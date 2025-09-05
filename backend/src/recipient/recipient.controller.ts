import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  ForbiddenException,
  Headers,
} from "@nestjs/common";
import { RecipientService } from "./recipient.service";
import { CreateRecipientDto } from "./dto/create-recipient.dto";
import { UpdateRecipientDto } from "./dto/update-recipient.dto";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";

@Controller("recipients")
export class RecipientController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recipientService: RecipientService,
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
  @Post()
  create(@Body() createRecipientDto: CreateRecipientDto) {
    return this.recipientService.create(createRecipientDto);
  }

  @Get()
  findAll() {
    return this.recipientService.findAll();
  }

  @Get("my")
  async my(@Headers("authorization") auth?: string) {
    const p = this.payload(auth);
    return this.prisma.parcel.findMany({ where: { userId: p?.sub }, include: { warehouse: true } });
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.recipientService.findOne(id);
  }

  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateRecipientDto: UpdateRecipientDto) {
    return this.recipientService.update(id, updateRecipientDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.recipientService.remove(id);
  }
}
