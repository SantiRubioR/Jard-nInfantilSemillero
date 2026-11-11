import { fail, ok, type ServiceResult } from "@/lib/result";
import { postFormSchema, type PostFormInput } from "./blog.schemas";
import {
  isValidBlogSlug,
  toBlogSlug,
  type BlogCategory,
  type BlogPost,
} from "./blog.types";

export type ValidPost = {
  title: string;
  slug: string;
  category: BlogCategory;
  publishedAt: string;
  excerpt: string | null;
  content: string | null;
};

export type PostFiles = {
  coverImageUrl: string | null;
  pdfUrl: string | null;
};

export function validatePost(input: PostFormInput): ServiceResult<ValidPost> {
  const parsed = postFormSchema.safeParse({
    title: input.title,
    category: input.category,
    publishedAt: input.publishedAt,
    excerpt: input.excerpt,
    content: input.content,
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Revisa los datos.");
  }

  const slug = toBlogSlug(parsed.data.title);

  if (!isValidBlogSlug(slug)) {
    return fail("El título debe contener letras o números para generar la URL.");
  }

  return ok({
    title: parsed.data.title,
    slug,
    category: parsed.data.category,
    publishedAt: parsed.data.publishedAt,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content || null,
  });
}

// Qué archivos de la publicación anterior se conservan según la categoría.
// Un evento solo tiene imagen y una circular solo tiene PDF.
export function keptFiles(
  category: BlogCategory,
  existing: BlogPost | null,
): PostFiles {
  if (category === "evento") {
    return {
      coverImageUrl:
        existing?.category === "evento" ? existing.coverImageUrl : null,
      pdfUrl: null,
    };
  }

  return {
    coverImageUrl: null,
    pdfUrl: existing?.category === "circular" ? existing.pdfUrl : null,
  };
}
