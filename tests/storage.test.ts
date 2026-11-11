import { describe, expect, it } from "vitest";
import { ok, fail } from "@/lib/result";
import {
  MAX_IMAGE_BYTES,
  MAX_PDF_BYTES,
  fileExtension,
  uploadFile,
  validateFile,
  type StorageService,
} from "@/lib/storage";

function makeStorage(result = ok({ url: "https://cdn.test/stored" })) {
  const paths: string[] = [];
  const storage: StorageService = {
    async upload(input) {
      paths.push(input.path);
      return result;
    },
    async remove() {
      return ok(undefined);
    },
  };

  return { storage, paths };
}

describe("validateFile", () => {
  it("acepta una imagen JPG dentro del límite", () => {
    // Arrange
    const file = { type: "image/jpeg", size: 1024 };

    // Act
    const error = validateFile(file, "image");

    // Assert
    expect(error).toBeNull();
  });

  it("rechaza una imagen con un tipo no permitido", () => {
    // Arrange
    const file = { type: "image/gif", size: 1024 };

    // Act
    const error = validateFile(file, "image");

    // Assert
    expect(error).toContain("JPG, PNG o WebP");
  });

  it("rechaza una imagen que supera 5 MB", () => {
    // Arrange
    const file = { type: "image/png", size: MAX_IMAGE_BYTES + 1 };

    // Act
    const error = validateFile(file, "image");

    // Assert
    expect(error).toContain("5 MB");
  });

  it("acepta un PDF de hasta 10 MB y rechaza uno más grande", () => {
    // Arrange
    const ok10 = { type: "application/pdf", size: MAX_PDF_BYTES };
    const tooBig = { type: "application/pdf", size: MAX_PDF_BYTES + 1 };

    // Act
    const results = [validateFile(ok10, "pdf"), validateFile(tooBig, "pdf")];

    // Assert
    expect(results[0]).toBeNull();
    expect(results[1]).toContain("10 MB");
  });
});

describe("fileExtension", () => {
  it("usa la extensión del nombre si es válida", () => {
    // Arrange
    const file = new File(["x"], "Foto.PNG", { type: "image/png" });

    // Act
    const extension = fileExtension(file);

    // Assert
    expect(extension).toBe("png");
  });

  it("usa el tipo MIME cuando el nombre no tiene extensión", () => {
    // Arrange
    const file = new File(["x"], "documento", { type: "application/pdf" });

    // Act
    const extension = fileExtension(file);

    // Assert
    expect(extension).toBe("pdf");
  });
});

describe("uploadFile", () => {
  it("sube el archivo con la ruta indicada y la extensión del archivo", async () => {
    // Arrange
    const { storage, paths } = makeStorage();
    const file = new File(["x"], "circular.pdf", { type: "application/pdf" });

    // Act
    const result = await uploadFile(storage, {
      bucket: "documents",
      path: "institutional/circular-1",
      file,
      kind: "pdf",
    });

    // Assert
    expect(paths).toEqual(["institutional/circular-1.pdf"]);
    expect(result).toEqual({ ok: true, data: { bucket: "documents", url: "https://cdn.test/stored" }, message: "" });
  });

  it("propaga el error del almacenamiento sin devolver datos", async () => {
    // Arrange
    const { storage } = makeStorage(fail("Sin conexión."));
    const file = new File(["x"], "foto.jpg", { type: "image/jpeg" });

    // Act
    const result = await uploadFile(storage, {
      bucket: "images",
      path: "blog/abc",
      file,
      kind: "image",
    });

    // Assert
    expect(result.ok).toBe(false);
    expect(result.message).toBe("Sin conexión.");
  });
});
