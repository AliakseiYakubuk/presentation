import path from 'path';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  server: {
    open: 'index.html',
    port: 4200
  },
  root: "src",
  resolve: {
    alias: {
      "src": path.resolve(process.cwd(), "src"),
    }
  },
  build: {
    outDir: path.resolve(process.cwd(), "build"),
    sourcemap: false,
    rollupOptions: {
      output: {
        compact: true,
      },
    },
  },
  plugins: [
    createHtmlPlugin({
      inject: { data: {} },
      minify: true,
    })
  ]
});
