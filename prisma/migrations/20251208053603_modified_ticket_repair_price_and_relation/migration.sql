/*
  Warnings:

  - You are about to drop the column `name` on the `ticketrepair` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ticketrepair` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Repair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceAtUse` to the `TicketRepair` table without a default value. This is not possible if the table is not empty.
  - Made the column `repairId` on table `ticketrepair` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ticketrepair` DROP FOREIGN KEY `TicketRepair_repairId_fkey`;

-- DropIndex
DROP INDEX `TicketRepair_repairId_fkey` ON `ticketrepair`;

-- AlterTable
ALTER TABLE `repair` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `ticketrepair` DROP COLUMN `name`,
    DROP COLUMN `price`,
    ADD COLUMN `priceAtUse` DOUBLE NOT NULL,
    MODIFY `repairId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TicketRepair` ADD CONSTRAINT `TicketRepair_repairId_fkey` FOREIGN KEY (`repairId`) REFERENCES `Repair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
