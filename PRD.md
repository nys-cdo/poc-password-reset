# PRD — NYS GovArc Support, rebuilt on the NYS Design System

| | |
|---|---|
| **Product** | GovArc Support portal (NYSDS reference rebuild) |
| **Type** | Proof of concept / reference implementation |
| **Owner** | Jesse Gardner — Design System & Accessibility, NYS ITS |
| **Status** | Draft v1 — for review |
| **Last updated** | July 2, 2026 |
| **Reference site** | https://demo.leanopstechnology.com/en (the "demo") |
| **Target repo** | `poc-password-reset` |

---

## 1. Summary

Rebuild the public-facing pages of the GovArc Support demo as a React + TypeScript application built entirely on the **NYS Design System (NYSDS)**. Where NYSDS ships a component, we use it. Where it does not, we build to DS engineering standards (Lit web components) or, for page-specific layout, React components styled exclusively with DS tokens.

The demo is a bespoke, NYS-styled application that **does not use NYSDS**. Its visual language (state blue header, official-website trust bar, statewide footer, 14-language translate menu) mirrors NYS conventions, which is exactly why it is a good candidate to re-express through the real design system. This POC demonstrates that NYSDS can reproduce a real agency support portal — including a password-recovery flow, a searchable knowledge base, and full English/Spanish localization — with high fidelity and less custom code.

## 2. Goals

1. Recreate eight pages (Section 6) on NYSDS with visual and behavioral parity to the demo.
2. Maximize use of NYSDS components; minimize and clearly justify every custom component.
3. Prove the design system holds up for a real product surface: forms, search, pagination, rich content, alerts, multi-step flows.
4. Ship WCAG 2.2 AA + Section 508 conformance as a build-time and manual gate, not an afterthought.
5. Deliver full English **and** Spanish content with route-based i18n (`/en/`, `/es/`) and the UNav language selector.
6. Produce a component-mapping reference (demo pattern → NYSDS component or custom spec) reusable by other ITS teams.

## 3. Non-goals

- No real authentication, identity provider, or backend. Tickets renders its **unauthenticated** state only (per decision in Section 15).
- No recreation of all 348 knowledge-base articles — a representative set of ~12–16 with a few paginated pages.
- No content-management system; all content is static local fixtures.
- No dark mode (NYSDS ships appearance tokens; out of scope for v1).
- Not a pixel-tracing of demo bugs or truncation quirks; we match intent, corrected to DS standards.

## 4. Success criteria

- All eight routes render on NYSDS chrome (`nys-skipnav` → `nys-unavheader` → `nys-globalheader` → `main` → `nys-backtotop` → `footer` with `nys-globalfooter` + `nys-unavfooter`).
- ≥ 80% of interactive UI is standard NYSDS components; every custom component is listed in Section 13 with a build rationale.
- Zero hardcoded color/space/type values in custom components — DS tokens only (enforced by lint).
- `axe-core` + Lighthouse pass with no serious/critical violations on every route; manual keyboard + screen-reader pass documented.
- Language switch toggles `/en/ ↔ /es/`, updates `<html lang>`/`dir`, and translates all page content and chrome.

## 5. Technical architecture

### 5.1 Stack

- **Vite + React 18 + TypeScript** (matches the official `nysds-react-demo` scaffold).
- **`@nysds/components`** — React-wrapped web components. Import from `@nysds/components/react` (React wrappers with event bindings), **never** the package root (raw Lit elements without wrappers).
- **`@nysds/styles`** — `nysds-full.min.css` loaded once at the entry point (reset, typography, tokens, utilities). Default theme is `state-blue`.
- **React Router v6** — locale-prefixed routes.
- **react-i18next** — UI string + content localization.
- Packages `@nysds/components` and `@nysds/styles` are versioned together; always install matching versions.

### 5.2 NYSDS integration patterns (from the React tutorial)

- **String/boolean props** pass through JSX normally: `<NysButton label="Continue" variant="primary" />`.
- **Custom events**, not React synthetic events. Use wrapper callbacks and read `CustomEvent.detail`:
  ```tsx
  <NysTextinput name="email" onNysInput={(e) => { if (e instanceof CustomEvent) setEmail(e.detail.value); }} />
  ```
