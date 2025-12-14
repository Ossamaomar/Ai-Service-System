/*
  Warnings:

  - The values [REPAIR] on the enum `Ticket_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `deviceId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `deviceId` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('RECEIVED', 'APPROVED', 'DIAGNOSIS', 'WAITING_APPROVAL', 'WAITING_PARTS', 'UNDER_REPAIR', 'READY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'RECEIVED';

-- CreateTable
CREATE TABLE `Device` (
    `id` VARCHAR(191) NOT NULL,
    `serialNumber` VARCHAR(191) NOT NULL,
    `type` ENUM('LAPTOP', 'CAMERA', 'PRINTER', 'OTHER') NOT NULL,
    `otherType` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NULL,
    `color` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Device_serialNumber_key`(`serialNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
