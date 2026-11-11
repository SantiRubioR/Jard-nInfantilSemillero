import { fail, ok, type ServiceResult } from "@/lib/result";
import { getCurrentUserId } from "@/lib/supabase";
import {
  storageService,
  uploadFile,
  type StorageService,
  type UploadedFile,
} from "@/lib/storage";
import {
  getBlogRepository,
  type BlogRepository,
} from "./blog.repository";
import {
  keptFiles,
  validatePost,
  type PostFiles,
} from "./blog.rules";
import type { PostFormInput } from "./blog.schemas";
import {
  sortPostsByDateDesc,
  type BlogCategory,
  type BlogPost,
} from "./blog.types";

export type BlogDeps = {
  repository: BlogRepository;
  storage: StorageService;
  getCurrentUserId: () => Promise<ServiceResult<string>>;
};

function defaultDeps(): BlogDeps {
  return {
    repository: getBlogRepository(),
    storage: storageService,
    getCurrentUserId,
  };
}

export async function listPublishedPosts(
  category?: BlogCategory,
  deps: BlogDeps = defaultDeps(),
): Promise<ServiceResult<BlogPost[]>> {
  const result = await deps.repository.listPublished(category);

  if (!result.ok) {
    return result;
  }

  return ok(sortPostsByDateDesc(result.data));
}

export async function getPostBySlug(
  slug: string,
  deps: BlogDeps = defaultDeps(),
): Promise<ServiceResult<BlogPost>> {
  const result = await deps.repository.findBySlug(slug);

  if (!result.ok) {
    return result;
  }

  if (!result.data) {
    return fail("La publicación no existe o no está publicada.");
  }

  return ok(result.data);
}

export async function listAllPosts(
  deps: BlogDeps = defaultDeps(),
): Promise<ServiceResult<BlogPost[]>> {
  const result = await deps.repository.listAll();

  if (!result.ok) {
    return result;
  }

  return ok(sortPostsByDateDesc(result.data));
}

async function removeFiles(deps: BlogDeps, files: UploadedFile[]) {
  await Promise.all(
    files.map((file) => deps.storage.remove(file.bucket, file.url)),
  );
}

// Sube la imagen o el PDF nuevos. Si la subida falla, borra lo ya subido.
async function uploadNewFiles(
  input: PostFormInput,
  category: BlogCategory,
  kept: PostFiles,
  deps: BlogDeps,
): Promise<ServiceResult<{ files: PostFiles; uploaded: UploadedFile[] }>> {
  const uploaded: UploadedFile[] = [];
  const files = { ...kept };

  if (category === "evento" && input.coverImage) {
    const upload = await uploadFile(deps.storage, {
      bucket: "images",
      path: `blog/${crypto.randomUUID()}`,
      file: input.coverImage,
      kind: "image",
    });

    if (!upload.ok) {
      return fail(upload.message);
    }

    uploaded.push(upload.data);
    files.coverImageUrl = upload.data.url;
  }

  if (category === "circular" && input.pdfFile) {
    const upload = await uploadFile(deps.storage, {
      bucket: "documents",
      path: `blog/${crypto.randomUUID()}`,
      file: input.pdfFile,
      kind: "pdf",
    });

    if (!upload.ok) {
      await removeFiles(deps, uploaded);
      return fail(upload.message);
    }

    uploaded.push(upload.data);
    files.pdfUrl = upload.data.url;
  }

  return ok({ files, uploaded });
}

export async function createPost(
  input: PostFormInput,
  deps: BlogDeps = defaultDeps(),
): Promise<ServiceResult<BlogPost>> {
  const user = await deps.getCurrentUserId();

  if (!user.ok) {
    return fail(user.message);
  }

  const post = validatePost(input);

  if (!post.ok) {
    return fail(post.message);
  }

  const uploads = await uploadNewFiles(
    input,
    post.data.category,
    keptFiles(post.data.category, null),
    deps,
  );

  if (!uploads.ok) {
    return fail(uploads.message);
  }

  const created = await deps.repository.create({
    ...post.data,
    ...uploads.data.files,
    isPublished: input.isPublished,
    createdBy: user.data,
  });

  if (!created.ok) {
    await removeFiles(deps, uploads.data.uploaded);
    return created;
  }

  return ok(created.data, "Publicación creada correctamente.");
}

export async function updatePost(
  id: string,
  input: PostFormInput,
  deps: BlogDeps = defaultDeps(),
): Promise<ServiceResult<BlogPost>> {
  const existing = await deps.repository.findById(id);

  if (!existing.ok) {
    return existing;
  }

  if (!existing.data) {
    return fail("La publicación no existe.");
  }

  const post = validatePost(input);

  if (!post.ok) {
    return fail(post.message);
  }

  const uploads = await uploadNewFiles(
    input,
    post.data.category,
    keptFiles(post.data.category, existing.data),
    deps,
  );

  if (!uploads.ok) {
    return fail(uploads.message);
  }

  const updated = await deps.repository.update(id, {
    ...post.data,
    ...uploads.data.files,
    isPublished: input.isPublished,
  });

  if (!updated.ok) {
    await removeFiles(deps, uploads.data.uploaded);
    return updated;
  }

  const { files } = uploads.data;

  if (
    existing.data.coverImageUrl &&
    existing.data.coverImageUrl !== files.coverImageUrl
  ) {
    await deps.storage.remove("images", existing.data.coverImageUrl);
  }

  if (existing.data.pdfUrl && existing.data.pdfUrl !== files.pdfUrl) {
    await deps.storage.remove("documents", existing.data.pdfUrl);
  }

  return ok(updated.data, "Publicación actualizada correctamente.");
}

export async function deletePost(
  id: string,
  deps: BlogDeps = defaultDeps(),
): Promise<ServiceResult<void>> {
  const existing = await deps.repository.findById(id);

  if (!existing.ok) {
    return existing;
  }

  if (!existing.data) {
    return fail("La publicación no existe.");
  }

  const deleted = await deps.repository.delete(id);

  if (!deleted.ok) {
    return deleted;
  }

  await Promise.all([
    deps.storage.remove("images", existing.data.coverImageUrl),
    deps.storage.remove("documents", existing.data.pdfUrl),
  ]);

  return ok(undefined, "Publicación eliminada correctamente.");
}
