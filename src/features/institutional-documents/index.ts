export { DocumentsSection } from "./components/documents-section";
export { InstitutionalDocumentsAdminPanel } from "./components/institutional-documents-admin-panel";
export {
  listInstitutionalDocuments,
  uploadInstitutionalDocument,
} from "./institutional-documents.service";
export {
  useInstitutionalDocumentsViewModel,
  useInstitutionalDocumentsAdminViewModel,
} from "./institutional-documents.hooks";
export type {
  DocumentType,
  InstitutionalDocument,
} from "./institutional-documents.types";
