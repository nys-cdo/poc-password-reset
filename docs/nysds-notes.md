# NYSDS integration notes (v1.19.2) — issues & workarounds

Findings from the GovArc Support POC (Vite + React 18 + TS). See also
`nysds-bug-unavheader-languages-react.md` for the `NysUnavHeader` wrapper bugs.

## 1. `nys-globalheader` active-link over-highlights on locale-prefixed SPAs

**Severity:** Medium (incorrect active state; not a crash).

`_highlightActiveLink` uses **longest-prefix matching** against `window.location.pathname`:

```js
i === "/" && s === "/" ? {length:1} : s.startsWith(i) && i.length > o.length && {…}
```

The only exact-match exemption is the literal root `/`. A "Home" nav link whose href is
the locale root (`/en`) is therefore a **prefix of every page** (`/en/privacy`,
`/en/accessibility`, …). On any page without a more-specific nav item, Home is marked
active. PRD §8.2 anticipated this ("matcher must ignore the `/en|/es` locale prefix"),
but the shipped matcher does not.

**Suggested fix (upstream):** treat a nav href as active only on exact pathname match
(optionally plus descendant match for explicitly-hierarchical items), or expose a
`match="exact|prefix"` opt-in per link, or strip a configurable locale prefix before
comparing. **Workaround options for consumers:** omit Home from the nav, or don't rely on
auto-highlight. Left as-is in this POC pending upstream guidance.

## 2. `nys-icon` SVG base path breaks under bundlers

**Severity:** High for bundled apps (icons silently render nothing).

`nys-icon` resolves each SVG from `./icons/` relative to its own script `src` /
`import.meta.url`, falling back to `document.baseURI`. Under Vite/webpack the module URL
is not the package `dist/` folder, so every icon 404s silently (no error, empty render).

**Workaround (used here):** copy `@nysds/components/dist/icons/*.svg` into `public/icons/`
and point the shared icon registry at them before first render:

```ts
// setupIcons.ts — uses the same window.__nysIconRegistry that registerIconLibrary writes
window.__nysIconRegistry?.set("default", {
  resolver: (name) => (name ? `${import.meta.env.BASE_URL}icons/${name}.svg` : undefined),
});
```

The package also exports `registerIconLibrary("default", { resolver })` from its root, but
that root import is disallowed by our PRD (wrappers only from `@nysds/components/react`),
so we write the registry directly. **Suggested fix (upstream):** support a documented,
bundler-friendly base-path config exported from `/react`, and emit a console warning when
an icon fails to resolve.

Note: only ~82 curated icons ship; several common Material Symbols names
(`lock_reset`, `confirmation_number`, `keyboard`, `translate`, …) are absent.

## 3. `nys-radiobutton` slotted `description` doesn't render (tile mode)

The `description` **slot** content did not render inside the tile in our tests, though the
`description` **prop** renders reliably. We used the prop (with the estimate appended
inline) instead of slotting a `nys-badge`. Worth confirming whether the nested
`nys-label` description slot is wired for the radiobutton.

## 4. `nys-breadcrumbs` — undocumented input contract + missing item element

**Severity:** Medium (breadcrumb silently renders nothing if used the "obvious" way).

Two gotchas discovered wiring the article breadcrumb:

1. **`nys-breadcrumbitem` is never registered.** The bundle calls
   `customElements.define("nys-breadcrumbs")` only — there is no
   `define("nys-breadcrumbitem")`. A `NysBreadcrumbItem` React wrapper file ships but
   is **not re-exported** from `@nysds/components/react` (and the exports map blocks deep
   imports), so it's unreachable. Rendering `<nys-breadcrumbitem label=… link=…>` does
   nothing.
2. **The real input is a slotted `<ol>` of plain `<li>`.** `nys-breadcrumbs` calls
   `assignedElements().find(el => el.tagName === "OL")`, then reads that OL's `<li>`
   children — pulling each `<li>`'s inner `<a href>` (href + text) and rebuilding the
   trail in its shadow DOM, treating an `<li>` with no anchor as the current page.

   Working usage:
   ```jsx
   <NysBreadcrumbs ariaLabel="…">
     <ol>
       <li><a href="/en">Home</a></li>
       <li><a href="/en/resident/knowledge">Knowledge Base</a></li>
       <li>Current Page</li>
     </ol>
   </NysBreadcrumbs>
   ```

