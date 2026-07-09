# Project Design — Small Simple Blog HTML Site

Design authority for `index.html` — a single-file, self-contained static blog page. This document distills the refined request, plan, and investigation into concrete instructions for the coder. It is intentionally right-sized for a one-file deliverable.

## Scope Reminder

- **Deliverable**: exactly one HTML file, `index.html`, at the repository root.
- **Optional**: `test_scripts/verify-blog-site.mjs` verification helper (Phase 2 of the plan).
- **No** external CSS/JS/font/image assets, **no** build tooling, **no** runtime JavaScript, **no** frameworks.
- **File-size budget**: < 30 KB for `index.html`.

## Implementation Units

**This project is a SINGLE implementation unit.** The deliverable is one HTML file plus an optional verification helper. Downstream orchestration must launch exactly one coder — not a fan-out across multiple coders. There is no module boundary to split, no interface to negotiate between components, and no ordering constraint beyond "write the file, then verify it."

Unit 1 (only unit): `index.html` (with optional `test_scripts/verify-blog-site.mjs`).

## File Structure

```
<repo root>/
├── index.html                            # THE deliverable (HTML5 + inline <style>)
└── test_scripts/
    └── verify-blog-site.mjs              # Optional Node ESM verifier (Phase 2)
```

No other files are created or modified. No `package.json`, no config files, no assets folder.

## Document Outline (exact HTML5 tree)

The following is the canonical element tree the coder must produce. Indentation shows nesting; comments in parentheses are non-normative. `ARIA` attributes shown are recommended per the investigation.

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="A small, simple demo blog.">
    <meta name="color-scheme" content="light dark">
    <title>My Blog — Notes and Essays</title>
    <style> … all CSS lives here (one and only one <style> block) … </style>
  </head>
  <body>
    <header class="site-header">                         (site-level header)
      <div class="site-header__row">                     (flex row: brand + nav)
        <div class="site-brand">
          <h1 class="site-title">My Blog</h1>
          <p class="site-tagline">Notes and essays on nothing in particular.</p>
        </div>
        <nav aria-label="Primary" class="site-nav">
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <div class="page">                                   (grid scaffold container)
      <main class="posts" aria-label="Blog posts">
        <article class="post">
          <header class="post__header">
            <h2 class="post__title">Post 1 title</h2>
            <p class="post__meta">By Ada Lovelace · March 3, 2026</p>
          </header>
          <p>… paragraph 1 …</p>
          <p>… paragraph 2 …</p>
          (optional paragraph 3)
          <p><a class="post__more" href="#"
                aria-label="Read more about Post 1 title">Read more →</a></p>
        </article>

        <article class="post"> … same shape … </article>  (Post 2)
        <article class="post"> … same shape … </article>  (Post 3)
      </main>

      <aside class="sidebar" aria-label="Sidebar">
        <section class="widget" aria-labelledby="about-heading">
          <h2 id="about-heading" class="widget__title">About</h2>
          <p>… 2–3 sentence blurb …</p>
        </section>

        <section class="widget" aria-labelledby="recent-heading">
          <h2 id="recent-heading" class="widget__title">Recent Posts</h2>
          <ul>
            <li><a href="#">Recent post one</a></li>
            <li><a href="#">Recent post two</a></li>
            <li><a href="#">Recent post three</a></li>
            <li><a href="#">Recent post four</a></li>
          </ul>
        </section>

        <section class="widget" aria-labelledby="categories-heading">
          <h2 id="categories-heading" class="widget__title">Categories</h2>
          <ul>
            <li><a href="#">Writing</a></li>
            <li><a href="#">Design</a></li>
            <li><a href="#">Code</a></li>
            <li><a href="#">Notes</a></li>
          </ul>
        </section>
      </aside>
    </div>

    <footer class="site-footer">
      <p>&copy; 2026 My Blog. All rights reserved.</p>
    </footer>
  </body>
