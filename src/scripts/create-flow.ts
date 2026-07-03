import {
  createEbook,
  generateEbook,
  getJob,
  getSettingsStatus,
  proposeModules
} from "./api";
import type { EbookModuleInput, ModuleMode, SettingsStatus } from "./types";
import {
  allocatePagesForPreview,
  validateCounts,
  validateModules,
  validateTopic
} from "./validators";

type FlowStep = "config" | "modules" | "summary" | "progress";

interface FlowState {
  topic: string;
  moduleCount: number;
  totalPages: number;
  moduleMode: ModuleMode;
  modules: EbookModuleInput[];
  proposalSignature: string;
  settings?: SettingsStatus;
}

const state: FlowState = {
  topic: "",
  moduleCount: 8,
  totalPages: 60,
  moduleMode: "ai_suggested",
  modules: [],
  proposalSignature: ""
};

const topicInput = document.querySelector<HTMLInputElement>("#topic-input");
const moduleCountInput = document.querySelector<HTMLInputElement>("#module-count");
const pageCountInput = document.querySelector<HTMLInputElement>("#page-count");
const configError = document.querySelector<HTMLElement>("#config-error");
const modulesError = document.querySelector<HTMLElement>("#modules-error");
const moduleList = document.querySelector<HTMLElement>("#module-list");
const modulesLoading = document.querySelector<HTMLElement>("#modules-loading");
const summaryBox = document.querySelector<HTMLElement>("#summary-box");
const settingsWarning = document.querySelector<HTMLElement>("#settings-warning");
const generateButton = document.querySelector<HTMLButtonElement>("#generate-ebook");

function initCreateFlow(): void {
  if (!topicInput || !moduleCountInput || !pageCountInput || !moduleList) return;

  const storedTopic = sessionStorage.getItem("ebookTopic");
  if (storedTopic && !topicInput.value) {
    topicInput.value = storedTopic;
  }

  document.querySelector("#to-modules")?.addEventListener("click", handleConfigContinue);
  document.querySelector("#back-config")?.addEventListener("click", () => setStep("config"));
  document.querySelector("#to-summary")?.addEventListener("click", handleModulesContinue);
  document.querySelector("#back-modules")?.addEventListener("click", () => setStep("modules"));
  document.querySelector("#add-module")?.addEventListener("click", addModule);
  document.querySelector("#generate-ebook")?.addEventListener("click", handleGenerate);
  document.querySelector("#back-after-fail")?.addEventListener("click", () => setStep("modules"));

  moduleList.addEventListener("input", syncModulesFromDom);
  moduleList.addEventListener("change", syncModulesFromDom);
  moduleList.addEventListener("click", handleModuleButtonClick);

  setStep("config");
}

function readConfig(): boolean {
  const topic = topicInput?.value ?? "";
  const moduleCount = Number(moduleCountInput?.value ?? 0);
  const totalPages = Number(pageCountInput?.value ?? 0);
  const selectedMode = document.querySelector<HTMLInputElement>("input[name='module-mode']:checked");

  const topicValidation = validateTopic(topic);
  if (!topicValidation.ok) {
    showError(configError, topicValidation.message);
    return false;
  }

  const countValidation = validateCounts(moduleCount, totalPages);
  if (!countValidation.ok) {
    showError(configError, countValidation.message);
    return false;
  }

  state.topic = topic.trim();
  state.moduleCount = moduleCount;
  state.totalPages = totalPages;
  state.moduleMode = (selectedMode?.value ?? "ai_suggested") as ModuleMode;
  hide(configError);
  sessionStorage.setItem("ebookTopic", state.topic);
  return true;
}

async function handleConfigContinue(): Promise<void> {
  if (!readConfig()) return;
  setStep("modules");

  const signature = `${state.topic}|${state.moduleCount}|${state.totalPages}|${state.moduleMode}`;
  if (state.moduleMode === "manual") {
    if (!state.modules.length || state.proposalSignature !== signature) {
      state.modules = buildGenericModules(state.moduleCount);
      state.proposalSignature = signature;
    }
    renderModules();
    return;
  }

  if (state.modules.length && state.proposalSignature === signature) {
    renderModules();
    return;
  }

  await loadProposedModules(signature);
}

