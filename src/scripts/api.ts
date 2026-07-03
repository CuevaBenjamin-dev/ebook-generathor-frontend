import type {
  EbookCreateInput,
  EbookListItem,
  EbookPreviewResponse,
  GenerationJobStatus,
  ProposedModule,
  SettingsStatus,
} from "./types";

const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.PUBLIC_API_BASE_URL ||
    "http://localhost:8000/api/v1" ||
    "https://legwork-sulfide-slacking.ngrok-free.dev/api/v1",
);

function normalizeApiBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function apiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");
  headers.set("ngrok-skip-browser-warning", "true");

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
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
    body: JSON.stringify(payload),
  });
}

export function createEbook(
  payload: EbookCreateInput,
): Promise<{ ebook_id: string; status: string }> {
  return request("/ebooks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function generateEbook(
  ebookId: string,
): Promise<{ job_id: string; ebook_id: string; status: string }> {
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

// export function getPdfUrl(ebookId: string): string {
//   return `${API_BASE_URL}/ebooks/${ebookId}/export/pdf`;
// }

// export function getEpubUrl(ebookId: string): string {
//   return `${API_BASE_URL}/ebooks/${ebookId}/export/epub`;
// }

async function requestFile(path: string, accept: string): Promise<Blob> {
  const response = await fetch(apiUrl(path), {
    method: "GET",
    headers: {
      Accept: accept,
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!response.ok) {
    let message = "No se pudo descargar el archivo.";
    try {
      const payload = await response.json();
      message = payload.detail ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  return response.blob();
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export async function downloadPdf(ebookId: string): Promise<void> {
  const blob = await requestFile(
    `/ebooks/${ebookId}/export/pdf`,
    "application/pdf",
  );

  downloadBlob(blob, `ebook-${ebookId}.pdf`);
}

export async function downloadEpub(ebookId: string): Promise<void> {
  const blob = await requestFile(
    `/ebooks/${ebookId}/export/epub`,
    "application/epub+zip",
  );

  downloadBlob(blob, `ebook-${ebookId}.epub`);
}
