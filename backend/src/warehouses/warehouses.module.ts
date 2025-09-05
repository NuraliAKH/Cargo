import { Module } from "@nestjs/common";
import { WarehousesController } from "./warehouses.controller";
import { PrismaService } from "../prisma.service";
import { AuthModule } from "src/auth/auth.module";

@Module({ imports: [AuthModule], controllers: [WarehousesController], providers: [PrismaService] })
export class WarehousesModule {}
