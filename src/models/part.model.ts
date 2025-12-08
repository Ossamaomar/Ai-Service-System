import { PartCreateInput, PartUpdateInput } from "generated/prisma/models";
import { prisma } from "src/config/database";

export class PartModel {
  static async create(data: PartCreateInput) {
    return await prisma.part.create({ data });
  }

  static async getAll(options: any) {
    return await prisma.part.findMany(options);
  }

  static async get(id: string) {
    return await prisma.part.findUnique({ where: { id } });
  }

  static async update(id: string, data: PartUpdateInput) {
    return await prisma.part.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return await prisma.part.delete({ where: { id } });
  }
}
