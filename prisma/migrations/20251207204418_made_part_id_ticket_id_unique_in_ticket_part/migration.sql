/*
  Warnings:

  - A unique constraint covering the columns `[partId,ticketId]` on the table `TicketPart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TicketPart_partId_ticketId_key` ON `TicketPart`(`partId`, `ticketId`);
