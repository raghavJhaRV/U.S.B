/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Merchandise` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Merchandise` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Merchandise` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `category` to the `Merchandise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Merchandise` table without a default value. This is not possible if the table is not empty.
  - Made the column `imageUrl` on table `Merchandise` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Merchandise" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "stock" DROP DEFAULT;
