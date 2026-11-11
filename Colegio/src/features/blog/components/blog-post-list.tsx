"use client";

import Image from "next/image";
import { FileText, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/feedback/delete-button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "../blog.types";
import type { ActionResult } from "@/lib/result";

export function BlogPostList({
  posts,
  onEdit,
  onRemove,
  onRemoved,
}: {
  posts: BlogPost[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => Promise<ActionResult>;
  onRemoved: () => void;
}) {
  if (posts.length === 0) {
    return (
      <p className="px-6 pb-6 text-sm text-muted-foreground">
        Todavía no hay publicaciones. Usa el formulario para crear la primera.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border border-t border-border">
      {posts.map((post) => (
        <li key={post.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-50">
            {post.coverImageUrl ? (
              <Image
                src={post.coverImageUrl}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-brand/50">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={post.category === "evento" ? "accent" : "default"}>
                {post.category === "evento" ? "Evento" : "Circular"}
              </Badge>
              <Badge variant={post.isPublished ? "success" : "muted"}>
                {post.isPublished ? "Publicada" : "Borrador"}
              </Badge>
            </div>
            <p className="mt-1 truncate font-display text-sm font-bold text-brand-deep">
              {post.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(post.publishedAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(post.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand/30 px-3 py-2 text-xs font-bold text-brand hover:bg-brand-50"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Editar
            </button>
            <DeleteButton
              action={() => onRemove(post.id)}
              label="Eliminar"
              confirmText={`¿Eliminar la publicación "${post.title}"? También se borrarán sus archivos adjuntos.`}
              onSuccess={onRemoved}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
