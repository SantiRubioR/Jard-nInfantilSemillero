const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const forceDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const isSupabaseConfigured =
  !forceDemoMode && Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabaseEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. Revisa .env.local",
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}