- **Forms** use the native `ElementInternals` API — NYSDS fields participate in `FormData` on submit; no per-field React state required.
- **Form reset** must clear NYSDS fields explicitly (`el.value = null`); `form.reset()` alone won't.
- **Slots** are set via the `slot` attribute on children (e.g. `<div slot="actions">`).

### 5.3 Proposed project structure

```
src/
  main.tsx                 # imports nysds-full.min.css, mounts <App/>
  App.tsx                  # Router + <AppLayout/>
  i18n/
    index.ts               # react-i18next config
    en/*.json  es/*.json   # namespaced strings + content
  layout/
    AppLayout.tsx          # skipnav → unavheader → globalheader → main → backtotop → footer
    SiteHeader.tsx         # nys-globalheader + Help dropdown + sign-in actions
    SiteFooter.tsx         # nys-globalfooter + nys-unavfooter
  components/              # app-local React components (DS tokens only)
  ds-custom/               # Lit web components (breadcrumb, card) + React wrappers
  data/                    # static fixtures: articles, categories, faqs, tickets
  pages/                   # one folder per route
  styles/tokens.css        # references to --nys-* only; no raw values
```

## 6. Scope — pages

| # | Page | EN route | Notes |
|---|------|----------|-------|
| 1 | Home | `/en` | Hero + task selector, quick-action cards, KB preview |
| 2 | FAQ | `/en/faq` | Accordion |
| 3 | Knowledge Base (listing) | `/en/resident/knowledge` | Search, category filter, grid/list, pagination |
| 4 | KB article (detail) | `/en/resident/knowledge/:id` | Breadcrumb, hero, rich body, feedback |
| 5 | Accessibility | `/en/accessibility` | Statement + callouts + icon lists |
| 6 | Password Recovery | `/en/resident/password-reset/forgot?method=security` | Multi-step form |
| 7 | Privacy Policy | `/en/privacy` | Structured policy content |
| 8 | Tickets | `/en/resident/a/tickets` | Auth-required state only |

Spanish equivalents at `/es/...`. Out of scope: About, Sign in, Create account, Contact Support destinations (may be stubbed links).

## 7. Design-system usage principles

1. **Component-first.** Reach for a NYSDS component before writing markup. Section 10 is the canonical mapping.
2. **Tokens only.** Custom components consume `--nys-*` variables and NYSDS utility classes (`nys-grid-*`, spacing, typography). No raw hex, px, or rem for themed values. Enforced by a stylelint rule.
3. **Hybrid custom-component strategy** (decision):
   - **Lit web components** for reusable primitives that plausibly belong in the DS: **Breadcrumb** and **Card**. Built like NYSDS itself (Lit + `ElementInternals` where relevant + CSS custom properties + TS), shipped with thin React wrappers, and flagged as **candidates to contribute upstream**. Code-only for this POC — **no Figma parity** (per decision).
   - **React + DS tokens** for page-specific layout with no reuse case: hero bands, the KB filter layout, the task selector, the article body renderer, callouts, and the quick-actions sidebar.
4. **Match intent, not defects.** Where the demo truncates text or has contrast/keyboard gaps, we correct to DS standards.
5. **Accessibility is a gate,** not a task — see Section 12.

## 8. Global layout & chrome (every page)

Follows the NYSDS page-structure guide exactly:

```
nys-skipnav (first focusable, target #main-content)
nys-unavheader           ← NY.gov trust bar + Translate
nys-globalheader         ← agency nav (state blue)
<main id="main-content"> … </main>
nys-backtotop
<footer>
  nys-globalfooter       ← ITS links + social
  nys-unavfooter         ← statewide ny.gov links
</footer>
```

### 8.1 `nys-unavheader` (Universal header)

