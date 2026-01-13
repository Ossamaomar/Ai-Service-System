import { Prisma } from "generated/prisma/client";
import { prisma } from "src/config/database";

export class TicketModel {
  static async create(data: Prisma.TicketCreateInput) {
    return await prisma.ticket.create({ data });
  }

  static async get(id: string) {
    return await prisma.ticket.findUnique({
      where: { id },
      include: {
        parts: {
          include: {
            part: true,
          },
        },
        repairs: {
          include: {
            repair: true,
          },
        },
        assignedTech: {
          omit: {
            password: true,
            passwordChangedAt: true,
            passwordResetExpires: true,
            otpAttempts: true,
            otpExpiresAt: true,
            passwordConfirm: true,
            passwordResetToken: true,
            phoneVerificationOTP: true,
          },
        },
        customer: true,
        device: true,
      },
    });
  }

  static async assignTicket(id: string, techId: string) {
    return await prisma.ticket.update({
      where: {
        id,
      },
      data: {
        assignedTechId: techId,
      },
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
    let { customerPhone, ...whereOptions } = options.where;
    if (!customerPhone) customerPhone = "";
    return await prisma.ticket.findMany({
      ...options,
      where: {
        ...whereOptions,
        customer: {
          phone: { contains: `${customerPhone}` || "" },
        },
      },
      include: { assignedTech: true, customer: true, device: true },
    });
  }

  static async getAllForTechnician(options: any, techId: string) {
    console.log(techId);
    let { customerPhone, ...whereOptions } = options.where;
    if (!customerPhone) customerPhone = "";
    return await prisma.ticket.findMany({
      ...options,
      where: {
        ...whereOptions,
        customer: {
          phone: { contains: `${customerPhone}` || "" },
        },
        AND: [
          {
            OR: [{ assignedTechId: techId }, { assignedTechId: null }],
          },
        ],
      },
      include: { assignedTech: true, customer: true, device: true },
    });
  }

  static async update(id: string, data: Prisma.TicketUpdateInput) {
    return await prisma.ticket.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return await prisma.ticket.delete({ where: { id } });
  }
}
