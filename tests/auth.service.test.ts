import { describe, expect, it } from "vitest";
import { ok } from "@/lib/result";
import type { AuthRepository } from "@/features/auth/auth.repository";
import { signIn, signOut } from "@/features/auth/auth.service";

function makeRepository(overrides: Partial<AuthRepository> = {}) {
  let signInCalled = false;
  let signOutCalled = false;

  const repository: AuthRepository = {
    async getCurrentUser() {
      return ok(null);
    },
    async signIn(email) {
      signInCalled = true;
      return ok({ id: "user-1", email });
    },
    async signOut() {
      signOutCalled = true;
      return ok(undefined);
    },
    onAuthStateChange() {
      return () => undefined;
    },
    ...overrides,
  };

  return {
    repository,
    wasSignInCalled: () => signInCalled,
    wasSignOutCalled: () => signOutCalled,
  };
}

describe("auth.service", () => {
  it("rechaza una contraseña demasiado corta sin llamar al repositorio", async () => {
    // Arrange
    const { repository, wasSignInCalled } = makeRepository();

    // Act
    const result = await signIn(
      { email: "admin@test.dev", password: "123" },
      { repository },
    );

    // Assert
    expect(result.ok).toBe(false);
    expect(wasSignInCalled()).toBe(false);
  });

  it("inicia sesión con credenciales válidas", async () => {
    // Arrange
    const { repository, wasSignInCalled } = makeRepository();

    // Act
    const result = await signIn(
      { email: "admin@test.dev", password: "secreto123" },
      { repository },
    );

    // Assert
    expect(result.ok).toBe(true);
    expect(wasSignInCalled()).toBe(true);
    if (result.ok) {
      expect(result.data.email).toBe("admin@test.dev");
    }
  });

  it("cierra la sesión usando el repositorio", async () => {
    // Arrange
    const { repository, wasSignOutCalled } = makeRepository();

    // Act
    const result = await signOut({ repository });

    // Assert
    expect(result.ok).toBe(true);
    expect(wasSignOutCalled()).toBe(true);
  });
});
