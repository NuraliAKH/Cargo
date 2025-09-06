import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { Cron } from "@nestjs/schedule";
import { SmsService } from "src/sms/sms.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private sms: SmsService
  ) {}

  // РЕГИСТРАЦИЯ: создает юзера, если не существует, или повторно отправляет код
  async register(dto: { phone: string; password: string; name: string }) {
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });

    if (existing) {
      if (!existing.isVerified) {
        // Пользователь есть, но не верифицирован → просто пересылаем код
        return this.sendVerificationCode(dto.phone);
      }
      throw new BadRequestException("Phone already registered");
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    await this.prisma.user.create({
      data: {
        phone: dto.phone,
        password: hashed,
        name: dto.name,
        isVerified: false,
      },
    });

    return this.sendVerificationCode(dto.phone);
  }

  // ПОВТОРНАЯ ОТПРАВКА КОДА
  async resendCode(phone: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new BadRequestException("User not found");
    if (user.isVerified) throw new BadRequestException("Already verified");

    return this.sendVerificationCode(phone);
  }

  // ПОДТВЕРЖДЕНИЕ КОДА
  async verifyCode(phone: string, code: string) {
    const record = await this.prisma.verificationCode.findFirst({ where: { phone, code } });

    if (!record) throw new BadRequestException("Invalid or expired code");
    if (record.expiresAt < new Date()) {
      await this.prisma.verificationCode.delete({ where: { id: record.id } });
      throw new BadRequestException("Code expired");
    }

    await this.prisma.user.update({
      where: { phone },
      data: { isVerified: true },
    });

    // Удаляем код после успешной верификации
    await this.prisma.verificationCode.delete({ where: { id: record.id } });

    return { message: "Phone verified successfully" };
  }

  // ЛОГИН
  async login(dto: { phone: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user || !user.isVerified) throw new UnauthorizedException("Phone not verified");

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    return this.sign(user.id, user.phone, user.role);
  }

  // JWT генерация
  sign(id: number, phone: string, role: any) {
    const access_token = this.jwt.sign({ sub: id, phone, role });
    return { access_token };
  }

  // ПРОСМОТР СВОЕГО ПРОФИЛЯ
  async me(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, phone: true, name: true, role: true, isVerified: true, createdAt: true },
    });
  }

  async sendVerificationCode(phone: string) {
    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут

    // Удаляем старые коды для этого номера
    await this.prisma.verificationCode.deleteMany({ where: { phone } });

    // Сохраняем новый код
    await this.prisma.verificationCode.create({
      data: { phone, code, expiresAt },
    });

    // Формируем двухъязычное SMS
    const message = `AirExpress platformasida ro'yxatdan o'tish uchun kod: ${code}`;

    // Отправляем SMS
    try {
      await this.sms.sendSms(phone, message);
      return { message: "Код подтверждения отправлен" };
    } catch (error) {
      console.error("Ошибка отправки SMS:", error);
      throw new Error("Не удалось отправить SMS");
    }
  }

  // CRON: автоудаление просроченных кодов (каждую минуту)
  @Cron("* * * * *")
  async cleanExpiredCodes() {
    await this.prisma.verificationCode.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
