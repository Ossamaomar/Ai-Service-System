import { RepairCreateInput, RepairUpdateInput } from "generated/prisma/models";
import { RepairModel } from "src/models/repair.model";
import { APIFeatures } from "src/utils/ApiFeatures";

export class RepairService {
  static async createRepair(data: RepairCreateInput) {
    const repair = await RepairModel.create(data);

    return repair;
  }

  static async getAllRepairs(query: any) {
    const options = new APIFeatures(query).filter().sort().select().paginate();
    const repairs = await RepairModel.getAll(options.options);

    return repairs;
  }

  static async getRepair(id: string) {
    const repair = await RepairModel.get(id);

    return repair;
  }

  static async updateRepair(id: string, data: RepairUpdateInput) {
    const repair = await RepairModel.update(id, data);

    return repair;
  }

  static async deleteRepair(id: string) {
    const repair = await RepairModel.delete(id);

    return repair;
  }
}
