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

    if (ticketPart) {
      await this.#updateTicketTotalPrice(ticketPart.ticketId);
    }

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

  static async updateTicketPart(id: string, data: TicketPartUpdateInput) {
    const ticketPart = await TicketPartModel.update(id, data);
    if (ticketPart) {
      await this.#updateTicketTotalPrice(ticketPart.ticketId);
    }
    return ticketPart;
  }

  static async deleteTicketPart(id: string) {
    const ticketPart = await TicketPartModel.delete(id);
    if (ticketPart) {
      await this.#updateTicketTotalPrice(ticketPart.ticketId);
    }
    return ticketPart;
  }

  static async #updateTicketTotalPrice(ticketId: string) {
    const ticket = await TicketModel.getWithAllRepairsAndPartsIncluded(
      ticketId
    );

    if (!ticket) throw new ApiError(400, "No ticket found with that id");

    const totalRepairsCost = ticket.repairs.reduce(
      (sum, r) => sum + r.priceAtUse,
      0
    );

    const totalPartsCost = ticket.parts.reduce(
      (sum, p) => sum + p.priceAtUse * p.quantity,
      0
    );

    const totalPrice = totalRepairsCost + totalPartsCost;

    await TicketModel.updateAfterRepairOrTicketAdded(
      ticketId,
      totalRepairsCost,
      totalPartsCost,
      totalPrice
    );
  }
}
