import type { Prisma } from "generated/prisma/client";
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
  

  // Delete customer
  static async delete(id: string) {
    return await prisma.customer.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}
