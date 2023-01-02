import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('signup')
  public async signup(@Body() credentials: AuthCredentialsDto): Promise<User> {
    return this.authService.signup(credentials);
  }

  @Post('login')
  public async login(@Body() credentials: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.login(credentials);
  }
}