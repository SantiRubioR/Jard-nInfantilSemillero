import { getSupabaseClient, type AppSupabaseClient } from "@/lib/supabase";
import { fail, ok, type ServiceResult } from "@/lib/result";
import type { AuthUser } from "./auth.types";

export interface AuthRepository {
  getCurrentUser(): Promise<ServiceResult<AuthUser | null>>;
  signIn(email: string, password: string): Promise<ServiceResult<AuthUser>>;
  signOut(): Promise<ServiceResult<void>>;
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}

const demoUser: AuthUser = {
  id: "demo-admin",
  email: "modo-demo@jardinsemillero.local",
};

const demoAuthRepository: AuthRepository = {
  async getCurrentUser() {
    return ok(demoUser);
  },

  async signIn() {
    return fail(
      "Supabase no está configurado en este build. Agrega las variables de entorno y vuelve a construir el sitio.",
    );
  },

  async signOut() {
    return ok(undefined);
  },

  onAuthStateChange(callback) {
    callback(demoUser);
    return () => undefined;
  },
};

function createSupabaseAuthRepository(
  supabase: AppSupabaseClient,
): AuthRepository {
  return {
    async getCurrentUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        return ok(null);
      }

      return ok({
        id: data.user.id,
        email: data.user.email ?? "administrador",
      });
    },

    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return fail("Correo o contraseña incorrectos. Verifica tus datos.");
      }

      return ok({
        id: data.user.id,
        email: data.user.email ?? "administrador",
      });
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return fail("No se pudo cerrar la sesión.");
      }

      return ok(undefined);
    },

    onAuthStateChange(callback) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(
          session?.user
            ? {
                id: session.user.id,
                email: session.user.email ?? "administrador",
              }
            : null,
        );
      });

      return () => subscription.unsubscribe();
    },
  };
}

export function getAuthRepository(): AuthRepository {
  const supabase = getSupabaseClient();
  return supabase ? createSupabaseAuthRepository(supabase) : demoAuthRepository;
}
