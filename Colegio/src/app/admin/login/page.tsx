import Link from "next/link";
import { ArrowLeft, AlertTriangle, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { isSupabaseConfigured } from "@/lib/env";
import { LoginForm } from "@/features/auth";

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured;

  return (
    <main className="flex min-h-screen flex-col bg-muted">
      <div className="container-page flex items-center justify-between py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al sitio público
        </Link>
        <span className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:flex">
          <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
          Acceso seguro
        </span>
      </div>

      <div className="flex flex-1 items-start justify-center px-4 pb-16 pt-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto inline-flex rounded-2xl bg-white p-2 shadow-soft">
              <Logo className="h-20 w-auto" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-brand-deep">
              Jardín Infantil Semillero
            </h1>
            <p className="mt-1 font-display text-base font-semibold text-brand">
              Portal administrativo · Rectora
            </p>
          </div>

          <div className="mt-6 rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-card sm:p-8">
            {!configured && (
              <div className="mb-5 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>
                  Supabase aún no está configurado en este build. Puedes explorar el panel
                  en modo demostración, pero los cambios no se guardarán.
                </p>
              </div>
            )}

            <LoginForm configured={configured} />

            <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
              Ingresa con el correo y la contraseña asignados por la administración del
              jardín. Si olvidaste tu contraseña, contacta al soporte técnico.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
