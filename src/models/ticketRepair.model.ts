import {
  TicketRepairCreateInput,
  TicketRepairUpdateInput,
} from "generated/prisma/models";
import { prisma } from "src/config/database";
import { ApiError } from "src/utils/ApiError";

export class TicketRepairModel {
  static async create(data: TicketRepairCreateInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Create a ticket repair.
      const ticketRepair = await tx.ticketRepair.create({ data });

      // 2. Calculate the totalRepairsCost, totalPrice and totalPrice.
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketRepair.ticketId },
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
        where: { id: ticketRepair.ticketId },
        data: {
          totalRepairsCost,
          totalPartsCost,
          totalPrice,
        },
      });

      return ticketRepair;
    });
  }

  static async getAll(options: any) {
    return await prisma.ticketRepair.findMany(options);
  }

  static async get(id: string) {
    return await prisma.ticketRepair.findUnique({ where: { id } });
  }

  static async getAllRepairsOnTicket(ticketId: string) {
    return await prisma.ticketRepair.findMany({
      where: { ticketId },
      include: { repair: true },
    });
  }

  static async update(id: string, data: TicketRepairUpdateInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Update a ticket repair.
      const ticketRepair = await prisma.ticketRepair.update({
        where: { id },
        data,
      });

      // 2. Calculate the totalRepairsCost, totalPrice and totalPrice.
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketRepair.ticketId },
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
        where: { id: ticketRepair.ticketId },
        data: {
          totalRepairsCost,
          totalPartsCost,
          totalPrice,
        },
      });

      return ticketRepair;
    });
  }

  static async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Delete a ticket repair.
      const ticketRepair = await await prisma.ticketRepair.delete({
        where: { id },
      });

      // 2. Calculate the totalRepairsCost, totalPrice and totalPrice.
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketRepair.ticketId },
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
        where: { id: ticketRepair.ticketId },
        data: {
          totalRepairsCost,
          totalPartsCost,
          totalPrice,
        },
      });

      return ticketRepair;
    });
  }
}