</html>
```

Notes on this tree:

- `<aside>` follows `<main>` in source order so that on mobile it naturally stacks **below** the posts without any `order` or grid-reordering hack.
- Each `<article>` carries its own inner `<header>` for post title + metadata, per HTML5 semantics.
- Sidebar widgets are `<section>` elements with `aria-labelledby` pointing at their heading — a small, cheap a11y win.
- Only one `<h1>` (the site title). All post titles and sidebar widget titles are `<h2>`.
- No `<a>` element is left without an `href` (dummies use `href="#"`).
- The `.page` wrapper is the CSS-Grid host for the main+aside two-column region. This keeps the outer `<header>` and `<footer>` full-width and independent from that grid.

## Head Contract

Required elements inside `<head>`, in this order:

1. `<meta charset="utf-8">`
2. `<meta name="viewport" content="width=device-width, initial-scale=1">`
3. `<meta name="description" content="A small, simple demo blog.">` (placeholder description)
4. `<meta name="color-scheme" content="light dark">` — signals to the UA that both themes are supported so form controls, scrollbars, and default UA colors adapt to OS preference.
5. `<title>My Blog — Notes and Essays</title>` — title format: `Site Name — Short Descriptor`.
6. Exactly one `<style>` element containing all CSS.

Forbidden inside `<head>`:

- `<link rel="stylesheet">` (any target).
- `<link rel="preconnect">` / `<link rel="preload">` for fonts.
- Any external asset URL of any form.
- `<script>` elements (none in the document at all).
- More than one `<style>` element.

## Content Contract

**Exactly three blog posts.** Each `<article>` MUST contain:

- One `<h2>` post title (plain text placeholder).
- One `<p class="post__meta">` line containing author + date (e.g., `By Ada Lovelace · March 3, 2026`).
- 2–3 body `<p>` paragraphs of dummy prose (each 2–5 sentences). Keep total prose short enough that the file stays comfortably below 30 KB.
- Exactly one `<a class="post__more" href="#" aria-label="Read more about {post title}">Read more →</a>`.

Suggested placeholder post triplet (coder may adapt wording, but keep the shape):

| # | Title | Author | Date |
|---|-------|--------|------|
| 1 | Hello, world (again) | Ada Lovelace | March 3, 2026 |
| 2 | On small websites | Grace Hopper | April 12, 2026 |
| 3 | Notes from the workshop | Alan Turing | May 21, 2026 |

**Exactly three sidebar widgets**, in this order:

1. **About** — one `<p>` of 2–3 sentences of dummy prose describing the blog.
2. **Recent Posts** — `<ul>` with 4 `<li><a href="#">…</a></li>` items (dummy titles).
3. **Categories** — `<ul>` with 4 `<li><a href="#">…</a></li>` items (dummy category names). Naming this widget "Categories" (not "Tags") is fine; the refined request permits either.

**Footer** — single `<p>` with `&copy; 2026 My Blog. All rights reserved.` The year `2026` is hard-coded (no JS, per constraint).

**Header** — site title (`<h1>My Blog</h1>`), a one-sentence tagline `<p>`, and a `<nav aria-label="Primary">` containing a `<ul>` with three `<li><a href="#">…</a></li>` links: **Home**, **About**, **Contact**.

## Style Contract

The single `<style>` block MUST include, at minimum:

- **Universal box-sizing reset**: `*, *::before, *::after { box-sizing: border-box; }`.
- **CSS custom properties** on `:root` (see palette below) — used everywhere colors and the primary spacing scale appear.
- **System font stack** applied to the body:
  `font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;`
  Base `font-size: 16px` (or `100%`), `line-height: 1.5`. Same font stack for body and headings — no display font.
- **Mobile-first base styles**: single-column natural block flow. The `.page` grid uses `grid-template-columns: 1fr;` in the base.
- **Header row via Flexbox**: `.site-header__row` uses `display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-3);` so the brand and nav sit on one row on wide viewports and wrap on narrow ones.
- **CSS Grid for the page scaffold**: `.page { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }`.
- **Exactly one breakpoint**: `@media (min-width: 768px)` that sets `.page { grid-template-columns: minmax(0, 1fr) 260px; }` (main flexible, sidebar ~240–280px fixed). Also cap `body`/wrapper width via `max-width: 1100px; margin-inline: auto;` and add horizontal padding.
- **Focus styling**: use `:focus-visible` selectors on `a` (and any other interactive element) to keep a visible focus indicator. **Never use `outline: none`** without a visible replacement.
- **Dark mode**: a compact `@media (prefers-color-scheme: dark) { :root { … overrides for palette variables … } }` block. All colors reference the custom properties so the override is ~5 lines.
- **Print styles**: `@media print { … }` block (~10 lines) that hides `.site-nav`, `.sidebar`, and `.site-footer` (optional), drops background colors, forces black text, and lets content flow full width.
- **Typography rhythm**: generous vertical margins on paragraphs/headings using the spacing scale; readable line-length (the ~1100px wrapper + 260px sidebar leaves a comfortable main column).
- **Lists in the sidebar**: strip default bullets and left padding from `.widget ul`; use small vertical rhythm between items; underline link on hover / focus.

Forbidden CSS patterns:

- No `outline: none;` without a visible replacement.
- No `@font-face` referencing an external URL. No `@import url(…)`.
- No `background: url(…)` referencing an external URL. Inline SVG or CSS gradients are permitted (but not required).
- No CSS attempting to load external images.
- No `!important` unless there is a documented reason (there shouldn't be for this scope).

## CSS Custom-Property Palette

Declare the following on `:root`. All colors and the spacing scale in the stylesheet MUST reference these variables so the dark-mode block can override them in ~5 lines.

```css
:root {
  /* Color palette (light theme) */
  --color-bg:         #ffffff;   /* page background */
  --color-fg:         #1f2328;   /* primary text */
  --color-muted:      #57606a;   /* metadata, secondary text */
  --color-accent:     #0969da;   /* links, focus ring */
  --color-border:     #d0d7de;   /* hairlines, widget dividers */
  --color-surface:    #f6f8fa;   /* subtle widget background */

  /* Spacing scale (rem-based) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --space-6: 3rem;

  /* Layout */
  --content-max:      1100px;    /* wrapper max-width on desktop */
  --sidebar-w:        260px;     /* sidebar column width on desktop */
  --radius:           6px;       /* consistent corner radius */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:      #0d1117;
    --color-fg:      #e6edf3;
    --color-muted:   #8b949e;
    --color-accent:  #58a6ff;
    --color-border:  #30363d;
    --color-surface: #161b22;
  }
}
```

The exact hex values above are suggestions calibrated for WCAG AA-ish contrast; the coder may nudge them within the same intent but must keep the variable **names** as listed (`--color-bg`, `--color-fg`, `--color-muted`, `--color-accent`, `--color-border`, `--color-surface`, plus the `--space-N` scale, `--content-max`, `--sidebar-w`, `--radius`).

## Interface Contracts

**None.** This is a single-file deliverable with no modules, no imports, no exports, no functions, no cross-component boundaries. There is nothing to negotiate between components because there is only one component.

## Error Handling

**N/A.** This is static HTML with no runtime logic, no fetches, no forms that submit, no user input processing, and no JavaScript. There are no error paths to design for. If the browser fails to render the file, that is a browser bug or a user-environment issue, not something the deliverable can meaningfully handle.

## Technology Choices (with justification)

Reproduced from the investigator's short-list:

| Choice | Selected | Rationale |
|---|---|---|
| Page layout primitive | **CSS Grid** (outer scaffold) | Layout is 2D at the page level (top-bar, two-column middle, bottom-bar). Grid expresses this in one declaration. Baseline-supported since 2017. |
| Row-level alignment inside header | **Flexbox** | The header brand + nav is a genuine 1D row — flex is the idiomatic tool. Nesting flex inside a grid cell is idiomatic and cost-free. |
| Media-query direction | **Mobile-first (`min-width: 768px`)** | Base styles carry the simpler (stacked) case; the media query only turns *on* the two-column layout. Zero rules to "undo". |
| Semantic HTML pattern | **Nested S1** (per investigation) | `<article>` contains its own `<header>`; sidebar widgets are `<section>`s with `aria-labelledby`. Matches HTML5 conceptual model. |
| Font stack | **Pragmatic system stack** (F1) | Zero network cost, native feel on each OS, covers macOS/iOS/Windows/Android/ChromeOS with a clean fallback chain. |
| Dark mode | **`prefers-color-scheme` + CSS custom properties** | Cheap (~5 lines) once palette is variable-driven. No JS required. |
| Print support | **Small `@media print` block** | ~10 lines to hide sidebar/nav and flow content full width. Users occasionally print or Save-as-PDF blog articles. |
| Reset | **`box-sizing: border-box` universal** | One rule; saves headaches with padded elements. |
| JavaScript | **None** | Explicit requirement in refined request; nothing in scope requires it. |
| Build tooling / package manager | **None** | Explicit constraint. File opens directly via `file://`. |
| External assets | **None** | Explicit constraint. No `<link>`, no external images, no CDN fonts. |

