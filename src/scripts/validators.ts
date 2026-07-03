import type { EbookModuleInput } from "./types";

export interface ValidationResult {
  ok: boolean;
  message?: string;
}

export function validateTopic(topic: string): ValidationResult {
  const value = topic.trim();
  if (!value) return { ok: false, message: "El tema es obligatorio." };
  if (value.length < 5) return { ok: false, message: "El tema debe tener al menos 5 caracteres." };
  if (value.length > 160) return { ok: false, message: "El tema debe tener máximo 160 caracteres." };
  return { ok: true };
}

export function validateCounts(moduleCount: number, totalPages: number): ValidationResult {
  if (!Number.isInteger(moduleCount) || moduleCount < 1 || moduleCount > 20) {
    return { ok: false, message: "La cantidad de módulos debe estar entre 1 y 20." };
  }
  if (!Number.isInteger(totalPages) || totalPages < 5 || totalPages > 300) {
    return { ok: false, message: "Las páginas de contenido deben estar entre 5 y 300." };
  }
  if (totalPages < moduleCount) {
    return { ok: false, message: "La cantidad de páginas debe ser igual o mayor a la cantidad de módulos" };
  }
  return { ok: true };
}

export function activeModules(modules: EbookModuleInput[]): EbookModuleInput[] {
  return modules.filter((module) => module.is_active);
}

export function validateModules(modules: EbookModuleInput[], totalPages: number): ValidationResult {
  const active = activeModules(modules);
  if (active.length === 0) return { ok: false, message: "Debe haber al menos un módulo activo." };
  if (totalPages < active.length) {
    return { ok: false, message: "La cantidad de páginas debe ser igual o mayor a la cantidad de módulos" };
  }

  const titles = new Set<string>();
  for (const module of active) {
    const title = module.title.trim();
    if (!title) return { ok: false, message: "Los módulos activos deben tener título." };
    if (title.length > 90) return { ok: false, message: "Cada título debe tener máximo 90 caracteres." };
    if (titles.has(title)) return { ok: false, message: "No se permiten títulos duplicados exactos." };
    titles.add(title);
  }

  const assigned = active.reduce((sum, module) => sum + (module.target_pages ?? 0), 0);
  const unassigned = active.filter((module) => module.target_pages === undefined).length;
  if (unassigned === 0 && assigned !== totalPages) {
    return { ok: false, message: `La suma de páginas por módulo debe ser exactamente ${totalPages}.` };
  }
  if (unassigned > 0 && assigned + unassigned > totalPages) {
    return { ok: false, message: `La suma de páginas por módulo debe ser exactamente ${totalPages}.` };
  }
  return { ok: true };
}

export function allocatePagesForPreview(modules: EbookModuleInput[], totalPages: number): EbookModuleInput[] {
  const active = activeModules(modules).map((module) => ({ ...module }));
  const assigned = active.reduce((sum, module) => sum + (module.target_pages ?? 0), 0);
  const missing = active.filter((module) => module.target_pages === undefined);
  if (missing.length === 0) return active;

  const remaining = totalPages - assigned;
  const base = Math.floor(remaining / missing.length);
  const extra = remaining % missing.length;
  let missingIndex = 0;

  return active.map((module) => {
    if (module.target_pages !== undefined) return module;
    const pages = base + (missingIndex < extra ? 1 : 0);
    missingIndex += 1;
    return { ...module, target_pages: pages };
  });
}