**Suggested fixes (upstream):** register/export `nys-breadcrumbitem` (or drop it from the
API and docs), and clearly document the `<ol><li>` slot contract. Also: on a dark band the
breadcrumb has no `inverted` prop — override the color tokens on an ancestor
(`--nys-color-link`, `--nys-color-text`, `--nys-color-text-weak`, `--nys-color-ink`), which
inherit into the shadow DOM.

## 5. Packaging/integration (see also the bug ticket)

- `@nysds/components` imports `lit` but doesn't declare it as a dependency — consumers
  must `npm i lit`.
- Stylesheet specifier is `@nysds/styles/full` (exports map blocks the deep
  `dist/nysds-full.min.css` path named in some docs).

## 6. `nys-step` active step is focusable *and* `aria-hidden` (WCAG 4.1.2)

**Severity:** High (confirmed axe violation `aria-hidden-focus`, serious).

On the active/`current` step, the component renders the step control as:

```html
<div class="nys-step__label" role="button" aria-hidden="true" tabindex="0" aria-label="… Step">
```

`tabindex="0"` + `role="button"` makes it keyboard-focusable, while `aria-hidden="true"`
removes it from the accessibility tree. A keyboard user can Tab to it, but screen readers
announce nothing — the exact anti-pattern SC 4.1.2 / axe `aria-hidden-focus` flags. Inactive
steps use `tabindex="-1"` (not focusable), so only the current step trips it.

Found via real-browser axe on the password-recovery stepper. Our usage is minimal and
correct (`<NysStep label current selected onNysStepClick>`, no slotted content) — the
contradictory attributes are generated inside the component's shadow DOM.

**Suggested fix (upstream):** don't put `aria-hidden="true"` on a focusable element. Either
drop `aria-hidden` from the interactive step control, or make it truly inert
(`tabindex="-1"` + `aria-hidden`) when it should not be reachable. Step-number contrast is
fine (9.41:1 current, 17.22:1 pending) — the issue is attributes only.

## 7. Chrome components hardcode English labels — no i18n hook

**Severity:** Medium (blocks full localization on non-English pages).

- `nys-skipnav` renders "Skip to main content" with only `id`/`href` props — **no label
  slot or prop**. On a `<html lang="es">` page it still shows English.
- `nys-backtotop` similarly hardcodes "Back to top" (props: `position`, `visible` only).

For a bilingual (EN/ES) site this leaves the skip link and back-to-top button untranslated.
We defined a `common.skipToMain` string expecting to pass it, but there is nowhere to. (Key
left in place pending upstream; see also the app-side note in PROGRESS.)

**Suggested fix (upstream):** expose a `label` prop (and/or a default slot) on both
components so consumers can localize the visible/accessible text.

## 8. `nys-textarea` placeholder contrast below 4.5:1

**Severity:** Low–Medium (WCAG 1.4.3 for placeholder text).

The shadow-DOM placeholder color resolves to `rgb(121,124,127)` on white ≈ **4.20:1**, under
the 4.5:1 minimum for normal text. Entered text (17.22:1) and the border (3.09:1, meets the
3:1 UI-component minimum) are fine. Consumers can't fix this from light DOM — it's a token
choice inside the component. Seen on the article-feedback textarea.

**Suggested fix (upstream):** darken the placeholder token to ≥4.5:1.

## 9. Minor axe "needs-review" items inside shipped components

Real-browser axe (WCAG 2.2 AA) flags these as *incomplete* on every page; both live inside
NYSDS shadow DOM, not consumer code:

- **`nys-unavheader`** — `nys-button`s carry `aria-controls` (`#…know--inline`,
  `#…translate--desktop`); axe can't verify the attribute is allowed on the custom element
  (`aria-allowed-attr`).
- **`nys-alert`** — its container `<div class="nys-alert__container" aria-label="info alert">`
  triggers `aria-prohibited-attr` (`aria-label` on a `<div>` with no role). Consider a role
  or moving the label to a heading/`role="img"` pattern.
