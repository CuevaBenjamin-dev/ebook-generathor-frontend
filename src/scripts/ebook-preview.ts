import { downloadEpub, downloadPdf, getPreview } from "./api";
import type { EbookPreviewPage, EbookPreviewResponse } from "./types";

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
let pages: Array<EbookPreviewPage & { moduleTitle: string }> = [];
let currentIndex = 0;

async function initPreview(): Promise<void> {
  if (!reader) return;
  if (!ebookId) {
    reader.innerHTML = `<div class="error-box">No se recibió el ID del ebook. Abre el ebook desde la lista o genera uno nuevo.</div>`;
    return;
  }
  try {
    preview = await getPreview(ebookId);
    pages = preview.modules.flatMap((module) =>
      module.pages.map((page) => ({ ...page, moduleTitle: module.title })),
    );
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
  let index = 0;
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
      (page, index) =>
        `<option value="${index}">Página ${page.page_number}: ${escapeHtml(page.title)}</option>`,
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
    await downloadPdf(ebookId);
  } catch (error) {
    alert(errorMessage(error));
  }
});

epubLink?.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    await downloadEpub(ebookId);
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

void initPreview();
