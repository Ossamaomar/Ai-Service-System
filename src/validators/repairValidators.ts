import z from "zod";

export const createRepairSchema = z.object({
  name: z.string().trim().min(2, "Repair name is required"),
  price: z.number().nonnegative("Price must be >= 0"),
});

export const updateRepairSchema = z.object({
  name: z.string().trim().min(2).optional(),
  price: z.number().nonnegative().optional(),
});

export type CreateRepairDTO = z.infer<typeof createRepairSchema>;
export type UpdateRepairDTO = z.infer<typeof updateRepairSchema>;

