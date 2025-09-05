/*
  Warnings:

  - The values [SHIPPED] on the enum `ParcelStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ParcelStatus_new" AS ENUM ('AWAITING_AT_WAREHOUSE', 'AT_WAREHOUSE', 'IN_TRANSIT', 'AT_LOCAL_WAREHOUSE', 'WITH_COURIER', 'DELIVERED');
ALTER TABLE "Parcel" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Parcel" ALTER COLUMN "status" TYPE "ParcelStatus_new" USING ("status"::text::"ParcelStatus_new");
ALTER TABLE "ParcelStatusHistory" ALTER COLUMN "status" TYPE "ParcelStatus_new" USING ("status"::text::"ParcelStatus_new");
ALTER TYPE "ParcelStatus" RENAME TO "ParcelStatus_old";
ALTER TYPE "ParcelStatus_new" RENAME TO "ParcelStatus";
DROP TYPE "ParcelStatus_old";
ALTER TABLE "Parcel" ALTER COLUMN "status" SET DEFAULT 'AWAITING_AT_WAREHOUSE';
COMMIT;

-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "addresLine1" TEXT,
ADD COLUMN     "addresLine2" TEXT,
ADD COLUMN     "cell" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "telephone" TEXT,
ADD COLUMN     "zipcode" INTEGER;
