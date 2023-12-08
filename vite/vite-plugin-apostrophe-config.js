export function vitePluginApostropheConfig(aposHost, forwardHeaders) {

  const virtualModuleId = "virtual:apostrophe-config";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

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
          export default { aposHost: "${aposHost}" ${forwardHeaders ? `, forwardHeaders: ${JSON.stringify(forwardHeaders)}` : ''} }`
      }
    },
  };
};
