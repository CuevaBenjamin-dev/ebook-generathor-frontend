import { et as __exportAll } from "./errors_BiAoVKno.mjs";
import { C as createComponent, a as renderComponent, d as renderTemplate, h as maybeRenderHead, n as renderScript } from "./server_CQw33AXo.mjs";
import "./compiler_Bts11pUs.mjs";
import { n as $$AppShell, t as $$MainLayout } from "./MainLayout_Def_zGQE.mjs";
import { t as $$Card } from "./Card_DaQiRCc4.mjs";
//#region src/pages/settings.astro
var settings_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Settings,
	file: () => $$file,
	url: () => $$url
});
var $$Settings = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Configuración | Generador de eBooks IA" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", $$AppShell, { "active": "settings" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<p class="eyebrow">Configuración</p><h2>Estado del sistema</h2><div class="summary-meta" id="settings-status"><div class="meta-card"><span>Backend</span><strong id="backend-state">Conectando...</strong></div><div class="meta-card"><span>OpenAI</span><strong id="openai-state">Revisando...</strong></div><div class="meta-card"><span>Modelo configurado</span><strong id="model-state">Revisando...</strong></div><div class="meta-card"><span>Modelo</span><strong id="model-name">No disponible</strong></div></div><p class="notice">Para configurar OpenAI, abre backend/.env y completa OPENAI_API_KEY. Nunca coloques la API key en el frontend.</p><div id="settings-error" class="error-box is-hidden"></div>` })}` })}` })}${renderScript($$result, "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/settings.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/settings.astro", void 0);
var $$file = "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/settings.astro";
var $$url = "/settings";
//#endregion
//#region \0virtual:astro:page:src/pages/settings@_@astro
var page = () => settings_exports;
//#endregion
export { page };
