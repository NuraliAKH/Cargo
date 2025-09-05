import { IsEnum, IsOptional, IsString, Matches } from "class-validator";

export enum RecipientType {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

export class UpdateRecipientDto {
  @IsOptional()
  @IsEnum(RecipientType)
  type?: RecipientType;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2}$/, { message: "passportSeries ikki harf bo‘lishi kerak (masalan: AA)" })
  passportSeries?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{7,8}$/, { message: "passportNumber 7-8 raqamdan iborat bo‘lishi kerak" })
  passportNumber?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{14}$/, { message: "JShShIR 14 ta raqam bo‘lishi kerak" })
  jshshir?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