async function loadProposedModules(signature: string): Promise<void> {
  show(modulesLoading);
  hide(modulesError);
  moduleList!.innerHTML = "";
  try {
    const response = await proposeModules({
      topic: state.topic,
      module_count: state.moduleCount,
      total_content_pages: state.totalPages,
      audience: "principiantes",
      tone: "educativo y claro"
    });
    state.modules = response.modules.map((module) => ({
      position: module.position,
      title: module.title,
      objective: module.objective,
      is_active: true,
      target_pages: module.target_pages
    }));
    state.proposalSignature = signature;
  } catch (error) {
    state.modules = buildGenericModules(state.moduleCount);
    state.proposalSignature = signature;
    showError(
      modulesError,
      `${errorMessage(error)} Puedes cambiar a módulos manuales o completar backend/.env si falta OpenAI.`
    );
  } finally {
    hide(modulesLoading);
    renderModules();
  }
}

function handleModulesContinue(): void {
  syncModulesFromDom();
  const validation = validateModules(state.modules, state.totalPages);
  if (!validation.ok) {
    showError(modulesError, validation.message);
    return;
  }
  hide(modulesError);
  renderSummary();
  setStep("summary");
  void loadSettingsForSummary();
}

async function loadSettingsForSummary(): Promise<void> {
  if (!settingsWarning || !generateButton) return;
  generateButton.disabled = true;
  try {
    state.settings = await getSettingsStatus();
    if (!state.settings.openai_configured || !state.settings.model_configured) {
      showError(
        settingsWarning,
        "OpenAI no está configurado. Abre backend/.env y completa OPENAI_API_KEY y OPENAI_MODEL."
      );
      generateButton.disabled = true;
    } else {
      settingsWarning.className = "success-box";
      settingsWarning.textContent = `OpenAI configurado. Modelo: ${state.settings.model}`;
      show(settingsWarning);
      generateButton.disabled = false;
    }
  } catch {
    showError(settingsWarning, "No se pudo conectar con el backend en http://localhost:8000.");
    generateButton.disabled = true;
  }
}

async function handleGenerate(): Promise<void> {
  syncModulesFromDom();
  const validation = validateModules(state.modules, state.totalPages);
  if (!validation.ok) {
    setStep("modules");
    showError(modulesError, validation.message);
    return;
  }

  setStep("progress");
  updateProgress(0, "Creando ebook");
  try {
    const created = await createEbook({
      topic: state.topic,
      module_mode: state.moduleMode,
      total_content_pages: state.totalPages,
      modules: state.modules.map((module, index) => ({
        ...module,
        position: index + 1,
        title: module.title.trim(),
        objective: module.objective?.trim() || undefined
      }))
    });
    const generation = await generateEbook(created.ebook_id);
    await pollJob(generation.job_id);
  } catch (error) {
    failProgress(errorMessage(error));
  }
}

async function pollJob(jobId: string): Promise<void> {
  const poll = async (): Promise<void> => {
    try {
      const job = await getJob(jobId);
      updateProgress(job.progress, job.current_step);
      if (job.status === "completed") {
        window.location.href = `/ebooks/${job.ebook_id}`;
        return;
      }
      if (job.status === "failed") {
        failProgress(job.error_message ?? "No se pudo generar el ebook.");
        return;
      }
      window.setTimeout(poll, 2000);
    } catch (error) {
      failProgress(errorMessage(error));
    }
  };
  await poll();
}

function buildGenericModules(count: number): EbookModuleInput[] {
  return Array.from({ length: count }, (_, index) => ({
    position: index + 1,
    title: `Módulo ${index + 1}`,
    objective: "",
    is_active: true
  }));
}

function renderModules(): void {
  if (!moduleList) return;
  state.modules = state.modules.map((module, index) => ({ ...module, position: index + 1 }));
  moduleList.innerHTML = state.modules
    .map(
      (module, index) => `
        <article class="module-row" data-index="${index}">
          <input class="module-active" type="checkbox" aria-label="Activar módulo" ${module.is_active ? "checked" : ""} />
          <label class="field">
            <span>Título</span>
            <input class="module-title" type="text" maxlength="90" value="${escapeHtml(module.title)}" />
          </label>
          <label class="field">
            <span>Objetivo</span>
            <textarea class="module-objective">${escapeHtml(module.objective ?? "")}</textarea>
          </label>
          <label class="field">
            <span>Páginas</span>
            <input class="module-pages" type="number" min="1" max="300" placeholder="Auto" value="${module.target_pages ?? ""}" />
          </label>
          <div class="module-actions">
            <button class="button button-secondary" type="button" data-action="up">Subir</button>
            <button class="button button-secondary" type="button" data-action="down">Bajar</button>
            <button class="button button-danger" type="button" data-action="delete">Eliminar</button>
          </div>
        </article>
      `
    )
    .join("");
}

