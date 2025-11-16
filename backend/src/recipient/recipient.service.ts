import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateRecipientDto } from "./dto/create-recipient.dto";
import { UpdateRecipientDto } from "./dto/update-recipient.dto";
import { PrismaService } from "src/prisma.service";
import { RecipientType } from "@prisma/client";

@Injectable()
export class RecipientService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateRecipientDto) {
    const exists = await this.prisma.recipient.findUnique({
      where: { jshshir: dto.jshshir },
    });
    if (exists) throw new BadRequestException("Bu JShShIR bilan qabul qiluvchi mavjud");

    return this.prisma.recipient.create({
      data: {
        userId: userId,
        type: dto.type ?? RecipientType.INDIVIDUAL, // <-- default qo‘yish
        firstName: dto.firstName ?? "",
        lastName: dto.lastName ?? "",
        passportSeries: dto.passportSeries ?? "",
        passportNumber: dto.passportNumber ?? "",
        jshshir: dto.jshshir ?? "",
        phone: dto.phone,
        addressLine1: dto.addressLine1,
        city: dto.city,
        country: dto.country,
      },
    });
  }

  findAll() {
    return this.prisma.recipient.findMany({ orderBy: { createdAt: "desc" } });
  }

  findOne(id: number) {
    return this.prisma.recipient.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, dto: UpdateRecipientDto) {
    return this.prisma.recipient.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.recipient.delete({ where: { id } });
  }
}