## Architectural Decisions (with rationale)

**AD-1: CSS Grid for the page scaffold; Flexbox for row-level alignment.**
Rationale: The page has a 2D structure (header on top spanning full width; main + aside side by side; footer at bottom). Grid is the idiomatic 2D primitive. Flex would require fighting sizes (`flex: 1` / `flex: 0 0 260px`) and offers no compensating benefit. The header brand+nav row, however, is genuinely 1D — flex is the right tool there. Nesting is cheap and correct.

**AD-2: Mobile-first responsive strategy with a single `@media (min-width: 768px)` breakpoint.**
Rationale: The narrow (stacked) layout is the simpler layout. Making it the base means the single media query only *adds* the two-column grid rather than *undoing* it. Fewer specificity fights, less code, aligns with contemporary framework defaults (Tailwind, Bootstrap 5). The breakpoint value `768px` matches the refined request's "on viewports ≥ 768px" wording precisely.

**AD-3: Source-order-driven mobile stacking; `<aside>` follows `<main>` in the DOM.**
Rationale: On mobile, natural block flow stacks `<aside>` after `<main>` — which is the desired visual order (posts first, sidebar underneath). On desktop, Grid places `<aside>` in the right column. This means **no `order` property and no grid-reordering hack** is needed at either size. Source order also happens to be the accessible reading order (posts first, then supplementary widgets), which is the right choice regardless.

