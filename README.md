# NYS GovArc Support — NYSDS + React reference build

A React + TypeScript + Vite rebuild of the eight public **GovArc Support** pages on the
**New York State Design System (NYSDS)** — full **English and Spanish**, with **WCAG 2.2 AA**
as a build gate. It exists to show, concretely, how to build a real multi-page app **on top of
NYSDS in React** rather than re-implementing the look with a utility framework.

**Live demo:** https://nys-cdo.github.io/poc-password-reset/

> If you are picking this up to extend or reskin it: the single most important section below is
> [**Using NYSDS with React**](#using-nysds-with-react). NYSDS already ships the components,
> design tokens, and layout utilities you need. Reach for those first — don't rebuild them in
> Tailwind or hand-rolled CSS.

---

## Quick start

```bash
npm install        # `lit` is a required direct dependency — see gotchas
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # tsc -b && vite build  → dist/
npm run preview    # serve the production build locally
```

Quality gates (all must stay green):

```bash
npm run typecheck  # tsc -b --noEmit
npm run lint       # eslint (incl. jsx-a11y)
npm run lint:style # stylelint — bans raw hex/px/rem, enforces design-token use
npm test           # vitest: nys-card unit tests + axe-core over every route (EN/ES)
```

Routes are locale-prefixed (`/:lang`, `lang ∈ en|es`; anything else redirects to `/en`):
`/en` · `/en/faq` · `/en/resident/knowledge` · `/en/resident/knowledge/:slug` ·
`/en/accessibility` · `/en/privacy` · `/en/resident/password-reset/forgot` ·
`/en/resident/a/tickets`.

---

## Using NYSDS with React

NYSDS ships as **framework-agnostic Web Components** (built with [Lit](https://lit.dev/)) plus a
set of **React wrappers** (generated with [`@lit/react`](https://lit.dev/docs/frameworks/react/)).
You get real React components — typed props, `onNys*` event handlers, `ref` — that render the
NYSDS custom elements under the hood. You do **not** need Tailwind or a bespoke component library;
compose NYSDS components, design tokens, and layout utilities.

### 1. Install

```bash
npm i @nysds/components @nysds/styles lit
```

- **`@nysds/components`** — the components + the `@nysds/components/react` wrappers.
- **`@nysds/styles`** — the global stylesheet, design tokens, and utility classes.
- **`lit`** — ⚠️ **install it explicitly.** `@nysds/components` imports `lit` but does not declare
  it as a dependency, so a clean install without it fails.

### 2. Load the stylesheet once, at your entry point

```ts
// main.tsx
import "@nysds/styles/full";   // tokens + utilities + component styles
```

Use the `@nysds/styles/full` specifier — the package's `exports` map blocks the deep
`dist/nysds-full.min.css` path some docs reference. It's the same file.

### 3. Use the React wrappers

```tsx
import { NysButton, NysTextinput, NysAlert } from "@nysds/components/react";

<NysButton variant="filled" label="Continue" suffixIcon="arrow_forward" href="/next" />
<NysTextinput type="email" label="Email address" required onNysInput={onInput} />
```

Import wrappers only from `@nysds/components/react`. Prefer this over dropping raw
`<nys-*>` custom elements into JSX — the wrappers give you props/events/refs and typing.

### 4. Style with tokens and utilities — not Tailwind

This is the part vendors most often get wrong. NYSDS gives you:

- **Design tokens** as CSS custom properties: `var(--nys-color-theme)`, `var(--nys-space-400)`,
  `var(--nys-font-size-h2)`, `var(--nys-radius-md)`, … Use these for every themeable value.
  (This repo's stylelint config **bans raw hex / px / rem** to enforce it.)
- **Layout utilities:** a 12-column grid (`nys-grid-container`, `nys-grid-row`,
  `nys-grid-col-*`) and spacing utilities (`nys-margin-*`, `nys-padding-*`).
- **Component styling internals** via exposed `::part()` and per-component CSS custom
  properties (e.g. `--nys-button-background-color--hover`) — you can't reach into a component's
  shadow DOM any other way.

```tsx
// Mobile-first: col-12 base, widen at the `nys-desktop:` breakpoint.
<div className="nys-grid-row nys-grid-gap-400">
  <div className="nys-grid-col-12 nys-desktop:nys-grid-col-8">…</div>
  <div className="nys-grid-col-12 nys-desktop:nys-grid-col-4">…</div>
</div>
```

### 5. Gotchas we hit (and how we solved them)

Full write-ups live in [`docs/nysds-notes.md`](docs/nysds-notes.md) and
[`docs/nysds-bug-unavheader-languages-react.md`](docs/nysds-bug-unavheader-languages-react.md).
The short version:

| Area | Gotcha | Fix |
|------|--------|-----|
| **Object props** | Passing an object/array prop (e.g. `NysUnavHeader`'s `languages`) can serialize to an attribute → `null` → runtime crash. | Set complex props **imperatively** on the element via a `ref`, or rely on the component default. |
| **Events** | Some wrappers don't forward every custom event as an `onNys*` prop (e.g. the language-select event). | Listen for the native event (`nys-language-select`) on a wrapping element. |
| **Icons** | `nys-icon` resolves each SVG relative to its own script URL; bundlers break that → silent 404s. | Point the shared icon registry at SVGs you serve yourself, keyed off `import.meta.env.BASE_URL`. See [`src/setupIcons.ts`](src/setupIcons.ts). |
| **Grid gutters** | The gutter classes changed to numeric (`nys-grid-gap-400`, `-500`, …); they work via a negative row margin, which can **collapse out of a background-less section** and overlap the element above. | Zero the block-axis margin on that row, or give the section its own padding / a block formatting context. |
| **Sub-path deploys** | Icons, assets, and routing must respect the deploy base path. | `setupIcons` uses `import.meta.env.BASE_URL`; the router reads a `basename` from it (see [`src/App.tsx`](src/App.tsx)); Vite `base` is set for the production build. |
| **i18n** | A few chrome components (`nys-skipnav`, `nys-backtotop`) hardcode English labels with no `label` prop. | Documented upstream; localize by wrapping/replacing if full parity is required. |
| **Packaging** | `lit` undeclared (above); stylesheet specifier is `/full` (above). | Install `lit`; import `@nysds/styles/full`. |

### 6. When NYSDS is missing a component

NYSDS ships no card component, so this repo includes one **custom Lit primitive**,
[`src/ds-custom/nys-card/`](src/ds-custom/nys-card) (`nys-card` + a thin React wrapper), written
to NYSDS engineering standards: **design tokens only**, logical properties for RTL, decorator-free
so it transpiles cleanly under Vite. Use it as the template for any component you have to add —
match NYSDS conventions rather than introducing a different styling system.

Everything else on these pages uses shipped NYSDS components (button, text input, alert, accordion,
breadcrumbs, stepper, pagination, global/unav header & footer, dropdown menu, badge, divider, …).

---

## Project structure

```
src/
  main.tsx            # loads @nysds/styles/full + tokens.css + components.css, setupIcons(), mounts App
  App.tsx             # RouterProvider (basename from BASE_URL for sub-path deploys)
  routes.tsx          # RouteObject[] — shared by the app and the a11y tests
  setupIcons.ts       # points the NYSDS icon registry at /icons (bundler fix)
  layout/             # AppLayout (chrome + locale/<html lang|dir> sync), SiteHeader, SiteFooter
  components/         # page-agnostic React presentation components (tokens only)
  ds-custom/nys-card/ # the one custom Lit primitive + React wrapper + tests
  pages/              # one component per route
  data/               # fixtures (articles, categories, faqs, password rules, …) — content resolves via i18n keys
  i18n/               # i18next setup + en/ and es/ namespaces (typed resources)
  styles/             # tokens.css (app tokens) + components.css (component styling, tokens only)
  test/               # jsdom setup + axe-core a11y sweep over every route (EN/ES)
docs/                 # NYSDS integration notes and bug write-ups for the DS team
PRD.md                # product/scope spec (source of truth)
PROGRESS.md           # build log: phases, decisions, deviations, known issues
```

## Accessibility & internationalization

- **WCAG 2.2 AA is a gate.** `npm test` runs axe-core over every route in both locales
  (color-contrast is verified in a real browser during QA, since jsdom can't compute it).
- All user-facing copy is **key-based** and lives in the `i18n/en` and `i18n/es` namespaces —
  data fixtures store i18n keys, never localized strings. `<html lang>`/`dir` track the active
  locale.

## Deployment

Pushes to `main` build and deploy to **GitHub Pages** via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): it runs `npm ci && npm run build`,
copies `index.html` to `404.html` (so client-side routes resolve on deep links / refresh), and
publishes `dist/`. The production build sets Vite `base` to `/poc-password-reset/`.
