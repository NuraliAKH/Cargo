/*
  Warnings:

  - Added the required column `label` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "line2" TEXT;
