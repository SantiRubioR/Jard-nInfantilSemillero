import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

export function PageHero({
  title,
  description,
  breadcrumb,
  className,
}: {
  title: string;
  description?: string;
  breadcrumb: Crumb[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark text-white",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-accent/15"
        aria-hidden="true"
      />
      <div className="container-page relative py-12 md:py-16">
        <nav aria-label="Migas de pan">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-white">
            {breadcrumb.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-white">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
