import { vitePluginApostropheDoctype } from './vite/vite-plugin-apostrophe-doctype.js';
import { vitePluginApostropheConfig } from './vite/vite-plugin-apostrophe-config.js';

export default function apostropheIntegration(options) {
  console.log('integrating');
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
        // duplication of entrypoint needed for Astro 3.x support per
        // https://docs.astro.build/en/guides/upgrade-to/v4/#renamed-entrypoint-integrations-api
        injectRoute({
          pattern: '/apos-frontend/[...slug]',
<<<<<<< HEAD
          entryPoint: '@apostrophecms/apostrophe-astro/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/api/v1/[...slug]',
          entryPoint: '@apostrophecms/apostrophe-astro/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/[locale]/api/v1/[...slug]',
          entryPoint: '@apostrophecms/apostrophe-astro/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/api/v1/@apostrophecms/area/render-widget',
          entryPoint: '@apostrophecms/apostrophe-astro/endpoints/renderWidget.astro'
        });
        injectRoute({
          pattern: '/[locale]/api/v1/@apostrophecms/area/render-widget',
          entryPoint: '@apostrophecms/apostrophe-astro/endpoints/renderWidget.astro'
        });
        injectRoute({
          pattern: '/login',
          entryPoint: '@apostrophecms/apostrophe-astro/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/[locale]/login',
          entryPoint: '@apostrophecms/apostrophe-astro/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/uploads/[...slug]',
          entryPoint: '@apostrophecms/apostrophe-astro/endpoints/aposProxy.js'
=======
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js',
          entrypoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/api/v1/[...slug]',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js',
          entrypoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/[locale]/api/v1/[...slug]',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js',
          entrypoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/api/v1/@apostrophecms/area/render-widget',
          entryPoint: '@apostrophecms/astro-integration/endpoints/renderWidget.astro',
          entrypoint: '@apostrophecms/astro-integration/endpoints/renderWidget.astro'
        });
        injectRoute({
          pattern: '/[locale]/api/v1/@apostrophecms/area/render-widget',
          entryPoint: '@apostrophecms/astro-integration/endpoints/renderWidget.astro',
          entrypoint: '@apostrophecms/astro-integration/endpoints/renderWidget.astro'
        });
        injectRoute({
          pattern: '/login',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js',
          entrypoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/[locale]/login',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js',
          entrypoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
        });
        injectRoute({
          pattern: '/uploads/[...slug]',
          entryPoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js',
          entrypoint: '@apostrophecms/astro-integration/endpoints/aposProxy.js'
>>>>>>> main
        });
        (options.proxyRoutes || []).forEach(route => injectRoute({
          pattern: route,
          entrypoint: '@apostrophecms/apostrophe-astro/endpoints/aposProxy.js',
          entryPoint: '@apostrophecms/apostrophe-astro/endpoints/aposProxy.js'
        }));
      }
    }
  };
};

