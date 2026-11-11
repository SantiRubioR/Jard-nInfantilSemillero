import Image from "next/image";
import type { Facility } from "../facilities.types";

export function FacilityGallery({ facilities }: { facilities: Facility[] }) {
  if (facilities.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
        Aún no hay fotografías de las instalaciones publicadas.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {facilities.map((facility, index) => (
        <figure
          key={facility.id}
          className={
            index === 0
              ? "group relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-muted md:col-span-2"
              : "group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-muted"
          }
        >
          <Image
            src={facility.imageUrl}
            alt={facility.title}
            fill
            sizes={
              index === 0
                ? "(max-width: 768px) 100vw, 66vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/90 via-brand-deep/40 to-transparent p-4 text-white">
            <p className="font-display text-base font-bold">{facility.title}</p>
            {facility.description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-white/85">
                {facility.description}
              </p>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
