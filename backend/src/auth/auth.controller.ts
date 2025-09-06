import { Body, Controller, Get, Headers, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly jwt: JwtService
  ) {}

  @Post("request-code")
  requestCode(@Body() body: { phone: string }) {
    return this.auth.sendVerificationCode(body.phone);
  }

  @Post("verify")
  verifyCode(@Body() body: { phone: string; code: string }) {
    return this.auth.verifyCode(body.phone, body.code);
  }
  @Post("register")
  register(@Body() body: { phone: string; password: string; name: string }) {
    return this.auth.register(body);
  }

  // 4. Логин (без кода)
  @Post("login")
  login(@Body() body: { phone: string; password: string }) {
    return this.auth.login(body);
  }

  @Get("me")
  me(@Headers("authorization") authHeader?: string) {
    const token = authHeader?.split(" ")[1];
    if (!token) return null;
    const payload = this.jwt.verify(token, {
      secret: process.env.JWT_SECRET || "secret",
    });
    return this.auth.me(payload["sub"]);
  }
}
