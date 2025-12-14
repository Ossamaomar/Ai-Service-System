/*
  Warnings:

  - Added the required column `branch` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `branch` ENUM('FARQ', 'SOUQ') NOT NULL,
    ADD COLUMN `hasScratches` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `includesBattery` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `includesCharger` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `missingSkrews` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `underWarranty` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `wantsBackup` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `branch` VARCHAR(191) NOT NULL DEFAULT '';
