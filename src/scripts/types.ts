export type ModuleMode = "ai_suggested" | "manual";
export type EbookType =
  | "standard"
  | "teacher_training"
  | "law"
  | "public_management"
  | "office"
  | "health"
  | "technology"
  | "civil_engineering"
  | "agronomy";
export type EbookStatus = "draft" | "generating" | "completed" | "failed";
export type JobStatus = "pending" | "running" | "completed" | "failed";

export const EBOOK_TYPE_LABELS: Record<EbookType, string> = {
  standard: "Estándar",
  teacher_training: "Capacitación Docente",
  law: "Derecho",
  public_management: "Gestión Pública",
  office: "Ofimática",
  health: "Sector Salud",
  technology: "Tecnología",
  civil_engineering: "Ingeniería Civil",
  agronomy: "Agronomía o Cultivos",
};

export const EBOOK_EXPORT_SUFFIXES: Record<Exclude<EbookType, "standard">, string> = {
  teacher_training: "Capacitacion_Docente",
  law: "Derecho",
  public_management: "Gestion_Publica",
  office: "Ofimatica",
  health: "Sector_Salud",
  technology: "Tecnologia",
  civil_engineering: "Ingenieria_Civil",
  agronomy: "Agronomia_Cultivos",
};

export function hasCollectionCover(
  ebookType: EbookType,
): ebookType is Exclude<EbookType, "standard"> {
  return ebookType !== "standard";
}

export interface EbookModuleInput {
  position: number;
  title: string;
  objective?: string;
  is_active: boolean;
  target_pages?: number;
}

export interface EbookCreateInput {
  topic: string;
  module_mode: ModuleMode;
  ebook_type: EbookType;
  total_content_pages: number;
  modules: EbookModuleInput[];
}

export interface GenerationJobStatus {
  job_id: string;
  ebook_id: string;
  status: JobStatus;
  progress: number;
  current_step: string;
  error_message?: string | null;
}

export interface SettingsStatus {
  backend_ok: boolean;
  openai_configured: boolean;
  model_configured: boolean;
  model: string;
}

export interface ProposedModule {
  position: number;
  title: string;
  objective: string;
  target_pages: number;
  subtopics: string[];
}

export interface EbookListItem {
  id: string;
  topic: string;
  title?: string | null;
  status: EbookStatus;
  ebook_type: EbookType;
  total_content_pages: number;
  active_modules: number;
  created_at: string;
}

export interface EbookPreviewPage {
  page_number: number;
  title: string;
  body_markdown: string;
}

export interface EbookPreviewModule {
  id: string;
  position: number;
  title: string;
  pages: EbookPreviewPage[];
}

export interface EbookPreviewResponse {
  ebook: {
    id: string;
    title: string;
    topic: string;
    total_content_pages: number;
    status: EbookStatus;
    ebook_type: EbookType;
    cover_url?: string | null;
  };
  modules: EbookPreviewModule[];
}
