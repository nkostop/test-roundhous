# Refined Request: Small Simple Blog HTML Site

## Category
Development (single-file static web page)

## Objective
Create a single self-contained static HTML file, `index.html`, at the repository root that renders a small, simple blog site. The page must include a header, a main content area containing several dummy blog posts, a sidebar, and basic visual styling delivered via an inline `<style>` tag. No build tooling, no framework, and no external CSS/JS assets are permitted.

## Scope

**In scope**
- A single `index.html` file at the project root.
- Semantic HTML5 markup for the page structure (header, main content, sidebar, footer).
- At least three dummy blog post entries with placeholder title, metadata (author/date), and body text.
- A sidebar with typical blog widgets (e.g., about box, recent posts list, categories/tags).
- A site header containing site title/branding and a simple navigation area.
- All CSS embedded within a single `<style>` tag inside the `<head>` of the HTML file.
- Basic, clean, readable visual styling (typography, spacing, layout, colors).
- A two-column layout on desktop (main content + sidebar) that degrades gracefully on narrow viewports.

**Out of scope**
- Any external stylesheets, CSS frameworks (Bootstrap, Tailwind, etc.), fonts loaded from CDNs, images loaded from external URLs, or icon libraries.
- JavaScript behavior of any kind (no `<script>` tags with logic, no interactivity beyond native HTML/CSS behavior).
- A build system, bundler, package manager, or dependency manifest.
- Multiple HTML pages, routing, or dynamic content generation.
- Backend integration, forms that submit data, authentication, or persistence.
- Full accessibility audit beyond basic semantic markup and reasonable color contrast.
- Cross-browser testing beyond current evergreen browsers.

## Requirements

### Functional / Content Requirements
1. The file `index.html` must exist at the repository root and open correctly as a static file in a modern web browser (no server required).
2. The page must declare `<!DOCTYPE html>`, use `lang="en"`, and include a `<meta charset="utf-8">` and a responsive `<meta name="viewport">` tag.
3. The page must set a meaningful `<title>` (e.g., the blog's name).
4. The header section must contain:
   - A site title or logo text.
   - An optional short tagline.
   - A simple horizontal navigation with at least 3 dummy links (e.g., Home, About, Contact).
5. The main content area must contain at least 3 dummy blog post entries. Each entry must include:
   - A post title.
   - Post metadata (author name and publish date, using placeholder values).
   - A short excerpt or body paragraph of dummy text (2–5 sentences).
   - A "Read more" link (may be a non-functional `href="#"`).
6. The sidebar must contain at least 3 distinct widgets, for example:
   - An "About" blurb.
   - A "Recent Posts" list (dummy titles as links).
   - A "Categories" or "Tags" list (dummy links).
7. A footer must be present with copyright text and the current year (may be hard-coded to 2026).

### Structural Requirements
8. All CSS must live inside a single `<style>` tag inside `<head>`; no `style` attributes on individual elements should be used except where clearly justified (e.g., none expected).
9. HTML must use semantic elements: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`.
10. Element IDs and class names must be lowercase-hyphenated and descriptive.

### Presentation / Non-Functional Requirements
11. Layout: on viewports ≥ 768px wide, the main content and sidebar must appear side-by-side. On narrower viewports the sidebar must stack below the main content.
12. Typography: a legible system font stack (e.g., `system-ui, -apple-system, Segoe UI, Roboto, sans-serif`), with a base font size of at least 16px and line-height of at least 1.5 for body text.
13. Colors: pleasing, sufficient contrast for text (WCAG AA-ish visually; formal audit not required). A restrained palette (roughly 2–4 colors) is preferred.
14. Spacing: consistent vertical rhythm and comfortable padding around content blocks.
15. The page must render without console errors or broken layout in the latest stable Chrome, Firefox, and Safari at both 1280px and 375px widths.
16. Total file size should remain small (target < 30 KB), reflecting the "small, simple" nature of the request.

## Constraints
- **Delivery format**: exactly one file, `index.html`, at the repository root.
- **No external assets**: no CDN references, no external `<link rel="stylesheet">`, no external image URLs. If images are used at all, they must be inline SVG or CSS-drawn.
- **No build tooling**: the file must be viewable simply by opening it in a browser.
- **No JavaScript logic**: `<script>` tags should not be added unless strictly necessary; the current spec has no need for any.
- **Greenfield project**: no existing conventions, so establish sensible defaults inside the file itself.

## Acceptance Criteria
1. Opening `index.html` in a modern browser via `file://` renders the full page without errors in the browser console.
2. Viewing the page source shows all styling inside a single `<style>` block within `<head>`, and no `<link>` tag references any external stylesheet.
3. The rendered page shows, from top to bottom: a header (with title and nav), a two-column region containing blog posts and a sidebar, and a footer.
4. There are at least 3 distinct dummy blog posts, each with title, metadata, body text, and a "Read more" link.
5. The sidebar contains at least 3 distinct widget blocks.
6. Resizing the browser to 375px width causes the sidebar to stack beneath the main content, and no horizontal scrolling appears.
7. Resizing the browser to 1280px width shows main content and sidebar side-by-side.
8. All hyperlinks are present (even if pointing to `#`) — no `href`-less `<a>` tags are used for navigation-like elements.
9. HTML validates as HTML5 (e.g., passes W3C Nu Validator with no errors; warnings are acceptable).
10. The document uses semantic tags `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, and `<footer>` at least once each.
11. File size of `index.html` is under 30 KB.

## Assumptions
- **Language**: Content is in English. Basis: no locale specified; English is a reasonable default.
- **Blog name**: The site name/branding is a placeholder such as "My Blog" or similar. Basis: none specified.
- **Post count**: Exactly 3 dummy posts satisfy "a few". Basis: "a few" commonly means 3–5; 3 is the minimum that clearly reads as plural variety.
- **Sidebar position**: Sidebar sits to the right of main content on desktop. Basis: common blog convention.
- **Color scheme**: Light theme with dark text. Basis: safer default for readability; no theme preference given.
- **No images**: Dummy posts do not need thumbnails or hero images. Basis: constraint against external assets and desire for simplicity.
- **No dark mode toggle**: Only a single visual theme is needed. Basis: complexity beyond "basic CSS styling".
- **No search / no comments**: These common blog features are omitted. Basis: not mentioned; would exceed "small, simple".
- **Static year in footer**: Copyright year is hard-coded (2026). Basis: no JavaScript is used.
- **Placeholder dates**: Blog post dates are plausible recent dates (e.g., 2026) but arbitrary. Basis: dummy content.

## Open Questions
None blocking. If the following surface later, they should be resolved via the same defaults noted in Assumptions:
- Preferred blog name / branding text.
- Preferred color palette or brand colors.
- Whether the "Read more" links should anchor to in-page section IDs or remain `#`.

## Original Request
```
# Request
Create a small, simple blog HTML site in `index.html`. It should have a basic layout with a header, a few dummy blog posts, a sidebar, and basic CSS styling included in the `<style>` tag.
```
