"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText, ImagePlus, Save } from "lucide-react";
import { ActionMessage } from "@/components/feedback/action-message";
import { SubmitButton } from "@/components/feedback/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isPresentFile } from "@/lib/storage";
import type { BlogCategory, BlogPost } from "../blog.types";
import type { PostFormInput } from "../blog.schemas";
import { usePostFormViewModel } from "../blog.hooks";

export function PostForm({
  post,
  onSaved,
  onCancel,
}: {
  post?: BlogPost;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const [category, setCategory] = useState<BlogCategory>(post?.category ?? "evento");
  const { state, pending, submit } = usePostFormViewModel(post);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const coverFile = formData.get("cover_image");
    const pdfFile = formData.get("pdf_file");

    const input: PostFormInput = {
      title: String(formData.get("title") ?? ""),
      category,
      publishedAt: String(formData.get("published_at") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      content: String(formData.get("content") ?? ""),
      isPublished: formData.get("is_published") === "on",
      coverImage:
        category === "evento" && isPresentFile(coverFile) ? coverFile : undefined,
      pdfFile:
        category === "circular" && isPresentFile(pdfFile) ? pdfFile : undefined,
    };

    const result = await submit(input);

    if (result.ok) {
      toast.success(result.message);
      if (!post) {
        form.reset();
        setCategory("evento");
      }
      onSaved?.();
    } else {
      toast.error(result.message);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="post-title">Título de la publicación</Label>
        <Input
          id="post-title"
          name="title"
          defaultValue={post?.title}
          placeholder="Ej. Día del niño y la niña 2026"
          required
          maxLength={160}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="post-category">Categoría</Label>
          <Select
            id="post-category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value as BlogCategory)}
          >
            <option value="evento">Evento</option>
            <option value="circular">Circular</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="post-date">Fecha de publicación</Label>
          <Input
            id="post-date"
            name="published_at"
            type="date"
            defaultValue={post?.publishedAt ?? today}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="post-excerpt">Resumen</Label>
        <Textarea
          id="post-excerpt"
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          placeholder="Texto breve que aparece en la tarjeta del blog."
          maxLength={320}
          className="min-h-20"
        />
      </div>

      <div>
        <Label htmlFor="post-content">Cuerpo / descripción</Label>
        <Textarea
          id="post-content"
          name="content"
          defaultValue={post?.content ?? ""}
          placeholder="Contenido completo de la publicación. Separa los párrafos con una línea en blanco."
          className="min-h-32"
        />
      </div>

      {category === "evento" ? (
        <div>
          <Label htmlFor="post-cover">Imagen de portada</Label>
          <Input
            id="post-cover"
            type="file"
            name="cover_image"
            accept="image/jpeg,image/png,image/webp"
            className="h-auto cursor-pointer py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG o WebP. Máximo 5 MB.{" "}
            {post?.coverImageUrl
              ? "Si no seleccionas una nueva, se conserva la actual."
              : ""}
          </p>
          {post?.coverImageUrl && (
            <a
              href={post.coverImageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
            >
              <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
              Ver imagen actual
            </a>
          )}
        </div>
      ) : (
        <div>
          <Label htmlFor="post-pdf">Archivo PDF de la circular</Label>
          <Input
            id="post-pdf"
            type="file"
            name="pdf_file"
            accept="application/pdf"
            className="h-auto cursor-pointer py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            PDF máximo 10 MB.{" "}
            {post?.pdfUrl ? "Si no seleccionas uno nuevo, se conserva el actual." : ""}
          </p>
          {post?.pdfUrl && (
            <a
              href={post.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Ver PDF actual
            </a>
          )}
        </div>
      )}

      <label className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/60 px-3 py-3 text-sm font-medium text-brand-deep">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={post?.isPublished ?? true}
          className="h-4 w-4 rounded border-border text-brand accent-[#2F71CE]"
        />
        Publicar inmediatamente en el sitio web
      </label>

      <ActionMessage state={state} />

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <SubmitButton
          pending={pending}
          pendingText={post ? "Guardando cambios…" : "Creando publicación…"}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {post ? "Guardar cambios" : "Agregar publicación"}
        </SubmitButton>
        {post && onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancelar edición
          </Button>
        )}
      </div>
    </form>
  );
}
