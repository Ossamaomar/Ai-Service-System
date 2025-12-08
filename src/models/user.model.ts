import type { Prisma } from "generated/prisma/client";
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
    return await prisma.user.findMany({
      where: { phone },
    });
  }

  // Get all users
  static async findAll(skip = 0, take = 10) {
    return await prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
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

  // Delete user
  static async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
