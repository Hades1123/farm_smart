-- DropIndex
DROP INDEX "sensor_data_dataType_recordedAt_idx";

-- CreateIndex
CREATE INDEX "sensor_data_dataType_recordedAt_idx" ON "sensor_data"("dataType", "recordedAt");
