# Project Functions

This document lists the functional requirements the project must satisfy. It is the running catalog of "what this thing must do" and is refined as the project evolves.

Source: `docs/design/refined-request-blog-site.md` (initial extraction).

## Scope Summary

A single self-contained static HTML file (`index.html`) at the repository root that renders a small, simple blog page. All CSS is embedded via one inline `<style>` tag. No JavaScript, no external assets, no build tooling.

## Functional Requirements

### F1. Deliverable
- **F1.1** — Deliver exactly one file, `index.html`, at the repository root.
- **F1.2** — The file must open correctly as a static file (`file://`) in a modern browser without a server.
- **F1.3** — No external assets: no external stylesheets, fonts, images, icon libraries, CDNs, or scripts.
- **F1.4** — No build tooling, package manager, or dependency manifest is used.

### F2. Document Fundamentals
- **F2.1** — Declare `<!DOCTYPE html>`.
- **F2.2** — `<html lang="en">`.
- **F2.3** — Include `<meta charset="utf-8">`.
- **F2.4** — Include a responsive `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- **F2.5** — Provide a meaningful `<title>` (the blog name).
- **F2.6** — Include `<meta name="color-scheme" content="light dark">` (from investigation recommendation).

### F3. Header
- **F3.1** — A `<header>` with site title/branding text.
- **F3.2** — An optional short tagline.
- **F3.3** — A `<nav>` with at least 3 dummy links (e.g., Home, About, Contact).

### F4. Main Content — Blog Posts
- **F4.1** — A `<main>` region containing at least 3 dummy `<article>` blog posts.
- **F4.2** — Each post has a title (`<h2>`).
- **F4.3** — Each post has metadata (author name + publish date, placeholder values).
- **F4.4** — Each post has a body of 2–5 sentences of dummy text.
- **F4.5** — Each post has a "Read more" link (may point to `#`).

### F5. Sidebar
- **F5.1** — An `<aside>` with at least 3 distinct widget blocks.
- **F5.2** — Widget examples: "About" blurb, "Recent Posts" list, "Categories" or "Tags" list.
- **F5.3** — Each widget uses a `<section>` with a heading.

### F6. Footer
- **F6.1** — A `<footer>` with copyright text.
- **F6.2** — Copyright year is hard-coded to 2026.

### F7. Structural Rules
- **F7.1** — All CSS lives inside a single `<style>` element inside `<head>`.
- **F7.2** — No `style="..."` attributes on individual elements (except with clear justification).
- **F7.3** — Semantic HTML5 tags used at least once each: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`.
- **F7.4** — Element IDs and class names are lowercase-hyphenated and descriptive.
- **F7.5** — All hyperlinks have `href` (dummy `#` acceptable) — no `href`-less `<a>` for navigation.

### F8. Responsive Layout
- **F8.1** — At viewports ≥ 768px, main content and sidebar are side-by-side.
- **F8.2** — At narrower viewports, the sidebar stacks below main content.
- **F8.3** — At 375px width, no horizontal scrolling.
- **F8.4** — At 1280px width, two-column layout is visible.
- **F8.5** — Layout strategy is mobile-first with a single `@media (min-width: 768px)` breakpoint (from investigation).

### F9. Typography & Visual Style
- **F9.1** — System font stack: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- **F9.2** — Base font size ≥ 16px.
- **F9.3** — Body line-height ≥ 1.5.
- **F9.4** — Restrained palette (2–4 colors) with sufficient contrast (visually WCAG AA-ish).
- **F9.5** — Consistent vertical rhythm and comfortable padding.

### F10. Quality-of-Life (from investigation, low-cost wins)
- **F10.1** — Universal `box-sizing: border-box` reset.
- **F10.2** — A `max-width` on the content wrapper for readable line lengths on wide monitors.
- **F10.3** — A compact `@media (prefers-color-scheme: dark)` block driven by CSS custom properties on `:root`.
- **F10.4** — A short `@media print` block that hides nav/sidebar and drops backgrounds.
- **F10.5** — Visible `:focus-visible` outline preserved on interactive elements.
- **F10.6** — `aria-label` on the primary `<nav>` and on the `<aside>` sidebar.

### F11. Non-Functional Constraints
- **F11.1** — Total file size < 30 KB.
- **F11.2** — Renders without console errors in latest Chrome, Firefox, and Safari.
- **F11.3** — HTML validates as HTML5 (W3C Nu Validator, no errors; warnings acceptable).

## Out of Scope (explicit)

- External stylesheets, CSS frameworks (Bootstrap, Tailwind), CDN fonts, external images/icons.
- Any JavaScript logic or interactivity beyond native HTML/CSS behavior.
- Build system, bundler, or dependency manifest.
- Multiple HTML pages, routing, or dynamic content.
- Backend integration, forms that submit, authentication, persistence.
- Full accessibility audit beyond basic semantic markup and reasonable contrast.
- Manual dark-mode toggle, search, comments, thumbnails, or hero images.
