import { RepairCreateInput, RepairUpdateInput } from "generated/prisma/models";
import { prisma } from "src/config/database";

export class RepairModel {
  static async create(data: RepairCreateInput) {
    return await prisma.repair.create({ data });
  }

  static async getAll(options: any) {
    return await prisma.repair.findMany(options);
  }

  static async get(id: string) {
    return await prisma.repair.findUnique({ where: { id } });
  }

  static async update(id: string, data: RepairUpdateInput) {
    return await prisma.repair.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return await prisma.repair.delete({ where: { id } });
  }
}
