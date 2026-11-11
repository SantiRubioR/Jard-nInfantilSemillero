import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BlogPostDetail,
  findStaticPostBySlug,
  listStaticPostSlugs,
} from "@/features/blog";
import { PageHero } from "@/components/layout/page-hero";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listStaticPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = findStaticPostBySlug(slug);

  if (!post) {
    return { title: "Publicación no encontrada" };
  }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function StaticBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = findStaticPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Inicio", href: "/" },
          { label: "Blog", href: "/blog/" },
          { label: post.title },
        ]}
        title={post.title}
        description={post.excerpt ?? undefined}
      />
      <BlogPostDetail post={post} showTitle={false} />
    </>
  );
}
