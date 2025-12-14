import {
  TicketPartCreateInput,
  TicketPartUncheckedCreateInput,
  TicketPartUpdateInput,
} from "generated/prisma/models";
import { TicketModel } from "src/models/ticket.model";
import { TicketPartModel } from "src/models/ticketPart.model";
import { ApiError } from "src/utils/ApiError";
import { APIFeatures } from "src/utils/ApiFeatures";
import { normalizeNullable, validateData } from "src/utils/helpers";
import {
  CreateTicketPartDTO,
  createTicketPartSchema,
  UpdateTicketPartDTO,
  updateTicketPartSchema,
} from "src/validators/ticketPartValidators";

export class TicketPartService {
  static async createTicketPart(data: CreateTicketPartDTO) {
    const validatedData = validateData(createTicketPartSchema, data);

    const prismaData = normalizeNullable(validatedData);
    const ticketPart = await TicketPartModel.create(
      prismaData as TicketPartUncheckedCreateInput
    );

    return ticketPart;
  }

  static async getAllTicketParts(query: any) {
    const options = new APIFeatures(query).filter().sort().select().paginate();
    const ticketParts = await TicketPartModel.getAll(options.options);

    return ticketParts;
  }

  static async getTicketPart(id: string) {
    const ticketPart = await TicketPartModel.get(id);

    return ticketPart;
  }

  static async getAllPartsOnTicket(ticketId: string) {
    const ticketParts = await TicketPartModel.getAllPartsOnTicket(ticketId);

    return ticketParts;
  }

  static async updateTicketPart(id: string, data: UpdateTicketPartDTO) {
    const validatedData = validateData(updateTicketPartSchema, data);

    const prismaData = normalizeNullable(validatedData);
    const ticketPart = await TicketPartModel.update(id, prismaData);

    return ticketPart;
  }

  static async deleteTicketPart(id: string) {
    const ticketPart = await TicketPartModel.delete(id);

    return ticketPart;
  }
}
