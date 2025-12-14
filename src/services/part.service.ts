import { PartCreateInput, PartUpdateInput } from "generated/prisma/models";
import { PartModel } from "src/models/part.model";
import { APIFeatures } from "src/utils/ApiFeatures";
import { normalizeNullable, validateData } from "src/utils/helpers";
import {
  CreatePartDTO,
  createPartSchema,
  UpdatePartDTO,
  updatePartSchema,
} from "src/validators/partValidators";

export class PartService {
  static async createPart(data: CreatePartDTO) {
    const validatedData = validateData(createPartSchema, data);

    const prismaData = normalizeNullable(validatedData);

    const part = await PartModel.create(prismaData as PartCreateInput);

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

  static async updatePart(id: string, data: UpdatePartDTO) {
    const validatedData = validateData(updatePartSchema, data);

    const prismaData = normalizeNullable(validatedData);
    
    const part = await PartModel.update(id, prismaData);

    return part;
  }

  static async deletePart(id: string) {
    const part = await PartModel.delete(id);

    return part;
  }
}
