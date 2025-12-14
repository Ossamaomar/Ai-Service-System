import {
  TicketRepairCreateInput,
  TicketRepairUpdateInput,
} from "generated/prisma/models";
import { TicketModel } from "src/models/ticket.model";
import { TicketRepairModel } from "src/models/ticketRepair.model";
import { ApiError } from "src/utils/ApiError";
import { APIFeatures } from "src/utils/ApiFeatures";
import { normalizeNullable, validateData } from "src/utils/helpers";
import { CreateTicketRepairDTO, createTicketRepairSchema } from "src/validators/ticketRepairValidators";

export class TicketRepairService {
  static async createTicketRepair(data: CreateTicketRepairDTO) {
    const validatedData = validateData(createTicketRepairSchema, data);

    const prismaData = normalizeNullable(validatedData);
    const ticketRepair = await TicketRepairModel.create(prismaData as TicketRepairCreateInput);

    return ticketRepair;
  }

  static async getAllTicketRepairs(query: any) {
    const options = new APIFeatures(query).filter().sort().select().paginate();
    const ticketRepairs = await TicketRepairModel.getAll(options.options);

    return ticketRepairs;
  }

  static async getTicketRepair(id: string) {
    const ticketRepair = await TicketRepairModel.get(id);

    return ticketRepair;
  }

  static async getAllRepairsOnTicket(ticketId: string) {
    const ticketParts = await TicketRepairModel.getAllRepairsOnTicket(ticketId);

    return ticketParts;
  }

  static async updateTicketRepair(id: string, data: TicketRepairUpdateInput) {
    const ticketRepair = await TicketRepairModel.update(id, data);

    return ticketRepair;
  }

  static async deleteTicketRepair(id: string) {
    const ticketRepair = await TicketRepairModel.delete(id);

    return ticketRepair;
  }
}
