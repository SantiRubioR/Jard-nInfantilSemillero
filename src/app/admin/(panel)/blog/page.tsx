import { AdminPageHeader } from "@/components/admin";
import { Badge } from "@/components/ui/badge";
import { BlogAdminPanel } from "@/features/blog";

export default function BlogAdminPage() {
  return (
    <div>
      <AdminPageHeader
        title="Blog y circulares"
        description="Crea eventos con imagen de portada y circulares con PDF descargable. Todo se publica sin recompilar el sitio."
        action={<Badge variant="default">Módulo Blog</Badge>}
      />
      <BlogAdminPanel />
    </div>
  );
}
