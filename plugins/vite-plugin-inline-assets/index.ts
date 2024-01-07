/* eslint-disable import/no-extraneous-dependencies */
import { HtmlTagDescriptor, Plugin } from 'vite';

const removeScriptTag = (html: string, filename: string) => {
  const regexp = new RegExp(`<script([^>]*?) src="[./]*${filename}"([^>]*?)></script>`);
  return html.replace(regexp, '');
};

const removeLinkTag = (html: string, filename: string) => {
  const regexp = new RegExp(`<link([^>]*?) href="[./]*${filename}"([^>]*?)>`);
  return html.replace(regexp, '');
};

export const inlineAssetsPlugin = (): Plugin => ({
  name: 'inline-assets',
  apply: 'build',
  enforce: 'post',
  transformIndexHtml: (input, context) => {
    let html = input;
    const tags: HtmlTagDescriptor[] = [];
    const bundle = context.bundle || {};
    const css = Object.values(bundle).find((item) => item.name === 'index.css');
    const js = Object.values(bundle).find((item) => item.name === 'index');

    if (css?.type === 'asset') {
      html = removeLinkTag(html, css.fileName);
      tags.push({
        tag: 'style',
        injectTo: 'head',
        children: css.source as string,
        attrs: { type: 'text/css' },
      });

      delete bundle[css.fileName];
    }

    if (js?.type === 'chunk') {
      html = removeScriptTag(html, js.fileName);
      tags.push({
        tag: 'script',
        injectTo: 'body',
        children: js.code as string,
        attrs: { type: 'module' },
      });

      delete bundle[js.fileName];
    }

    return { html, tags };
  },
});
