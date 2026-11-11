import { BookOpen, ChevronDown, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import type { AcademicLevel } from "../academic-levels.types";

export function EducationLevels({ levels }: { levels: AcademicLevel[] }) {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {levels.map((level) => (
        <details
          key={level.id}
          className="group rounded-2xl border border-border bg-white shadow-soft open:border-brand/40 open:shadow-card"
        >
          <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex-1 font-display text-lg font-bold text-brand-deep">
              {level.name}
            </span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:block">
              {level.schedule}
            </span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-brand transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>

          <div className="border-t border-border/70 px-5 py-5 sm:px-20">
            <h3 className="font-display text-base font-bold text-brand">
              Descripción del nivel
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {level.description}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-semibold text-brand-deep">Horario académico:</span>{" "}
              {level.schedule}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {level.pdfUrl ? (
                <>
                  <a
                    href={level.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "md" }))}
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Ver temario
                  </a>
                  <a
                    href={level.pdfUrl}
                    download
                    className={cn(buttonVariants({ variant: "accent", size: "md" }))}
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Descargar PDF
                  </a>
                  <Badge variant="muted">
                    Última actualización: {formatDate(level.updatedAt)}
                  </Badge>
                </>
              ) : (
                <Badge variant="muted" className="px-4 py-2">
                  Temario pendiente por cargar
                </Badge>
              )}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
