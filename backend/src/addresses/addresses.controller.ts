import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { JwtService } from "@nestjs/jwt";

@Controller("addresses")
export class AddressesController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  private userIdFromAuth(authHeader?: string) {
    const token = authHeader?.split(" ")[1];
    if (!token) return null;
    const payload: any = this.jwt.verify(token, { secret: process.env.JWT_SECRET || "secret" });
    return payload?.sub;
  }

  @Post()
  async create(@Headers("authorization") auth?: string, @Body() dto?: any) {
    const userId = this.userIdFromAuth(auth);
    return this.prisma.address.create({ data: { ...dto, userId } });
  }

  @Get("my")
  my(@Headers("authorization") auth?: string) {
    const userId = this.userIdFromAuth(auth);
    return this.prisma.address.findMany({ where: { userId } });
  }
}
