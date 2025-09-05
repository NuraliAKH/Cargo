import { Injectable } from "@nestjs/common";
import { CreateFlightDto } from "./dto/create-flight.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class FlightService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateFlightDto) {
    return this.prisma.flight.create({
      data: {
        code: dto.code,
        status: dto.status,
        departureAt: new Date(dto.departureAt),
        departureFrom: dto.departureFrom,
        arrivalTo: dto.arrivalTo,
        arrivalAt: dto.arrivalAt ? new Date(dto.arrivalAt) : null,
        capacityKg: dto.capacityKg ?? 0,
      },
    });
  }

  findAll() {
    return this.prisma.flight.findMany({ orderBy: { createdAt: "desc" } });
  }

  findOne(id: number) {
    return this.prisma.flight.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, dto: any) {
    return this.prisma.flight.update({
      where: { id },
      data: {
        code: dto.code,
        status: dto.status,
        departureAt: dto.departureAt ? new Date(dto.departureAt) : undefined,
        departureFrom: dto.departureFrom,
        arrivalTo: dto.arrivalTo,
        arrivalAt: dto.arrivalAt ? new Date(dto.arrivalAt) : undefined,
        capacityKg: dto.capacityKg,
      },
    });
  }

  remove(id: number) {
    return this.prisma.flight.delete({ where: { id } });
  }
}
