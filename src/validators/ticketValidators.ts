import { z } from "zod";
import { TicketStatus, Branches } from "generated/prisma/enums.js";
import { cleanUndefined } from "src/utils/helpers";
export const DeviceTypeEnum = z.enum(["LAPTOP", "CAMERA", "PRINTER", "OTHER"], {
  error: "Please select a valid device type",
});
export const createTicketSchema = z.object({
  // Required relations
  deviceId: z.cuid("Invalid device ID"),
  customerId: z.cuid("Invalid customer ID"),
  assignedTechId: z.cuid("Invalid technician ID").optional().nullable(),

  // Ticket details
  status: z.enum(TicketStatus).optional().default(TicketStatus.RECEIVED),
  urgent: z.boolean().optional().default(false),
  branch: z.enum(Branches),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional().nullable(),
  password: z.string().max(50, "Password cannot exceed 50 characters").optional().nullable(),

  // Device condition checkboxes
  includesBattery: z.boolean().optional().default(false),
  includesCharger: z.boolean().optional().default(false),
  missingSkrews: z.boolean().optional().default(false),
  hasScratches: z.boolean().optional().default(false),
  wantsBackup: z.boolean().optional().default(false),
  underWarranty: z.boolean().optional().default(false),
});

export const createDeviceSchema = z.object({
  serialNumber: z.string().optional(),

  type: DeviceTypeEnum,
  otherType: z.string().optional(),
  brand: z.string("The brand name is required").min(2, "Enter a valid brand name"),
  model: z.string("The model name is required").min(1, "Enter a valid model name"),
  color: z.string("The color name is required").min(3, "Enter a valid color name"),
  customerId: z.cuid("Invalid customer ID"),
});

export const updateTicketSchema = z.object({
  assignedTechId: z.cuid("Invalid technician ID").optional(),
  status: z.enum(TicketStatus).optional(),
  urgent: z.boolean().optional(),
  branch: z.enum(Branches).optional(),
  notes: z.string().max(1000).optional(),
  password: z.string().max(50).optional(),
  includesBattery: z.boolean().optional(),
  includesCharger: z.boolean().optional(),
  missingSkrews: z.boolean().optional(),
  hasScratches: z.boolean().optional(),
  wantsBackup: z.boolean().optional(),
  underWarranty: z.boolean().optional(),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(TicketStatus),
});

export const assignTechnicianSchema = z.object({
  technicianId: z.cuid("Invalid technician ID"),
});

export const addTicketPartSchema = z.object({
  partId: z.cuid("Invalid part ID"),
  quantity: z.number().int().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
});

export const addTicketRepairSchema = z.object({
  repairId: z.cuid("Invalid repair ID"),
  price: z.number().positive("Price must be positive"),
  notes: z.string().max(500).optional(),
});

export const searchTicketSchema = z.object({
  id: z.cuid().optional(),
  ticketNumber: z.string().optional(),
  deviceCode: z.string().optional(),
}).refine((data) => data.id || data.ticketNumber || data.deviceCode, {
  message: "Provide at least one search parameter: id, ticketNumber, or deviceCode",
});

// Type inference
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;