/*
  Warnings:

  - You are about to drop the column `deviceCode` on the `ticket` table. All the data in the column will be lost.
  - Made the column `deviceCode` on table `device` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Ticket_deviceCode_key` ON `ticket`;

-- AlterTable
ALTER TABLE `device` MODIFY `deviceCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ticket` DROP COLUMN `deviceCode`;
