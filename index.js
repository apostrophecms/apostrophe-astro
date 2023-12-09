import { vitePluginApostropheDoctype } from './vite/vite-plugin-apostrophe-doctype.js';
import { vitePluginApostropheConfig } from './vite/vite-plugin-apostrophe-config.js';

export default function apostropheIntegration(options) {
  return {
    name: 'apostrophe-integration',
    hooks: {
      "astro:config:setup": ({ injectRoute, updateConfig, injectScript }) => {
        if (!options.widgetsMapping || !options.templatesMapping) {
          throw new Error('Missing required options')
        }
        updateConfig({
          vite: {
            plugins: [
            vitePluginApostropheDoctype(
              options.widgetsMapping,
              options.templatesMapping
            ),
            vitePluginApostropheConfig(
              options.aposHost,
              options.forwardHeaders
            ),
            ],
          },
        });
        
        injectRoute({
          pattern: '/apos-frontend/[...slug]',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/api/v1/[...slug]',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/[locale]/api/v1/[...slug]',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/api/v1/@apostrophecms/area/render-widget',
          entryPoint: '@apostrophecms/astro-integration/endpoints/renderWidget.astro'
        });
        injectRoute({
          pattern: '/[locale]/api/v1/@apostrophecms/area/render-widget',
          entryPoint: '@apostrophecms/astro-integration/endpoints/renderWidget.astro'
        });
        injectRoute({
          pattern: '/login',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/[locale]/login',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/uploads/[...slug]',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
      }
    }
  };
};

