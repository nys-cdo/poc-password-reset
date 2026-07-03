/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// `base` is the repo name for the production build AND `vite preview` (both mirror
// GitHub Pages at https://nys-cdo.github.io/poc-password-reset/). Dev (`vite`) and
// tests stay at "/". `vite preview` resolves config with command="serve", so it
// needs the explicit `isPreview` check — otherwise it can't serve the build's
// /poc-password-reset/ assets and the ES module 404s to the SPA fallback.
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/poc-password-reset/" : "/",
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
}));
