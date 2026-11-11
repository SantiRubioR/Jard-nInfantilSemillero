import type { Metadata } from "next";
import {
  Clock,
  Hash,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  CalendarCheck,
} from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { MapEmbed } from "@/components/layout/map-embed";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Dirección, teléfono, WhatsApp, correo y ubicación del Jardín Infantil Semillero en Ibagué.",
};

const contactItems = [
  {
    icon: MapPin,
    label: "Dirección física",
    value: `${siteConfig.contact.address}, ${siteConfig.contact.city}`,
  },
  {
    icon: Phone,
    label: "Teléfono / WhatsApp",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phoneHref}`,
  },
  {
    icon: Mail,
    label: "Correo electrónico",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: siteConfig.contact.hours,
  },
  {
    icon: Hash,
    label: "DANE",
    value: siteConfig.contact.dane,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]}
        title="Estamos para escucharte"
        description="¿Tienes dudas o quieres conocer nuestras instalaciones? Contáctanos y agenda una visita."
      />

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-bold text-brand-deep">
              Información de contacto
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Nuestro equipo está disponible para acompañarte en el proceso de admisión
              y resolver tus inquietudes.
            </p>

            <dl className="mt-6 space-y-5">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium text-brand-deep">
                        {item.href ? (
                          <a href={item.href} className="hover:text-brand">
                            {item.value}
                          </a>
                        ) : (
                          item.value
                        )}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>

            <div className="mt-8 rounded-xl bg-accent p-5">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-brand-deep">
                <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                Agenda tu visita
              </h3>
              <p className="mt-1 text-sm text-brand-deep/80">
                Escríbenos por WhatsApp y coordinemos un recorrido por nuestras
                instalaciones.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-4")}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Escribir por WhatsApp
              </a>
            </div>
          </div>

          <div>
            <MapEmbed />
            <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-deep">
              <p className="font-semibold">¿Cómo llegar?</p>
              <p className="mt-1 text-muted-foreground">
                Estamos ubicados en el barrio Jordán 9a Etapa. Puedes abrir la ruta en
                Google Maps y planear tu visita.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
