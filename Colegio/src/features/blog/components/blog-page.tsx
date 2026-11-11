"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogCard } from "./blog-card";
import { BlogListSection } from "./blog-list";
import { BlogPostSection } from "./blog-post";
import { listStaticPosts } from "../blog.demo";
import type { BlogCategory } from "../blog.types";

const demoPublishedPosts = listStaticPosts();

export function BlogPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const categoryParam = searchParams.get("categoria");
  const category: BlogCategory | undefined =
    categoryParam === "evento" || categoryParam === "circular"
      ? categoryParam
      : undefined;

  if (slug) {
    return <BlogPostSection key={slug} slug={slug} />;
  }

  return <BlogListSection key={category ?? "all"} category={category} />;
}

export function BlogStaticList() {
  return (
    <section className="container-page py-12 md:py-16">
      <div
        className="flex flex-wrap items-center gap-2"
        role="navigation"
        aria-label="Filtrar publicaciones"
      >
        {[
          { label: "Todos", href: "/blog/" },
          { label: "Eventos", href: "/blog/?categoria=evento" },
          { label: "Circulares", href: "/blog/?categoria=circular" },
        ].map((filter, index) => (
          <Link
            key={filter.label}
            href={filter.href}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
              index === 0
                ? "bg-brand text-white shadow-soft"
                : "border border-brand/25 bg-white text-brand hover:bg-brand-50",
            )}
            aria-current={index === 0 ? "page" : undefined}
          >
            {filter.label}
          </Link>
        ))}
        <span className="ml-auto text-sm text-muted-foreground">
          {demoPublishedPosts.length} publicaciones
        </span>
      </div>

      {demoPublishedPosts.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoPublishedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted px-6 py-16 text-center">
          <FileText className="h-12 w-12 text-brand/40" aria-hidden="true" />
          <h2 className="mt-4 font-display text-xl font-bold text-brand-deep">
            Aún no hay publicaciones
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Vuelve pronto para conocer las novedades de nuestra comunidad educativa.
          </p>
        </div>
      )}
    </section>
  );
}
