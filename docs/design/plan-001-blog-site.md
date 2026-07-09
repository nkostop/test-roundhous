# Plan 001 — Small Simple Blog HTML Site

## Ambiguities / Pending User Decisions

**None blocking.** All open questions from the refined request are resolvable via the documented Assumptions. If the user wants to override any of these defaults, they can flag it before Phase 1 executes. Otherwise proceed with:

- **Blog name / branding**: default to a neutral placeholder such as "My Blog".
- **Color palette**: light theme with dark text; a restrained 2–4 color palette (background, text, muted text, accent, border) driven by CSS custom properties on `:root`, with a compact `prefers-color-scheme: dark` override.
- **"Read more" links**: use `href="#"` (non-functional dummies).
- **Sidebar side on desktop**: right of main content (common blog convention).
- **Skip-link for accessibility**: omit (out of scope per the refined request; low value for a 3-widget dummy page).

## Objective

Deliver a single self-contained static HTML file, `index.html`, at the repository root that renders a small, simple blog site (header + main content with dummy posts + sidebar + footer) with all CSS in one inline `<style>` block. No JavaScript, no external assets, no build tooling. Total file size under 30 KB.

## Context

Read before starting:
- @docs/design/refined-request-blog-site.md — refined request spec (source of the 11 acceptance criteria).
- @docs/reference/investigation-blog-site.md — technical investigation and design recommendations (CSS Grid outer scaffold + Flexbox row-level, mobile-first `min-width: 768px`, semantic-nested HTML, system font stack, plus small quality-of-life touches).
- @docs/design/project-functions.md — distilled functional requirements catalog.

**Greenfield project.** No source code exists yet. No prior conventions to inherit. No dependencies on any other component.

## Scope Note

This is a very small single-file deliverable. Aggressive multi-phase decomposition would be over-engineering. The plan uses **two phases**: implementation, then verification. There are no inter-phase dependencies beyond the trivial "write the file → verify the file exists and meets criteria."

## Files to Create

| File | Purpose | Required |
|------|---------|----------|
| `index.html` | The complete self-contained blog page (HTML + inline CSS). | Yes |
| `test_scripts/verify-blog-site.mjs` | Node-based verification helper (well-formedness, size, single `<style>` block, semantic-tag presence). | Optional but recommended |

No other files are created or modified.

## Phase 1 — Implementation

**Goal:** Produce `index.html` at the repository root that satisfies every functional requirement in `docs/design/project-functions.md`.

**Approach (from investigation recommendations):**
- **Layout**: CSS Grid for the outer page scaffold; Flexbox where a single-axis alignment is natural (header title + nav row).
- **Responsive**: Mobile-first base styles, then `@media (min-width: 768px)` to enable the two-column main+aside grid.
- **Semantic HTML**: `<header>` (with `<h1>`, tagline, `<nav aria-label="Primary">` containing `<ul>` of links) → `<main>` with 3 `<article>` elements (each has an inner `<header>` with `<h2>` + post-meta, body `<p>`, and "Read more" link) → `<aside aria-label="Sidebar">` with 3 `<section>` widgets → `<footer>` with copyright.
- **Font**: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- **Quality-of-life**: `box-sizing: border-box` reset, CSS custom properties on `:root`, compact `prefers-color-scheme: dark` override, short `@media print` block, `<meta name="color-scheme" content="light dark">`, `:focus-visible` styling preserved.

**Tasks:**

1. Sketch the CSS custom-property palette on `:root` (background, text, muted, accent, border).
2. Draft the semantic HTML skeleton with all mandatory tags present (`<header>`, `<nav>`, `<main>`, `<article>` ×3, `<aside>`, `<footer>`).
3. Write dummy content: site title/tagline, nav links, 3 blog posts (title + author/date + 2–5 sentence body + "Read more" link), 3 sidebar widgets (About, Recent Posts list, Categories list), footer copyright (year 2026).
4. Apply mobile-first CSS: typography (16px base, line-height ≥ 1.5), spacing, colors, list styling, link styling, `:focus-visible` outlines.
5. Add `@media (min-width: 768px)` block that turns on the two-column grid for the main+aside region.
6. Add `@media (prefers-color-scheme: dark)` override (~5 lines using the CSS custom properties).
7. Add `@media print` block (~10 lines) hiding sidebar and nav, dropping backgrounds.
8. Verify inline: file opens in a browser, semantic tags present, no external references, size feels well under 30 KB.

**Deviation rules apply:**
- If a broken behavior is found (e.g., invalid HTML, layout collapse), auto-fix and record in the summary.
- If a critical gap (e.g., missing `<meta viewport>`) is discovered, auto-add.
- If the CSS grows uncomfortably close to the 30 KB budget, trim dummy copy before adding more polish.
- If an architectural decision surfaces (e.g., adding JS), stop and ask.

**Done when:**
- `index.html` exists at the repo root.
- Manual visual inspection: header, three posts, sidebar with three widgets, and footer are all present and readable.
- The `<style>` block is a single element inside `<head>` and no `<link>` or external URL is referenced.

## Phase 2 — Verification

**Goal:** Confirm all 11 acceptance criteria are met and document the outcome.

**Approach:** Create a small Node ESM verifier that performs the automatable checks. Combine automated results with a short manual visual check.

**Tasks:**

