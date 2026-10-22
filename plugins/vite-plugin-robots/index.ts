import { Plugin } from "vite";
import path from "path";
import fs from "fs";

interface RobotsPluginOptions {
	host: string;
	sitemap: string;
}

export function robotsPlugin(options: RobotsPluginOptions): Plugin {
	let config: any; // To store the resolved config

	return {
		name: "vite-plugin-robots",
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		async writeBundle() {
			const robotsTxtContent = `Sitemap: ${options.sitemap}\n\nUser-agent: *\nDisallow: /assets/*.jpg\n\nUser-agent: *\nDisallow: /assets/*.webp\n`;
			const outDir = config.build.outDir;
			const robotsFilePath = path.resolve(outDir, "robots.txt");

			if (!fs.existsSync(outDir)) {
				fs.mkdirSync(outDir, { recursive: true });
			}

			fs.writeFileSync(robotsFilePath, robotsTxtContent);
			this.info(`generated robots.txt`);
		},
	};
}
