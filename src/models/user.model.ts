import { Prisma, TicketStatus } from "generated/prisma/client";
import { prisma } from "../config/database";

export class UserModel {
  // Create user
  static async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data });
  }

  // Find user by ID
  static async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Find user by email
  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async findByPhone(phone: string) {
    return await prisma.user.findUnique({
      where: { phone },
    });
  }

  static async findByResetToken(passwordResetToken: string) {
    return await prisma.user.findUnique({
      where: { passwordResetToken },
    });
  }

  // Get all users
  static async findAll(options: any) {
    return await prisma.user.findMany({
      ...options,
      omit: {
        password: true,
        passwordConfirm: true,
        passwordResetToken: true,
        passwordResetExpires: true,
      },
    });
  }

  // Update user
  static async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async updateCurrent(id: string, data: Prisma.UserUpdateInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Check for part quantity
      const user = await tx.user.update({ where: { id }, data });

      if (user.role === "CUSTOMER") {
        await tx.customer.update({
          where: {
            userId: user.id,
          },
          data: {
            name: user.name,
            phone: user.phone,
            email: user.email,
          },
        });
      }
      return user;
    });
  }

  // Delete user
  static async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  static async getTechniciansOverview(options: any) {
    const take = options.take ?? 10;
    const skip = (Number(options?.page) - 1) * take || 0;

    const orderDirection =
      options.sort === "least_completed" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

    const nameFilter = options.name ?? "";

    const branchFilter = options.branch;

    const branchCondition = branchFilter
      ? Prisma.sql`AND u.branch = ${branchFilter}`
      : Prisma.empty;

    const technicians = await prisma.$queryRaw<
      {
        id: string;
        name: string;
        phone: string;
        completedTickets: number;
        activeTickets: number;
        createdAt: string;
      }[]
    >`
    SELECT 
      u.id,
      u.name,
      u.phone,
      u.createdAt,

      SUM(
        CASE 
          WHEN t.status = 'DELIVERED' THEN 1 
          ELSE 0 
        END
      ) AS completedTickets,

      SUM(
        CASE 
          WHEN t.status IN (
            'RECEIVED',
            'DIAGNOSIS',
            'UNDER_REPAIR',
            'WAITING_APPROVAL',
            'WAITING_PARTS'
          )
          THEN 1 ELSE 0
        END
      ) AS activeTickets

    FROM User u
    LEFT JOIN Ticket t ON t.assignedTechId = u.id

    WHERE 
      u.role = 'TECHNICIAN'
      AND u.isActive = true
      AND u.name LIKE ${`%${nameFilter}%`}
      ${branchCondition}
    GROUP BY u.id
    ORDER BY completedTickets ${orderDirection}
    LIMIT ${take}
    OFFSET ${skip};
  `;

    return technicians;
  }
}
