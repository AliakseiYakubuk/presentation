import path from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { inlineAssetsPlugin } from "./plugins/vite-plugin-inline-assets";
import { robotsPlugin } from "./plugins/vite-plugin-robots";
import { sitemapPlugin } from "./plugins/vite-plugin-sitemap";

export default defineConfig({
	server: {
		open: "index.html",
		port: 4200,
	},
	root: "src",
	resolve: {
		alias: {
			src: path.resolve(process.cwd(), "src"),
		},
	},
	publicDir: "public",
	build: {
		target: "es2015",
		outDir: path.resolve(process.cwd(), "build"),
		sourcemap: false,
		rollupOptions: {
			output: {
				compact: true,
			},
		},
	},
	plugins: [
		createHtmlPlugin({ minify: true }),
		inlineAssetsPlugin(),
		robotsPlugin({
			host: process.env.VITE_DOMAIN as string,
			sitemap: `https://${process.env.VITE_DOMAIN}/sitemap.xml`,
		}),
		sitemapPlugin({
			host: process.env.VITE_DOMAIN as string,
		}),
		viteStaticCopy({
			targets: [{ src: "assets/og-image.jpg", dest: "assets" }],
			silent: true,
		}),
	],
});
