-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "servesCuisine" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tiktokUrl" TEXT;

-- CreateTable
CREATE TABLE "BranchHours" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "opens" TEXT,
    "closes" TEXT,

    CONSTRAINT "BranchHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BranchHours_branchId_dayOfWeek_key" ON "BranchHours"("branchId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "BranchHours" ADD CONSTRAINT "BranchHours_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
