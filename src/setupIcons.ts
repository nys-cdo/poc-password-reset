// `nys-icon` resolves each SVG relative to its own script `src` / `import.meta.url`
// (falling back to `document.baseURI`). Vite bundling breaks that resolution, so
// icons silently 404. We point the library's shared icon registry at the SVGs we
// serve from `public/icons`. This uses the same `window.__nysIconRegistry` that
// the package's `registerIconLibrary` writes to — avoiding an import from the
// package root (PRD hard rule: wrappers come from `@nysds/components/react` only).

interface IconRegistryEntry {
  resolver: (name?: string) => string | undefined;
}

declare global {
  interface Window {
    __nysIconRegistry?: Map<string, IconRegistryEntry>;
  }
}

export function setupIcons() {
  const base = import.meta.env.BASE_URL;
  window.__nysIconRegistry?.set("default", {
    resolver: (name) => (name ? `${base}icons/${name}.svg` : undefined),
  });
}
