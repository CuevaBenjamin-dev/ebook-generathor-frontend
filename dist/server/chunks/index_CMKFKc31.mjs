import { et as __exportAll } from "./errors_BiAoVKno.mjs";
import { C as createComponent, a as renderComponent, d as renderTemplate, h as maybeRenderHead, n as renderScript } from "./server_CQw33AXo.mjs";
import "./compiler_Bts11pUs.mjs";
import { n as $$AppShell, t as $$MainLayout } from "./MainLayout_Def_zGQE.mjs";
import { t as $$Card } from "./Card_DaQiRCc4.mjs";
import { t as $$TextInput } from "./TextInput_DodD2kb2.mjs";
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Inicio | Generador de eBooks IA" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", $$AppShell, { "active": "inicio" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="start-grid">${renderComponent($$result, "Card", $$Card, { "class": "start-panel" }, { "default": ($$result) => renderTemplate`<p class="eyebrow">Nuevo proyecto</p><h2>Generador de eBooks</h2><p class="muted">Ingresa un tema, configura la estructura y genera un eBook exportable.</p><form class="start-form" id="start-form" novalidate>${renderComponent($$result, "TextInput", $$TextInput, {
		"id": "topic-start",
		"label": "Tema del eBook",
		"placeholder": "Ejemplo: Marketing digital para principiantes",
		"maxlength": "160",
		"required": true
	})}<div id="topic-error" class="error-box is-hidden"></div><button class="button button-primary" type="submit">Comenzar</button></form>` })}${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`<p class="eyebrow">Accesos</p><h2>Continuar trabajo</h2><p class="muted">Revisa ebooks generados anteriormente o confirma el estado de conexión del backend.</p><div class="quick-links"><a class="button button-secondary" href="/ebooks">Mis eBooks</a><a class="button button-secondary" href="/settings">Configuración</a></div>` })}</section>` })}` })}${renderScript($$result, "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/index.astro", void 0);
var $$file = "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
