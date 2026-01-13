import { RepairCreateInput, RepairUpdateInput } from "generated/prisma/models";
import { RepairModel } from "src/models/repair.model";
import { APIFeatures } from "src/utils/ApiFeatures";
import { normalizeNullable, validateData } from "src/utils/helpers";
import {
  CreateRepairDTO,
  createRepairSchema,
  UpdateRepairDTO,
  updateRepairSchema,
} from "src/validators/repairValidators";

export class RepairService {
  static async createRepair(data: CreateRepairDTO) {
    const validatedData = validateData(createRepairSchema, data);

    const prismaData = normalizeNullable(validatedData);
    const repair = await RepairModel.create(prismaData as RepairCreateInput);

    return repair;
  }

  static async getAllRepairs(query: any) {
    let options;
    if (query.page) {
      options = new APIFeatures(query).filter().sort().select().paginate();
    } else {
      options = {};
    }
    const repairs = await RepairModel.getAll(options.options);

    return repairs;
  }

  static async getRepair(id: string) {
    const repair = await RepairModel.get(id);

    return repair;
  }

  static async updateRepair(id: string, data: UpdateRepairDTO) {
    const validatedData = validateData(updateRepairSchema, data);

    const prismaData = normalizeNullable(validatedData);
    const repair = await RepairModel.update(id, prismaData);

    return repair;
  }

  static async deleteRepair(id: string) {
    const repair = await RepairModel.delete(id);

    return repair;
  }
}
