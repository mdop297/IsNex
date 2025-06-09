import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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

  async login(body: LoginDto, response: Response) {
    const validUser = await this.validateUser(body.username, body.password);

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
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

      // Update refresh token in cookie
      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { accessToken: tokens.accessToken };
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
}
