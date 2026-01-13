/*
  Warnings:

  - Added the required column `priceAtUse` to the `TicketPart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceAtUse` to the `TicketRepair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticketpart` ADD COLUMN `priceAtUse` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `ticketrepair` ADD COLUMN `priceAtUse` DOUBLE NOT NULL;
