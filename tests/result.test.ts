import { describe, expect, it } from "vitest";
import { fail, ok } from "@/lib/result";

describe("result", () => {
  it("ok() devuelve los datos y el mensaje", () => {
    // Arrange
    const data = { id: "1" };

    // Act
    const result = ok(data, "Guardado.");

    // Assert
    expect(result).toEqual({ ok: true, data, message: "Guardado." });
  });

  it("fail() devuelve solo el mensaje de error", () => {
    // Arrange
    const message = "No se pudo guardar.";

    // Act
    const result = fail(message);

    // Assert
    expect(result).toEqual({ ok: false, message });
  });
});
