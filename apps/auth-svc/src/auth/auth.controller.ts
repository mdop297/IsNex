import {
  Body,
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
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public, CurrentUser } from '../decorators/customize';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IUser } from '../users/user.interface';
import { LoginDto } from './dtos/login.dto';
import { ClientKafka } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}
  @Public()
  @Post('/signup')
  async signUp(@Body() body: CreateUserDto, @Res() res: Response) {
    const result = await this.authService.register(body);

    return res.json(result);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    console.log('backend Login called');
    const result = await this.authService.login(body, res);
    console.log('backend Login Success');
    return res.json(result);
  }

  @Get('/profile/:id')
  getProfile(@Param('id') param: string) {
    return this.authService.getProfile(param);
  }

  @Get('/me')
  whoami(@CurrentUser() user: IUser) {
    return user;
  }

  @Public()
  @Post('/signout')
  signOut(@Res() res: Response) {
    const result = this.authService.signOut(res);
    return res.json(result);
  }

  @Public()
  @Post('/refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const data = await this.authService.refreshToken(refreshToken, res);

    return data;
  }

  @Public()
  @Get('/verify/:token')
  async verify(@Param('token') token: string, @Res() res: Response) {
    const verified = await this.authService.verify(token);
    return res.json(verified);
  }
}
