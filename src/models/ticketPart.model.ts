import {
  TicketPartCreateInput,
  TicketPartUncheckedCreateInput,
  TicketPartUpdateInput,
} from "generated/prisma/models";
import { prisma } from "src/config/database";
import { ApiError } from "src/utils/ApiError";

export class TicketPartModel {
  static async create(data: TicketPartUncheckedCreateInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Check for part quantity
      const part = await tx.part.findUnique({ where: { id: data.partId } });

      if (part) {
        if (part.quantity < data.quantity) {
          throw new ApiError(
            400,
            "There are no enough quantities available for this part"
          );
        }
      }

      // 2. Create a ticket part.
      const ticketPart = await tx.ticketPart.create({ data });

      // 3. Calculate the totalRepairsCost, totalPrice and totalPrice.
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

      // 4. Update ticket price
      await tx.ticket.update({
        where: { id: ticketPart.ticketId },
        data: {
          totalRepairsCost,
          totalPartsCost,
          totalPrice,
        },
      });

      // 5. Decrease the quantity of the
      await tx.part.update({
        where: { id: data.partId },
        data: { quantity: part?.quantity! - data.quantity },
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

  static async getAllPartsOnTicket(ticketId: string) {
    return await prisma.ticketPart.findMany({
      where: { ticketId },
      include: { part: true },
    });
  }

  static async update(id: string, data: TicketPartUpdateInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Check for part quantity
      if (data?.quantity) {
        const ticketPart = await tx.ticketPart.findUnique({
          where: { id },
        });

        if (ticketPart) {
          const part = await tx.part.findUnique({
            where: { id: ticketPart.partId },
          });

          const newQuantity =
            part?.quantity! - (Number(data.quantity) - ticketPart.quantity);

          if (newQuantity < 0) {
            throw new ApiError(
              400,
              "There are no enough quantities available for this part"
            );
          }

          // 5. Decrease the quantity of the
          await tx.part.update({
            where: { id: ticketPart.partId },
            data: { quantity: newQuantity },
          });
        }
      }

      // 2. Update a ticket part.
      const ticketPart = await tx.ticketPart.update({
        where: { id },
        data,
      });

      // 3. Calculate the totalRepairsCost, totalPrice and totalPrice.
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
      // 1. Delete a ticket part.
      const ticketPart = await tx.ticketPart.delete({
        where: { id },
        include: { part: true },
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
      const partQuantity = ticketPart.part.quantity;
      await tx.part.update({
        where: { id: ticketPart.partId },
        data: { quantity: partQuantity + ticketPart.quantity },
      });

      return ticketPart;
    });
    // return prisma.$transaction(async (tx) => {
    //   // 1. Check for part quantity
    //   // const part = await tx.part.findUnique({ where: { id: data.partId } });

    //   // if (part) {
    //   //   if (part.quantity < data.quantity) {
    //   //     throw new ApiError(
    //   //       400,
    //   //       "There are no enough quantities available for this part"
    //   //     );
    //   //   }
    //   // }

    //   // 2. Create a ticket part.
    //   const ticketPart = await tx.ticketPart.create({ data });

    //   // 3. Calculate the totalRepairsCost, totalPrice and totalPrice.
    //   const ticket = await tx.ticket.findUnique({
    //     where: { id: ticketPart.ticketId },
    //     include: { repairs: true, parts: true },
    //   });

    //   if (!ticket) throw new ApiError(400, "No ticket found with that id");

    //   const repairsSum = await tx.ticketRepair.aggregate({
    //     where: { ticketId: ticket.id },
    //     _sum: { priceAtUse: true },
    //   });

    //   const partsSum = await tx.$queryRawUnsafe<{ sum: number | null }[]>(
    //     `
    //         SELECT SUM(priceAtUse * quantity) AS sum
    //         FROM TicketPart
    //         WHERE ticketId = ?
    //         `,
    //     ticket.id
    //   );

    //   const totalPartsCost = partsSum[0]?.sum ?? 0;
    //   const totalRepairsCost = repairsSum._sum.priceAtUse ?? 0;
    //   const totalPrice = totalRepairsCost + totalPartsCost;

    //   // 4. Update ticket price
    //   await tx.ticket.update({
    //     where: { id: ticketPart.ticketId },
    //     data: {
    //       totalRepairsCost,
    //       totalPartsCost,
    //       totalPrice,
    //     },
    //   });

    //   // 5. Decrease the quantity of the
    //   await tx.part.update({
    //     where: { id: data.partId },
    //     data: { quantity: part?.quantity! - data.quantity },
    //   });
    //   return ticketPart;
    // });
  }
}
