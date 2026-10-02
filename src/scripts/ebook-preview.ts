import { downloadEpub, downloadPdf, getCoverUrl, getPreview } from "./api";
import {
  EBOOK_EXPORT_SUFFIXES,
  EBOOK_TYPE_LABELS,
  hasCollectionCover,
  type EbookPreviewPage,
  type EbookPreviewResponse,
} from "./types";

type PreviewItem =
  | { kind: "cover"; page_number: 0; title: string; moduleTitle: string }
  | (EbookPreviewPage & { kind: "content"; moduleTitle: string });

const app = document.querySelector<HTMLElement>("#preview-app");
const ebookId =
  app?.dataset.ebookId ||
  new URLSearchParams(window.location.search).get("id") ||
  "";
const moduleList = document.querySelector<HTMLElement>("#preview-modules");
const reader = document.querySelector<HTMLElement>("#reader-page");
const pageSelect = document.querySelector<HTMLSelectElement>("#page-select");
const prevButton = document.querySelector<HTMLButtonElement>("#prev-page");
const nextButton = document.querySelector<HTMLButtonElement>("#next-page");
const zoomControl = document.querySelector<HTMLInputElement>("#zoom-control");
const pdfLink = document.querySelector<HTMLAnchorElement>("#download-pdf");
const epubLink = document.querySelector<HTMLAnchorElement>("#download-epub");

let preview: EbookPreviewResponse | null = null;
let pages: PreviewItem[] = [];
let currentIndex = 0;

async function initPreview(): Promise<void> {
  if (!reader) return;
  if (!ebookId) {
    reader.innerHTML = `<div class="error-box">No se recibió el ID del ebook. Abre el ebook desde la lista o genera uno nuevo.</div>`;
    return;
  }
  try {
    preview = await getPreview(ebookId);
    const contentPages: PreviewItem[] = preview.modules.flatMap((module) =>
      module.pages.map((page) => ({
        ...page,
        kind: "content" as const,
        moduleTitle: module.title,
      })),
    );
    pages =
      hasCollectionCover(preview.ebook.ebook_type)
        ? [
            {
              kind: "cover",
              page_number: 0,
              title: `Carátula ${EBOOK_TYPE_LABELS[preview.ebook.ebook_type]}`,
              moduleTitle: "Colección",
            },
            ...contentPages,
          ]
        : contentPages;
    if (pdfLink) pdfLink.href = "#";
    if (epubLink) epubLink.href = "#";
    renderModules();
    renderPageOptions();
    renderPage(0);
  } catch (error) {
    reader.innerHTML = `<div class="error-box">${escapeHtml(errorMessage(error))}</div>`;
  }
}

function renderModules(): void {
  if (!moduleList || !preview) return;
  moduleList.innerHTML = preview.modules
    .map(
      (module) => `
        <button class="preview-module-button" type="button" data-page="${firstPageIndexForModule(module.id)}">
          ${module.position}. ${escapeHtml(module.title)}
        </button>
      `,
    )
    .join("");

  moduleList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const pageIndex = Number(target.dataset.page ?? 0);
    renderPage(pageIndex);
  });
}

function firstPageIndexForModule(moduleId: string): number {
  if (!preview) return 0;
  let index = hasCollectionCover(preview.ebook.ebook_type) ? 1 : 0;
  for (const module of preview.modules) {
    if (module.id === moduleId) return index;
    index += module.pages.length;
  }
  return 0;
}

function renderPageOptions(): void {
  if (!pageSelect) return;
  pageSelect.innerHTML = pages
    .map(
      (page, index) => {
        const label =
          page.kind === "cover"
            ? "Carátula"
            : `Página ${page.page_number}: ${page.title}`;
        return `<option value="${index}">${escapeHtml(label)}</option>`;
      },
    )
    .join("");
}

function renderPage(index: number): void {
  if (!reader) return;
  if (!pages.length) {
    reader.innerHTML = `<div class="empty-state"><strong>Vista previa no disponible</strong><p>El ebook aún no tiene páginas generadas.</p></div>`;
    return;
  }
  currentIndex = Math.max(0, Math.min(index, pages.length - 1));
  const page = pages[currentIndex];
  if (page.kind === "cover") {
    const coverLabel = preview
      ? EBOOK_TYPE_LABELS[preview.ebook.ebook_type]
      : "Colección";
    reader.innerHTML = `
      <div class="training-cover-frame">
        <img class="training-cover-preview" src="${escapeHtml(getCoverUrl(ebookId))}" alt="Carátula ${escapeHtml(coverLabel)}" />
      </div>
    `;
    if (pageSelect) pageSelect.value = String(currentIndex);
    if (prevButton) prevButton.disabled = true;
    if (nextButton) nextButton.disabled = pages.length === 1;
    return;
  }
  reader.innerHTML = `
    <p class="eyebrow">${escapeHtml(page.moduleTitle)}</p>
    <h2>${escapeHtml(page.title)}</h2>
    ${markdownToHtml(page.body_markdown)}
  `;
  if (pageSelect) pageSelect.value = String(currentIndex);
  if (prevButton) prevButton.disabled = currentIndex === 0;
  if (nextButton) nextButton.disabled = currentIndex === pages.length - 1;
}

prevButton?.addEventListener("click", () => renderPage(currentIndex - 1));
nextButton?.addEventListener("click", () => renderPage(currentIndex + 1));
pageSelect?.addEventListener("change", () =>
  renderPage(Number(pageSelect.value)),
);
zoomControl?.addEventListener("input", () => {
  if (!reader || !zoomControl) return;
  reader.style.fontSize = `${Number(zoomControl.value)}%`;
});
pdfLink?.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    await downloadPdf(ebookId, exportFilename("pdf"));
  } catch (error) {
    alert(errorMessage(error));
  }
});

epubLink?.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    await downloadEpub(ebookId, exportFilename("epub"));
  } catch (error) {
    alert(errorMessage(error));
  }
});

function markdownToHtml(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  let inList = false;
  const output: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (inList) {
        output.push("</ul>");
        inList = false;
      }
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inList) {
        output.push("<ul>");
        inList = true;
      }
      output.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      continue;
    }
    if (inList) {
      output.push("</ul>");
      inList = false;
    }
    if (line.startsWith("### "))
      output.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
    else if (line.startsWith("## "))
      output.push(`<h3>${escapeHtml(line.slice(3))}</h3>`);
    else output.push(`<p>${escapeHtml(line.replace(/^#\s+/, ""))}</p>`);
  }

  if (inList) output.push("</ul>");
  return output.join("");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Ocurrió un error inesperado.";
}

function exportFilename(extension: "pdf" | "epub"): string {
  if (!preview || !hasCollectionCover(preview.ebook.ebook_type)) {
    return `ebook-${ebookId}.${extension}`;
  }
  const normalizedTopic = preview.ebook.topic
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const collection = EBOOK_EXPORT_SUFFIXES[preview.ebook.ebook_type];
  const suffix = extension === "pdf" ? `_${collection}_A4` : `_${collection}`;
  return `${normalizedTopic || "Ebook"}${suffix}.${extension}`;
}

void initPreview();
