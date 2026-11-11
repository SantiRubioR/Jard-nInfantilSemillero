import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/layout/logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-white p-1.5">
              <Logo className="h-12 w-auto" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-white">
                Sobre nosotros
              </p>
              <p className="font-display text-lg font-bold">Jardín Infantil Semillero</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/95">
            Formando niños felices, curiosos y seguros desde 2003. Un espacio donde el
            aprendizaje comienza con el juego.
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Sitemap
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/95 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Contacto
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/95">
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`tel:${siteConfig.contact.phoneHref}`} className="hover:underline">
                {siteConfig.contact.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                {siteConfig.contact.address}
                <br />
                {siteConfig.contact.city}
              </span>
            </li>
          </ul>
          <p className="mt-3 text-xs text-white/95">{siteConfig.contact.hours}</p>
          <p className="mt-1 text-xs text-white/95">DANE: {siteConfig.contact.dane}</p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Síguenos
          </h2>
          <div className="mt-4 flex gap-3">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook del Jardín Infantil Semillero"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-brand-deep transition-transform hover:scale-105"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram del Jardín Infantil Semillero"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-brand-deep transition-transform hover:scale-105"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              aria-label="Enviar correo al Jardín Infantil Semillero"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-brand-deep transition-transform hover:scale-105"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <Link
            href="/admin/login/"
            className="mt-6 inline-block text-xs font-medium text-white/95 hover:underline"
          >
            Acceso administrativo
          </Link>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/95 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} de Ibagué. Todos los derechos
            reservados.
          </p>
          <p>Hecho con cariño para nuestra comunidad educativa.</p>
        </div>
      </div>
    </footer>
  );
}
