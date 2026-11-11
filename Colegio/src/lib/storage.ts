import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseClient } from "./supabase";
import { fail, ok, type ServiceResult } from "./result";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_PDF_BYTES = 10 * 1024 * 1024;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PDF_TYPES = ["application/pdf"];

export type FileBucket = "images" | "documents";
export type FileKind = "image" | "pdf";

export interface StorageService {
  upload(input: {
    bucket: FileBucket;
    path: string;
    file: File;
    kind: FileKind;
  }): Promise<ServiceResult<{ url: string }>>;
  remove(bucket: FileBucket, url: string | null): Promise<ServiceResult<void>>;
}

export type UploadedFile = { bucket: FileBucket; url: string };

export async function uploadFile(
  storage: StorageService,
  input: { bucket: FileBucket; path: string; file: File; kind: FileKind },
): Promise<ServiceResult<UploadedFile>> {
  const upload = await storage.upload({
    bucket: input.bucket,
    path: `${input.path}.${fileExtension(input.file)}`,
    file: input.file,
    kind: input.kind,
  });

  if (!upload.ok) {
    return fail(upload.message);
  }

  return ok({ bucket: input.bucket, url: upload.data.url });
}

export function isPresentFile(
  value: FormDataEntryValue | null | undefined,
): value is File {
  return value instanceof File && value.size > 0;
}

export function fileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) {
    return fromName;
  }

  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export function validateFile(
  file: { type: string; size: number },
  kind: FileKind,
): string | null {
  const allowed = kind === "image" ? IMAGE_TYPES : PDF_TYPES;
  const max = kind === "image" ? MAX_IMAGE_BYTES : MAX_PDF_BYTES;

  if (!allowed.includes(file.type)) {
    return kind === "image"
      ? "El archivo debe ser una imagen JPG, PNG o WebP."
      : "El archivo debe ser un PDF.";
  }

  if (file.size > max) {
    return kind === "image"
      ? "La imagen supera el límite de 5 MB."
      : "El PDF supera el límite de 10 MB.";
  }

  return null;
}

function publicUrl(
  supabase: SupabaseClient<Database>,
  bucket: FileBucket,
  path: string,
) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function uploadPublicFile({
  supabase,
  bucket,
  path,
  file,
  kind,
}: {
  supabase: SupabaseClient<Database>;
  bucket: FileBucket;
  path: string;
  file: File;
  kind: FileKind;
}): Promise<ServiceResult<{ url: string }>> {
  const validationError = validateFile(file, kind);
  if (validationError) {
    return fail(validationError);
  }

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: "3600",
  });

  if (error) {
    console.error("Error al subir archivo:", error.message);
    return fail("No se pudo subir el archivo. Intenta nuevamente.");
  }

  return ok({ url: publicUrl(supabase, bucket, path) });
}

export async function deletePublicFile(
  supabase: SupabaseClient<Database>,
  bucket: FileBucket,
  url: string | null,
): Promise<ServiceResult<void>> {
  if (!url) {
    return ok(undefined);
  }

  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) {
    return ok(undefined);
  }

  const path = decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("No se pudo eliminar el archivo anterior:", error.message);
    return fail("No se pudo eliminar el archivo anterior.");
  }

  return ok(undefined);
}

export const storageService: StorageService = {
  async upload(input) {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return fail("Configura Supabase en el build para guardar cambios reales.");
    }

    return uploadPublicFile({ supabase, ...input });
  },

  async remove(bucket, url) {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return ok(undefined);
    }

    return deletePublicFile(supabase, bucket, url);
  },
};
