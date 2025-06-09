import {
  Body,
  Controller,
  Get,
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('/register')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(body, res);
    return res.json(result);
  }

  @Get('/profile/:id')
  getProfile(@Param('id') param: string) {
    return this.authService.getProfile(param);
  }

  @Get('/whoami')
  whoami(@CurrentUser() user: IUser) {
    return user;
  }

  @Post('/signout')
  signOut(@Res() res: Response) {
    const result = this.authService.signOut(res);
    return res.json(result);
  }

  @Public()
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const tokens = await this.authService.refreshToken(refreshToken, res);

    return { accessToken: tokens.accessToken };
  }
}
