# Investigation: Small Simple Single-File Blog HTML Site

## Executive Summary

For a single-file `index.html` blog with header + main + right sidebar + footer, an inline `<style>` block, no JS, and a 768px breakpoint, the recommended approach is:

- **Layout**: CSS Grid for the outer page scaffold (header / main+aside / footer), with Flexbox used only where linear alignment is needed (the header nav row, and any horizontal metadata rows inside posts).
- **Responsive strategy**: Mobile-first with a single `@media (min-width: 768px)` breakpoint that switches the main+aside region from a stacked single column to a two-column grid.
- **Semantic HTML**: `<header>` (with nested `<nav>`), `<main>` containing three `<article>` elements (each with its own inner `<header>`), `<aside>` for the sidebar (with `<section>` blocks for each widget), and `<footer>` at the bottom.
- **Font stack**: A pragmatic modern system font stack: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- **Quality-of-life**: Include the one-line `<meta name="color-scheme" content="light dark">` and a minimal `@media (prefers-color-scheme: dark)` override; include a small `@media print` block. Skip a manual dark-mode toggle (needs JS) and skip container queries / `light-dark()` (unneeded scope).

The overall bias is: use the simplest primitive that unambiguously expresses the layout intent, and add only the quality-of-life touches that cost a handful of lines and pay off immediately.

## Context

- **What**: A greenfield, single-file static blog page. The refined request mandates one `index.html` at the repo root with all CSS inline, no external assets, no JS, target size < 30 KB, and semantic HTML5.
- **Why the investigation**: Even though the technology space (vanilla HTML+CSS) is small, several small decisions compound into the shape of the final file. Choosing the wrong primitive (e.g., float-based columns) makes the code longer and less robust; choosing the wrong media-query direction produces a stylesheet that fights itself.
- **Refined request**: `docs/design/refined-request-blog-site.md`
- **Key constraints driving choices**:
  - Two-column desktop layout collapsing to one column at 768px.
  - Semantic tags `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` are all mandatory.
  - Base font size >= 16px, line-height >= 1.5.
  - Total file < 30 KB.
  - No JavaScript, no external assets.
  - Must render clean in latest Chrome/Firefox/Safari at 1280px and 375px.

## Options Identified

### CSS layout approaches for header + main + sidebar

#### Option A: CSS Grid outer scaffold, Flexbox for row-level UI (recommended)

- **Description**: Use a grid on the `<body>` or a top-level wrapper to lay out header / (main + aside) / footer. Optionally use a nested grid on a `.content` wrapper for the two-column region. Flexbox is used only for the header's title+nav row and any inline metadata.
- **Strengths**: One clean declaration expresses the layout ("sidebar is 260px, main is `1fr`, gap between them"). Explicit main+sidebar widths avoid the flexbox trick of `flex: 1` on main and `flex: 0 0 260px` on the sidebar. Collapses to a single column with one line: `grid-template-columns: 1fr;` inside the media query. Named grid areas are self-documenting.
- **Weaknesses**: Slightly more CSS than a pure flexbox approach for people already fluent in flex. Nothing else meaningful.
- **Effort/Complexity**: Low.
- **Risk**: Low. Grid has been Baseline since 2017 and works in every modern evergreen browser.
- **Best suited when**: A page has a defined 2D structure (header/content/footer where content is itself two columns) — exactly this case.

#### Option B: Flexbox-only

- **Description**: Use `display: flex; flex-direction: column;` on the wrapper for vertical stacking, and a nested `display: flex;` on the middle region to place main + aside side by side.
- **Strengths**: Familiar; slightly less new syntax if the author has only used flex before. Great for the row-level alignments inside the header.
- **Weaknesses**: To match a fixed-sidebar/fluid-main pattern you end up writing `flex: 1 1 auto` on main and `flex: 0 0 260px` on aside — the mental model of "the sidebar is 260px, main fills the rest" is more directly expressed in grid. When the current CSS spec guidance itself says "if you are using flexbox and find yourself disabling some of the flexibility, you probably need to use CSS grid layout", this is that case. Reordering for mobile (sidebar below main) requires either `flex-direction: column` plus source order care or an `order` property; grid handles it more naturally.
- **Effort/Complexity**: Low.
- **Risk**: Low. Baseline since 2015.
- **Best suited when**: The layout is genuinely one-dimensional (a nav row, a row of tags, a stack of sidebar widgets) — good for the sub-components, not the page scaffold.

#### Option C: Float-based layout

