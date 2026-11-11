import { slugify } from "@/lib/utils";

export type BlogCategory = "evento" | "circular";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  pdfUrl: string | null;
  publishedAt: string;
  isPublished: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export const blogCategoryLabels: Record<BlogCategory, string> = {
  evento: "Evento",
  circular: "Circular",
};

export function toBlogSlug(title: string): string {
  return slugify(title);
}

export function isValidBlogSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function sortPostsByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
