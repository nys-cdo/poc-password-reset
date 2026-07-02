/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// `base` is the repo name only for the production build (GitHub Pages serves the
// site from https://nys-cdo.github.io/poc-password-reset/). Dev and tests use "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/poc-password-reset/" : "/",
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
}));
