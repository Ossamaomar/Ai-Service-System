import { DeviceCreateInput, DeviceUpdateInput } from "generated/prisma/models";
import { prisma } from "src/config/database";

export class DeviceModel {
  static async create(data: DeviceCreateInput) {
    return await prisma.device.create({ data });
  }

  static async get(id: string) {
    return await prisma.device.findUnique({
      where: { id },
    });
  }

  static async getBySerialNumber(serialNumber: string) {
    console.log(serialNumber);
    return await prisma.device.findUnique({
      where: { serialNumber },
    });
  }

  static async getAll(options: any) {
    return await prisma.device.findMany(options);
  }

  static async update(id: string, data: DeviceUpdateInput) {
    return await prisma.device.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return await prisma.device.delete({ where: { id } });
  }
}
