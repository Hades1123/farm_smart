/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `sensor_thresholds` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `sensor_thresholds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sensor_thresholds" ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sensor_thresholds_userId_key" ON "sensor_thresholds"("userId");

-- AddForeignKey
ALTER TABLE "sensor_thresholds" ADD CONSTRAINT "sensor_thresholds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
