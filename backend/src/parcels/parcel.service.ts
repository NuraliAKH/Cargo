import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateParcelDto } from "./dto/create-parcel.dto";
import { RecipientType } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ParcelService {
  constructor(private prisma: PrismaService) {}

  private async checkLimit(recipientId: number, price: string) {
    const recipient = await this.prisma.recipient.findUnique({
      where: { id: recipientId },
      select: { type: true },
    });
    if (!recipient) throw new BadRequestException("Qabul qiluvchi topilmadi");

    const priceVal = Number(price);
    if (recipient.type === RecipientType.INDIVIDUAL && priceVal > 200) {
      throw new BadRequestException("Jismoniy shaxs uchun limit: $200");
    }
  }

  async create(dto: CreateParcelDto, userId: number) {
    await this.checkLimit(dto.recipientId, dto.price);
    return this.prisma.parcel.create({
      data: {
        trackCode: dto.trackCode,
        description: dto.description,
        status: dto.status,
        userId: userId,
        warehouseId: dto.warehouseId,
        price: dto.price,
        recipientId: dto.recipientId,
        flightId: dto.flightId,
      },
    });
  }

  findAll() {
    return this.prisma.parcel.findMany({
      orderBy: { createdAt: "desc" },
      include: { recipient: true, user: true, flight: true, warehouse: true },
    });
  }

  findOne(id: number) {
    return this.prisma.parcel.findUniqueOrThrow({
      where: { id },
      include: { recipient: true, user: true, flight: true, warehouse: true, history: true },
    });
  }

  async update(id: number, dto: any) {
    const old = await this.prisma.parcel.findUniqueOrThrow({
      where: { id },
      select: { recipientId: true, price: true },
    });
    await this.checkLimit(dto.recipientId ?? old.recipientId, dto.price ?? old.price.toString());

    return this.prisma.parcel.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.parcel.delete({ where: { id } });
  }
}
