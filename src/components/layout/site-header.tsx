"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/95 backdrop-blur">
      <div className="hidden border-b border-brand-100 bg-brand-50/70 md:block">
        <div className="container-page flex items-center justify-between py-2 text-xs text-brand-deep">
          <p className="font-medium">
            Inscripciones abiertas · Cupos limitados para el año escolar 2027
          </p>
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            className="inline-flex items-center gap-1.5 font-semibold hover:text-brand-dark"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {siteConfig.contact.phone}
          </a>
        </div>
      </div>

      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${siteConfig.name} - Inicio`}
          onClick={() => setOpen(false)}
        >
          <Logo className="h-12 w-auto shrink-0" />
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-sm font-bold text-brand-deep">
              Jardín Infantil
            </span>
            <span className="block font-display text-lg font-extrabold text-brand">
              Semillero
            </span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-dark"
                  : "text-brand-deep hover:bg-brand-50 hover:text-brand-dark",
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contacto/"
            className="hidden items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-brand-deep shadow-soft transition-colors hover:bg-accent-dark sm:inline-flex"
          >
            Agenda tu visita
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-brand-deep lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="menu-movil"
        className={cn(
          "border-t border-border bg-white lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav aria-label="Navegación móvil" className="container-page flex flex-col py-3">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-3 py-3 text-sm font-semibold",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-dark"
                  : "text-brand-deep hover:bg-brand-50",
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contacto/"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-bold text-brand-deep"
          >
            Agenda tu visita
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
