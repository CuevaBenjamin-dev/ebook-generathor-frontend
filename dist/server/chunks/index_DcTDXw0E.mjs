import { et as __exportAll } from "./errors_BiAoVKno.mjs";
import { C as createComponent, S as createAstro, a as renderComponent, d as renderTemplate, h as maybeRenderHead, n as renderScript } from "./server_CQw33AXo.mjs";
import "./compiler_Bts11pUs.mjs";
import { n as $$AppShell, t as $$MainLayout } from "./MainLayout_Def_zGQE.mjs";
import { t as $$Card } from "./Card_DaQiRCc4.mjs";
//#region src/components/EmptyState.astro
createAstro("https://astro.build");
var $$EmptyState = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EmptyState;
	const { title = "Sin resultados", text = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="empty-state"><strong>${title}</strong>${text && renderTemplate`<p>${text}</p>`}</div>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/EmptyState.astro", void 0);
//#endregion
//#region src/pages/ebooks/index.astro
var ebooks_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Mis eBooks | Generador de eBooks IA" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", $$AppShell, { "active": "ebooks" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="module-toolbar"><div><p class="eyebrow">Biblioteca local</p><h2>Mis eBooks</h2></div><a class="button button-primary" href="/">Crear eBook</a></div><div id="ebooks-error" class="error-box is-hidden"></div><div id="ebooks-empty">${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": "Aún no hay eBooks",
		"text": "Crea tu primer ebook desde la pantalla de inicio."
	})}</div><div id="ebooks-table-wrap" class="is-hidden"><table class="ebook-table"><thead><tr><th>Tema</th><th>Estado</th><th>Páginas</th><th>Módulos</th><th>Creado</th><th>Acciones</th></tr></thead><tbody id="ebooks-table"></tbody></table></div>` })}` })}` })}${renderScript($$result, "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/ebooks/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/ebooks/index.astro", void 0);
var $$file = "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/ebooks/index.astro";
var $$url = "/ebooks";
//#endregion
//#region \0virtual:astro:page:src/pages/ebooks/index@_@astro
var page = () => ebooks_exports;
//#endregion
export { page };
