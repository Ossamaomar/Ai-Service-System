import z from "zod";

export const createTicketPartSchema = z.object({
  ticketId: z.cuid("Invalid ticket ID"),
  partId: z.cuid("Invalid part ID"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  priceAtUse: z.number().nonnegative("Price must be >= 0"),
});

export const updateTicketPartSchema = z.object({
  quantity: z.number().int().positive().optional(),
  priceAtUse: z.number().nonnegative().optional(),
});

export type CreateTicketPartDTO = z.infer<typeof createTicketPartSchema>;
export type UpdateTicketPartDTO = z.infer<typeof updateTicketPartSchema>;

