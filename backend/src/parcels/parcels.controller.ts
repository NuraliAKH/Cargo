import { Body, Controller, Get, Headers, Param, Patch, Post, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import { ParcelService } from "./parcel.service";

@Controller("parcels")
export class ParcelsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly percelService: ParcelService,

    private readonly jwt: JwtService
  ) {}

  private payload(authHeader?: string) {
    const token = authHeader?.split(" ")[1];
    if (!token) return null;
    return this.jwt.verify(token, { secret: process.env.JWT_SECRET || "secret" }) as any;
  }

  private verifyAdmin(authHeader?: string) {
    const payload = this.payload(authHeader);
    if (!payload || payload.role !== "ADMIN") {
      throw new ForbiddenException();
    }
    return payload;
  }

  @Get("my")
  async my(@Headers("authorization") auth?: string) {
    const p = this.payload(auth);
    console.log(p);

    return this.prisma.parcel.findMany({ where: { userId: p?.sub }, include: { warehouse: true } });
  }

  @Post()
  async create(@Headers("authorization") auth?: string, @Body() dto?: any) {
    const p = this.payload(auth);
    return this.percelService.create(dto, p?.sub);
  }

  @Patch(":id/status")
  async updateStatus(@Headers("authorization") auth?: string, @Param("id") id?: string, @Body() body?: any) {
    this.verifyAdmin(auth);
    const status = body?.status;
    return this.prisma.$transaction([
      this.prisma.parcel.update({ where: { id: Number(id) }, data: { status } }),
      this.prisma.parcelStatusHistory.create({ data: { parcelId: Number(id), status } }),
    ]);
  }

  @Get()
  async all(@Headers("authorization") auth?: string) {
    this.verifyAdmin(auth);
    return this.percelService.findAll();
  }
}