- Renders "An official website of New York State / Here's how you know" trust bar and the **Translate** language menu.
- `hideSearch` = **true** (the demo's UNav has no search box).
- `hideTranslate` = false.
- `languages`: the demo's 14-language menu (English, Español, 中文, 繁體中文, יידיש, Русский, বাংলা, 한국어, Kreyòl Ayisyen, Italiano, العربية, Polski, Français, اردو) matches NYS's standard language set — which is **also the default `languages` array `nys-unavheader` ships** — so the component reproduces the same menu out of the box (the match is convenient, not because the demo uses NYSDS). We pass a custom `languages` array only to wire each option to our router locale switch instead of the default Smartling behavior (see Section 11).

### 8.2 `nys-globalheader` (Agency header)

- `appName` = "GovArc Support", `nysLogo` = true, `homepageLink` = current-locale home (`/en` or `/es`).
- Nav slotted as `<ul><li><a>`: **Home**, **Knowledge Base**, **Help**. Active link auto-highlights by URL — matcher must ignore the `/en|/es` locale prefix.
- **Help** is a submenu (FAQ, Accessibility, Contact Support) → compose `nys-dropdownmenu` + `nys-dropdownmenuitem` inside the nav slot.
- **Sign in | Create account** actions go in `nys-globalheader`'s built-in **`user-actions` slot** (`<div slot="user-actions">…</div>`) — no custom extension needed.

### 8.3 Footer

- `nys-globalfooter` — `agencyName` = "New York State Information Technology Services", `homepageLink` = `https://its.ny.gov`. Slotted links: About GovArc Support, Privacy Policy, Accessibility + social icons (Facebook, X) via `nys-icon`.
- `nys-unavfooter` — statewide ny.gov links (Services, Programs, Events, Counties, App Directory, Agencies). Provided by the component.

## 9. Design tokens (reference)

| Purpose | Token | Value |
|---|---|---|
| Agency header / primary blue | `--nys-color-theme` | `#154973` (state-blue-700) |
| Header hover / strong | `--nys-color-theme-strong` | `#0e324f` |
| Accent (yellow icon, e.g. Account recovery) | `--nys-color-accent` | `#face00` |
| Body text | `--nys-color-text` | `#1b1b1b` |
| Secondary text / metadata | `--nys-color-text-weak` | `#4a4d4f` |
| Links | `--nys-color-link` | `#004dd1` |
| Card / page surface | `--nys-color-surface` | `#ffffff` |
| Raised / footer band | `--nys-color-surface-raised` | `#f6f6f6` |
| Warning alert (auth-required) | `--nys-color-warning` / `-weak` | `#face00` / `#fefae5` |
| Focus ring | `--nys-color-focus` | `#004dd1` |
| Spacing scale | `--nys-space-50 … --nys-space-1200` | `0.25rem … 6rem` |

Custom components reference these variables only. Resolve additional tokens via the NYSDS token tooling or designsystem.ny.gov; do not inline literals.

## 10. Component mapping (master)

### 10.1 NYSDS components used

| Demo pattern | NYSDS component | Key props / notes |
|---|---|---|
| Skip link | `nys-skipnav` | target `#main-content` |
| Trust bar + translate | `nys-unavheader` | `hideSearch`, `languages` |
| Agency nav bar | `nys-globalheader` | `appName`, `nysLogo`, nav slot |
| Help submenu | `nys-dropdownmenu` + `nys-dropdownmenuitem` | attaches to a trigger by id via `for` |
| Back-to-top | `nys-backtotop` | before `<footer>` |
| Agency footer | `nys-globalfooter` | slotted links + social |
| Statewide footer | `nys-unavfooter` | — |
| FAQ Q&A | `nys-accordion` + `nys-accordionitem` | single-select optional |
| Auth-required / info callouts | `nys-alert` | `type` = warning/info/base; `heading`, slot body |
| Category chip, "min read", effective date | `nys-badge` | `intent`, `size`, `prefixIcon` |
| Buttons / CTAs | `nys-button` | `variant`, `label`, icon slot |
| Email + search + feedback inputs | `nys-textinput`, `nys-textarea` | `onNysInput`, `required` |
| Task selector options | `nys-radiogroup` + `nys-radiobutton` | form-associated |
| KB pagination | `nys-pagination` | `currentPage`, `totalPages`, `nys-change` |
| Password-recovery progress | `nys-stepper` + `nys-step` | `actions` slot for Back/Continue |
| Icons (nav, features, social, meta) | `nys-icon` | Material Symbols set |
| Embedded article video | `nys-video` | `videourl` = full YouTube URL |
| Section rules | `nys-divider` | — |
| Help/quick-action hints | `nys-tooltip` | optional |

### 10.2 Custom components

**Lit web components (build to DS standards; upstream candidates)**

| Component | Why custom | Notes |
|---|---|---|
| `nys-breadcrumb` (+ item) | No DS breadcrumb; needed on KB article, reusable statewide | Ordered-list semantics, `aria-current="page"`, truncation |
| `nys-card` | No DS card; demo uses 3 card variants | Slots: `media`, default (title/body), `actions`; variants: bordered/elevated, icon-lead |

**React + DS tokens (page-specific)**

`AppLayout`, `SiteHeader` (incl. sign-in actions), `SiteFooter`, `PageHero`, `ArticleHero`, `TaskSelector`, `IconActionCard` (wraps `nys-card`), `ArticleCard` (wraps `nys-card`), `KnowledgeBaseLayout`, `CategorySidebar`, `SearchBar` (wraps `nys-textinput` + `nys-button`), `ViewToggle` (grid/list), `ArticleListRow`, `ArticleBody` (rich-text renderer), `ArticleFeedback`, `Callout`, `IconFeatureList`, `QuickActions`, `ContactPanel`.

## 11. Internationalization (full EN + ES)

- **Routing**: locale is the first path segment (`/:lang/...`), `lang ∈ {en, es}`. A guard redirects unknown/empty locale to `/en`. All internal links are locale-aware.
- **Strings & content**: react-i18next namespaces per page (`home`, `faq`, `kb`, `article`, `privacy`, `accessibility`, `passwordReset`, `tickets`, `common`). Full English and Spanish authored for every recreated page, including body content, article copy, FAQ Q&A, privacy/accessibility prose, and form labels/validation.
- **Language selector**: `nys-unavheader` `languages` entries are wired so selecting a language swaps the locale prefix and preserves the current path + query. English and Spanish switch in-app; the remaining 12 languages remain in the menu for parity (behavior for those documented as out-of-scope stubs for v1).
- **Document attributes**: update `<html lang>` and `dir` on locale change. `dir="rtl"` for Arabic/Urdu/Yiddish is designed for even though those locales are stubbed, so custom components must be logical-property safe (use `margin-inline`, `padding-inline`, not left/right).
- **Formatting**: dates/numbers via `Intl` with the active locale (e.g. article read time, privacy effective date).
- **Parity check**: no hardcoded user-facing strings in components; a pseudo-locale build surfaces leaks.

## 12. Accessibility (WCAG 2.2 AA + Section 508)

Mirrors and enforces the commitments the Accessibility page itself states:

- **Structure**: single `<main id="main-content">`, one `<h1>` per page, logical heading order, landmark regions, `<footer>` wrapper.
- **Keyboard**: every interactive element reachable/operable; visible `:focus-visible` using `--nys-color-focus`; no traps; skip link first.
- **Screen readers**: semantic HTML + ARIA only where needed; `nys-alert` live regions for async states (search results, form errors, auth-required); accordion/stepper use DS-provided ARIA.
- **Contrast**: 4.5:1 text / 3:1 large & UI, satisfied by DS tokens; verify hero text over the photographic background (add a token-based scrim overlay).
- **Reflow/resize**: usable to 200% zoom and 320 px without loss; grid via `nys-grid-*`.
- **Motion**: honor `prefers-reduced-motion` (back-to-top scroll, accordion, stepper).
- **Forms**: programmatic label association, `required` semantics, inline errors via `nys-errormessage`, WCAG 2.2 target-size and focus-not-obscured checks.
- **Tooling**: `axe-core` + Lighthouse in CI on every route; manual keyboard pass + NVDA/JAWS/VoiceOver spot-checks recorded before sign-off.

## 13. Per-page requirements

### 13.1 Home — `/en`

- **Hero** (`PageHero`): full-bleed state-blue band with the B&W Williamsburg Bridge background (`src/assets/hero-williamsburg-bridge.jpg`) + token scrim overlay for text contrast; `<h1>` "Welcome to GovArc Support", subtitle, and a "search the knowledge base" link.
- **Task selector** (`TaskSelector`, overlapping card on `nys-card`): `nys-radiogroup` with three `nys-radiobutton`s using the `tile` variant (large clickable option cards) — "Reset my password" (`nys-badge` "~2 min"), "Recover my account" (`nys-badge` "~10 min"), "Something else"; per-option `description` helper text; group helper "No login needed for the first step."; `nys-button` "Continue". Selection routes to the matching flow.
- **Quick actions** (`IconActionCard` ×3 on `nys-card`): Search articles, Check ticket status, Account recovery — each `nys-icon` + title + text + link. Account-recovery icon uses `--nys-color-accent`.
- **KB preview**: section header + "View all articles" link + four `ArticleCard`s (Data Privacy, Webex, Smartphone Safety, Microsoft Outlook) with image, title, excerpt, `nys-button` "Read Article".
- **Data**: `data/articles.ts` (featured subset), `data/tasks.ts`.

### 13.2 FAQ — `/en/faq`

- `<h1>` "Frequently Asked Questions" + subtitle.
- `nys-accordion` with eight `nys-accordionitem`s (What is GovArc Support?, reset password, enroll in MFA, account locked, supported browsers, is it accessible, data protection, contact support); first expanded by default.
- `ContactPanel` "Still have questions?" with Service Desk email + hours.
- **Data**: `data/faqs.ts` (question/answer pairs, localized).

### 13.3 Knowledge Base listing — `/en/resident/knowledge`

- `<h1>` + subtitle.
- `SearchBar`: `nys-textinput` (`onNysInput`, debounced) + `nys-button` (search icon). Filters fixtures client-side; empty-state message when no matches.
- `ViewToggle`: Grid / List (two `nys-button`s, `aria-pressed`); default List.
- `CategorySidebar`: "CATEGORIES" heading + selectable list with counts via `nys-badge` (All Articles, About ITS & Careers, Artificial Intelligence, Cybersecurity Advisories, … Uncategorized). Selecting filters the list.
- Results: List view → `ArticleListRow` (title link, excerpt, "N min read" with `nys-icon`, category `nys-badge`). Grid view → `ArticleCard` grid.
- `nys-pagination` (`totalPages` from filtered count; `nys-change` updates page). Demo shows 29 pages; POC mocks ~12–16 articles across 2–3 pages to exercise controls.
- **Data**: `data/articles.ts`, `data/categories.ts`.

### 13.4 KB article detail — `/en/resident/knowledge/:id`

- `nys-breadcrumb` (custom Lit): Home / Knowledge Base / {title}.
- `ArticleHero`: state-blue band with breadcrumb, `<h1>` title, description, and meta row (read time, author, views) with `nys-icon`.
- `ArticleBody` (rich-text renderer over fixture content): H2 sections, paragraphs, bold, unordered lists, inline links, images, and an embedded YouTube via `nys-video`; trailing "Source:" line; `nys-divider` between sections.
- `ArticleFeedback`: "Was this article helpful?" + two `nys-button`s ("Yes, helpful" / "No, not helpful" with thumb icons, `aria-pressed`) + `nys-textarea` (optional) + `nys-button` "Submit". Local-only; success via `nys-alert type="success"`.
- **Not-found**: invalid `:id` renders a friendly `nys-alert` + link back to the KB (the demo throws a raw "Something went wrong"; we improve it).
- **Data**: `data/articles.ts` (full body for the mocked set).

### 13.5 Accessibility — `/en/accessibility`

- `<h1>` "Accessibility Statement" + intro.
- `Callout` "Our Commitment" (bordered box, token border/surface).
- `IconFeatureList` "Accessibility Features" (`nys-icon` + text per item).
- "Standards We Follow" and "How We Test" — semantic lists (DS typography).
- `ContactPanel` "Report an Accessibility Issue" (`nys-alert type="info"` or Callout) with `accessibility@its.ny.gov` and 2-business-day response.
- **Data**: localized prose in `i18n/*/accessibility.json`.

### 13.6 Password Recovery — `/en/resident/password-reset/forgot?method=security`

- Multi-step flow presented with `nys-stepper` + `nys-step` in a `nys-grid` sidebar layout: **1) Enter email → 2) Verify identity (security questions) → 3) Reset password**. `method=security` selects the security-question branch.
- **Step 1**: `<h1>` "Recover Your Account" + description; `nys-textinput` Email (required, `type="email"`, inline validation via `nys-errormessage`); `actions` slot with `nys-button` "Back" (`variant="outline"`) + "Continue" (`variant="filled"`, `type="submit"`).
- **Step 2**: security questions (`nys-textinput`/`nys-select` from fixtures).
- **Step 3**: new-password fields with requirements text (no real submission; success via `nys-alert`).
- `QuickActions` sidebar panel: "QUICK ACTIONS" heading + "Account Recovery" link with help `nys-icon`.
- **Notes**: form uses `FormData`/`ElementInternals`; reset clears NYSDS fields explicitly. This flow is the POC's centerpiece (repo name `poc-password-reset`).
- **Data**: `data/securityQuestions.ts`, `data/passwordRules.ts`.

