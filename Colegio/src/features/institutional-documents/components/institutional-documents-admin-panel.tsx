"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Building2, FileText, Upload } from "lucide-react";
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
import type {
  DocumentType,
  InstitutionalDocument,
} from "../institutional-documents.types";
import { useInstitutionalDocumentsAdminViewModel } from "../institutional-documents.hooks";

function DocumentUploadForm({
  document,
  upload,
}: {
  document: InstitutionalDocument;
  upload: (
    type: DocumentType,
    title: string,
    file: File,
  ) => Promise<ActionResult>;
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
    const result = await upload(document.type, document.title, file);
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
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand" aria-hidden="true" />
          <p className="font-display text-sm font-bold text-brand-deep">
            {document.title}
          </p>
        </div>
        <Badge variant={document.pdfUrl ? "success" : "muted"}>
          {document.pdfUrl ? "PDF cargado" : "Pendiente"}
        </Badge>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {document.pdfUrl
          ? `Última actualización: ${formatDate(document.updatedAt)}`
          : "Sube el documento oficial en PDF."}
      </p>

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
          {document.pdfUrl ? "Reemplazar" : "Subir PDF"}
        </SubmitButton>
      </div>

      {document.pdfUrl && (
        <a
          href={document.pdfUrl}
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

export function InstitutionalDocumentsAdminPanel() {
  const viewModel = useInstitutionalDocumentsAdminViewModel();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Documentos institucionales</CardTitle>
            <CardDescription>
              Reemplaza los PDF oficiales que descargan las familias.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {viewModel.documents.map((document) => (
          <DocumentUploadForm
            key={document.type}
            document={document}
            upload={viewModel.upload}
          />
        ))}
        <p className="text-xs leading-relaxed text-muted-foreground">
          Los documentos se almacenan en Supabase Storage y se eliminan
          automáticamente cuando se reemplazan.
        </p>
      </CardContent>
    </Card>
  );
}
