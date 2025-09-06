// src/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../prisma.service";
import { SmsService } from "src/sms/sms.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "secret",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [AuthService, PrismaService, SmsService],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
