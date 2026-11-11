import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EducationLevelsSection } from "@/features/academic-levels";
import { PageHero } from "@/components/layout/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { institutionalContent } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Niveles educativos",
  description:
    "Conoce los niveles de prejardín a quinto de primaria del Jardín Infantil Semillero, sus horarios y temarios descargables.",
};

export default function EducationPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Educación" }]}
        title="Niveles educativos"
        description="Ofrecemos un entorno estructurado y afectuoso, adaptado a cada etapa del desarrollo infantil: desde los primeros pasos hasta la transición escolar."
      />

      <section className="container-page py-14 md:py-20">
        <EducationLevelsSection />
      </section>

      <section className="bg-accent">
        <div className="container-page grid items-center gap-8 py-12 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-deep/80">
              Inscripciones abiertas
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-brand-deep md:text-3xl">
              {institutionalContent.commitment.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-deep/80">
              {institutionalContent.commitment.text}
            </p>
          </div>
          <Link
            href="/contacto/"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "justify-self-start md:justify-self-end",
            )}
          >
            Agenda tu visita
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
