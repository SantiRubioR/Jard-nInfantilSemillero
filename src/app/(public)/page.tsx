import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Eye,
  Heart,
  Shapes,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/layout/section-heading";
import { institutionalContent } from "@/lib/constants";
import { FacilitiesSection } from "@/features/facilities";
import { LatestPostsSection } from "@/features/blog";
import { StatsSection } from "@/features/statistics";
import { cn } from "@/lib/utils";

const commitments = [
  {
    ...institutionalContent.history,
    icon: BookOpen,
    iconClass: "bg-brand-100 text-brand",
  },
  {
    ...institutionalContent.mission,
    icon: Heart,
    iconClass: "bg-amber-100 text-amber-600",
  },
  {
    ...institutionalContent.vision,
    icon: Eye,
    iconClass: "bg-green-100 text-green-700",
  },
  {
    ...institutionalContent.pedagogicalModel,
    icon: Shapes,
    iconClass: "bg-purple-100 text-purple-700",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark text-white">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div className="animate-fade-up">
            <Badge variant="accent" className="gap-2 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Matrículas 2027 abiertas
            </Badge>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.08] md:text-5xl lg:text-6xl">
              {institutionalContent.hero.title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white md:text-lg">
              {institutionalContent.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/nosotros/"
                className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
              >
                Conoce nuestro jardín
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/contacto/"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/40 bg-white/10 text-white hover:border-white hover:bg-white/20",
                )}
              >
                Agenda tu visita
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <dt className="text-white/95">Trayectoria</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-accent">
                  20+ años
                </dd>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <dt className="text-white/95">Niveles</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-accent">
                  Prejardín a 5°
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-4 border-white/20 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=85"
                alt="Niños jugando y aprendiendo en el Jardín Infantil Semillero"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl bg-white p-4 shadow-xl sm:left-8 sm:right-auto sm:max-w-xs">
              <p className="text-xs font-bold uppercase tracking-wide text-brand">
                Nuestro compromiso
              </p>
              <p className="mt-1 text-sm font-medium text-brand-deep">
                Un entorno seguro, afectuoso y lleno de experiencias significativas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="Nuestro compromiso"
          title="Una educación que siembra futuro"
          description="Cuatro pilares que guían nuestro quehacer pedagógico y acompañan el crecimiento de cada niño y su familia."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="group rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-card transition-transform duration-300 hover:-translate-y-1"
              >
                <span
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-xl",
                    item.iconClass,
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-brand-deep">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-muted py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              align="left"
              eyebrow="Instalaciones"
              title="Espacios que inspiran y protegen"
              description="Ambientes diseñados para el juego, la exploración y el aprendizaje seguro de nuestros niños."
            />
            <Link
              href="/nosotros/"
              className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
            >
              Ver galería completa
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8">
            <FacilitiesSection limit={4} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-accent">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=85"
              alt="Aula del Jardín Infantil Semillero"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-deep/80">
              Excelencia académica
            </p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-brand-deep md:text-4xl">
              {institutionalContent.commitment.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-deep/80">
              {institutionalContent.commitment.text}
            </p>
            <ul className="mt-6 space-y-3">
              {institutionalContent.commitment.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm font-medium text-brand-deep">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                  {bullet}
                </li>
              ))}
            </ul>
            <Link
              href="/educacion/"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-8")}
            >
              Explora nuestros niveles
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Novedades"
            title="Noticias, eventos y circulares"
            description="Mantente al día con las actividades y comunicados de nuestra comunidad educativa."
          />
          <Link
            href="/blog/"
            className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
          >
            Ver todas las publicaciones
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <LatestPostsSection limit={3} />
      </section>

      <section className="bg-gradient-to-r from-brand-deep to-brand py-14 text-white">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Inscripciones abiertas
          </p>
          <h2 className="max-w-2xl text-3xl font-extrabold md:text-4xl">
            Ven a conocer el lugar donde comienza el aprendizaje de tus hijos
          </h2>
          <p className="max-w-xl text-sm text-white/95 md:text-base">
            Agenda una visita guiada, conoce nuestras instalaciones y conversa con
            nuestro equipo pedagógico.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contacto/" className={cn(buttonVariants({ variant: "accent", size: "lg" }))}>
              Agendar visita
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/educacion/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/40 bg-white/10 text-white hover:border-white hover:bg-white/20",
              )}
            >
              Ver niveles educativos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
