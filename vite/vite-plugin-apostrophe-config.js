export function vitePluginApostropheConfig(
  aposHost,
  forwardHeaders = null,
  viewTransitionWorkaround,
  includeResponseHeaders = null
) {
  const virtualModuleId = "virtual:apostrophe-config";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  // Use includeResponseHeaders if provided, fallback to forwardHeaders for BC
  const headersToInclude = includeResponseHeaders || forwardHeaders;

  return {
    name: "vite-plugin-apostrophe-config",
    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
          export default {
            aposHost: "${aposHost}"
            ${headersToInclude ? `,
              includeResponseHeaders: ${JSON.stringify(headersToInclude)}` : ''
            }
            ${viewTransitionWorkaround ? `,
              viewTransitionWorkaround: true` : ''
            }
          }`
        ;
      }
    },
  };
};