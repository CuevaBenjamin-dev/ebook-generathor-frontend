import { C as createComponent, S as createAstro, _ as addAttribute, c as renderSlot, d as renderTemplate, h as maybeRenderHead } from "./server_CQw33AXo.mjs";
import "./compiler_Bts11pUs.mjs";
//#region src/components/Card.astro
createAstro("https://astro.build");
var $$Card = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Card;
	const { class: className = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section${addAttribute(`card ${className}`, "class")}>${renderSlot($$result, $$slots["default"])}</section>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/Card.astro", void 0);
//#endregion
export { $$Card as t };