### 13.7 Privacy Policy — `/en/privacy`

- `<h1>` "Privacy Policy" + `nys-badge` "Effective: January 1, 2025".
- Intro + H2 sections: Information We Collect, How We Use Your Information, Data Security (with a `Callout` "Security Measures"), Information Sharing, Data Retention, Your Rights — paragraphs + semantic lists.
- `ContactPanel` "Questions about this policy?" (`nys-alert`/Callout) with privacy office contact.
- **Data**: localized prose in `i18n/*/privacy.json`.

### 13.8 Tickets — `/en/resident/a/tickets` (auth-required state only)

- `<h1>` "My Support".
- `nys-alert type="warning"` `heading="Authentication Required"` — "You must be signed in to access this page. Please sign in to continue."
- "Sign In to Continue" section: supporting text + full-width `nys-button` "Sign in".
- No signed-in ticket list in v1 (decision). The signed-in `nys-table` design is noted as a future extension in Section 16.
- **Data**: none (static state).

## 14. Data model (static fixtures)

TypeScript fixtures under `src/data/`, localized where user-facing:

- `Article { id, slug, title, excerpt, body(blocks), category, readMinutes, author, views, image, videoUrl?, sourceUrl? }`
- `Category { id, label, count }`
- `Faq { id, question, answer }`
- `Task { id, label, description, estimate, route }`
- `Ticket` (typed for future use; unused in v1)

