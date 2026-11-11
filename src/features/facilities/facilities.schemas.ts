import { z } from "zod";

export const facilitySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres.")
    .max(120, "El título no puede superar 120 caracteres."),
  description: z
    .string()
    .trim()
    .max(300, "La descripción no puede superar 300 caracteres.")
    .optional()
    .or(z.literal("")),
});
