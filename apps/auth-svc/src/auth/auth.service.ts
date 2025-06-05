import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // async isValidPassword(password: string, hashedPassword: string) {
  //   const [salt, storedHash] = hashedPassword.split('.');
  //   const hash = (await scrypt(password, salt, 32)) as Buffer;
  //   return storedHash === hash.toString('hex');
  // }

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

  async register(userDto: CreateUserDto) {
    const user = await this.userService.findByEmail(userDto.email);

    if (user) {
      throw new BadRequestException('Email in use');
    }

    const result = this.getHashPassword(userDto.password);
    userDto.password = result;
    if (!userDto.username) {
      userDto.username = userDto.email.split('@')[0];
    }
    const newUser = await this.userService.create(userDto);

    return newUser;
  }

  async login(user: UpdateUserDto, response: Response) {
    // const validUser = await this.validateUser(body.email, body.password);

    // if (!validUser) {
    //   throw new NotFoundException('Invalid credentials');
    // }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.username,
    );

    // Set refresh token in HTTP-only cookie
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async refreshToken(
    userId: number,
    email: string,
    username: string,
    response: Response,
  ) {
    const tokens = await this.generateTokens(userId, email, username);

    // Update refresh token in cookie
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }

  signOut(response: Response) {
    if (!response) {
      throw new Error('Response object is undefined');
    }
    response.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(
    userId: number,
    email: string,
    username: string,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, username },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, username },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
