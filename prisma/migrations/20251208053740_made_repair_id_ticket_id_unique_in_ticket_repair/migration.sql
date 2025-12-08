/*
  Warnings:

  - A unique constraint covering the columns `[repairId,ticketId]` on the table `TicketRepair` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TicketRepair_repairId_ticketId_key` ON `TicketRepair`(`repairId`, `ticketId`);
