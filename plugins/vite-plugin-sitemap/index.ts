import { Plugin } from "vite";
import path from "path";
import fs from "fs";

interface RobotsPluginOptions {
	host: string;
}

export function sitemapPlugin(options: RobotsPluginOptions): Plugin {
	let config: any; // To store the resolved config

	return {
		name: "vite-plugin-robots",
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		async writeBundle() {
			const robotsTxtContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>https://${options.host}/</loc>
		<lastmod>${new Date().toISOString().split("T").shift()}</lastmod>
	</url>
</urlset>
			`;
			const outDir = config.build.outDir;
			const robotsFilePath = path.resolve(outDir, "sitemap.xml");

			if (!fs.existsSync(outDir)) {
				fs.mkdirSync(outDir, { recursive: true });
			}

			fs.writeFileSync(robotsFilePath, robotsTxtContent);
			this.info(`generated sitemap.xml`);
		},
	};
}
