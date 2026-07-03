import { et as __exportAll } from "./errors_BiAoVKno.mjs";
import { C as createComponent, S as createAstro, _ as addAttribute, a as renderComponent, d as renderTemplate, h as maybeRenderHead, n as renderScript } from "./server_CQw33AXo.mjs";
import "./compiler_Bts11pUs.mjs";
import { n as $$AppShell, t as $$MainLayout } from "./MainLayout_Def_zGQE.mjs";
//#region src/components/EbookPreview.astro
createAstro("https://astro.build");
var $$EbookPreview = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EbookPreview;
	const { ebookId } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section class="preview-shell" id="preview-app"${addAttribute(ebookId, "data-ebook-id")}><aside class="preview-sidebar"><h2>Módulos</h2><div id="preview-modules" class="preview-modules"></div></aside><article class="preview-reader"><div class="preview-toolbar"><button class="button button-secondary" type="button" id="prev-page">Anterior</button><select id="page-select" aria-label="Selector de página"></select><button class="button button-secondary" type="button" id="next-page">Siguiente</button><label class="zoom-control" for="zoom-control">Zoom<input id="zoom-control" type="range" min="85" max="125" value="100"></label><a class="button button-secondary" href="/create">Volver a editar</a><a class="button button-secondary" id="download-pdf" href="#">Descargar PDF</a><a class="button button-secondary" id="download-epub" href="#">Descargar EPUB</a></div><div class="reader-page" id="reader-page"></div></article></section>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/EbookPreview.astro", void 0);
//#endregion
//#region src/pages/ebooks/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Vista previa | Generador de eBooks IA" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", $$AppShell, { "active": "ebooks" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "EbookPreview", $$EbookPreview, { "ebookId": id })}` })}` })}${renderScript($$result, "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/ebooks/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/ebooks/[id].astro", void 0);
var $$file = "C:/Benja/Instituto/ebook-generathor/frontend/src/pages/ebooks/[id].astro";
var $$url = "/ebooks/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/ebooks/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
