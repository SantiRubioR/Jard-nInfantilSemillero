import { AdminPageHeader } from "@/components/admin";
import { Badge } from "@/components/ui/badge";
import { InstitutionalDocumentsAdminPanel } from "@/features/institutional-documents";
import { FacilitiesAdminPanel } from "@/features/facilities";

export default function AboutAdminPage() {
  return (
    <div>
      <AdminPageHeader
        title="Nosotros"
        description="Administra el manual de convivencia, la resolución de estudios y la galería de instalaciones del jardín."
        action={<Badge variant="default">Módulo Nosotros</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <InstitutionalDocumentsAdminPanel />
        <div>
          <FacilitiesAdminPanel />
        </div>
      </div>
    </div>
  );
}
