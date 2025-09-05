import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private jwt: JwtService) {}

  @Post('register')
  register(@Body() body: {email: string; password: string; name: string}) {
    return this.auth.register(body);
  }
  @Post('login')
  login(@Body() body: {email: string; password: string}) {
    return this.auth.login(body);
  }
  @Get('me')
  me(@Headers('authorization') authHeader?: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) return null;
    const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'secret' });
    return this.auth.me(payload['sub']);
  }
}
