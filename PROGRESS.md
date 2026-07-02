# PROGRESS — GovArc Support on NYSDS (handoff)

Status snapshot for resuming in a fresh context. Source of truth for scope is
**`PRD.md`**; NYSDS integration issues are in **`docs/nysds-notes.md`** and
**`docs/nysds-bug-unavheader-languages-react.md`**.

## What this is

React + TS + Vite rebuild of the 8 public GovArc Support pages on the **NYS Design
System (NYSDS)**, full English **and** Spanish, WCAG 2.2 AA as a gate. Reference demo:
https://demo.leanopstechnology.com/en

## Phase status (PRD §17)

| Phase | Scope | Status |
|------|-------|--------|
| 1 | Vite/React/TS scaffold, NYSDS install, AppLayout chrome, routing + i18n skeleton, token/lint/a11y guardrails | ✅ Done |
| 2 | Custom primitives: `nys-card` (Lit) + React wrapper. **Breadcrumb uses shipped `nys-breadcrumbs`** (not custom) | ✅ Done |
| 3 | Content pages: Home, FAQ, Accessibility, Privacy (+ EN/ES) | ✅ Done |
| 4 | Knowledge Base listing (search/filter/toggle/pagination) + article detail (body renderer, video, feedback, 404) | ✅ Done |
| 5 | Password Recovery flow (email → verify → reset; no stepper — centered form + Quick Actions rail, matches reference) | ✅ Done |
| 6 | Tickets (auth-required state only) | ✅ Done |
| — | **Hardening pass — a11y + i18n + responsive done** (see below) | ✅ Done |

**All 8 pages are built and render in EN + ES.** Verified in-browser each phase.

## How to run & verify

```bash
npm install            # (lit is a required direct dep — see gotchas)
npm run dev            # Vite dev server (http://localhost:5173+, currently on :5175)
npm run typecheck      # tsc -b --noEmit
npm run lint           # eslint
npm run lint:style     # stylelint (bans raw hex/px/rem; enforces token use)
npm test               # vitest: nys-card unit + axe-in-jsdom over every route (EN/ES)
npm run build          # tsc -b && vite build
```

**Current gate: all green** — typecheck, ESLint, stylelint, tests 18/18, build.
A Vite dev server is currently running in the background on **http://localhost:5175**.

## Routes (locale-prefixed: `/:lang`, lang ∈ en|es; invalid → /en)

- `/en` Home · `/en/faq` FAQ · `/en/resident/knowledge` KB listing
- `/en/resident/knowledge/:slug` article (real slugs, e.g. `protecting-your-data-privacy`)
- `/en/accessibility` · `/en/privacy`
- `/en/resident/password-reset/forgot?method=security` recovery
- `/en/resident/a/tickets` tickets · `*` NotFound

## Architecture / where things live

- `src/main.tsx` — loads `@nysds/styles/full` + `tokens.css` + `components.css`, calls `setupIcons()`, mounts App.
- `src/setupIcons.ts` — points the NYSDS icon registry at `public/icons/` (Vite fix; see gotchas).
- `src/routes.tsx` — RouteObject[] (reused by App + a11y tests). `src/App.tsx` — RouterProvider.
- `src/layout/` — `AppLayout` (chrome order + locale/`<html lang/dir>` sync + invalid-locale guard), `SiteHeader` (unavheader + globalheader + user-actions + Help dropdown + language-switch listener), `SiteFooter`.
- `src/i18n/` — `index.ts` (init; initial `lng` derived from URL), `locales.ts`, `useLocale.ts` (localePath/switchLocale), `i18next.d.ts` (typed resources). Namespaces: `common, home, faq, accessibility, privacy, articles, article, kb, passwordReset, tickets` — each `en/` + `es/`.
- `src/ds-custom/nys-card/` — Lit `nys-card` (decorator-free) + `NysCard` wrapper + test. Only custom Lit primitive.
- `src/components/` — page-agnostic React (tokens only): PageHeader, Callout, ContactPanel, IconFeatureList, IconActionCard, ArticleCard, TaskSelector, SearchBar, ViewToggle, CategorySidebar, ArticleListRow, ArticleHero, ArticleBody, ArticleFeedback, BreadcrumbItem, QuickActions, PagePlaceholder.
- `src/data/` — fixtures: articles (14), categories, faqs (8), tasks (3), securityQuestions, passwordRules, types.
- `src/pages/` — one per route.
- `src/styles/tokens.css` — app tokens + the `.nys-grid-container { max-width: 83rem }` override (stylelint-disabled `rem`). `components.css` — all component styling (tokens only; layout via NYSDS `nys-grid-*`/`nys-*` utilities).
- `src/test/` — `setup.ts` (jsdom stubs: matchMedia/observers/scrollTo + `attachInternals` mock; see gotchas), `a11y.test.tsx` (axe over all routes, color-contrast disabled in jsdom).

## Key decisions & deviations (beyond PRD)