- **Description**: The pre-2015 approach: `float: left` on main, `float: right` on aside, with widths as percentages and a clearfix on the container.
- **Strengths**: None relevant in 2026. Works in ancient browsers, which we do not target.
- **Weaknesses**: Requires clearfix hacks. Equal-height columns are painful. Ordering is source-order-bound. Verbose CSS. Every current CSS-layout reference treats floats as a legacy layout method.
- **Effort/Complexity**: Medium (more CSS lines, plus clearfix boilerplate).
- **Risk**: Medium — easy to introduce subtle layout bugs (collapsed containers, overflow issues).
- **Best suited when**: Never, for a new project targeting modern browsers.

### Responsive strategy

#### Option R1: Mobile-first (`min-width` media queries) (recommended)

- **Description**: Write base styles for the narrow (single-column) case. Add a single `@media (min-width: 768px) { ... }` block that turns on the two-column grid and any desktop-only spacing tweaks.
- **Strengths**: Base CSS is the simplest case (natural block flow). Only additive rules inside the media query. No specificity fights, no rules to "undo". Aligns with current framework defaults (Tailwind, Bootstrap 5) and Google mobile-first indexing.
- **Weaknesses**: None material for this scope. (SEO relevance is minor for a single dummy blog file, but the code-quality argument stands regardless.)
- **Effort/Complexity**: Low.
- **Risk**: Low.
- **Best suited when**: The mobile layout is the simpler layout — which is our case.

#### Option R2: Desktop-first (`max-width` media queries)

- **Description**: Write base styles for the two-column desktop case, then override to a single column under `@media (max-width: 767.98px)`.
- **Strengths**: Familiar to anyone who learned CSS pre-2015.
- **Weaknesses**: Base styles carry all the two-column complexity that then has to be undone inside the media query. Every additional breakpoint compounds this. On a tiny file it's still workable, but the code smells worse.
- **Effort/Complexity**: Low.
- **Risk**: Low.
- **Best suited when**: An existing desktop-only codebase is being retrofitted for mobile — not our case.

### Semantic HTML structure choices

All the required tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`) are mandatory per the spec, so the interesting sub-decisions are about their internal composition.

#### S1: Standard nested pattern (recommended)

```
<body>
  <header>                          <!-- site header -->
    <h1>Blog title</h1>
    <p>tagline</p>
    <nav aria-label="Primary">
      <ul>...</ul>
    </nav>
  </header>
  <main>
    <article>
      <header>                      <!-- per-post header -->
        <h2>Post title</h2>
        <p class="post-meta">By ... on ...</p>
      </header>
      <p>body...</p>
      <a href="#">Read more</a>
    </article>
    ... (repeat for 3 posts)
  </main>
  <aside aria-label="Sidebar">
    <section aria-labelledby="about-heading">
      <h2 id="about-heading">About</h2>
      ...
    </section>
    <section aria-labelledby="recent-heading">
      <h2 id="recent-heading">Recent Posts</h2>
      <ul>...</ul>
    </section>
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading">Categories</h2>
      <ul>...</ul>
    </section>
  </aside>
  <footer>
    <p>&copy; 2026 ...</p>
  </footer>
</body>
```

- **Strengths**: Matches the HTML5 conceptual model exactly: an `<article>` is self-contained and can carry its own `<header>` with title/metadata; the sidebar's widgets are `<section>`s each with their own heading; the primary nav has `aria-label="Primary"` to distinguish it from the sidebar nav-like lists. Heading hierarchy stays clean (`h1` for the site, `h2` for post titles and sidebar widget headings).
- **Weaknesses**: None material.

#### S2: Flat `<div>`-heavy structure

- **Description**: Use `<div>` wrappers instead of nested `<header>`/`<footer>`/`<section>`, keeping only the mandatory outer semantic tags.
- **Strengths**: Slightly fewer characters.
- **Weaknesses**: The refined request explicitly emphasises semantic markup and lists the tags to use. This option is strictly worse for accessibility, SEO, and validation without any offsetting benefit.

Recommendation: **S1**.

Small structural sub-decisions:
- **Sidebar order in the DOM**: Place `<aside>` after `<main>` in the source. On desktop the grid positions it to the right of main; on mobile the natural source order stacks it correctly below. No `order` property or grid reordering needed.
- **Nav markup**: `<nav>` containing `<ul>` with `<li><a>` links is the accessible, screen-reader-friendly choice.
- **Post "Read more" link**: An `<a href="#">` inside the `<article>` is fine per the request; a more accessible variant would give it `aria-label="Read more about {post title}"` — cheap upgrade, worth doing.

### Font stack recommendation

#### F1: Pragmatic modern system stack (recommended)

```css
font-family: system-ui, -apple-system, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif;
```

- **Strengths**: Zero network cost (no font downloads). Feels native on each OS. Covers macOS/iOS (`-apple-system`, and `system-ui` picks up SF on newer Safari), Windows (`Segoe UI`), Android/ChromeOS (`Roboto`), and falls through cleanly to `Arial`/`sans-serif`.
- **Weaknesses**: On some Windows + Chromium + CJK-language combinations `system-ui` can render Latin glyphs awkwardly. For an English-only dummy blog this is not a real risk.
- **Effort**: Zero.
- **Risk**: Low.

#### F2: Longer historical stack

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
```

