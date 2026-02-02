import { User } from "generated/prisma/client";
import { UserRole } from "generated/prisma/enums";
import { TicketUpdateInput } from "generated/prisma/models";
import { prisma } from "src/config/database";
import { TicketModel } from "src/models/ticket.model";
import { ApiError } from "src/utils/ApiError";
import { APIFeatures } from "src/utils/ApiFeatures";
import { generateTicketNumber, validateData } from "src/utils/helpers";
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
      // const deviceCode = generateDeviceCode();

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
          device: { connect: { id: validatedData.deviceId } },
          customer: { connect: { id: validatedData.customerId } },
          ...(validatedData.assignedTechId && {
            assignedTech: {
              connect: { id: validatedData.assignedTechId },
            },
            assignedAt: new Date(),
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

  static async getAllTicketsForTechnician(query: any, id: string) {
    // if (id) {
    //   query.customerId = id;
    // }
    const options = new APIFeatures(query).filter().sort().select().paginate();

    const tickets = await TicketModel.getAllForTechnician(options.options, id);

    return tickets;
  }

  static async assignForCurrentTechnician(id: string, techId: string) {
    const tickets = await TicketModel.assignTicket(id, techId);

    return tickets;
  }

  static async updateTicket(id: string, data: TicketUpdateInput, user: User) {
    const ticketCurrent = await TicketModel.get(id);
    // 2. Validated ticket data
    const validatedData = validateData(updateTicketSchema, data);

    // Check if the tech. who wants to edit the ticket is the same tech. that assigned to that ticket
    if (
      ticketCurrent?.assignedTechId &&
      ticketCurrent.assignedTechId === user.id
    ) {
      // 1. Check if the ticket is closed
      if (
        ticketCurrent?.status === "CANCELLED" ||
        ticketCurrent?.status === "DELIVERED"
      ) {
        throw new ApiError(403, "This ticket is closed");
      }

      // 3. Make only admins can change branch
      if (validatedData.branch && user.role !== "ADMIN") {
        throw new ApiError(403, "You are not allowed to change ticket branch");
      }

      // 4. Handling status change permissions
      const receptionistOnlyStatuses = ["APPROVED", "RECEIVED", "DELIVERED"];

      const technicianOnlyStatuses = [
        "DIAGNOSIS",
        "WAITING_APPROVAL",
        "WAITING_PARTS",
        "UNDER_REPAIR",
        "READY",
      ];

      // CANCELLED can be done by both receptionist and technician
      const sharedStatuses = ["CANCELLED"];

      // Check if status is being changed
      if (validatedData.status) {
        const isReceptionistOnly = receptionistOnlyStatuses.includes(
          validatedData.status
        );
        const isTechnicianOnly = technicianOnlyStatuses.includes(
          validatedData.status
        );
        const isSharedStatus = sharedStatuses.includes(validatedData.status);

        // Receptionist-only statuses
        if (
          isReceptionistOnly &&
          user.role !== "RECEPTIONIST" &&
          user.role !== "ADMIN"
        ) {
          throw new ApiError(403, "Only receptionists can set this status");
        }

        // Technician-only statuses
        if (
          isTechnicianOnly &&
          user.role !== "TECHNICIAN" &&
          user.role !== "ADMIN"
        ) {
          throw new ApiError(403, "Only technicians can set this status");
        }

        // Shared statuses (like CANCELLED)
        if (isSharedStatus) {
          const canUpdate =
            user.role === "RECEPTIONIST" ||
            user.role === "TECHNICIAN" ||
            user.role === "ADMIN";

          if (!canUpdate) {
            throw new ApiError(403, "You are not allowed to set this status");
          }
        }
      }

      // 5. Check if assigning a technician, set assignedAt timestamp
      if (validatedData.assignedTechId) {
        // Check if technician is being newly assigned
        const currentTicket = await TicketModel.get(id);

        if (
          !currentTicket?.assignedTechId ||
          currentTicket.assignedTechId !== validatedData.assignedTechId
        ) {
          validatedData.assignedAt = new Date();
        }
      }

      // 6. Check if unassigning technician, clear assignedAt
      if (validatedData.assignedTechId === null) {
        validatedData.assignedAt = undefined;
      }

      // 7. Update ticket data
      const ticket = await TicketModel.update(
        id,
        validatedData as TicketUpdateInput
      );

      if (!ticket) {
        throw new ApiError(404, "No ticket found");
      }

      return ticket;
    } else if (
      ticketCurrent?.assignedTechId === null &&
      user.role === "TECHNICIAN" &&
      validatedData.assignedTechId
    ) {
      // 5. Check if assigning a technician, set assignedAt timestamp
      if (validatedData.assignedTechId) {
        // Check if technician is being newly assigned
        const currentTicket = await TicketModel.get(id);

        if (
          !currentTicket?.assignedTechId ||
          currentTicket.assignedTechId !== validatedData.assignedTechId
        ) {
          validatedData.assignedAt = new Date();
        }
      }

      // 6. Check if unassigning technician, clear assignedAt
      if (validatedData.assignedTechId === null) {
        validatedData.assignedAt = undefined;
      }
      const ticket = await TicketModel.update(
        id,
        validatedData as TicketUpdateInput
      );

      if (!ticket) {
        throw new ApiError(404, "No ticket found");
      }

      return ticket;
    } else {
      throw new ApiError(403, "You are not allowed to do this action");
    }
  }

  static async deleteTicket(id: string) {
    const ticket = await TicketModel.delete(id);
    if (!ticket) {
      throw new ApiError(404, "No ticket found");
    }
    return ticket;
  }
}
