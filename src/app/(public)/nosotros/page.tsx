import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake } from "lucide-react";
import { DocumentsSection } from "@/features/institutional-documents";
import { FacilitiesSection } from "@/features/facilities";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { institutionalValues, uniforms } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce la historia, el manual de convivencia, la resolución de estudios, los uniformes y las instalaciones del Jardín Infantil Semillero.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Nosotros" }]}
        title="Conoce nuestra comunidad"
        description="Descubre la infraestructura, las normas y los elementos que hacen del Jardín Infantil Semillero el lugar ideal para el crecimiento de tus hijos."
      />

      <section className="container-page py-14 md:py-20">
        <DocumentsSection />

        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-3">
          <Badge variant="accent" className="gap-2 px-4 py-2">
            <HeartHandshake className="h-4 w-4" aria-hidden="true" />
            Nuestros valores
          </Badge>
          {institutionalValues.map((value) => (
            <Badge key={value} variant="muted" className="px-4 py-2">
              {value}
            </Badge>
          ))}
        </div>
      </section>

      <section className="bg-accent py-14 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Identidad institucional"
            title="Uniformes institucionales"
            description="Nuestros uniformes están diseñados para brindar comodidad, identidad y funcionalidad en todas las actividades diarias."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {uniforms.map((uniform) => (
              <article
                key={uniform.title}
                className="overflow-hidden rounded-[var(--radius-card)] border border-white/60 bg-white shadow-card"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={uniform.image}
                    alt={uniform.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-brand-deep">
                    {uniform.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {uniform.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <SectionHeading
          align="left"
          eyebrow="Instalaciones"
          title="Nuestras instalaciones"
          description="Espacios diseñados para inspirar, proteger y potenciar el aprendizaje de nuestros pequeños gigantes."
        />
        <div className="mt-8">
          <FacilitiesSection />
        </div>
      </section>
    </>
  );
}