1. Create `test_scripts/verify-blog-site.mjs` that:
   - Reads `index.html` from the repo root.
   - Reports byte size and asserts `< 30 * 1024`.
   - Asserts exactly one `<style>` element exists inside `<head>`.
   - Asserts zero `<link rel="stylesheet">` elements exist.
   - Asserts zero `<script>` elements exist.
   - Asserts each mandatory semantic tag is present at least once: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`.
   - Asserts at least 3 `<article>` elements exist.
   - Asserts `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="utf-8">`, `<meta name="viewport" ...>`, and a non-empty `<title>` are present.
   - Asserts no `<a>` tag lacks an `href` attribute.
   - Exits with non-zero status on any failure and prints a compact pass/fail table.
2. Run the verifier: `node test_scripts/verify-blog-site.mjs`. Fix any failures in `index.html` and re-run.
3. Run the W3C Nu HTML Checker (via `curl -F "out=json" -F "file=@index.html" https://validator.w3.org/nu/`) or note it as a manual step if network access is unavailable; require zero errors (warnings acceptable).
4. Manual visual check: open `index.html` in a browser and confirm rendering at both 1280px and 375px widths matches expectations (two-column vs stacked). No console errors.

**Verification criteria (Claude can run these):**

| Check | Method | Pass condition |
|-------|--------|----------------|
| HTML5 well-formedness | W3C Nu Validator (or verifier's structural checks) | Zero errors |
| File-size budget | `wc -c index.html` or verifier | < 30 KB (30720 bytes) |
| Single `<style>` block | Verifier count | Exactly 1 `<style>` inside `<head>` |
| Semantic tags present | Verifier presence check | `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` each ≥ 1 |
| No external CSS/JS | Verifier: 0 `<link rel="stylesheet">`, 0 `<script>` | Both counts = 0 |
| No `href`-less `<a>` | Verifier | 0 `<a>` without `href` |
| Required meta tags | Verifier | `<!DOCTYPE html>`, `lang="en"`, `meta charset`, `meta viewport`, `<title>` all present |
| Post count | Verifier | ≥ 3 `<article>` |

**Done when:**
- Verifier reports all checks passing.
- Manual visual check at 1280px and 375px shows the expected layout with no console errors.

## Acceptance Criteria (mirrored from the refined request)

Numbered exactly as in `docs/design/refined-request-blog-site.md` §"Acceptance Criteria":

1. Opening `index.html` in a modern browser via `file://` renders the full page without console errors.
2. Viewing the page source shows all styling inside a single `<style>` block within `<head>`, and no `<link>` references any external stylesheet.
3. The rendered page shows, top to bottom: a header (title + nav), a two-column region containing blog posts and a sidebar, and a footer.
4. At least 3 distinct dummy blog posts, each with title, metadata, body text, and a "Read more" link.
5. Sidebar contains at least 3 distinct widget blocks.
6. Resizing the browser to 375px width causes the sidebar to stack beneath the main content; no horizontal scrolling.
7. Resizing the browser to 1280px width shows main content and sidebar side-by-side.
8. All hyperlinks have `href` (may be `#`) — no `href`-less `<a>` tags for navigation-like elements.
9. HTML validates as HTML5 (W3C Nu Validator, no errors; warnings acceptable).
10. Semantic tags `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` are each used at least once.
11. File size of `index.html` is under 30 KB.

## Risks

Small scope, small risk surface. Called out for completeness:

- **R1 — Missing `<meta viewport>`**: Without it, the mobile-first responsive layout will not behave correctly on real phones. Mitigation: it is an explicit functional requirement (F2.4) and is on the verifier's checklist.
- **R2 — Inline CSS specificity conflicts**: With everything in one `<style>` block, ordering matters. Mitigation: write mobile-first with only additive `min-width` overrides so nothing needs to be "undone". Use classes (not deep descendant selectors) to keep specificity flat.
- **R3 — File-size creep**: Dummy body copy or overly verbose comments could push toward the 30 KB budget. Mitigation: verifier enforces the budget; trim dummy copy before adding more polish.
- **R4 — `outline: none` on links silently breaks keyboard a11y**: Do not disable focus outlines without a visible replacement. Mitigation: explicit `:focus-visible` styling is on the implementation checklist.
- **R5 — Multiple `<h1>`s**: Only the site title should be `<h1>`; post titles must be `<h2>`. Mitigation: called out in investigation "Potential pitfalls"; the verifier can optionally check heading hierarchy if time permits.
- **R6 — Using `<section>` where `<article>` is required**: Blog posts must be `<article>` (self-contained). Mitigation: verifier asserts ≥ 3 `<article>` elements.
- **R7 — W3C Nu Validator requires network**: If offline, this becomes a manual step. Mitigation: the structural checks in the verifier catch the most common HTML5 errors; the W3C step is a belt-and-braces confirmation.

Not risks in this scope: cross-browser JS compatibility (no JS), dependency vulnerabilities (no deps), build/pipeline flake (no build), performance regressions (single static file), security surface (no inputs, no forms, no fetch).

## Success Criteria (measurable)

- `index.html` exists at the repo root; `wc -c` reports < 30720 bytes.
- `node test_scripts/verify-blog-site.mjs` exits 0 with all checks passing.
- W3C Nu HTML Checker reports 0 errors on `index.html` (warnings OK).
- Manual browser check at 1280px and 375px confirms acceptance criteria 3, 6, and 7.
- All 11 acceptance criteria in the refined request are satisfied.

## Output

Upon completion:
- `index.html` at the repo root.
- `test_scripts/verify-blog-site.mjs` (verification helper).
- A brief summary (in chat or a phase summary) noting: file size in bytes, W3C validator result, verifier result, and any deviations taken under the auto-fix rules.
