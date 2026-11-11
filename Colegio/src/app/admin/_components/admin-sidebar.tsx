"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAdminSidebarViewModel } from "@/features/auth";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

const links = [
  { href: "/admin/", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/admin/estadisticas/", label: "Estadísticas", icon: BarChart3 },
  { href: "/admin/educacion/", label: "Temarios", icon: GraduationCap },
  { href: "/admin/nosotros/", label: "Nosotros", icon: Building2 },
  { href: "/admin/blog/", label: "Blog y circulares", icon: Newspaper },
];

export function AdminSidebar({
  email,
  configured,
}: {
  email: string;
  configured: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = pathname.replace(/\/+$/, "") || "/";
  const { pending, signOut } = useAdminSidebarViewModel({
    onSignedOut: () => router.replace("/admin/login/"),
  });

  const isActive = (href: string, exact?: boolean) => {
    const target = href.replace(/\/+$/, "") || "/";
    return exact ? current === target : current === target || current.startsWith(`${target}/`);
  };

  const navigation = (
    <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Menú administrativo">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
              isActive(link.href, link.exact)
                ? "bg-brand text-white shadow-soft"
                : "text-brand-deep/80 hover:bg-brand-50 hover:text-brand-dark",
            )}
            aria-current={isActive(link.href, link.exact) ? "page" : undefined}
          >
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const bottom = (
    <div className="mt-auto border-t border-border pt-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-brand-50 hover:text-brand-dark"
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        Ver sitio público
      </Link>

      <div className="mt-3 rounded-lg bg-muted px-3 py-2.5">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {configured ? "Sesión activa" : "Modo demostración"}
        </p>
        <p className="mt-1 truncate text-xs text-muted-foreground" title={email}>
          {email}
        </p>
      </div>

      {configured ? (
        <button
          type="button"
          onClick={signOut}
          disabled={pending}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-red-50 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      ) : (
        <Link
          href="/admin/login/"
          className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand hover:bg-brand-50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Configurar acceso
        </Link>
      )}
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border bg-white p-5 lg:flex">
        <Link href="/admin/" className="flex items-center gap-3">
          <Logo className="h-11 w-auto" />
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold text-brand-deep">
              Jardín Infantil
            </span>
            <span className="block font-display text-lg font-extrabold text-brand">
              Semillero
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Panel administrativo
            </span>
          </span>
        </Link>
        {navigation}
        {bottom}
      </aside>

      <div className="sticky top-0 z-40 border-b border-border bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin/" className="flex items-center gap-2">
            <Logo className="h-9 w-auto" />
            <span className="font-display text-sm font-bold text-brand-deep">
              Panel administrativo
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-brand-deep"
            aria-expanded={open}
            aria-controls="admin-menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div id="admin-menu-movil" className="border-t border-border bg-white px-4 pb-4">
            {navigation}
            {bottom}
          </div>
        )}
      </div>
    </>
  );
}
