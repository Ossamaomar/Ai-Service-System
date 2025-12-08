import {
  TicketPartCreateInput,
  TicketPartUpdateInput,
} from "generated/prisma/models";
import { TicketModel } from "src/models/ticket.model";
import { TicketPartModel } from "src/models/ticketPart.model";
import { ApiError } from "src/utils/ApiError";
import { APIFeatures } from "src/utils/ApiFeatures";

export class TicketPartService {
  static async createTicketPart(data: TicketPartCreateInput) {
    const ticketPart = await TicketPartModel.create(data);

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

  static async updateTicketPart(id: string, data: TicketPartUpdateInput) {
    const ticketPart = await TicketPartModel.update(id, data);

    return ticketPart;
  }

  static async deleteTicketPart(id: string) {
    const ticketPart = await TicketPartModel.delete(id);

    return ticketPart;
  }
}
