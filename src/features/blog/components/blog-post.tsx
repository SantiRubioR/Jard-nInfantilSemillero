"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { PdfDownloadCard } from "@/components/ui/pdf-download-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { useBlogPostViewModel } from "../blog.hooks";
import type { BlogPost } from "../blog.types";

export function BlogPostDetail({
  post,
  showTitle = true,
}: {
  post: BlogPost;
  showTitle?: boolean;
}) {
  const paragraphs = (post.content ?? post.excerpt ?? "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={post.category === "evento" ? "accent" : "default"}>
            {post.category === "evento" ? "Evento" : "Circular"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatDate(post.publishedAt)}
          </span>
        </div>

        {showTitle && (
          <>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-brand-deep md:text-4xl">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}
          </>
        )}

        {post.coverImageUrl && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-muted shadow-card">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className="prose-institucional mt-8 text-base">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>Esta publicación no tiene contenido adicional.</p>
          )}
        </div>

        {post.category === "circular" && (
          <div className="mt-8">
            <PdfDownloadCard
              title={post.title}
              description="Descarga el comunicado oficial en formato PDF."
              pdfUrl={post.pdfUrl}
              updatedAt={post.updatedAt}
              actionLabel="Descargar circular"
            />
          </div>
        )}

        <div className="mt-10 border-t border-border pt-6">
          <Link
            href="/blog/"
            className={cn(buttonVariants({ variant: "ghost", size: "md" }), "-ml-4")}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al blog
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BlogPostSection({ slug }: { slug: string }) {
  const viewModel = useBlogPostViewModel(slug);

  if (viewModel.post) {
    return <BlogPostDetail post={viewModel.post} />;
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-muted p-10 text-center">
        <FileText className="mx-auto h-12 w-12 text-brand/40" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl font-bold text-brand-deep">
          {viewModel.loading ? "Cargando publicación…" : "Publicación no encontrada"}
        </h2>
        {!viewModel.loading && (
          <Link
            href="/blog/"
            className={cn(buttonVariants({ variant: "outline" }), "mt-5")}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al blog
          </Link>
        )}
      </div>
    </div>
  );
}
