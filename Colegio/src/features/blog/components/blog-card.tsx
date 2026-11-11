import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "../blog.types";

export function BlogCard({ post }: { post: BlogPost }) {
  const href = `/blog/?slug=${post.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-card transition-transform duration-300 hover:-translate-y-1">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-brand-50">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
            <FileText className="h-14 w-14 text-brand/50" aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3">
          <Badge variant={post.category === "evento" ? "accent" : "default"}>
            {post.category === "evento" ? "Evento" : "Circular"}
          </Badge>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {formatDate(post.publishedAt)}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-brand-deep">
          <Link href={href} className="hover:text-brand">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-dark"
        >
          Leer más
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
