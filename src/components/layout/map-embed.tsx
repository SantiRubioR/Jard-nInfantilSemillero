import { MapPin } from "lucide-react";
import { mapEmbedUrl, siteConfig } from "@/lib/site";

export function MapEmbed({ className }: { className?: string }) {
  return (
    <div
      className={
        className ??
        "overflow-hidden rounded-[var(--radius-card)] border border-border bg-muted shadow-card"
      }
    >
      <iframe
        title={`Ubicación de ${siteConfig.name} en Google Maps`}
        src={mapEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-[360px] w-full border-0 md:h-[420px]"
      />
      <div className="flex items-start gap-2 border-t border-border bg-white px-4 py-3 text-sm text-muted-foreground">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        <p>
          {siteConfig.contact.address}, {siteConfig.contact.city}
        </p>
      </div>
    </div>
  );
}
