"use client";

import { useState } from "react";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { fail, ok, type ActionResult } from "@/lib/result";
import {
  listInstitutionalDocuments,
  uploadInstitutionalDocument,
} from "./institutional-documents.service";
import { demoInstitutionalDocuments } from "./institutional-documents.repository";
import type { DocumentType } from "./institutional-documents.types";

export function useInstitutionalDocumentsViewModel() {
  const { data: documents, loading, error, reload } = useAsyncData(
    () => listInstitutionalDocuments(),
    demoInstitutionalDocuments,
  );

  return { documents, loading, error, reload };
}

export function useInstitutionalDocumentsAdminViewModel() {
  const viewModel = useInstitutionalDocumentsViewModel();
  const [pending, setPending] = useState(false);

  async function upload(
    type: DocumentType,
    title: string,
    file: File,
  ): Promise<ActionResult> {
    setPending(true);
    const result = await uploadInstitutionalDocument({ type, title, file });
    setPending(false);

    if (result.ok) {
      viewModel.reload();
      return ok(undefined, result.message);
    }

    return fail(result.message);
  }

  return { ...viewModel, pending, upload };
}
