import { IsDateString, IsEnum, IsOptional, IsString, IsNumberString } from "class-validator";
import { FlightStatus } from "@prisma/client";

export class CreateFlightDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsEnum(FlightStatus)
  status?: FlightStatus = FlightStatus.SCHEDULED;

  @IsDateString()
  departureAt!: string;

  @IsString()
  departureFrom!: string;

  @IsString()
  arrivalTo!: string;

  @IsOptional()
  @IsDateString()
  arrivalAt?: string;

  @IsOptional()
  @IsNumberString()
  capacityKg?: string; // Decimal sifatida yuboriladi
}
