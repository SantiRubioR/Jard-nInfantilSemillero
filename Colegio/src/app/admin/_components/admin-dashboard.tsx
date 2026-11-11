"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  FileText,
  GraduationCap,
  Newspaper,
  CalendarDays,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/env";
import { formatDate } from "@/lib/utils";
import { useBlogAdminViewModel } from "@/features/blog";
import { useFacilitiesAdminViewModel } from "@/features/facilities";
import { useAcademicLevelsAdminViewModel } from "@/features/academic-levels";
import { useInstitutionalDocumentsAdminViewModel } from "@/features/institutional-documents";

const quickLinks = [
  {
    href: "/admin/estadisticas/",
    label: "Estadísticas",
    description: "Actualiza docentes, estudiantes, graduados y años de experiencia.",
    icon: BarChart3,
  },
  {
    href: "/admin/educacion/",
    label: "Temarios",
    description: "Carga o reemplaza el PDF de cada nivel educativo.",
    icon: GraduationCap,
  },
  {
    href: "/admin/nosotros/",
    label: "Nosotros",
    description: "Manual de convivencia, resolución y galería de instalaciones.",
    icon: Building2,
  },
  {
    href: "/admin/blog/",
    label: "Blog y circulares",
    description: "Crea, edita y elimina eventos y comunicados oficiales.",
    icon: Newspaper,
  },
];

export function AdminDashboard() {
  const blog = useBlogAdminViewModel();
  const facilities = useFacilitiesAdminViewModel();
  const levels = useAcademicLevelsAdminViewModel();
  const documents = useInstitutionalDocumentsAdminViewModel();

  const posts = blog.posts;
  const published = posts.filter((post) => post.isPublished);
  const events = posts.filter((post) => post.category === "evento");
  const circulars = posts.filter((post) => post.category === "circular");
  const levelsWithPdf = levels.levels.filter((level) => level.pdfUrl).length;
  const documentsWithPdf = documents.documents.filter(
    (document) => document.pdfUrl,
  ).length;

  return (
    <div>
      <AdminPageHeader
        title="Resumen del panel"
        description="Administra el contenido dinámico de la plataforma sin tocar el código fuente."
      />

      {!isSupabaseConfigured && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Estás viendo datos de demostración</p>
          <p className="mt-1">
            El sitio público funciona con contenido de ejemplo. Al conectar Supabase, los
            datos que guardes aquí se reflejarán en la web.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Publicaciones
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold text-brand-deep">
                  {published.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Visibles en el sitio</p>
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
                <Newspaper className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Eventos
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold text-brand-deep">
                  {events.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Con imagen de portada</p>
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Circulares
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold text-brand-deep">
                  {circulars.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Con PDF descargable</p>
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Instalaciones
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold text-brand-deep">
                  {facilities.facilities.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">En la galería pública</p>
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Accesos rápidos</CardTitle>
            <Badge variant="muted">CMS</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group rounded-xl border border-border p-4 transition-colors hover:border-brand/40 hover:bg-brand-50/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">
                        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 font-display text-sm font-bold text-brand-deep">
                      {link.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {link.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del contenido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Temarios con PDF</span>
              <Badge
                variant={
                  levelsWithPdf === levels.levels.length ? "success" : "muted"
                }
              >
                {levelsWithPdf} de {levels.levels.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Documentos institucionales</span>
              <Badge
                variant={
                  documentsWithPdf === documents.documents.length
                    ? "success"
                    : "muted"
                }
              >
                {documentsWithPdf} de {documents.documents.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Conexión a Supabase</span>
              <Badge variant={isSupabaseConfigured ? "success" : "danger"}>
                {isSupabaseConfigured ? "Configurada" : "Pendiente"}
              </Badge>
            </div>
            <div className="rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
              Los cambios se publican automáticamente. Si un archivo no aparece, verifica
              que el bucket de Supabase Storage tenga las políticas RLS aplicadas.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Publicaciones recientes</CardTitle>
          <Link
            href="/admin/blog/"
            className="text-sm font-bold text-brand hover:text-brand-dark"
          >
            Gestionar
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {posts.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-muted-foreground">
              Todavía no hay publicaciones. Crea la primera desde el gestor del blog.
            </p>
          ) : (
            <ul className="divide-y divide-border border-t border-border">
              {posts.slice(0, 5).map((post) => (
                <li key={post.id} className="flex flex-wrap items-center gap-3 px-6 py-3.5">
                  <Badge variant={post.category === "evento" ? "accent" : "default"}>
                    {post.category === "evento" ? "Evento" : "Circular"}
                  </Badge>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-brand-deep">
                    {post.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </span>
                  <Badge variant={post.isPublished ? "success" : "muted"}>
                    {post.isPublished ? "Publicada" : "Borrador"}
                  </Badge>
                  <Link
                    href="/admin/blog/"
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    Editar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