- **Strengths**: Explicit Linux desktop coverage (`Oxygen-Sans`, `Ubuntu`, `Cantarell`).
- **Weaknesses**: Longer; `BlinkMacSystemFont` is redundant with `system-ui`/`-apple-system` on current Chromium; every extra byte counts against the 30 KB budget only trivially, but there's no real payoff either.

#### F3: A single specific fallback family (e.g., `Georgia, serif` or `Arial, sans-serif`)

- **Strengths**: Predictable rendering across OSes; author controls tone.
- **Weaknesses**: Loses the native-feel benefit of system fonts. Not a great match for the request's "clean, readable" intent.

Recommendation: **F1**. Use the same stack for body and headings; do not introduce a display font.

### Quality-of-life considerations

For a "small, simple" static file the guiding question is: does this cost more than a few lines and does it give a real user benefit? Below are the small touches worth including vs skipping.

**Worth including** (each is ~1–8 lines):

- **`<meta name="color-scheme" content="light dark">`**: One line in `<head>`. Signals to the browser to align form controls, scrollbars, and default UA colors with the user's OS preference. Free win.
- **Base a11y touches**:
  - `lang="en"` on `<html>` (already required by the spec).
  - `aria-label` on the two `<nav>`-like regions if both exist (primary nav in header; the "Recent Posts" list in the sidebar is inside a `<section>` with a heading so it doesn't strictly need one).
  - Visible `:focus-visible` outline on links (either a custom outline or trust the UA default — do not do `outline: none` without a replacement).
  - Sufficient color contrast (WCAG AA-ish; the request accepts a visual check).
- **A minimal `@media (prefers-color-scheme: dark)` block**: If the palette is expressed via CSS custom properties on `:root`, adding a dark override is ~5 lines and materially improves the experience for users whose OS is in dark mode.
- **A minimal `@media print` block**: ~10 lines to hide the sidebar and nav, drop backgrounds, and let content flow full width. Users occasionally print or Save-as-PDF blog articles; the cost is trivial.
- **`box-sizing: border-box`** universal reset: One rule (`*, *::before, *::after { box-sizing: border-box; }`) that saves headaches when sizing padded elements.
- **`max-width` on the body wrapper** (e.g., ~1100px) with `margin-inline: auto` for readable line lengths on very wide monitors.

**Worth skipping** for this scope:

- **Manual dark-mode toggle button**: Requires JS state and (probably) localStorage. The refined request says no JS. `prefers-color-scheme` alone is sufficient.
- **The new CSS `light-dark()` function**: Elegant, but only Baseline "newly available" (May 2024). For a file that must render clean in current evergreen browsers it's fine, but it's overkill relative to a plain media query. A media query is easier for a reader to grok at a glance.
- **Container queries**: Not needed. The layout has exactly one breakpoint at the page level.
- **Full accessibility audit / skip-link**: The refined request explicitly puts a full a11y audit out of scope. A skip-link is a nice-to-have but with only three sections on the page, its value is limited on a dummy blog. Optional.
- **`prefers-reduced-motion`** handling: No animations are planned, so nothing to guard.
- **CSS variables for theming beyond dark mode**: A tiny set (background, text, accent, border, muted) is enough. Do not over-engineer.
- **Icons / inline SVG**: Not requested. Skip.
- **Explicit viewport-relative font sizing (`clamp()` fluid type)**: Nice, but a static `16px` base with `1.5` line-height comfortably meets the requirement. Add only if there's spare budget.

## Comparison Matrix

### Layout approach

| Criterion | Grid outer + Flex inner (A) | Flexbox-only (B) | Floats (C) |
|---|---|---|---|
| Fits "sidebar + fluid main" mental model | High | Medium | Low |
| Lines of CSS needed | Low | Low-Medium | Medium-High |
| Ease of collapsing at 768px | Very easy | Easy | Fiddly |
| Source-order flexibility | Excellent | Good | Poor |
| Long-term viability | Excellent | Excellent | Legacy |
| Risk | Low | Low | Medium |

### Responsive strategy

| Criterion | Mobile-first (R1) | Desktop-first (R2) |
|---|---|---|
| Base-style simplicity | High | Low |
| Number of rules to "undo" | Zero | Several |
| Alignment with modern frameworks | High | Low |
| Fit for this project | Best | Acceptable |

### Font stack

| Criterion | Pragmatic system (F1) | Long historical (F2) | Specific family (F3) |
|---|---|---|---|
| File-size cost | Minimal | Slightly higher | Minimal |
| Native feel | High | High | Low |
| Coverage of major OSes | Full | Full + explicit Linux | Uniform (not native) |
| Simplicity | High | Medium | High |

## Recommendation

1. **Layout — CSS Grid for the page scaffold, Flexbox where a single-axis row alignment is needed.**
   - Rationale: The layout is explicitly two-dimensional at the page level (header on top spanning full width; main + aside side by side; footer at bottom). Grid expresses this in one declaration. Flex would require size-fighting and offers no compensating benefit. Floats are a legacy technique with no upside in 2026. Nesting flex inside a grid cell (e.g., for the header title + nav row) is idiomatic and cost-free.

2. **Responsive — Mobile-first with a single `@media (min-width: 768px)` breakpoint.**
   - Rationale: The narrow (stacked) layout is the simpler one; making it the base means the media query only turns *on* the two-column layout instead of undoing it. This produces the least code and aligns with universally cited 2026 best practice.

3. **Semantic HTML — Nested pattern (S1).**
   - `<header>` (site) contains `<h1>`, tagline, `<nav aria-label="Primary">` with `<ul>` list of links.
   - `<main>` contains three `<article>` elements. Each `<article>` contains an inner `<header>` (with `<h2>` title and a `<p class="post-meta">` line for author + date), one or more body `<p>` elements, and a `<a href="#">Read more</a>`.
   - `<aside aria-label="Sidebar">` contains three `<section>`s (About / Recent Posts / Categories), each with an `<h2>` heading. Recent Posts and Categories use `<ul>` lists.
   - `<footer>` contains a single `<p>` with copyright and the hard-coded year 2026.
   - Place `<aside>` after `<main>` in source order so mobile stacking is natural without `order` overrides.

4. **Font stack — pragmatic modern system:**
   `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

5. **Quality-of-life — include the small wins, skip the rest:**
   - Include: `<meta name="color-scheme" content="light dark">`, a compact `prefers-color-scheme: dark` override built on a handful of CSS custom properties, a `~10-line` print stylesheet, universal `box-sizing: border-box`, `max-width` on a content wrapper, `:focus-visible` styling on links, `aria-label`s on `<nav>` and `<aside>`.
   - Skip: manual dark toggle, `light-dark()`, container queries, fluid type via `clamp()`, skip-link (optional; low value for a 3-widget dummy page), animations / motion preferences.

**When the recommendation would change**:
- If the sidebar had to be reorderable per screen (e.g., appear above main on some sizes and below on others), grid's explicit control becomes even more decisive.
- If JS were allowed and a persistent user-controlled theme toggle were needed, we'd move to `light-dark()` with a `color-scheme` toggle on `<html>`. Not the case here.
- If Linux desktop native fonts (Ubuntu, Cantarell) were an important audience, expand to F2.

**Caveats / prerequisites**:
- Keep the total inline `<style>` block tight; the 30 KB budget is roomy but easy to blow if verbose comments or unused rules creep in.
- Declare CSS custom properties on `:root` from the start, even for the light theme, so the dark-mode override is a few lines instead of a rewrite.
- Ensure the desktop breakpoint at exactly 768px matches the spec's "on viewports ≥ 768px wide" language: `@media (min-width: 768px)`.

## Technical Research Guidance

**Research needed**: No.

Rationale: Every technology involved (CSS Grid, Flexbox, mobile-first media queries, HTML5 semantic elements, system font stacks, `prefers-color-scheme`, `@media print`) is Baseline-supported, decades-mature, and exhaustively documented. This investigation gathered specific 2026-current guidance on the trade-offs where multiple viable options exist; the recommended combination is a well-worn path with no unknowns that would materially affect planning or implementation. Proceeding straight to design and implementation is appropriate.

## Implementation Considerations

- **Key decisions still to be made during design**:
  - Exact color palette (2–4 colors as the request allows) for light theme and its dark-mode counterpart.
  - Sidebar fixed width on desktop (a value in the ~240–300px range is typical; the tight main column needs to remain comfortable to read).
  - Content max-width (suggest 1100–1200px for a two-column layout to keep line lengths readable).
  - Whether to include a skip-link (small a11y polish; optional).
- **Prerequisites**: None — no dependencies, no tooling.
- **Potential pitfalls to watch for**:
  - Do not use `<section>` where `<article>` is more appropriate for the blog posts; each post is self-contained.
  - Avoid multiple `<h1>` elements — the site title is `<h1>`, post titles are `<h2>`.
  - Avoid `outline: none` on interactive elements without a visible replacement — this silently breaks keyboard a11y.
  - Watch the file size when writing generous dummy body copy; the < 30 KB budget is comfortable but not unlimited.
  - When adding the media query, ensure that any dimensions set in the base (mobile) styles do not need to be undone — that's the tell of desktop-first thinking creeping in.
- **Suggested first steps**:
  1. Sketch the CSS custom-property palette on `:root` (background, text, muted-text, accent, border, code-bg or similar).
  2. Draft the semantic HTML skeleton first with no CSS; verify each mandatory tag is present.
  3. Apply the base mobile-first styles (typography, spacing, colors).
  4. Add the `@media (min-width: 768px)` block that turns on the two-column grid.
  5. Add the small `prefers-color-scheme: dark` and `@media print` blocks last.
  6. Validate at the W3C Nu HTML Checker; visually inspect at 375px and 1280px.

## References

| # | Source | URL | What was learned |
|---|---|---|---|
| 1 | MDN — Relationship of grid layout to other layout methods | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Relationship_with_other_layout_methods | Canonical rule: grid for 2D layout, flex for 1D; if you're fighting flex sizes, switch to grid. |
| 2 | StudioMeyer — CSS Grid vs Flexbox 2026 | https://studiomeyer.io/en/blog/css-grid-vs-flexbox-2026 | Grid for page scaffold, flex for component internals is the 2026 consensus. |
| 3 | StudioLimb — CSS Flexbox vs Grid | https://www.studiolimb.com/guides/css-flexbox-vs-grid.html | Concrete header/sidebar/main/footer grid template pattern used as the model here. |
| 4 | DEV — CSS Layout in 2026 | https://dev.to/armorbreak/css-layout-in-2026-flexbox-grid-and-when-to-use-each-2026-155c | Confirmed Baseline support timelines and "no performance penalty for nesting" guidance. |
| 5 | CSSAWWWARDS — CSS Media Queries Guide 2026 | https://cssawwwards.com/blog/css-media-queries-guide-2026 | Mobile-first `min-width` is the standard; add breakpoints where content breaks, not by device. |
| 6 | UXPin — Mobile-First Design Guide 2026 | https://www.uxpin.com/studio/blog/a-hands-on-guide-to-mobile-first-design/ | Rationale for mobile-first: cleaner code, fewer overrides, framework alignment. |
| 7 | Noble Desktop — Mobile First vs Desktop First | https://blog.nobledesktop.com/learn/web-design/mobile-first-vs-desktop-first | Concrete example of why mobile-first requires fewer "undo" rules. |
| 8 | CSS-Tricks — System Font Stack | https://css-tricks.com/snippets/css/system-font-stack/ | Origin of the canonical GitHub/Bootstrap/Medium system stack. |
| 9 | Stefan Judis — Load the default OS font with CSS | https://www.stefanjudis.com/blog/load-the-default-os-font-with-css/ | Modern simplification: `system-ui` mostly replaces `-apple-system`/`BlinkMacSystemFont` on current browsers. |
| 10 | freeCodeCamp — Semantic HTML5 Elements Explained | https://www.freecodecamp.org/news/semantic-html5-elements/ | Blog article pattern with nested `<header>` inside `<article>`. |
| 11 | DEV — When to use main/section/article/header/footer/aside | https://dev.to/alebarbaja/when-to-use-and-in-html5-4f1l | Distinguishing `<article>` (self-contained) from `<section>` (thematic grouping). |
| 12 | HTMHell — Native HTML light and dark color scheme switching | https://www.htmhell.dev/adventcalendar/2024/9/ | Just adding `<meta name="color-scheme" content="light dark">` gives free UA-level dark mode. |
| 13 | MDN — prefers-color-scheme | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme | Confirmed media-query approach and the `light` default assumption during print. |
| 14 | CSSence — Six levels of dark mode | https://cssence.com/2024/six-levels-of-dark-mode/ | Print always renders as light regardless of dark-mode CSS — so print styles remain a separate concern worth handling explicitly. |

## Original Request

Refined request: `docs/design/refined-request-blog-site.md`

Raw request (preserved from the refined document):

```
# Request
Create a small, simple blog HTML site in `index.html`. It should have a basic layout with a header, a few dummy blog posts, a sidebar, and basic CSS styling included in the `<style>` tag.
```
