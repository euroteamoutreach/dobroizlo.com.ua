import Alpine from "alpinejs";

// Bundled via Hugo's js.Build (esbuild resolves the import from node_modules):
// self-hosted, fingerprinted, and SRI-verified rather than pulled from a CDN.
// Exposing window.Alpine is Alpine's documented ESM setup.
window.Alpine = Alpine;
Alpine.start();
