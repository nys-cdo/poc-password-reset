import { describe, expect, it } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import axe from "axe-core";

import { routes } from "../routes";
import "../i18n";

// Every Phase 1 route, in both locales, must render on NYSDS chrome and pass axe.
const PATHS = [
  "/en",
  "/en/faq",
  "/en/resident/knowledge",
  "/en/resident/knowledge/protecting-your-data-privacy",
  "/en/resident/knowledge/does-not-exist",
  "/en/accessibility",
  "/en/resident/password-reset/forgot",
  "/en/privacy",
  "/en/resident/a/tickets",
  "/en/does-not-exist",
  "/es",
  "/es/privacy",
];

async function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const result = render(<RouterProvider router={router} />);
  // Wait until the page <h1> is present so chrome + route have mounted.
  await waitFor(() => {
    expect(result.container.querySelector("h1")).not.toBeNull();
  });
  return result;
}

describe("route accessibility (axe-core)", () => {
  it.each(PATHS)("has no serious/critical a11y violations: %s", async (path) => {
    const { container } = await renderRoute(path);

    const results = await axe.run(container, {
      resultTypes: ["violations"],
      // color-contrast needs real layout/canvas (unavailable in jsdom);
      // contrast is verified via DS tokens + Lighthouse in the hardening phase.
      rules: { "color-contrast": { enabled: false } },
    });

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    if (blocking.length > 0) {
      const summary = blocking
        .map((v) => `${v.id} (${v.impact}): ${v.help}`)
        .join("\n");
      throw new Error(`axe violations on ${path}:\n${summary}`);
    }

    expect(blocking).toHaveLength(0);
  });

  it("renders one <h1> per route", async () => {
    for (const path of PATHS) {
      const { container } = await renderRoute(path);
      expect(container.querySelectorAll("h1")).toHaveLength(1);
    }
  });

  it("exposes a main landmark with the skipnav target id", async () => {
    const { container } = await renderRoute("/en");
    const main = container.querySelector("main#main-content");
    expect(main).not.toBeNull();
  });
});
