import { DeviceCreateInput, DeviceUpdateInput } from "generated/prisma/models";
import { DeviceModel } from "src/models/device.model";
import { APIFeatures } from "src/utils/ApiFeatures";
import { validateData } from "src/utils/helpers";
import { createDeviceSchema } from "src/validators/ticketValidators";

export class DeviceService {
  static async createDevice(data: DeviceCreateInput) {
    const validatedData = validateData(createDeviceSchema, data);
    const device = await DeviceModel.create(validatedData);

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