- **Breadcrumb:** use shipped `nys-breadcrumbs` (not a custom Lit one) — overrides PRD §10.2.
- **Stylesheet import:** `@nysds/styles/full` (exports map blocks the deep `dist/...` path in PRD hard rule; same file).
- **`lit` added as a direct dependency** (NYSDS imports it but doesn't declare it).
- **Icons:** served from `public/icons/` via registry override; only ~82 curated icons ship — verify names against `public/icons/`.
- **Task-selector estimates** render inline in the radio `description` (`… · ~2 min`), not a right-aligned pill (no such slot on `nys-radiobutton`; its `description` slot didn't render — used the prop).
- **Recovery Back/Continue** live in the form footer, not the stepper `actions` slot (nys-button can't submit an external form).
- **Field errors** use `nys-textinput`'s built-in error, not `nys-errormessage` (internal-only).
- **KB list "min read"** is inline text (no badge slot exposed).
- Sign-in / Create account are **stub links** (point to tickets/home); no real auth (PRD non-goal).

## Known issues (documented, not fixed)

- **`nys-globalheader` active-link over-highlights "Home"** on locale-prefixed pages with no deeper nav match (longest-prefix matcher; `/en` prefixes everything). Details + suggested upstream fix in `docs/nysds-notes.md` §1. Decision pending.
- **Skip link / back-to-top show English on ES pages** — `nys-skipnav` and `nys-backtotop` hardcode their labels (no `label` prop). Our translated `common.skipToMain` key is currently unused as a result. Upstream fix filed (`docs/nysds-notes.md` §7); left in place pending it. Workaround if needed: replace with a small localized skip link that reuses the existing key.
- ~~**`nys-step` `aria-hidden-focus`**~~ — resolved: the recovery flow was redesigned to match the reference (no stepper), so `nys-step` is no longer used. The upstream bug writeup stays in `docs/nysds-notes.md` §6 for the DS team.

## NYSDS bugs/gaps found (for the DS team)

Full writeups in `docs/`. Summary:
1. `NysUnavHeader` wrapper: drops `languages` (object prop → attribute → null crash), doesn't forward `ref`, no event props → listen for `nys-language-select` on a wrapping div; rely on default language list. (`docs/nysds-bug-unavheader-languages-react.md`)
2. `nys-icon` resolves SVGs from its script URL → silent 404 under bundlers. (`docs/nysds-notes.md` §2)
3. `nys-globalheader` active-link (above). (§1)
4. `nys-breadcrumbs`: `nys-breadcrumbitem` isn't registered/exported; real input is a slotted `<ol>` of `<li>` (inner `<a>` = link, no anchor = current). No `inverted`; recolor via inherited tokens. (§4)
5. Packaging: `lit` undeclared; stylesheet specifier is `/full`. (§5)
6. **`nys-step`**: active step is `tabindex="0"` + `role="button"` **and** `aria-hidden="true"` → confirmed axe `aria-hidden-focus` (WCAG 4.1.2). Found via real-browser axe on the stepper. (§6)
7. **`nys-skipnav` / `nys-backtotop`**: hardcode English labels, no `label` prop → untranslatable on ES pages. (§7)
8. **`nys-textarea`**: placeholder contrast ≈4.20:1 (< 4.5:1). Entered text 17.2:1, border 3.09:1 are fine. (§8)
9. **`nys-unavheader` / `nys-alert`**: axe needs-review items (`aria-allowed-attr` on unavheader buttons; `aria-prohibited-attr` on the alert container's `aria-label` div). (§9)

## Hardening pass — results (2026-07-02)

Done via real-browser audit (axe 4.10.2 injected per route + iframe-based reflow testing;
the automation tab has a fixed viewport, so 320px/640px were tested by rendering each route
in a sized same-origin iframe — media queries evaluate against the iframe width).

1. **Accessibility (real browser):** axe (WCAG 2.2 AA, color-contrast enabled) on all 8 routes
   EN + ES spot-checks → **zero violations from app code**. One h1/route; `<html lang/dir>`
   correct per locale; skip target + `<main>` present. **Hero contrast verified: 7.19:1 worst
   case** (white text over the 0.9-alpha oklab tint with a pure-white photo pixel) — clears
   3:1/4.5:1. Remaining flags are all upstream NYSDS (§6–§9). *Not done:* live
   NVDA/JAWS/VoiceOver SR passes (needs a human + AT).
2. **i18n parity:** all 10 namespaces present both locales with **0 key mismatches**; no
   hardcoded user-facing strings in JSX/attrs (all content is key-based fixtures + `t()`).
   ES==EN values are intentional (emails, brand, "min"). **Fixed:** the catch-all 404 was
   rendering Phase-1 scaffold copy ("This page is part of a later build phase.") → rewrote
   `NotFound` as a real localized page (heading + body + home link), added `common.notFound.*`
   EN/ES, removed the now-dead `PagePlaceholder` component, `.page-placeholder` CSS, and
   `common.placeholder` key. Remaining gap: English skip-link/back-to-top text (upstream, §7).
3. **Responsive / reflow:** all 8 routes × EN/ES pass at **320px** and **640px (~200% zoom)**
   with no horizontal overflow. **Fixed:** `.site-header__actions` (Sign in / Create account
   in the globalheader user-actions slot) overflowed 42px at 320px on every page (WCAG 1.4.10)
   → added `flex-wrap: wrap` + `justify-content: flex-end` so the two buttons stack; verified
   visually (mobile header: hamburger + app name + stacked actions). App CSS has no fixed
   widths; grid is mobile-first (`nys-grid-col-12` base everywhere); images constrained.
   *Not done:* real Chrome/Edge/Firefox/Safari cross-browser smoke (single-engine here).

**Gate after hardening: all green** — typecheck, ESLint, stylelint, tests 18/18, build.

### Still optional / open
- Resolve or formally file the globalheader active-link issue (§1).
- Decide whether to ship a custom localized skip link (reusing `skipToMain`) vs. wait for the
  upstream `label` prop (§7).
- `postcss-lit` so stylelint also lints the Lit `css` template in `nys-card.ts` (token-pure by hand).
- Live screen-reader + cross-browser passes (need human/AT + multiple engines).

## Notes

- NYSDS installed = latest (1.19.2); it's the source of truth for component/token APIs.
- Verify NYSDS APIs before use; several React wrappers are under-implemented (see gotchas).
