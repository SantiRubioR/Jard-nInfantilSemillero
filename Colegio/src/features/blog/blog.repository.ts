import type { Database } from "@/types/database";
import { getSupabaseClient, type AppSupabaseClient } from "@/lib/supabase";
import { fail, ok, type ServiceResult } from "@/lib/result";
import {
  demoPosts,
  findStaticPostBySlug,
  listStaticPosts,
} from "./blog.demo";
import type { BlogCategory, BlogPost } from "./blog.types";

type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];

export type CreateBlogPostRecord = {
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  pdfUrl: string | null;
  publishedAt: string;
  isPublished: boolean;
  createdBy: string;
};

export type UpdateBlogPostRecord = Omit<CreateBlogPostRecord, "createdBy">;

export interface BlogRepository {
  listPublished(category?: BlogCategory): Promise<ServiceResult<BlogPost[]>>;
  findBySlug(slug: string): Promise<ServiceResult<BlogPost | null>>;
  listAll(): Promise<ServiceResult<BlogPost[]>>;
  findById(id: string): Promise<ServiceResult<BlogPost | null>>;
  create(input: CreateBlogPostRecord): Promise<ServiceResult<BlogPost>>;
  update(id: string, input: UpdateBlogPostRecord): Promise<ServiceResult<BlogPost>>;
  delete(id: string): Promise<ServiceResult<void>>;
}

const READ_ONLY_MESSAGE = "Configura Supabase en el build para guardar cambios reales.";

function toBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    pdfUrl: row.pdf_url,
    publishedAt: row.published_at,
    isPublished: row.is_published,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWriteError(error: { code?: string; message: string } | null) {
  if (error?.code === "23505") {
    return "Ya existe una publicación con un título muy similar. Usa otro título.";
  }

  return "No se pudo guardar la publicación.";
}

const demoBlogRepository: BlogRepository = {
  async listPublished(category) {
    return ok(listStaticPosts(category));
  },

  async findBySlug(slug) {
    return ok(findStaticPostBySlug(slug));
  },

  async listAll() {
    return ok(demoPosts);
  },

  async findById(id) {
    return ok(demoPosts.find((post) => post.id === id) ?? null);
  },

  async create() {
    return fail(READ_ONLY_MESSAGE);
  },

  async update() {
    return fail(READ_ONLY_MESSAGE);
  },

  async delete() {
    return fail(READ_ONLY_MESSAGE);
  },
};

function createSupabaseBlogRepository(
  supabase: AppSupabaseClient,
): BlogRepository {
  return {
    async listPublished(category) {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        return fail("No se pudieron cargar las publicaciones.");
      }

      return ok((data ?? []).map(toBlogPost));
    },

    async findBySlug(slug) {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) {
        return fail("No se pudo consultar la publicación.");
      }

      return ok(data ? toBlogPost(data) : null);
    },

    async listAll() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) {
        return fail("No se pudieron cargar las publicaciones.");
      }

      return ok((data ?? []).map(toBlogPost));
    },

    async findById(id) {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        return fail("No se pudo consultar la publicación.");
      }

      return ok(data ? toBlogPost(data) : null);
    },

    async create(input) {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: input.title,
          slug: input.slug,
          category: input.category,
          excerpt: input.excerpt,
          content: input.content,
          cover_image_url: input.coverImageUrl,
          pdf_url: input.pdfUrl,
          published_at: input.publishedAt,
          is_published: input.isPublished,
          created_by: input.createdBy,
        })
        .select("*")
        .single();

      if (error || !data) {
        return fail(mapWriteError(error));
      }

      return ok(toBlogPost(data));
    },

    async update(id, input) {
      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          title: input.title,
          slug: input.slug,
          category: input.category,
          excerpt: input.excerpt,
          content: input.content,
          cover_image_url: input.coverImageUrl,
          pdf_url: input.pdfUrl,
          published_at: input.publishedAt,
          is_published: input.isPublished,
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error || !data) {
        return fail(mapWriteError(error));
      }

      return ok(toBlogPost(data));
    },

    async delete(id) {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);

      if (error) {
        return fail("No se pudo eliminar la publicación.");
      }

      return ok(undefined);
    },
  };
}

export function getBlogRepository(): BlogRepository {
  const supabase = getSupabaseClient();
  return supabase ? createSupabaseBlogRepository(supabase) : demoBlogRepository;
}
