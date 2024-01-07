import path from 'path';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { inlineAssetsPlugin } from './plugins/vite-plugin-inline-assets';

export default defineConfig({
  server: {
    open: 'index.html',
    port: 4200
  },
  root: 'src',
  resolve: {
    alias: {
      "src": path.resolve(process.cwd(), "src"),
    }
  },
  publicDir: 'public',
  build: {
    target: 'es2015',
    outDir: path.resolve(process.cwd(), "build"),
    sourcemap: false,
    rollupOptions: {
      output: {
        compact: true,
      },
    },
  },
  plugins: [
    createHtmlPlugin({ minify: true, }),
    inlineAssetsPlugin(),
    viteStaticCopy({
      targets: [{ src: 'assets/og-image.jpg', dest: 'assets' }],
      silent: true,
    })
  ],
})
