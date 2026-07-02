import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";

import { NysCard } from "./NysCard";

async function settle(host: Element) {
  // Wait for the Lit element to finish its update cycle (incl. slotchange state).
  await customElements.whenDefined("nys-card");
  await (host as HTMLElement & { updateComplete?: Promise<unknown> }).updateComplete;
  await (host as HTMLElement & { updateComplete?: Promise<unknown> }).updateComplete;
}

describe("nys-card", () => {
  it("renders the heading at the requested level", async () => {
    const { container } = render(
      <NysCard heading="Data Privacy" headingLevel={2} description="Body copy." />,
    );
    const host = container.querySelector("nys-card")!;
    await settle(host);

    const heading = host.shadowRoot?.querySelector(".card__heading");
    expect(heading?.tagName).toBe("H2");
    expect(heading?.textContent).toContain("Data Privacy");
  });

  it("defaults to an h3 heading", async () => {
    const { container } = render(<NysCard heading="Webex" />);
    const host = container.querySelector("nys-card")!;
    await settle(host);
    expect(host.shadowRoot?.querySelector(".card__heading")?.tagName).toBe("H3");
  });

  it("projects media, accent, and footer slots", async () => {
    const { container } = render(
      <NysCard heading="Card" variant="elevated">
        <img slot="media" src="/x.jpg" alt="Preview" />
        <span slot="accent">~2 min</span>
        <a slot="footer" href="/read">
          Read article
        </a>
        <p>Default slot content</p>
      </NysCard>,
    );
    const host = container.querySelector("nys-card")!;
    await settle(host);

    expect(host.querySelector('[slot="media"]')).not.toBeNull();
    expect(host.querySelector('[slot="accent"]')).not.toBeNull();
    expect(host.querySelector('[slot="footer"]')).not.toBeNull();
    expect(host.getAttribute("variant")).toBe("elevated");
  });

  it("has no serious/critical a11y violations", async () => {
    const { container } = render(
      <NysCard heading="Accessible card" headingLevel={2} description="Copy.">
        <img slot="media" src="/x.jpg" alt="Preview" />
        <a slot="footer" href="/read">
          Read article
        </a>
      </NysCard>,
    );
    const host = container.querySelector("nys-card")!;
    await settle(host);

    const results = await axe.run(container, {
      resultTypes: ["violations"],
      rules: { "color-contrast": { enabled: false } },
    });
    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    if (blocking.length > 0) {
      throw new Error(blocking.map((v) => `${v.id}: ${v.help}`).join("\n"));
    }
    expect(blocking).toHaveLength(0);
  });
});
