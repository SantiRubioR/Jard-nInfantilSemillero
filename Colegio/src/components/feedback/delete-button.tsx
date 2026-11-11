"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/result";

export function DeleteButton({
  action,
  label = "Eliminar",
  confirmText = "¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.",
  onSuccess,
}: {
  action: () => Promise<ActionResult>;
  label?: string;
  confirmText?: string;
  onSuccess?: () => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (!window.confirm(confirmText)) return;

    setPending(true);
    const result = await action();
    setPending(false);

    if (result.ok) {
      toast.success(result.message);
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => window.location.reload(), 600);
      }
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={handleClick}
      className="border-red-200 text-danger hover:border-red-300 hover:bg-red-50"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      )}
      {label}
    </Button>
  );
}
