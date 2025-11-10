import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { ClientKafka } from '@nestjs/microservices';
import { UserCreatedEvent } from '../proto/auth';

export interface JwtPayload {
  user_id: string;
  email: string;
  username: string;
  role: string;
}

export interface EmailVerifyPayload {
  user_id: string;
  email: string;
}

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('AUTH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.logger.log('Connecting Kafka producer...');
    await this.kafkaClient.connect();
    this.logger.log('Kafka producer connected ✅');
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user && this.isValidPassword(password, user.password)) {
      return user;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(
    userDto: CreateUserDto,
  ): Promise<{ status: number; message: string; userId?: string }> {
    const user = await this.userService.findByEmail(userDto.email);
    if (user && user.isVerified) {
      throw new ConflictException('This email is already registered');
    }

    try {
      const result = this.getHashPassword(userDto.password);
      userDto.password = result;
      if (!userDto.username) {
        userDto.username = userDto.email.split('@')[0];
      }
      if (user) {
        await this.userService.remove(user.id);
      }
      const newUser = await this.userService.create(userDto);

      const payload: UserCreatedEvent = {
        userId: newUser.id,
        email: userDto.email,
        timestamp: Date.now(),
        urlToken: this.generateEmailToken({
          user_id: newUser.id,
          email: userDto.email,
        }),
      };

      const buffer = UserCreatedEvent.encode(payload).finish();
      await this.kafkaClient.producer.send({
        topic: 'user_created',
        messages: [
          {
            key: userDto.email,
            value: Buffer.from(buffer),
            headers: { 'event-type': 'user.created' },
          },
        ],
      });

      return {
        status: HttpStatus.CREATED,
        userId: newUser.id,
        message: 'User registered successfully',
      };
    } catch (err) {
      this.logger.error('Registration failed', err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        'Registration failed. Please try again later. Check broker or upstream server',
      );
    }
  }

  async verify(token: string) {
    try {
      const payload: EmailVerifyPayload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.user_id);
      if (!user) throw new NotFoundException('User not found');
      if (user.isVerified)
        return {
          status: HttpStatus.CONFLICT,
          message: 'Email already verified',
        }; // already verified
      await this.userService.update(user.id, { ...user, isVerified: true });
      return {
        status: HttpStatus.OK,
        message: 'Email verified successfully',
      };
    } catch (err) {
      if (err instanceof Error && err.name === 'TokenExpiredError') {
        const payload: EmailVerifyPayload = this.jwtService.decode(token);
        if (!payload?.user_id)
          throw new BadRequestException('Invalid token structure');

        const user = await this.userService.findById(payload.user_id);
        if (user?.isVerified) {
          throw new ConflictException('Email already verified');
        }
      }
      throw new BadRequestException(
        'Invalid or expired token, please try again',
      );
    }
  }

  async login(body: LoginDto, response: Response) {
    const validUser = await this.validateUser(body.email, body.password);

    const payload: JwtPayload = {
      user_id: validUser.id,
      email: validUser.email,
      username: validUser.username,
      role: validUser.role,
    };
    const tokens = await this.generateTokens(payload);

    // Set refresh token in HTTP-only cookie
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/api',
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 day
    });

    return {
      user: {
        userId: validUser.id,
        email: validUser.email,
        username: validUser.username,
        role: validUser.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async refreshToken(refreshToken: string, response: Response) {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const newPayload: JwtPayload = {
        user_id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
      const tokens = await this.generateTokens(newPayload);

      // Set refresh token in HTTP-only cookie
      response.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return {
        accessToken: tokens.accessToken,
        user: {
          userId: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      };
    } catch (e) {
      console.error('Refresh token error:', e);
      throw new UnauthorizedException('Invalid refresh token 2');
    }
  }

  signOut(response: Response) {
    // TODO: Also invalidate the refresh token server-side (e.g. delete from DB or Redis)
    // to prevent reuse of old tokens after logout.
    if (!response) {
      throw new Error('Response object is undefined');
    }
    response.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '5d',
        algorithm: 'HS256',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '15d',
        algorithm: 'HS256',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private generateEmailToken(payload: EmailVerifyPayload) {
    const emailToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
    return emailToken;
  }
}
