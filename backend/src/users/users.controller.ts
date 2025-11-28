import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { JwtService } from "@nestjs/jwt";

@Controller("users")
export class UsersController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}
  @Get()
  findAll(@Headers("authorization") auth?: string) {
    const token = auth?.split(" ")[1];
    const p: any = token ? this.jwt.verify(token, { secret: process.env.JWT_SECRET || "secret" }) : null;
    if (p?.role !== "ADMIN") throw new Error("Forbidden");
    return this.prisma.user.findMany({ select: { id: true, phone: true, name: true, role: true } });
  }

  @Patch(":id/role")
  async updateRole(@Param("id") id: string, @Body("role") role: string, @Headers("authorization") auth?: string) {
    const token = auth?.split(" ")[1];
    const p: any = token ? this.jwt.verify(token, { secret: process.env.JWT_SECRET || "secret" }) : null;
    if (p?.role !== "ADMIN") throw new ForbiddenException("Forbidden");

    if (!["ADMIN", "USER", "MANAGER"].includes(role)) {
      throw new ForbiddenException("Invalid role");
    }

    return this.prisma.user.update({
      where: { id: Number(id) },
      data: { role: role as any },
      select: { id: true, phone: true, role: true },
    });
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Headers("authorization") auth?: string) {
    const token = auth?.split(" ")[1];
    const p: any = token ? this.jwt.verify(token, { secret: process.env.JWT_SECRET || "secret" }) : null;
    if (p?.role !== "ADMIN") throw new ForbiddenException("Forbidden");

    const user = await this.prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) throw new NotFoundException("User not found");

    return this.prisma.user.delete({
      where: { id: Number(id) },
      select: { id: true, phone: true, role: true },
    });
  }
}
