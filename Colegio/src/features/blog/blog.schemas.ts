import { z } from "zod";

export const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres.")
    .max(160, "El título no puede superar 160 caracteres."),
  category: z.enum(["evento", "circular"], {
    message: "Selecciona una categoría válida.",
  }),
  publishedAt: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida."),
  excerpt: z
    .string()
    .trim()
    .max(320, "El resumen no puede superar 320 caracteres.")
    .optional()
    .or(z.literal("")),
  content: z.string().trim().optional().or(z.literal("")),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export type PostFormInput = {
  title: string;
  category: "evento" | "circular";
  publishedAt: string;
  excerpt: string;
  content: string;
  isPublished: boolean;
  coverImage?: File;
  pdfFile?: File;
};
