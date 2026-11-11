import { fail, type ServiceResult } from "@/lib/result";
import { getAuthRepository, type AuthRepository } from "./auth.repository";
import { loginSchema, type LoginInput } from "./auth.schemas";
import type { AuthUser } from "./auth.types";

export type AuthDeps = {
  repository: AuthRepository;
};

function defaultDeps(): AuthDeps {
  return { repository: getAuthRepository() };
}

export async function signIn(
  input: LoginInput,
  deps: AuthDeps = defaultDeps(),
): Promise<ServiceResult<AuthUser>> {
  if (!input.email.trim() || !input.password) {
    return fail("Ingresa tu correo y contraseña.");
  }

  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Revisa los datos.");
  }

  return deps.repository.signIn(parsed.data.email, parsed.data.password);
}

export function signOut(deps: AuthDeps = defaultDeps()): Promise<ServiceResult<void>> {
  return deps.repository.signOut();
}

export function getCurrentUser(
  deps: AuthDeps = defaultDeps(),
): Promise<ServiceResult<AuthUser | null>> {
  return deps.repository.getCurrentUser();
}

export function watchAuthState(
  callback: (user: AuthUser | null) => void,
  deps: AuthDeps = defaultDeps(),
): () => void {
  return deps.repository.onAuthStateChange(callback);
}