function syncModulesFromDom(): void {
  if (!moduleList) return;
  const rows = Array.from(moduleList.querySelectorAll<HTMLElement>(".module-row"));
  state.modules = rows.map((row, index) => {
    const pagesValue = row.querySelector<HTMLInputElement>(".module-pages")?.value ?? "";
    const targetPages = pagesValue ? Number(pagesValue) : undefined;
    return {
      position: index + 1,
      title: row.querySelector<HTMLInputElement>(".module-title")?.value.trim() ?? "",
      objective: row.querySelector<HTMLTextAreaElement>(".module-objective")?.value.trim() || undefined,
      is_active: row.querySelector<HTMLInputElement>(".module-active")?.checked ?? false,
      target_pages: targetPages && targetPages > 0 ? targetPages : undefined
    };
  });
}

function handleModuleButtonClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;
  if (!action) return;

  const row = target.closest<HTMLElement>(".module-row");
  const index = Number(row?.dataset.index ?? -1);
  if (index < 0) return;

  syncModulesFromDom();
  if (action === "delete") {
    state.modules.splice(index, 1);
  }
  if (action === "up" && index > 0) {
    [state.modules[index - 1], state.modules[index]] = [state.modules[index], state.modules[index - 1]];
  }
  if (action === "down" && index < state.modules.length - 1) {
    [state.modules[index + 1], state.modules[index]] = [state.modules[index], state.modules[index + 1]];
  }
  renderModules();
}

function addModule(): void {
  syncModulesFromDom();
  state.modules.push({
    position: state.modules.length + 1,
    title: `Módulo ${state.modules.length + 1}`,
    objective: "",
    is_active: true
  });
  renderModules();
}

function renderSummary(): void {
  if (!summaryBox) return;
  const allocated = allocatePagesForPreview(state.modules, state.totalPages);
  const activeCount = allocated.length;
  const modeText = state.moduleMode === "ai_suggested" ? "IA propuso módulos" : "Usuario definió módulos";

  summaryBox.innerHTML = `
    <div class="summary-meta">
      <div class="meta-card"><span>Tema</span><strong>${escapeHtml(state.topic)}</strong></div>
      <div class="meta-card"><span>Método</span><strong>${modeText}</strong></div>
      <div class="meta-card"><span>Páginas de contenido solicitadas</span><strong>${state.totalPages}</strong></div>
      <div class="meta-card"><span>Páginas adicionales automáticas</span><strong>portada, índice y cierre</strong></div>
      <div class="meta-card"><span>Módulos activos</span><strong>${activeCount}</strong></div>
      <div class="meta-card"><span>Aviso</span><strong>La generación puede tardar según la cantidad de páginas</strong></div>
    </div>
    <ol class="summary-list">
      ${allocated
        .map(
          (module) => `
            <li>
              <span>${escapeHtml(module.title)}</span>
              <strong>${module.target_pages} páginas</strong>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
}

function setStep(step: FlowStep): void {
  document.querySelectorAll<HTMLElement>(".flow-step").forEach((section) => {
    section.classList.toggle("is-active", section.dataset.step === step);
  });

  const stepIndex = { config: 1, modules: 2, summary: 3, progress: 4 }[step];
  document.querySelectorAll<HTMLElement>(".stepper-item").forEach((item) => {
    item.classList.toggle("is-active", Number(item.dataset.stepIndex) === stepIndex);
  });
}

function updateProgress(progress: number, text: string): void {
  const bar = document.querySelector<HTMLElement>("#progress-bar");
  const percent = document.querySelector<HTMLElement>("#progress-percent");
  const status = document.querySelector<HTMLElement>("#progress-status");
  if (bar) bar.style.width = `${progress}%`;
  if (percent) percent.textContent = `${progress}%`;
  if (status) status.textContent = text;
  hide(document.querySelector<HTMLElement>("#progress-error"));
}

function failProgress(message: string): void {
  showError(document.querySelector<HTMLElement>("#progress-error"), message);
  show(document.querySelector<HTMLElement>("#back-after-fail"));
}

function showError(element: HTMLElement | null, message?: string): void {
  if (!element) return;
  element.className = "error-box";
  element.textContent = message ?? "Revisa los datos ingresados.";
  show(element);
}

function show(element: HTMLElement | null): void {
  element?.classList.remove("is-hidden");
}

function hide(element: HTMLElement | null): void {
  element?.classList.add("is-hidden");
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

initCreateFlow();

