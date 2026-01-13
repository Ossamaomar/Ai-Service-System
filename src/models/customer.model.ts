import { Prisma } from "generated/prisma/client";
import { prisma } from "../config/database";

export class CustomerModel {
  // Create customer
  static async create(data: Prisma.CustomerCreateInput) {
    return await prisma.customer.create({ data });
  }

  // Find customer by ID
  static async findById(id: string) {
    return await prisma.customer.findUnique({
      where: { id },
    });
  }

  // Find customer by email
  static async findByEmail(email: string) {
    return await prisma.customer.findMany({
      where: { email: { contains: email } },
    });
  }

  static async findByPhone(phone: string) {
    return await prisma.customer.findUnique({
      where: { phone },
    });
  }

  static async findByName(name: string) {
    return await prisma.customer.findMany({
      where: { name: { contains: name } },
    });
  }

  // Get all customers
  static async findAll(options: any) {
    return await prisma.customer.findMany(options);
  }

  // Update customer
  static async update(id: string, data: Prisma.CustomerUpdateInput) {
    return await prisma.customer.update({
      where: { id },
      data,
    });
  }
  
  static async updateByUserId(userId: string, data: Prisma.CustomerUpdateInput) {
    return await prisma.customer.update({
      where: { userId },
      data,
    });
  }

  // Delete customer
  static async delete(id: string) {
    return await prisma.customer.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  static async getCustomersOverview(options: any) {
    const take = options.take || 10;
    const skip = (Number(options?.page) - 1) * take || 0;
    const phoneFilter = options.phone ?? "";

    let orderBy = Prisma.sql`ticketsCount DESC`;

    switch (options.sort) {
      case "least_tickets":
        orderBy = Prisma.sql`ticketsCount ASC`;
        break;
      case "most_devices":
        orderBy = Prisma.sql`devicesCount DESC`;
        break;
      case "least_devices":
        orderBy = Prisma.sql`devicesCount ASC`;
        break;
      case "newest":
        orderBy = Prisma.sql`createdAt DESC`;
        break;
      case "oldest":
        orderBy = Prisma.sql`createdAt ASC`;
        break;
      default:
        orderBy = Prisma.sql`ticketsCount DESC`;
    }

    const customers = await prisma.$queryRaw<
      {
        id: string;
        name: string;
        phone: string;
        email: string | null;
        ticketsCount: number;
        devicesCount: number;
        createdAt: string;
      }[]
    >`
    SELECT 
      c.id,
      c.name,
      c.phone,
      c.email,
      c.createdAt,

      COUNT(DISTINCT t.id) AS ticketsCount,
      COUNT(DISTINCT d.id) AS devicesCount

    FROM Customer c
    LEFT JOIN Ticket t ON t.customerId = c.id
    LEFT JOIN Device d ON d.customerId = c.id

    WHERE 
      c.isActive = true
      AND c.phone LIKE ${`%${phoneFilter}%`}

    GROUP BY c.id
    ORDER BY ${orderBy}
    LIMIT ${take}
    OFFSET ${skip};
  `;

    return customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      ticketsCount: Number(c.ticketsCount),
      devicesCount: Number(c.devicesCount),
      createdAt: c.createdAt,
    }));
  }
}
