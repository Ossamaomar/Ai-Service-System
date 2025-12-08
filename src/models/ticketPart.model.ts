import {
  TicketPartCreateInput,
  TicketPartUpdateInput,
} from "generated/prisma/models";
import { prisma } from "src/config/database";
import { ApiError } from "src/utils/ApiError";

export class TicketPartModel {
  static async create(data: TicketPartCreateInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Create a ticket part.
      const ticketPart = await tx.ticketPart.create({ data });

      // 2. Calculate the totalRepairsCost, totalPrice and totalPrice.
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketPart.ticketId },
        include: { repairs: true, parts: true },
      });

      if (!ticket) throw new ApiError(400, "No ticket found with that id");

      const repairsSum = await tx.ticketRepair.aggregate({
        where: { ticketId: ticket.id },
        _sum: { priceAtUse: true },
      });

      const partsSum = await tx.$queryRawUnsafe<{ sum: number | null }[]>(
        `
            SELECT SUM(priceAtUse * quantity) AS sum
            FROM TicketPart
            WHERE ticketId = ?
            `,
        ticket.id
      );

      const totalPartsCost = partsSum[0]?.sum ?? 0;
      const totalRepairsCost = repairsSum._sum.priceAtUse ?? 0;
      const totalPrice = totalRepairsCost + totalPartsCost;

      // 3. Update ticket price
      await tx.ticket.update({
        where: { id: ticketPart.ticketId },
        data: {
          totalRepairsCost,
          totalPartsCost,
          totalPrice,
        },
      });

      return ticketPart;
    });
  }

  static async getAll(options: any) {
    return await prisma.ticketPart.findMany(options);
  }

  static async get(id: string) {
    return await prisma.ticketPart.findUnique({ where: { id } });
  }

  static async update(id: string, data: TicketPartUpdateInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Create a ticket part.
      const ticketPart = await prisma.ticketPart.update({
        where: { id },
        data,
      });

      // 2. Calculate the totalRepairsCost, totalPrice and totalPrice.
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketPart.ticketId },
        include: { repairs: true, parts: true },
      });

      if (!ticket) throw new ApiError(400, "No ticket found with that id");

      const repairsSum = await tx.ticketRepair.aggregate({
        where: { ticketId: ticket.id },
        _sum: { priceAtUse: true },
      });

      const partsSum = await tx.$queryRawUnsafe<{ sum: number | null }[]>(
        `
            SELECT SUM(priceAtUse * quantity) AS sum
            FROM TicketPart
            WHERE ticketId = ?
            `,
        ticket.id
      );

      const totalPartsCost = partsSum[0]?.sum ?? 0;
      const totalRepairsCost = repairsSum._sum.priceAtUse ?? 0;
      const totalPrice = totalRepairsCost + totalPartsCost;

      // 3. Update ticket price
      await tx.ticket.update({
        where: { id: ticketPart.ticketId },
        data: {
          totalRepairsCost,
          totalPartsCost,
          totalPrice,
        },
      });

      return ticketPart;
    });
  }

  static async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Create a ticket part.
      const ticketPart = await prisma.ticketPart.delete({ where: { id } });

      // 2. Calculate the totalRepairsCost, totalPrice and totalPrice.
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketPart.ticketId },
        include: { repairs: true, parts: true },
      });

      if (!ticket) throw new ApiError(400, "No ticket found with that id");

      const repairsSum = await tx.ticketRepair.aggregate({
        where: { ticketId: ticket.id },
        _sum: { priceAtUse: true },
      });

      const partsSum = await tx.$queryRawUnsafe<{ sum: number | null }[]>(
        `
            SELECT SUM(priceAtUse * quantity) AS sum
            FROM TicketPart
            WHERE ticketId = ?
            `,
        ticket.id
      );

      const totalPartsCost = partsSum[0]?.sum ?? 0;
      const totalRepairsCost = repairsSum._sum.priceAtUse ?? 0;
      const totalPrice = totalRepairsCost + totalPartsCost;

      // 3. Update ticket price
      await tx.ticket.update({
        where: { id: ticketPart.ticketId },
        data: {
          totalRepairsCost,
          totalPartsCost,
          totalPrice,
        },
      });

      return ticketPart;
    });
  }
}
