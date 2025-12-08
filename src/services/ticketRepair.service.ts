import {
  TicketRepairCreateInput,
  TicketRepairUpdateInput,
} from "generated/prisma/models";
import { TicketModel } from "src/models/ticket.model";
import { TicketRepairModel } from "src/models/ticketRepair.model";
import { ApiError } from "src/utils/ApiError";
import { APIFeatures } from "src/utils/ApiFeatures";

export class TicketRepairService {
  static async createTicketRepair(data: TicketRepairCreateInput) {
    const ticketRepair = await TicketRepairModel.create(data);

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

  static async updateTicketRepair(id: string, data: TicketRepairUpdateInput) {
    const ticketRepair = await TicketRepairModel.update(id, data);
    if (ticketRepair) {
      await this.#updateTicketTotalPrice(ticketRepair.ticketId);
    }
    return ticketRepair;
  }

  static async deleteTicketRepair(id: string) {
    const ticketRepair = await TicketRepairModel.delete(id);
    if (ticketRepair) {
      await this.#updateTicketTotalPrice(ticketRepair.ticketId);
    }
    return ticketRepair;
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
