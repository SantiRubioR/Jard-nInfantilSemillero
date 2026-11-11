"use client";

import { PdfDownloadCard } from "@/components/ui/pdf-download-card";
import { useInstitutionalDocumentsViewModel } from "../institutional-documents.hooks";

export function DocumentsSection() {
  const { documents } = useInstitutionalDocumentsViewModel();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {documents.map((document) => (
        <PdfDownloadCard
          key={document.id}
          title={document.title}
          description={document.description}
          pdfUrl={document.pdfUrl}
          updatedAt={document.updatedAt}
          actionLabel={document.actionLabel}
        />
      ))}
    </div>
  );
}
