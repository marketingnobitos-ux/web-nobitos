-- CreateEnum
CREATE TYPE "BrandTemplate" AS ENUM ('BOLD', 'EDITORIAL');

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "template" "BrandTemplate" NOT NULL DEFAULT 'BOLD';
