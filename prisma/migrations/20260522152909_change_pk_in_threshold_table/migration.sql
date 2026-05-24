/*
  Warnings:

  - The primary key for the `sensor_thresholds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `sensor_thresholds` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sensor_thresholds" DROP CONSTRAINT "sensor_thresholds_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "sensor_thresholds_pkey" PRIMARY KEY ("userId");
