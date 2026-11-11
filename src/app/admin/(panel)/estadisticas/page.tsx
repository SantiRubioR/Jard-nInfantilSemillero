import { AdminPageHeader } from "@/components/admin";
import { Badge } from "@/components/ui/badge";
import { StatisticsAdminPanel } from "@/features/statistics";

export default function StatisticsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Estadísticas de inicio"
        description="Estos números aparecen en la franja amarilla de la página de inicio del sitio público."
        action={<Badge variant="accent">Módulo Inicio</Badge>}
      />
      <StatisticsAdminPanel />
    </div>
  );
}
