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
import { UserCreateDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public, CurrentUser } from '../decorators/customize';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IUser } from '../users/user.interface';
import { SigninDto } from './dtos/signin.dto';
import { ClientKafka } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpResponseDto } from './dtos/signup.dto';
import {
  UserProfileResponseDto,
  UserResponseDto,
} from '../users/dto/response-user.dto';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  @Public()
  @Post('/signup')
  @ApiOperation({
    summary: 'Register a new user account',
    operationId: 'signUp',
  })
  async signUp(@Body() body: UserCreateDto): Promise<SignUpResponseDto> {
    const result = await this.authService.register(body);
    return result;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @ApiOperation({
    summary: 'Login and issue authentication tokens',
    operationId: 'login',
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

  @Get('/profile/:id')
  @ApiOperation({
    summary: 'Get user profile by ID',
    operationId: 'getProfile',
  })
  async getProfile(
    @Param('id') param: string,
  ): Promise<UserProfileResponseDto> {
    return await this.authService.getProfile(param);
  }

  @Get('/me')
  @ApiOperation({
    summary: 'Get current logged-in user information',
    operationId: 'whoAmI',
  })
  whoami(@CurrentUser() user: IUser) {
    return user;
  }

  @Public()
  @Post('/signout')
  @ApiOperation({
    summary: 'Sign out and clear authentication cookies',
    operationId: 'signOut',
  })
  signOut(@Res() res: Response) {
    const result = this.authService.signOut(res);
    return res.json(result);
  }

  @Public()
  @Post('/refresh')
  @ApiOperation({
    summary: 'Refresh access token using refresh token',
    operationId: 'refreshToken',
  })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    const refreshToken = req.cookies['refresh_token'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const data = await this.authService.refreshToken(refreshToken, res);
    return data;
  }

  @Public()
  @Get('/verify/:token')
  @ApiOperation({
    summary: 'Verify email confirmation token',
    operationId: 'verifyEmail',
  })
  async verify(
    @Param('token') token: string,
  ): Promise<{ status: number; message: string }> {
    const verified = await this.authService.verify(token);
    return verified;
  }
}
