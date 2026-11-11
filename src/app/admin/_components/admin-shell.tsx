"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAdminGuardViewModel } from "@/features/auth";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({
  configured,
  children,
}: {
  configured: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { ready, email } = useAdminGuardViewModel({
    onUnauthenticated: () => router.replace("/admin/login/"),
  });

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Verificando sesión…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted lg:pl-72">
      <AdminSidebar email={email} configured={configured} />

      <div className="flex min-h-screen flex-col">
        {!configured && (
          <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:px-6 lg:px-8">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              <span className="font-semibold">Modo demostración:</span> define{" "}
              <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
              <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              al construir el sitio para guardar cambios reales.
            </p>
          </div>
        )}

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