**AD-4: No JavaScript included in the file.**
Rationale: The refined request forbids JS logic and the design has no requirement that needs it. Copyright year is hard-coded to 2026 (per the refined request's assumption). Dark mode is delivered via `prefers-color-scheme`, not a toggle. "Read more" links are non-functional `href="#"` dummies. Keeping JS out of the file simplifies the deliverable, keeps the file small, and eliminates an entire category of runtime failure.

**AD-5: CSS custom properties for the entire palette, from day one.**
Rationale: Even for the light theme, using variables costs almost nothing. It makes the `prefers-color-scheme: dark` override a ~5-line block rather than a rewrite. It also documents the palette intent (`--color-accent`, `--color-muted`) in a way that class-specific hex values would not.

**AD-6: `.page` grid host is a separate wrapper — the outer `<header>` and `<footer>` are outside it.**
Rationale: The two-column region is only the middle band. Placing `<header>` and `<footer>` outside `.page` keeps them full-width and independent from the two-column grid, which avoids column-spanning rules and keeps the grid template trivial (`1fr` mobile, `1fr 260px` desktop).

**AD-7: Named-class BEM-lite naming (`.site-header`, `.post__title`, `.widget__title`).**
Rationale: Flat, low-specificity selectors keep the mobile-first cascade predictable. No deep descendant selectors to fight. Class names are lowercase-hyphenated per the refined request's structural rule.

## Verification Hook (Phase 2 — informational)

The optional `test_scripts/verify-blog-site.mjs` (per Phase 2 of the plan) is the coder's own tool and does not affect the design. If produced, it should assert:

- File size < 30720 bytes.
- Exactly one `<style>` inside `<head>`; zero `<link rel="stylesheet">`; zero `<script>`.
- Presence of each mandatory semantic tag; `<article>` count ≥ 3.
- `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="utf-8">`, `<meta name="viewport" …>`, non-empty `<title>`.
- No `<a>` without `href`.

## Non-Goals (explicit)

- No skip-link (out of scope; low value for a 3-widget dummy page).
- No manual dark-mode toggle (would require JS).
- No `light-dark()` function (overkill; a media query is easier to read at a glance).
- No container queries (only one page-level breakpoint).
- No `clamp()` fluid typography (16px + 1.5 line-height meets the requirement).
- No animations, so no `prefers-reduced-motion` guard.
- No icons or inline SVG artwork (not requested).
- No forms, no interactivity, no fetches, no persistence.

## Summary

- **Deliverable**: one `index.html` at the repo root (plus optional Phase 2 verifier).
- **Layout**: CSS Grid outer scaffold + Flexbox header row, mobile-first with a single `min-width: 768px` breakpoint.
- **Semantics**: nested HTML5 pattern with per-article `<header>`, `aria-label` on `<nav>` and `<aside>`, `aria-labelledby` on sidebar `<section>`s.
- **Style contract**: system font stack, `box-sizing: border-box` reset, CSS custom-property palette (light + `prefers-color-scheme: dark`), `:focus-visible`, small `@media print` block.
- **Interfaces / errors**: none / N/A — single static file, no runtime logic.
- **Units**: exactly one implementation unit → orchestrate a single coder.
