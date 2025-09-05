/*
  Warnings:

  - A unique constraint covering the columns `[trackCode]` on the table `Parcel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trackCode` to the `Parcel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parcel" ADD COLUMN     "trackCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Parcel_trackCode_key" ON "Parcel"("trackCode");
