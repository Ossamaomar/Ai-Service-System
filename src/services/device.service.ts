import { Prisma } from "generated/prisma/client";
import { DeviceUpdateInput } from "generated/prisma/models";
import { DeviceModel } from "src/models/device.model";
import { APIFeatures } from "src/utils/ApiFeatures";
import { generateDeviceCode, validateData } from "src/utils/helpers";
import {
  createDeviceSchema,
  DeviceCreateInput,
} from "src/validators/ticketValidators";

export class DeviceService {
  static async createDevice(data: Omit<DeviceCreateInput, "deviceCode">) {
    // Generate device code
    const deviceCode = generateDeviceCode();

    // Validate input data
    const validatedData = validateData(createDeviceSchema, {
      ...data,
      deviceCode,
    });

    // Transform to Prisma format
    const prismaData: Prisma.DeviceCreateInput = {
      deviceCode: validatedData.deviceCode,
      serialNumber: validatedData.serialNumber,
      type: validatedData.type,
      otherType: validatedData.otherType,
      brand: validatedData.brand,
      model: validatedData.model,
      color: validatedData.color,
      customer: {
        connect: { id: validatedData.customerId },
      },
    };

    const device = await DeviceModel.create(prismaData);

    return device;
  }

  static async getAllDevices(reqQuery: any) {
    const query = new APIFeatures(reqQuery).filter().select().sort().paginate();
    const devices = await DeviceModel.getAll(query.options);

    return devices;
  }

  static async getDevice(id: string) {
    const device = await DeviceModel.get(id);

    return device;
  }

  static async getDeviceBySerialNumber(serialNumber: string) {
    const device = await DeviceModel.getBySerialNumber(serialNumber);

    return device;
  }

  static async updateDevice(id: string, data: DeviceUpdateInput) {
    const validatedData = validateData(createDeviceSchema, data);
    const device = await DeviceModel.update(id, validatedData);

    return device;
  }

  static async deleteDevice(id: string) {
    const device = await DeviceModel.delete(id);

    return device;
  }
}
