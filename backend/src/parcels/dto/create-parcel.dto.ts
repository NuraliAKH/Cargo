import { IsDecimal, IsEnum, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { ParcelStatus } from "@prisma/client";

export class CreateParcelDto {
  @IsString()
  trackCode!: string;

  @IsString()
  description!: string;

  @IsEnum(ParcelStatus)
  @IsOptional()
  status?: ParcelStatus;

  @IsOptional()
  @IsInt()
  @IsPositive()
  warehouseId?: number;

  @IsDecimal()
  price!: string;

  @IsInt()
  @IsPositive()
  recipientId!: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  flightId?: number;
}
