/*
  Warnings:

  - Added the required column `price` to the `Parcel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientId` to the `Parcel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecipientType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- CreateEnum
CREATE TYPE "FlightStatus" AS ENUM ('SCHEDULED', 'DEPARTED', 'ARRIVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Parcel" ADD COLUMN     "flightId" INTEGER,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "recipientId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Recipient" (
    "id" SERIAL NOT NULL,
    "type" "RecipientType" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "passportSeries" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "jshshir" TEXT NOT NULL,
    "phone" TEXT,
    "addressLine1" TEXT,
    "city" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "status" "FlightStatus" NOT NULL DEFAULT 'SCHEDULED',
    "departureAt" TIMESTAMP(3) NOT NULL,
    "departureFrom" TEXT NOT NULL,
    "arrivalTo" TEXT NOT NULL,
    "arrivalAt" TIMESTAMP(3),
    "capacityKg" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipient_jshshir_key" ON "Recipient"("jshshir");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_code_key" ON "Flight"("code");

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE SET NULL ON UPDATE CASCADE;
