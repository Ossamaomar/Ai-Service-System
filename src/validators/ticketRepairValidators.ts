import z from "zod";

export const createTicketRepairSchema = z.object({
  ticketId: z.cuid("Invalid ticket ID"),
  repairId: z.cuid("Invalid repair ID"),
  priceAtUse: z.number().nonnegative("Price must be >= 0"),
  notes: z.string().trim().max(1000).optional(),
});


export const updateTicketRepairSchema = z.object({
  priceAtUse: z.number().nonnegative().optional(),
  notes: z.string().trim().max(1000).optional(),
});


export type CreateTicketRepairDTO = z.infer<typeof createTicketRepairSchema>;
export type UpdateTicketRepairDTO = z.infer<typeof updateTicketRepairSchema>;

