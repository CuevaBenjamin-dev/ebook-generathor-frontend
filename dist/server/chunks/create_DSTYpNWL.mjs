import { et as __exportAll } from "./errors_BiAoVKno.mjs";
import { C as createComponent, S as createAstro, _ as addAttribute, a as renderComponent, d as renderTemplate, h as maybeRenderHead, n as renderScript } from "./server_CQw33AXo.mjs";
import "./compiler_Bts11pUs.mjs";
import { n as $$AppShell, t as $$MainLayout } from "./MainLayout_Def_zGQE.mjs";
import { t as $$Card } from "./Card_DaQiRCc4.mjs";
import { t as $$TextInput } from "./TextInput_DodD2kb2.mjs";
//#region src/components/ModuleEditor.astro
var $$ModuleEditor = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="module-editor"><div class="module-toolbar"><div><p class="eyebrow">Estructura</p><h2>Módulos del eBook</h2></div><button class="button button-secondary" type="button" id="add-module">Agregar módulo</button></div><div class="module-tabs" role="tablist" aria-label="Modo de módulos"><button type="button" class="tab-button is-active">Sugeridos por IA</button><button type="button" class="tab-button">Personalizar módulos</button></div><div id="modules-loading" class="notice is-hidden">Cargando módulos...</div><div id="module-list" class="module-list"></div></div>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/ModuleEditor.astro", void 0);
//#endregion
//#region src/components/NumberInput.astro
createAstro("https://astro.build");
var $$NumberInput = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$NumberInput;
	const { id, label, value, min, max } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<label class="field"${addAttribute(id, "for")}><span>${label}</span><input${addAttribute(id, "id")} type="number"${addAttribute(value, "value")}${addAttribute(min, "min")}${addAttribute(max, "max")}></label>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/NumberInput.astro", void 0);
//#endregion
//#region src/components/ProgressPanel.astro
var $$ProgressPanel = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="progress-panel" id="progress-panel"><h2>Generando tu eBook</h2><div class="progress-meter" aria-label="Progreso de generación"><span id="progress-bar" style="width: 0%"></span></div><p id="progress-percent">0%</p><ol class="progress-steps"><li>Analizando tema</li><li>Organizando estructura</li><li>Generando contenido por módulo</li><li>Validando páginas</li><li>Creando archivos exportables</li><li>Finalizando</li></ol><div id="progress-status" class="notice">Pendiente</div><div id="progress-error" class="error-box is-hidden"></div><button class="button button-secondary is-hidden" type="button" id="back-after-fail">Volver a editar</button></section>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/ProgressPanel.astro", void 0);
//#endregion
//#region src/components/RadioCard.astro
createAstro("https://astro.build");
var $$RadioCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$RadioCard;
	const { name, value, title, description, checked = false } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<label class="radio-card"><input type="radio"${addAttribute(name, "name")}${addAttribute(value, "value")}${addAttribute(checked, "checked")}><span><strong>${title}</strong><small>${description}</small></span></label>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/RadioCard.astro", void 0);
//#endregion
//#region src/components/Stepper.astro
createAstro("https://astro.build");
var $$Stepper = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Stepper;
	const { current = 1 } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<ol class="stepper" id="flow-stepper"${addAttribute(current, "data-current")}>${[
		"Configurar",
		"Módulos",
		"Resumen",
		"Generación"
	].map((step, index) => renderTemplate`<li${addAttribute(["stepper-item", index + 1 === current && "is-active"], "class:list")}${addAttribute(index + 1, "data-step-index")}><span>${index + 1}</span><strong>${step}</strong></li>`)}</ol>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/Stepper.astro", void 0);
//#endregion
//#region src/pages/create.astro
var create_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Create,
	file: () => $$file,
	url: () => $$url
});
var $$Create = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Crear eBook | Generador de eBooks IA" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", $$AppShell, { "active": "inicio" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Stepper", $$Stepper, { "current": 1 })}${maybeRenderHead($$result)}<section class="flow-step is-active" data-step="config">${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`<p class="eyebrow">Paso 1</p><h2>Configuración del eBook</h2><div class="config-form">${renderComponent($$result, "TextInput", $$TextInput, {
		"id": "topic-input",
		"label": "Tema del ebook",
		"maxlength": "160",
		"required": true
	})}<div class="form-grid">${renderComponent($$result, "NumberInput", $$NumberInput, {
		"id": "module-count",
		"label": "Cantidad de módulos",
		"value": "8",
		"min": "1",
		"max": "20"
	})}${renderComponent($$result, "NumberInput", $$NumberInput, {
		"id": "page-count",
		"label": "Páginas de contenido",
		"value": "60",
		"min": "5",
		"max": "300"
	})}</div><div><span class="field-label">Método de definición de módulos</span><div class="radio-grid">${renderComponent($$result, "RadioCard", $$RadioCard, {
		"name": "module-mode",
		"value": "ai_suggested",
		"title": "La aplicación propone los módulos",
		"description": "Usa OpenAI desde el backend para sugerir la estructura.",
		"checked": true
	})}${renderComponent($$result, "RadioCard", $$RadioCard, {
		"name": "module-mode",
		"value": "manual",
		"title": "Yo definiré los módulos",
		"description": "Crea una lista editable con nombres genéricos."
	})}</div></div><div id="config-error" class="error-box is-hidden"></div><div class="form-actions"><a class="button button-secondary" href="/">Volver</a><button class="button button-primary" type="button" id="to-modules">Continuar</button></div></div>` })}</section><section class="flow-step" data-step="modules">${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`<p class="eyebrow">Paso 2</p>${renderComponent($$result, "ModuleEditor", $$ModuleEditor, {})}<div id="modules-error" class="error-box is-hidden"></div><div class="form-actions"><button class="button button-secondary" type="button" id="back-config">Volver</button><button class="button button-primary" type="button" id="to-summary">Continuar</button></div>` })}</section><section class="flow-step" data-step="summary">${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`<p class="eyebrow">Paso 3</p><h2>Resumen antes de generar</h2><div id="summary-box" class="summary-grid"></div><div id="settings-warning" class="notice is-hidden"></div><div class="form-actions"><button class="button button-secondary" type="button" id="back-modules">Volver a editar</button><button class="button button-primary" type="button" id="generate-ebook" disabled>Generar eBook</button></div>` })}</section><section class="flow-step" data-step="progress">${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "ProgressPanel", $$ProgressPanel, {})}` })}</section>` })}` })}${renderScript($$result, "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/create.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/create.astro", void 0);
var $$file = "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/create.astro";
var $$url = "/create";
//#endregion
//#region \0virtual:astro:page:src/pages/create@_@astro
var page = () => create_exports;
//#endregion
export { page };
