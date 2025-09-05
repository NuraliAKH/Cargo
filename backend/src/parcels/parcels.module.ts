import { Module } from "@nestjs/common";
import { ParcelsController } from "./parcels.controller";
import { PrismaService } from "../prisma.service";
import { AuthModule } from "../auth/auth.module";
import { ParcelService } from "./parcel.service";

@Module({
  imports: [AuthModule], // Импортируем AuthModule, чтобы был доступен JwtService
  controllers: [ParcelsController],
  providers: [PrismaService, ParcelService],
})
export class ParcelsModule {}
