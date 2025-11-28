import { Body, Controller, Delete, Get, Headers, Param, Post } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { JwtService } from "@nestjs/jwt";

@Controller("warehouses")
export class WarehousesController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  @Get()
  all() {
    return this.prisma.warehouse.findMany();
  }

  @Post()
  create(@Headers("authorization") auth?: string, @Body() dto?: any) {
    const token = auth?.split(" ")[1];
    const p: any = token ? this.jwt.verify(token, { secret: process.env.JWT_SECRET || "secret" }) : null;
    if (p?.role !== "ADMIN") throw new Error("Forbidden");
    return this.prisma.warehouse.create({ data: dto });
  }

  @Delete(":id")
  delete(@Param("id") id: string, @Headers("authorization") auth?: string) {
    const token = auth?.split(" ")[1];
    const p: any = token ? this.jwt.verify(token, { secret: process.env.JWT_SECRET || "secret" }) : null;
    if (p?.role !== "ADMIN") throw new Error("Forbidden");

    return this.prisma.warehouse.delete({
      where: { id: Number(id) },
    });
  }
}
