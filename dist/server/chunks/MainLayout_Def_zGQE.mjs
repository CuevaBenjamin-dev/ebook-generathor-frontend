import { C as createComponent, S as createAstro, _ as addAttribute, a as renderComponent, c as renderSlot, d as renderTemplate, g as renderHead, h as maybeRenderHead } from "./server_CQw33AXo.mjs";
import "./compiler_Bts11pUs.mjs";
//#region src/components/Header.astro
var $$Header = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<header class="topbar"><div><p class="eyebrow">Aplicación local</p><h1>Generador de eBooks IA</h1></div><a class="button button-secondary" href="/ebooks">Mis eBooks</a></header>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/Header.astro", void 0);
//#endregion
//#region src/components/Sidebar.astro
createAstro("https://astro.build");
var $$Sidebar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Sidebar;
	const { active = "inicio" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<aside class="sidebar"><a class="brand" href="/" aria-label="Generador de eBooks"><span class="brand-mark">G</span><span>Generador de eBooks</span></a><nav class="sidebar-nav" aria-label="Navegación principal">${[
		{
			id: "inicio",
			href: "/",
			label: "Inicio"
		},
		{
			id: "ebooks",
			href: "/ebooks",
			label: "Mis eBooks"
		},
		{
			id: "settings",
			href: "/settings",
			label: "Configuración"
		}
	].map((link) => renderTemplate`<a${addAttribute(["nav-link", active === link.id && "is-active"], "class:list")}${addAttribute(link.href, "href")}>${link.label}</a>`)}</nav></aside>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/Sidebar.astro", void 0);
//#endregion
//#region src/components/AppShell.astro
createAstro("https://astro.build");
var $$AppShell = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AppShell;
	const { active = "inicio" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="app-shell">${renderComponent($$result, "Sidebar", $$Sidebar, { "active": active })}<div class="app-main">${renderComponent($$result, "Header", $$Header, {})}<main class="content">${renderSlot($$result, $$slots["default"])}</main></div></div>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/AppShell.astro", void 0);
//#endregion
//#region src/layouts/MainLayout.astro
createAstro("https://astro.build");
var $$MainLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$MainLayout;
	const { title = "Generador de eBooks IA" } = Astro.props;
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" href="/favicon.svg"><title>${title}</title>${renderHead($$result)}</head><body>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/layouts/MainLayout.astro", void 0);
//#endregion
export { $$AppShell as n, $$MainLayout as t };
