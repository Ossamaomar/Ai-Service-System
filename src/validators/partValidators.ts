import { Branches } from "generated/prisma/enums";
import { z } from "zod";

export const createPartSchema = z.object({
  name: z.string().trim().min(2, "Part name is required"),
  model: z.string().trim().optional(),
  sellingPrice: z.number().min(0.1, "Price must be higher than 0"),
  branch: z.enum(Branches),
  quantity: z.number().int().nonnegative(),
  minimumQuantity: z.number().int().nonnegative(),
});


export const updatePartSchema = z.object({
  name: z.string().trim().min(2, "Part name is required"),
  model: z.string().trim().optional(),
  sellingPrice: z.number().min(0.1, "Price must be higher than 0"),
  branch: z.enum(Branches),
  quantity: z.number().int().nonnegative(),
  minimumQuantity: z.number().int().nonnegative(),
});

export type CreatePartDTO = z.infer<typeof createPartSchema>;
export type UpdatePartDTO = z.infer<typeof updatePartSchema>;