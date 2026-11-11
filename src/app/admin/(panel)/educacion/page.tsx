import { AdminPageHeader } from "@/components/admin";
import { Badge } from "@/components/ui/badge";
import { AcademicLevelsAdminPanel } from "@/features/academic-levels";

export default function EducationAdminPage() {
  return (
    <div>
      <AdminPageHeader
        title="Temarios pedagógicos"
        description="Sube o reemplaza el plan pedagógico en PDF de cada nivel educativo. El archivo anterior se elimina automáticamente del almacenamiento."
        action={<Badge variant="default">Módulo Educación</Badge>}
      />
      <AcademicLevelsAdminPanel />
    </div>
  );
}
