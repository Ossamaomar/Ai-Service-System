import { PartCreateInput, PartUpdateInput } from "generated/prisma/models";
import { PartModel } from "src/models/part.model";
import { APIFeatures } from "src/utils/ApiFeatures";

export class PartService {
  static async createPart(data: PartCreateInput) {
    const part = await PartModel.create(data);

    return part;
  }

  static async getAllParts(query: any) {
    const options = new APIFeatures(query).filter().sort().select().paginate();
    const parts = await PartModel.getAll(options.options);

    return parts;
  }

  static async getPart(id: string) {
    const part = await PartModel.get(id);

    return part;
  }

  static async updatePart(id: string, data: PartUpdateInput) {
    const part = await PartModel.update(id, data);

    return part;
  }

  static async deletePart(id: string) {
    const part = await PartModel.delete(id);

    return part;
  }
}
