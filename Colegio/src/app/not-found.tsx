import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted px-6 text-center">
      <Logo className="h-20 w-auto" />
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-brand">
        Error 404
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-deep md:text-4xl">
        No encontramos esta página
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Es posible que el contenido haya cambiado de lugar o ya no esté disponible.
        Vuelve al inicio para seguir explorando.
      </p>
      <Link href="/" className={`${buttonVariants({ variant: "primary" })} mt-6`}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver al inicio
      </Link>
    </main>
  );
}
