export type ModuleMode = "ai_suggested" | "manual";
export type EbookStatus = "draft" | "generating" | "completed" | "failed";
export type JobStatus = "pending" | "running" | "completed" | "failed";

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
  };
  modules: EbookPreviewModule[];
}