Localized content lives in `i18n/{en,es}/*.json`; fixtures hold structure/ids and reference string keys.

## 15. Decisions (from review)

| Topic | Decision |
|---|---|
| Custom component strategy | **Hybrid** — breadcrumb & card as Lit (DS candidates); hero, KB layout, etc. as React + tokens |
| Tickets / auth | **Auth-required state only**; no mock signed-in view, no real auth |
| i18n depth | **Full English + Spanish** content + locale routing + UNav language list |
| Data source | **Static local mock data** (TS/JSON fixtures) |
| Header sign-in actions | Use `nys-globalheader`'s built-in **`user-actions` slot** |
| Figma parity for custom Lit components | **None** — code-only for this POC |
| Hero background image | **Provided** (B&W Williamsburg Bridge); lives at `src/assets/hero-williamsburg-bridge.jpg` |

## 16. Open questions & risks

**Resolved in review**

- **Sign-in actions** → use `nys-globalheader`'s built-in `user-actions` slot.
- **Custom Lit components** → code-only, no Figma parity for this POC.
- **Hero background** → provided (B&W Williamsburg Bridge); see asset note below.

**Still open / risks**

1. **Hero asset delivery** — the attached image didn't arrive as a file I can access. Drop `hero-williamsburg-bridge.jpg` into `src/assets/` (or point me at a path) and I'll wire it in; until then the hero uses a token-based gradient placeholder.
2. **Help dropdown in the header** — validate `nys-dropdownmenu` (trigger-by-`for`) composes cleanly inside the header and is keyboard/SR-correct; otherwise file a DS enhancement.
3. **RTL** — designed-for (logical properties) but untested since ar/ur/yi are stubbed; confirm acceptable for v1.
4. **Signed-in Tickets** — deferred; when scoped, render with `nys-table` (sortable, status `nys-badge`) behind a mock session.
5. **Untested React integration** — the NYSDS React guide notes React support is "currently untested." Budget time to harden event/`FormData` behavior and file DS issues as found.

## 17. Suggested delivery phases

1. **Foundation** — Vite/React/TS scaffold, NYSDS install, `AppLayout` chrome, routing + i18n skeleton, tokens/lint guardrails.
2. **Custom primitives** — `nys-breadcrumb`, `nys-card` (Lit + wrappers) and the shared React layout components.
3. **Content pages** — Home, FAQ, Accessibility, Privacy (+ EN/ES content).
4. **Knowledge base** — listing (search/filter/toggle/pagination) + article detail (body renderer, video, feedback).
5. **Password recovery** — stepper flow + forms + quick actions.
6. **Tickets** auth state, then **hardening** — a11y audit (axe/Lighthouse + manual), i18n parity pass, cross-browser/responsive QA.
```
