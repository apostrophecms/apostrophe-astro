import { vitePluginApostropheDoctype } from './vite/vite-plugin-apostrophe-doctype.js';
import { vitePluginApostropheConfig } from './vite/vite-plugin-apostrophe-config.js';
import AposSectionTemplateLibraryPreview from './components/templates/AposSectionTemplateLibraryPreview.astro';

const proxy = '@apostrophecms/apostrophe-astro/endpoints/aposProxy.js';
const proxyWithExternalFront = '@apostrophecms/apostrophe-astro/endpoints/aposProxyWithExternalFrontend.js';

export default function apostropheIntegration(options) {
  return {
    name: 'apostrophe-integration',
    hooks: {
      "astro:config:setup": ({ injectRoute, updateConfig, injectScript }) => {
        if (!options.widgetsMapping || !options.templatesMapping) {
          throw new Error('Missing required options')
        }
        // options.templatesMapping['@apostrophecms-pro/section-template-library:preview'] ||= AposSectionTemplateLibraryPreview;
        updateConfig({
          vite: {
            plugins: [
              vitePluginApostropheDoctype(
                options.widgetsMapping,
                options.templatesMapping
              ),
              vitePluginApostropheConfig(
                options.aposHost,
                options.forwardHeaders,
                options.viewTransitionWorkaround,
                options.includeResponseHeaders,
                options.excludeRequestHeaders
              ),
            ],
          },
        });
        const inject = [
          '/apos-frontend/[...slug]',
          {
            pattern: '/api/v1/@apostrophecms-pro/section-template-library/[id]/preview',
            entrypoint: proxyWithExternalFront
          },
          '/api/v1/[...slug]',
          '/[locale]/api/v1/[...slug]',
          '/login',
          '/[locale]/login',
          '/uploads/[...slug]',
          ...(options.proxyRoutes || []),
          {
            pattern: '/[locale]/api/v1/@apostrophecms/area/render-widget',
            entrypoint: '@apostrophecms/apostrophe-astro/endpoints/renderWidget.astro'
          },
          {
            pattern: '/api/v1/@apostrophecms/area/render-widget',
            entrypoint: '@apostrophecms/apostrophe-astro/endpoints/renderWidget.astro'
          }          
        ];
        for (let pattern of inject) {
          if ((typeof pattern) === 'object') {
            pattern = {
              ...pattern,
              // Automatic Astro 3 backwards compatibility
              entryPoint: pattern.entrypoint
            };
            injectRoute(pattern);
          } else {
            // duplication of entrypoint needed for Astro 3.x support per
            // https://docs.astro.build/en/guides/upgrade-to/v4/#renamed-entrypoint-integrations-api
            injectRoute({
              pattern,
              entryPoint: proxy,
              entrypoint: proxy
            });
          }
        }
      }
    }
  };
};

