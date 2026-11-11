"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText, GraduationCap, Upload } from "lucide-react";
import { ActionMessage } from "@/components/feedback/action-message";
import { SubmitButton } from "@/components/feedback/submit-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  initialActionState,
  type ActionState,
} from "@/lib/action-state";
import type { ActionResult } from "@/lib/result";
import { formatDate } from "@/lib/utils";
import { isPresentFile } from "@/lib/storage";
import type { AcademicLevel } from "../academic-levels.types";
import { useAcademicLevelsAdminViewModel } from "../academic-levels.hooks";

function PdfUploadForm({
  level,
  upload,
}: {
  level: AcademicLevel;
  upload: (slug: string, name: string, file: File) => Promise<ActionResult>;
}) {
  const [state, setState] = useState<ActionState>(initialActionState);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = new FormData(form).get("pdf_file");

    if (!isPresentFile(file)) {
      setState({ status: "error", message: "Selecciona un archivo PDF." });
      return;
    }

    setPending(true);
    const result = await upload(level.slug, level.name, file);
    setPending(false);

    if (result.ok) {
      setState({ status: "success", message: result.message });
      toast.success(result.message);
      form.reset();
    } else {
      setState({ status: "error", message: result.message });
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-display text-sm font-bold text-brand-deep">{level.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {level.pdfUrl
              ? `Última actualización: ${formatDate(level.updatedAt)}`
              : "Sin temario cargado"}
          </p>
        </div>
        <Badge variant={level.pdfUrl ? "success" : "muted"}>
          {level.pdfUrl ? "PDF cargado" : "Pendiente"}
        </Badge>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="file"
          name="pdf_file"
          accept="application/pdf"
          required
          className="h-auto cursor-pointer py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
        />
        <SubmitButton size="sm" pending={pending} pendingText="Subiendo…" className="shrink-0">
          <Upload className="h-4 w-4" aria-hidden="true" />
          {level.pdfUrl ? "Reemplazar PDF" : "Subir PDF"}
        </SubmitButton>
      </div>

      {level.pdfUrl && (
        <a
          href={level.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          Ver PDF actual
        </a>
      )}

      <div className="mt-3">
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

export function AcademicLevelsAdminPanel() {
  const viewModel = useAcademicLevelsAdminViewModel();
  const loaded = viewModel.levels.filter((level) => level.pdfUrl).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Documentos por nivel</CardTitle>
              <CardDescription>Formatos permitidos: PDF de máximo 10 MB.</CardDescription>
            </div>
          </div>
          <Badge variant={loaded === viewModel.levels.length ? "success" : "muted"}>
            {loaded} de {viewModel.levels.length} cargados
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 lg:grid-cols-2">
          {viewModel.levels.map((level) => (
            <PdfUploadForm key={level.id} level={level} upload={viewModel.upload} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
