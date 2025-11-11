import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ClientKafka } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { Public, CurrentUser } from '../decorators/customize';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { UserCreateDto } from '../users/dto/create-user.dto';
import { SigninDto } from './dtos/signin.dto';
import { SignUpResponseDto } from './dtos/signup.dto';
import {
  UserProfileResponseDto,
  UserResponseDto,
} from '../users/dto/response-user.dto';
import { IUser } from '../users/user.interface';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  /** ----------------- SIGN UP ----------------- */
  @Public()
  @Post('/signup')
  @ApiOperation({
    summary: 'Register a new user account',
    operationId: 'signUp',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: SignUpResponseDto,
  })
  async signUp(@Body() body: UserCreateDto): Promise<SignUpResponseDto> {
    return this.authService.register(body);
  }

  /** ----------------- SIGN IN ----------------- */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @ApiOperation({
    summary: 'Login and issue authentication tokens',
    operationId: 'login',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: UserResponseDto,
  })
  async login(
    @Body() body: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    this.logger.debug('backend Login called');
    const result = await this.authService.login(body, res);
    this.logger.debug('backend Login Success');
    return result;
  }

  /** ----------------- GET PROFILE BY ID ----------------- */
  @Get('/profile/:id')
  @ApiOperation({
    summary: 'Get user profile by ID',
    operationId: 'getProfile',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileResponseDto,
  })
  async getProfile(@Param('id') id: string): Promise<UserProfileResponseDto> {
    return this.authService.getProfile(id);
  }

  /** ----------------- WHO AM I ----------------- */
  @Get('/me')
  @ApiOperation({
    summary: 'Get current logged-in user information',
    operationId: 'whoAmI',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user information retrieved successfully',
    type: UserResponseDto,
  })
  whoami(@CurrentUser() user: IUser): IUser {
    return user;
  }

  /** ----------------- SIGN OUT ----------------- */
  @Public()
  @Post('/signout')
  @ApiOperation({
    summary: 'Sign out and clear authentication cookies',
    operationId: 'signOut',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed out',
    schema: {
      example: { status: 200, message: 'Signed out successfully' },
    },
  })
  signOut(@Res() res: Response) {
    const result = this.authService.signOut(res);
    return res.json(result);
  }

  /** ----------------- REFRESH TOKEN ----------------- */
  @Public()
  @Post('/refresh')
  @ApiOperation({
    summary: 'Refresh access token using refresh token',
    operationId: 'refreshToken',
  })
  @ApiResponse({
    status: 200,
    description: 'Access token successfully refreshed',
    type: UserResponseDto,
  })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    const refreshToken = req.cookies['refresh_token'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    return this.authService.refreshToken(refreshToken, res);
  }

  @Public()
  @Get('/verify/:token')
  @ApiOperation({
    summary: 'Verify email confirmation token',
    operationId: 'verifyEmail',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verification status',
    schema: {
      example: { status: 200, message: 'Email verified successfully' },
    },
  })
  async verify(
    @Param('token') token: string,
  ): Promise<{ status: number; message: string }> {
    return this.authService.verify(token);
  }
}
