import {
  BadRequestException,
  Inject,
  Injectable,
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
import { UserCreatedEvent } from 'src/proto/auth';

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
}

export interface EmailVerifyPayload {
  userId: string;
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
      return null;
    }
    if (user && this.isValidPassword(password, user.password)) {
      return user;
    } else {
      return null;
    }
  }

  async register(userDto: CreateUserDto, response: Response) {
    const user = await this.userService.findByEmail(userDto.email);
    const rawPassword = userDto.password;
    if (user) {
      throw new BadRequestException('Email in use');
    }
    console.log('Register reached!!!');
    const result = this.getHashPassword(userDto.password);
    userDto.password = result;
    if (!userDto.username) {
      userDto.username = userDto.email.split('@')[0];
    }
    const newUser = await this.userService.create(userDto);

    const payload: UserCreatedEvent = {
      userId: newUser.id,
      email: userDto.email,
      timestamp: Date.now(),
      urlToken: this.generateEmailToken({
        userId: newUser.id,
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
    // this.kafkaClient.emit('user_created', {
    //   key: userDto.email,
    //   value: Buffer.from(buffer),
    // });

    if (newUser) {
      return await this.login(
        { email: userDto.email, password: rawPassword },
        response,
      );
    }
    return {
      message: 'User not created',
    };
  }

  async verify(token: string) {
    try {
      const payload: EmailVerifyPayload | JwtPayload =
        this.jwtService.verify(token);
      if (payload) {
        const user = await this.userService.findById(payload.userId);
        if (!user) throw new NotFoundException('User not found');
        await this.userService.update(user.id, { ...user, isVerified: true });
      }
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }

  async login(body: LoginDto, response: Response) {
    const validUser = await this.validateUser(body.email, body.password);

    if (!validUser) {
      throw new NotFoundException('Invalid credentials');
    }

    const payload: JwtPayload = {
      userId: validUser.id,
      email: validUser.email,
      username: validUser.username,
      role: validUser.role,
    };
    const tokens = await this.generateTokens(payload);

    // Set refresh token in HTTP-only cookie
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken: tokens.accessToken,
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
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
      const tokens = await this.generateTokens(newPayload);

      // Set refresh token in HTTP-only cookie
      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 7 days
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
    if (!response) {
      throw new Error('Response object is undefined');
    }
    response.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
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
