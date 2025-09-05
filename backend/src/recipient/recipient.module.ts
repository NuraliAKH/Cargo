import { Module } from "@nestjs/common";
import { RecipientService } from "./recipient.service";
import { RecipientController } from "./recipient.controller";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [RecipientController],
  providers: [RecipientService, PrismaService, JwtService],
})
export class RecipientModule {}
