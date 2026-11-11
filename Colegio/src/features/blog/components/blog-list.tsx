"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogCard } from "./blog-card";
import { useBlogListViewModel } from "../blog.hooks";
import type { BlogCategory, BlogPost } from "../blog.types";

const filters: { label: string; value?: BlogCategory }[] = [
  { label: "Todos" },
  { label: "Eventos", value: "evento" },
  { label: "Circulares", value: "circular" },
];

export function BlogFilters({
  category,
  count,
}: {
  category?: BlogCategory;
  count: number;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="navigation"
      aria-label="Filtrar publicaciones"
    >
      {filters.map((filter) => {
        const href = filter.value ? `/blog/?categoria=${filter.value}` : "/blog/";
        const active = category === filter.value;

        return (
          <Link
            key={filter.label}
            href={href}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-brand text-white shadow-soft"
                : "border border-brand/25 bg-white text-brand hover:bg-brand-50",
            )}
            aria-current={active ? "page" : undefined}
          >
            {filter.label}
          </Link>
        );
      })}
      <span className="ml-auto text-sm text-muted-foreground">
        {count} {count === 1 ? "publicación" : "publicaciones"}
      </span>
    </div>
  );
}

export function BlogList({
  posts,
  loading,
}: {
  posts: BlogPost[];
  loading?: boolean;
}) {
  if (posts.length > 0) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted px-6 py-16 text-center">
      <FileText className="h-12 w-12 text-brand/40" aria-hidden="true" />
      <h2 className="mt-4 font-display text-xl font-bold text-brand-deep">
        {loading ? "Cargando publicaciones…" : "Aún no hay publicaciones"}
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Vuelve pronto para conocer las novedades de nuestra comunidad educativa.
      </p>
    </div>
  );
}

export function BlogListSection({ category }: { category?: BlogCategory }) {
  const viewModel = useBlogListViewModel(category);

  return (
    <section className="container-page py-12 md:py-16">
      <BlogFilters category={category} count={viewModel.posts.length} />
      <BlogList posts={viewModel.posts} loading={viewModel.loading} />
      {viewModel.error && (
        <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
          {viewModel.error}
        </p>
      )}
    </section>
  );
}
