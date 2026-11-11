"use client";

import { BlogCard } from "./blog-card";
import { useLatestPostsViewModel } from "../blog.hooks";

export function LatestPostsSection({ limit = 3 }: { limit?: number }) {
  const { posts } = useLatestPostsViewModel(limit);

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
