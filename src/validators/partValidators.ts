import { z } from "zod";

export const createPartSchema = z.object({
  name: z.string().trim().min(2, "Part name is required"),
  model: z.string().trim().optional(),
  sellingPrice: z.number().nonnegative("Selling price must be >= 0"),
  quantity: z.number().int().nonnegative().optional(),
  minimumQuantity: z.number().int().nonnegative().optional(),
});


export const updatePartSchema = z.object({
  name: z.string().trim().min(2).optional(),
  model: z.string().trim().optional(),
  sellingPrice: z.number().nonnegative().optional(),
  quantity: z.number().int().nonnegative().optional(),
  minimumQuantity: z.number().int().nonnegative().optional(),
});

export type CreatePartDTO = z.infer<typeof createPartSchema>;
export type UpdatePartDTO = z.infer<typeof updatePartSchema>;