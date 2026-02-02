/*
  Warnings:

  - A unique constraint covering the columns `[deviceCode]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `device` ADD COLUMN `deviceCode` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Device_deviceCode_key` ON `Device`(`deviceCode`);
