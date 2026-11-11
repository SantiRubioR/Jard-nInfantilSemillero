"use client";

import { useState } from "react";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import {
  initialActionState,
  type ActionState,
} from "@/lib/action-state";
import { fail, ok, type ActionResult } from "@/lib/result";
import {
  createPost,
  getPostBySlug,
  listAllPosts,
  listPublishedPosts,
  updatePost,
  deletePost,
} from "./blog.service";
import { demoPosts, findStaticPostBySlug, listStaticPosts } from "./blog.demo";
import type { PostFormInput } from "./blog.schemas";
import type { BlogCategory, BlogPost } from "./blog.types";

export function useBlogListViewModel(category?: BlogCategory) {
  const { data: posts, loading, error, reload } = useAsyncData(
    () => listPublishedPosts(category),
    listStaticPosts(category),
    [category],
  );

  return { posts, loading, error, reload };
}

export function useBlogPostViewModel(slug: string) {
  const { data, loading, error } = useAsyncData(
    () => getPostBySlug(slug),
    findStaticPostBySlug(slug),
    [slug],
  );

  return { post: error ? null : data, loading, error };
}

export function useLatestPostsViewModel(limit = 3) {
  const { data, loading } = useAsyncData(
    () => listPublishedPosts(),
    listStaticPosts(),
  );

  return { posts: data.slice(0, limit), loading };
}

export function useBlogAdminViewModel() {
  const { data: posts, loading, error, reload } = useAsyncData(
    () => listAllPosts(),
    demoPosts,
  );
  const [pending, setPending] = useState(false);

  async function remove(id: string): Promise<ActionResult> {
    setPending(true);
    const result = await deletePost(id);
    setPending(false);

    if (result.ok) {
      reload();
      return ok(undefined, result.message);
    }

    return fail(result.message);
  }

  return { posts, loading, error, pending, remove, reload };
}

export function usePostFormViewModel(post?: BlogPost) {
  const [state, setState] = useState<ActionState>(initialActionState);
  const [pending, setPending] = useState(false);

  async function submit(input: PostFormInput): Promise<ActionResult> {
    setPending(true);
    const result = post
      ? await updatePost(post.id, input)
      : await createPost(input);
    setPending(false);

    if (result.ok) {
      setState({ status: "success", message: result.message });
      return ok(undefined, result.message);
    }

    setState({ status: "error", message: result.message });
    return fail(result.message);
  }

  return { state, pending, submit };
}
