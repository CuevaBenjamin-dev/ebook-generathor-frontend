import type {
  EbookCreateInput,
  EbookListItem,
  EbookPreviewResponse,
  GenerationJobStatus,
  ProposedModule,
  SettingsStatus
} from "./types";

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    let message = "No se pudo completar la solicitud.";
    try {
      const payload = await response.json();
      message = payload.detail ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getSettingsStatus(): Promise<SettingsStatus> {
  return request<SettingsStatus>("/settings/status");
}

export function proposeModules(payload: {
  topic: string;
  module_count: number;
  total_content_pages: number;
  audience?: string;
  tone?: string;
}): Promise<{ modules: ProposedModule[]; total_pages_assigned: number }> {
  return request("/modules/propose", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createEbook(payload: EbookCreateInput): Promise<{ ebook_id: string; status: string }> {
  return request("/ebooks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function generateEbook(ebookId: string): Promise<{ job_id: string; ebook_id: string; status: string }> {
  return request(`/ebooks/${ebookId}/generate`, { method: "POST" });
}

export function getJob(jobId: string): Promise<GenerationJobStatus> {
  return request(`/jobs/${jobId}`);
}

export function getEbook(ebookId: string): Promise<unknown> {
  return request(`/ebooks/${ebookId}`);
}

export function getPreview(ebookId: string): Promise<EbookPreviewResponse> {
  return request(`/ebooks/${ebookId}/preview`);
}

export function listEbooks(): Promise<{ items: EbookListItem[] }> {
  return request("/ebooks");
}

export function deleteEbook(ebookId: string): Promise<{ deleted: boolean }> {
  return request(`/ebooks/${ebookId}`, { method: "DELETE" });
}

export function getPdfUrl(ebookId: string): string {
  return `${API_BASE_URL}/ebooks/${ebookId}/export/pdf`;
}

export function getEpubUrl(ebookId: string): string {
  return `${API_BASE_URL}/ebooks/${ebookId}/export/epub`;
}

