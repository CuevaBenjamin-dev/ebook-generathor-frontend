import { C as createComponent, S as createAstro, _ as addAttribute, d as renderTemplate, h as maybeRenderHead } from "./server_CQw33AXo.mjs";
import "./compiler_Bts11pUs.mjs";
//#region src/components/TextInput.astro
createAstro("https://astro.build");
var $$TextInput = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TextInput;
	const { id, label, placeholder = "", value = "", maxlength, required = false } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<label class="field"${addAttribute(id, "for")}><span>${label}</span><input${addAttribute(id, "id")} type="text"${addAttribute(placeholder, "placeholder")}${addAttribute(value, "value")}${addAttribute(maxlength, "maxlength")}${addAttribute(required, "required")}></label>`;
}, "C:/Benja/Instituto/ebook-generathor/frontend/src/components/TextInput.astro", void 0);
//#endregion
export { $$TextInput as t };
