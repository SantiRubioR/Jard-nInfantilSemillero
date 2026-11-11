"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { ActionMessage } from "@/components/feedback/action-message";
import { SubmitButton } from "@/components/feedback/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginViewModel } from "../auth.hooks";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const { state, pending, submit } = useLoginViewModel();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await submit({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    if (result.ok) {
      router.push("/admin/");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="rectora@jardinsemillero.edu.co"
          required
          disabled={!configured || pending}
        />
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          disabled={!configured || pending}
        />
      </div>

      <ActionMessage state={state} />

      <SubmitButton
        className="w-full"
        size="lg"
        pending={pending}
        pendingText="Ingresando…"
        disabled={!configured}
      >
        <LogIn className="h-5 w-5" aria-hidden="true" />
        Iniciar sesión
      </SubmitButton>

      {!configured && (
        <Link
          href="/admin/"
          className="block rounded-lg bg-accent px-4 py-3 text-center text-sm font-bold text-brand-deep hover:bg-accent-dark"
        >
          Explorar el panel en modo demostración
        </Link>
      )}
    </form>
  );
}
