import { TicketStatus } from "generated/prisma/enums";
import { TicketCreateInput, TicketUpdateInput } from "generated/prisma/models";
import { CustomerModel } from "src/models/customer.model";
import { TicketModel } from "src/models/ticket.model";
import { CreateTicketInputs } from "src/types";
import { ApiError } from "src/utils/ApiError";
import { APIFeatures } from "src/utils/ApiFeatures";
import { generateDeviceCode, generateTicketNumber } from "src/utils/helpers";

export class TicketService {
  static async createTicket(data: CreateTicketInputs) {
    const customer = await CustomerModel.findById(data.customerId);

    if (!customer) {
      throw new ApiError(404, "No customer found to assign the ticket for");
    }

    const ticketNumber = generateTicketNumber();
    const deviceCode = generateDeviceCode();

    const ticketData: TicketCreateInput = {
      ticketNumber,
      deviceCode,
      urgent: data.urgent,
      customer: {
        connect: { id: data.customerId },
      },
      ...(data.assignedTechId && {
        assignedTech: {
          connect: { id: data.assignedTechId },
        },
      }),
      ...(data.status && {
        status: data.status,
      }),
    };

    const ticket = await TicketModel.create(ticketData);
    return ticket;
  }

  static async getTicket(id: string) {
    const ticket = await TicketModel.get(id);
    if (!ticket) {
      throw new ApiError(404, "No ticket found");
    }
    return ticket;
  }

  static async getAllTickets(query: any) {
    const options = new APIFeatures(query).filter().sort().select().paginate();

    const tickets = await TicketModel.getAll(options.options);

    return tickets;
  }

  static async updateTicket(id: string, data: TicketUpdateInput) {
    const ticket = await TicketModel.update(id, data);
    if (!ticket) {
      throw new ApiError(404, "No ticket found");
    }
    return ticket;
  }

  static async deleteTicket(id: string) {
    const ticket = await TicketModel.delete(id);
    if (!ticket) {
      throw new ApiError(404, "No ticket found");
    }
    return ticket;
  }
}
