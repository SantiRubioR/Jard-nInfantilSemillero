"use client";

import { toast } from "sonner";
import { BarChart3 } from "lucide-react";
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
import type { StatisticsInput } from "../statistics.schemas";
import type { StatisticKey } from "../statistics.types";
import { useStatisticsAdminViewModel } from "../statistics.hooks";

const fields: { key: StatisticKey; label: string; hint: string }[] = [
  { key: "docentes", label: "Docentes", hint: "Número de docentes activos" },
  { key: "estudiantes", label: "Estudiantes", hint: "Estudiantes matriculados" },
  { key: "graduados", label: "Graduados", hint: "Graduados históricos" },
  {
    key: "anios_experiencia",
    label: "Años de experiencia",
    hint: "Trayectoria de la institución",
  },
];

export function StatisticsAdminPanel() {
  const viewModel = useStatisticsAdminViewModel();
  const values = new Map(
    viewModel.statistics.map((stat) => [stat.key, stat.value]),
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await viewModel.save({
      docentes: Number(formData.get("docentes")),
      estudiantes: Number(formData.get("estudiantes")),
      graduados: Number(formData.get("graduados")),
      anios_experiencia: Number(formData.get("anios_experiencia")),
    } as StatisticsInput);

    if (result.ok) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Contadores institucionales</CardTitle>
            <CardDescription>
              Actualiza los indicadores que se muestran a las familias y visitantes.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  name={field.key}
                  type="number"
                  min={0}
                  max={99999}
                  defaultValue={values.get(field.key) ?? 0}
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>
              </div>
            ))}
          </div>

          <ActionMessage state={viewModel.state} />

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <SubmitButton pending={viewModel.pending} pendingText="Guardando…" size="md">
              Guardar estadísticas
            </SubmitButton>
            <p className="text-xs text-muted-foreground">
              Los cambios se reflejan al recargar la página pública.
            </p>
          </div>
        </form>
        {viewModel.error && (
          <Badge variant="danger" className="mt-4">
            {viewModel.error}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
