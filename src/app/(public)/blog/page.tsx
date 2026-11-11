import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogPage, BlogStaticList } from "@/features/blog";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Blog y novedades",
  description:
    "Eventos, noticias y circulares del Jardín Infantil Semillero de Ibagué.",
};

export default function BlogRoutePage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Blog" }]}
        title="Novedades y eventos"
        description="Mantente al día con los eventos, noticias, hitos y circulares de nuestra comunidad educativa."
      />

      <Suspense fallback={<BlogStaticList />}>
        <BlogPage />
      </Suspense>
    </>
  );
}
