"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Images, Upload } from "lucide-react";
import { DeleteButton } from "@/components/feedback/delete-button";
import { ActionMessage } from "@/components/feedback/action-message";
import { SubmitButton } from "@/components/feedback/submit-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  initialActionState,
  type ActionState,
} from "@/lib/action-state";
import type { ActionResult } from "@/lib/result";
import { isPresentFile } from "@/lib/storage";
import { useFacilitiesAdminViewModel } from "../facilities.hooks";

function FacilityForm({
  create,
}: {
  create: (
    title: string,
    description: string,
    file: File,
  ) => Promise<ActionResult>;
}) {
  const [state, setState] = useState<ActionState>(initialActionState);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("image_file");

    if (!isPresentFile(file)) {
      setState({ status: "error", message: "Selecciona una imagen." });
      return;
    }

    setPending(true);
    const result = await create(
      String(formData.get("title") ?? ""),
      String(formData.get("description") ?? ""),
      file,
    );
    setPending(false);

    if (result.ok) {
      setState({ status: "success", message: result.message });
      toast.success(result.message);
      form.reset();
    } else {
      setState({ status: "error", message: result.message });
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="facility-title">Título de la instalación</Label>
        <Input
          id="facility-title"
          name="title"
          placeholder="Ej. Aula de prejardín"
          required
          maxLength={120}
        />
      </div>

      <div>
        <Label htmlFor="facility-description">Descripción breve</Label>
        <Textarea
          id="facility-description"
          name="description"
          placeholder="Describe el espacio y su uso pedagógico."
          maxLength={300}
          className="min-h-20"
        />
      </div>

      <div>
        <Label htmlFor="facility-image">Fotografía</Label>
        <Input
          id="facility-image"
          type="file"
          name="image_file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="h-auto cursor-pointer py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
        />
        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG o WebP. Máximo 5 MB.</p>
      </div>

      <ActionMessage state={state} />

      <SubmitButton pending={pending} pendingText="Subiendo…" className="w-full">
        <Upload className="h-4 w-4" aria-hidden="true" />
        Agregar instalación
      </SubmitButton>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
        La imagen se publica en la galería de Nosotros.
      </p>
    </form>
  );
}

export function FacilitiesAdminPanel() {
  const viewModel = useFacilitiesAdminViewModel();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <Images className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Galería de instalaciones</CardTitle>
              <CardDescription>
                Sube nuevas fotografías o elimina las que ya no estén vigentes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FacilityForm create={viewModel.create} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fotografías publicadas</CardTitle>
            <CardDescription>
              {viewModel.facilities.length}{" "}
              {viewModel.facilities.length === 1 ? "instalación" : "instalaciones"} en
              la galería.
            </CardDescription>
          </div>
          <Badge variant="muted">Máximo 5 MB por imagen</Badge>
        </CardHeader>
        <CardContent>
          {viewModel.facilities.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
              Aún no hay instalaciones registradas. Sube la primera fotografía.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {viewModel.facilities.map((facility) => (
                <article
                  key={facility.id}
                  className="overflow-hidden rounded-xl border border-border bg-white"
                >
                  <div className="relative aspect-[16/10] bg-muted">
                    <Image
                      src={facility.imageUrl}
                      alt={facility.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-sm font-bold text-brand-deep">
                          {facility.title}
                        </p>
                        {facility.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {facility.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={facility.isActive ? "success" : "muted"}>
                        {facility.isActive ? "Activa" : "Oculta"}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <DeleteButton
                        action={() => viewModel.remove(facility.id)}
                        label="Eliminar"
                        confirmText={`¿Eliminar la instalación "${facility.title}"? También se borrará la imagen del almacenamiento.`}
                        onSuccess={viewModel.reload}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
