import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-semillero.png"
      alt="Escudo del Jardín Infantil Semillero"
      width={512}
      height={407}
      className={cn("h-12 w-auto", className)}
    />
  );
}
