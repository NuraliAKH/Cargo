import { Module } from "@nestjs/common";
import { AddressesController } from "./addresses.controller";
import { PrismaService } from "../prisma.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET || "secret" })],
  controllers: [AddressesController],
  providers: [PrismaService],
})
export class AddressesModule {}
