import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// NYSDS web components rely on browser APIs jsdom does not implement.
// Stub them so components mount without throwing during a11y tests.

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

vi.stubGlobal("ResizeObserver", MockObserver);
vi.stubGlobal("IntersectionObserver", MockObserver);

if (!window.scrollTo) {
  window.scrollTo = vi.fn();
}

// jsdom's ElementInternals is incomplete and its ARIA-reflection setters throw.
// Return a self-contained mock so NYSDS form-associated components
// (nys-textinput, etc.) mount and update without throwing.
HTMLElement.prototype.attachInternals = function attachInternalsMock(this: HTMLElement) {
  const internals: Record<string, unknown> = {
    setFormValue: () => {},
    setValidity: () => {},
    checkValidity: () => true,
    reportValidity: () => true,
    form: null,
    labels: [] as unknown,
    validity: {},
    validationMessage: "",
    willValidate: true,
    states: new Set<string>(),
    shadowRoot: this.shadowRoot,
  };
  return internals as unknown as ElementInternals;
};

afterEach(() => {
  cleanup();
});
