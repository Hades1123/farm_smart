/*
  Warnings:

  - The primary key for the `sensor_thresholds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `sensor_thresholds` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sensor_thresholds" DROP CONSTRAINT "sensor_thresholds_userId_fkey";

-- DropIndex
DROP INDEX "sensor_thresholds_userId_key";

-- AlterTable
ALTER TABLE "sensor_thresholds" DROP CONSTRAINT "sensor_thresholds_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "sensor_thresholds_pkey" PRIMARY KEY ("id");
