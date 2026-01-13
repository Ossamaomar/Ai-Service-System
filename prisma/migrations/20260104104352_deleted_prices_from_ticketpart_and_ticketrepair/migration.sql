/*
  Warnings:

  - You are about to drop the column `priceAtUse` on the `ticketpart` table. All the data in the column will be lost.
  - You are about to drop the column `priceAtUse` on the `ticketrepair` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ticketpart` DROP COLUMN `priceAtUse`;

-- AlterTable
ALTER TABLE `ticketrepair` DROP COLUMN `priceAtUse`;
