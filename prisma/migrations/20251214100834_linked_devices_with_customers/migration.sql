/*
  Warnings:

  - Added the required column `customerId` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `device` ADD COLUMN `customerId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
