import { Body, Controller, Get, Headers, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly jwt: JwtService
  ) {}

  /**
   * Регистрация пользователя (отправка СМС-кода)
   */
  @Post("register")
  async register(@Body() body: { phone: string; password: string; name: string }) {
    // Создаёт пользователя (не активирован) и отправляет код
    await this.auth.register(body);
    return { message: "Код подтверждения отправлен" };
  }

  /**
   * Подтверждение телефона и завершение регистрации
   */
  @Post("verify")
  async verify(@Body() body: { phone: string; code: string }) {
    const token = await this.auth.verifyCode(body.phone, body.code);
    if (!token) throw new UnauthorizedException("Неверный код");
    return { access_token: token };
  }

  /**
   * Логин (только для подтверждённых пользователей)
   */
  @Post("login")
  async login(@Body() body: { phone: string; password: string }) {
    return this.auth.login(body);
  }

  /**
   * Получить текущего пользователя
   */
  @Get("me")
  async me(@Headers("authorization") authHeader?: string) {
    if (!authHeader) throw new UnauthorizedException("Нет токена");
    const token = authHeader.split(" ")[1];
    if (!token) throw new UnauthorizedException("Некорректный токен");

    const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET || "secret" });
    return this.auth.me(payload.sub);
  }
}
