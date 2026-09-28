/* eslint-disable import/no-extraneous-dependencies */
import { HtmlTagDescriptor, Plugin, IndexHtmlTransformHook } from "vite";
import { schema } from "../../src/schema";

type OutputBundle = NonNullable<
	Parameters<IndexHtmlTransformHook>[1]["bundle"]
>;
type OutputChunk = Extract<OutputBundle[string], { type: "chunk" }>;
type OutputAsset = Extract<OutputBundle[string], { type: "asset" }>;

const removeScriptTag = (html: string, filename: string) => {
	const regexp = new RegExp(
		`<script([^>]*?) src="[./]*${filename}"([^>]*?)></script>`,
	);
	return html.replace(regexp, "");
};

const removeLinkTag = (html: string, filename: string) => {
	const regexp = new RegExp(`<link([^>]*?) href="[./]*${filename}"([^>]*?)>`);
	return html.replace(regexp, "");
};

export const inlineAssetsPlugin = (): Plugin => ({
	name: "inline-assets",
	apply: "build",
	enforce: "post",
	transformIndexHtml: async (input, context) => {
		let html = input;
		const tags: HtmlTagDescriptor[] = [];
		const bundle = context.bundle || {};
		const values = Object.values(bundle);

		const css = values.find(
			(item): item is OutputAsset =>
				item.name === "index.css" && item.type === "asset",
		);

		const js = values.find(
			(item): item is OutputChunk =>
				item.name === "index" && item.type === "chunk",
		);

		if (css) {
			html = removeLinkTag(html, css.fileName);
			tags.push({
				tag: "style",
				injectTo: "head",
				children: css.source as string,
				attrs: { type: "text/css" },
			});

			delete bundle[css.fileName];
		}

		if (js) {
			html = removeScriptTag(html, js.fileName);
			tags.push({
				tag: "script",
				injectTo: "body",
				children: js.code as string,
				attrs: { type: "module" },
			});

			delete bundle[js.fileName];
		}

		if (schema) {
			tags.push({
				tag: "script",
				injectTo: "head",
				children: schema,
				attrs: { type: "application/ld+json" },
			});
		}

		return { html, tags };
	},
});
