import { Download, Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";

export function PdfDownloadCard({
  title,
  description,
  pdfUrl,
  updatedAt,
  actionLabel = "Descargar PDF",
}: {
  title: string;
  description: string;
  pdfUrl: string | null;
  updatedAt?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-card sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand">
        <FileText className="h-8 w-8" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-xl font-bold text-brand-deep">{title}</h3>
          {updatedAt && pdfUrl && (
            <Badge variant="muted">Actualizado {formatDate(updatedAt)}</Badge>
          )}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {pdfUrl ? (
          <>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "md" }))}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Ver
            </a>
            <a
              href={`${pdfUrl}?download=`}
              className={cn(buttonVariants({ variant: "accent", size: "md" }))}
              download
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {actionLabel}
            </a>
          </>
        ) : (
          <Badge variant="muted" className="px-4 py-2">
            PDF pendiente por cargar
          </Badge>
        )}
      </div>
    </div>
  );
}
