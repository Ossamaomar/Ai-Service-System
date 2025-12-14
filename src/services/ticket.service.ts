import { User } from "generated/prisma/client";
import {
  Branches,
  ReceptionistTicketStatus,
  TicketStatus,
  UserRole,
} from "generated/prisma/enums";
import { TicketCreateInput, TicketUpdateInput } from "generated/prisma/models";
import { prisma } from "src/config/database";
import { CustomerModel } from "src/models/customer.model";
import { TicketModel } from "src/models/ticket.model";
import { CreateTicketInputs } from "src/types";
import { ApiError } from "src/utils/ApiError";
import { APIFeatures } from "src/utils/ApiFeatures";
import {
  generateDeviceCode,
  generateTicketNumber,
  validateData,
} from "src/utils/helpers";
import {
  CreateTicketInput,
  createTicketSchema,
  updateTicketSchema,
} from "src/validators/ticketValidators";

export class TicketService {
  static async createTicket(data: CreateTicketInput, user: User) {
    // Validate input
    const validatedData = validateData(createTicketSchema, data);

    // Execute in transaction for ACID compliance
    const ticket = await prisma.$transaction(async (tx) => {
      // 1. Validate customer exists
      const customer = await tx.customer.findUnique({
        where: { id: validatedData.customerId },
        select: { id: true, name: true, email: true, phone: true },
      });

      if (!customer) {
        throw new ApiError(404, "Customer not found");
      }

      // 2. Validate device exists and belongs to customer
      const device = await tx.device.findUnique({
        where: { id: validatedData.deviceId },
        include: { customer: true },
      });

      if (!device) {
        throw new ApiError(404, "Device not found");
      }

      if (device.customerId !== validatedData.customerId) {
        throw new ApiError(400, "Device does not belong to this customer");
      }

      // 3. Validate assigned technician if provided
      if (validatedData.assignedTechId) {
        const technician = await tx.user.findUnique({
          where: { id: validatedData.assignedTechId },
          select: { id: true, role: true, name: true },
        });

        if (!technician) {
          throw new ApiError(404, "Technician not found");
        }

        if (technician.role !== UserRole.TECHNICIAN) {
          throw new ApiError(400, "Assigned user is not a technician");
        }
      }

      // 4. Generate unique identifiers
      const ticketNumber = generateTicketNumber();
      const deviceCode = generateDeviceCode();

      // 5. Handle ticket branch
      let branch: any = "";
      if (user.role === "RECEPTIONIST") {
        branch = user.branch!;
      } else {
        branch = validatedData.branch;
      }

      // 6. Create ticket
      const newTicket = await tx.ticket.create({
        data: {
          ticketNumber,
          deviceCode,
          device: { connect: { id: validatedData.deviceId } },
          customer: { connect: { id: validatedData.customerId } },
          ...(validatedData.assignedTechId && {
            assignedTech: { connect: { id: validatedData.assignedTechId } },
          }),
          status: validatedData.status,
          urgent: validatedData.urgent,
          branch: branch,
          ...(validatedData.notes && { notes: validatedData.notes }),
          ...(validatedData.password && { password: validatedData.password }),
          // password: validatedData.password,
          includesBattery: validatedData.includesBattery,
          includesCharger: validatedData.includesCharger,
          missingSkrews: validatedData.missingSkrews,
          hasScratches: validatedData.hasScratches,
          wantsBackup: validatedData.wantsBackup,
          underWarranty: validatedData.underWarranty,
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          device: {
            select: {
              id: true,
              brand: true,
              model: true,
              type: true,
              serialNumber: true,
            },
          },
          assignedTech: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      return newTicket;
    });

    // Send notifications after transaction (non-blocking)
    // this.sendTicketNotifications(ticket).catch((err) => {
    //   console.error("Failed to send ticket notifications:", err);
    // });

    return ticket;
  }

  static async getTicket(id: string) {
    const ticket = await TicketModel.get(id);
    if (!ticket) {
      throw new ApiError(404, "No ticket found");
    }
    return ticket;
  }

  static async getAllTickets(query: any, id?: string) {
    if (id) {
      query.customerId = id;
    }
    const options = new APIFeatures(query).filter().sort().select().paginate();

    const tickets = await TicketModel.getAll(options.options);

    return tickets;
  }

  static async updateTicket(id: string, data: TicketUpdateInput, user: User) {
    const validatedData = validateData(updateTicketSchema, data);

    if (validatedData.branch && user.role !== "ADMIN") {
      throw new ApiError(403, "You are not allowed to change ticket branch");
    }

    const isReceptionistStatus =
      validatedData.status === "APPROVED" ||
      validatedData.status === "DELIVERED" ||
      validatedData.status === "CANCELLED" ||
      validatedData.status === "READY" ||
      validatedData.status === "RECEIVED"
      
    const isTechnicianStatus =
      validatedData.status === "DIAGNOSIS" ||
      validatedData.status === "UNDER_REPAIR" ||
      validatedData.status === "WAITING_APPROVAL" ||
      validatedData.status === "WAITING_PARTS";

    if (isReceptionistStatus && user.role !== "RECEPTIONIST" && user.role !== "ADMIN") {
      throw new ApiError(403, "You are not allowed for this action")
    }
    
    
    if (isTechnicianStatus && user.role !== "TECHNICIAN" && user.role !== "ADMIN") {
      throw new ApiError(403, "You are not allowed for this action")
    }

    // console.log("Validated Data: ", validatedData);

    const ticket = await TicketModel.update(
      id,
      validatedData as TicketUpdateInput
    );

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
