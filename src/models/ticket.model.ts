import { Prisma } from "generated/prisma/client";
import { prisma } from "src/config/database";

export class TicketModel {
  static async create(data: Prisma.TicketCreateInput) {
    return await prisma.ticket.create({ data });
  }

  static async get(id: string) {
    return await prisma.ticket.findUnique({
      where: { id },
    });
  }

  static async getWithAllRepairsAndPartsIncluded(id: string) {
    return await prisma.ticket.findUnique({
      where: { id },
      include: { repairs: true, parts: true },
    });
  }

  static async updateAfterRepairOrTicketAdded(
    id: string,
    totalRepairsCost: number,
    totalPartsCost: number,
    totalPrice: number
  ) {
    await prisma.ticket.update({
      where: { id: id },
      data: {
        totalRepairsCost,
        totalPartsCost,
        totalPrice,
      },
    });
  }

  static async getAll(options: any) {
    return await prisma.ticket.findMany(options);
  }

  static async update(id: string, data: Prisma.TicketUpdateInput) {
    return await prisma.ticket.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return await prisma.ticket.delete({ where: { id } });
  }
}
