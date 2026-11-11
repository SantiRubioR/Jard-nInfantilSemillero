"use client";

import { useState } from "react";
import { Newspaper } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBlogAdminViewModel } from "../blog.hooks";
import { BlogPostList } from "./blog-post-list";
import { PostForm } from "./blog-post-form";

export function BlogAdminPanel() {
  const viewModel = useBlogAdminViewModel();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const editingPost = selectedId
    ? viewModel.posts.find((post) => post.id === selectedId)
    : undefined;

  function handleSaved() {
    setSelectedId(null);
    viewModel.reload();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <Newspaper className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>
                {editingPost ? "Editar publicación" : "Nueva publicación"}
              </CardTitle>
              <CardDescription>
                {editingPost
                  ? "Modifica los campos y guarda los cambios."
                  : "Completa los datos y adjunta la imagen o el PDF según la categoría."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PostForm
            key={editingPost?.id ?? "new"}
            post={editingPost}
            onSaved={handleSaved}
            onCancel={() => setSelectedId(null)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publicaciones existentes</CardTitle>
          <CardDescription>
            {viewModel.posts.length}{" "}
            {viewModel.posts.length === 1
              ? "publicación registrada"
              : "publicaciones registradas"}
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <BlogPostList
            posts={viewModel.posts}
            onEdit={setSelectedId}
            onRemove={viewModel.remove}
            onRemoved={viewModel.reload}
          />
        </CardContent>
      </Card>
    </div>
  );
}
