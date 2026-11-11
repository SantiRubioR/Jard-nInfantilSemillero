export type DocumentType = "manual_convivencia" | "resolucion_estudios";

export type InstitutionalDocument = {
  id: string;
  type: DocumentType;
  title: string;
  description: string;
  pdfUrl: string | null;
  updatedAt: string;
  actionLabel: string;
};

export const institutionalDocumentCatalog: Array<{
  type: DocumentType;
  title: string;
  description: string;
  actionLabel: string;
}> = [
  {
    type: "manual_convivencia",
    title: "Manual de convivencia",
    description:
      "Nuestro manual establece las bases para una convivencia armónica, el respeto mutuo y el fortalecimiento de los valores ciudadanos en la comunidad educativa.",
    actionLabel: "Descargar manual",
  },
  {
    type: "resolucion_estudios",
    title: "Resolución de estudios",
    description:
      "Documento oficial emitido por la Secretaría de Educación Municipal que autoriza y certifica el funcionamiento de nuestro jardín.",
    actionLabel: "Descargar resolución",
  },
];

export function findDocumentCatalog(type: DocumentType) {
  return institutionalDocumentCatalog.find((document) => document.type === type);
}
