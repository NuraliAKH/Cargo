import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async register(dto: { email: string; password: string; name: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new UnauthorizedException("Email already registered");
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({ data: { email: dto.email, password: hashed, name: dto.name } });
    return this.sign(user.id, user.email, user.role);
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    return this.sign(user.id, user.email, user.role);
  }

  async me(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  sign(id: number, email: string, role: any) {
    const access_token = this.jwt.sign({ sub: id, email, role });
    return { access_token };
  }
}
