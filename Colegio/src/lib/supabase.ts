import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv, isSupabaseConfigured } from "./env";
import { fail, ok, type ServiceResult } from "./result";

export type AppSupabaseClient = SupabaseClient<Database>;

let browserClient: AppSupabaseClient | null = null;

export function getSupabaseClient(): AppSupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!browserClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}

export async function getCurrentUserId(): Promise<ServiceResult<string>> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return fail("Configura Supabase en el build para guardar cambios reales.");
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return fail("Tu sesión expiró. Vuelve a iniciar sesión.");
  }

  return ok(data.user.id);
}
