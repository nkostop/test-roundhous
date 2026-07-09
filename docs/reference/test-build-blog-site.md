---
status: completed
scope: static-html-verification
target_path: .
framework: node-builtin-esm-script
tests_added: 26
tests_updated: 0
tests_passed: 26
tests_failed: 0
implementation_gaps: 0
---

# Test Build Report — Blog Site Verification

## Script

- Path: `test_scripts/verify-blog-site.mjs`
- Runtime: Node.js 18+ (uses ESM, `node:fs`, `node:path`, `node:url` built-ins only)
- Invocation: `node test_scripts/verify-blog-site.mjs`
- Exits with code `0` on all-pass, `1` on any failure.
- Resolves `index.html` relative to the script location (`..`), so `cwd` does not affect behavior.

## Scope Reality Check

- Deliverable is a single static `index.html`.
- No test framework in the project (no jest, vitest, mocha, pytest); no `package.json`.
- Per the plan (`docs/design/plan-001-blog-site.md`), the verifier is a plain Node ESM script.
- No external dependencies were added.

## Full Script Output (verbatim)

```
[PASS] 01 file exists and is readable — read 10718 bytes from /tmp/roundhouse-jobrun-fa4f443f-6471-472f-9ac8-96b79fa129cf-gxCESu/workspace/inproc-fa4f443f-6471-472f-9ac8-96b79fa129cf-73407aea-22d6-4bbb-99ce-84c0ebc648c0-8pzrKL/index.html
[PASS] 02 file size under 30 KB (30720 bytes) — 10718 bytes < 30720
[PASS] 03 starts with <!DOCTYPE html> — ok
[PASS] 04 contains <html lang="en"> — ok
[PASS] 05 contains <meta charset="utf-8"> — ok
[PASS] 06 viewport meta with width=device-width — ok
[PASS] 07 exactly one <style> block — found 1
[PASS] 08 no <link rel="stylesheet"> — ok
[PASS] 09 no <script tags — ok
[PASS] 10 exactly one <h1> — found 1
[PASS] 11 exactly three <article> opening tags — found 3
[PASS] 12 contains <header> — ok
[PASS] 12 contains <main> — ok
[PASS] 12 contains <aside> — ok
[PASS] 12 contains <footer> — ok
[PASS] 12 contains <nav> — ok
[PASS] 13 at least three <section> inside <aside> — found 3
[PASS] 14 contains @media (min-width: 768px) — ok
[PASS] 15 contains prefers-color-scheme: dark — ok
[PASS] 16 contains @media print — ok
[PASS] 17 contains box-sizing: border-box — ok
[PASS] 18 no external URLs (http:// or https://) in href/src/url() — ok
[PASS] 19 no javascript: scheme in href — ok
[PASS] 20 no inline event handler attributes (on*=) — ok
[PASS] 21 no "Lorem ipsum" placeholder text — ok
[PASS] 22 copyright with 2026 present — matched "&copy; 2026"

26 of 26 checks passed
```

Exit code: `0`.

## Check Results

| # | Check | Result |
|---|-------|--------|
| 01 | file exists and is readable | PASS |
| 02 | file size under 30 KB (30720 bytes) | PASS |
| 03 | starts with `<!DOCTYPE html>` | PASS |
| 04 | contains `<html lang="en">` | PASS |
| 05 | contains `<meta charset="utf-8">` | PASS |
| 06 | viewport meta with `width=device-width` | PASS |
| 07 | exactly one `<style>` block | PASS |
| 08 | no `<link rel="stylesheet">` | PASS |
| 09 | no `<script` tags | PASS |
| 10 | exactly one `<h1>` | PASS |
| 11 | exactly three `<article>` opening tags | PASS |
| 12a | contains `<header>` | PASS |
| 12b | contains `<main>` | PASS |
| 12c | contains `<aside>` | PASS |
| 12d | contains `<footer>` | PASS |
| 12e | contains `<nav>` | PASS |
| 13 | at least three `<section>` inside `<aside>` | PASS |
| 14 | contains `@media (min-width: 768px)` | PASS |
| 15 | contains `prefers-color-scheme: dark` | PASS |
| 16 | contains `@media print` | PASS |
| 17 | contains `box-sizing: border-box` | PASS |
| 18 | no external URLs in `href`/`src`/`url()` | PASS |
| 19 | no `javascript:` scheme in `href` | PASS |
| 20 | no inline event handler attributes (`on*=`) | PASS |
| 21 | no literal "Lorem ipsum" | PASS |
| 22 | copyright with 2026 present | PASS |

Total: **26 of 26 PASS**.

## Manual Review Needed

None. All automated checks pass. The remaining acceptance criteria are inherently visual/manual and out of scope for this static-analysis script:

- Acceptance criterion 1 — no browser console errors when opened via `file://` (manual browser check).
- Acceptance criteria 3, 6, 7 — visual layout at 1280px and 375px widths (manual browser check).
- Acceptance criterion 9 — W3C Nu Validator HTML5 conformance (requires network / external tool).

These are documented as manual steps in `docs/design/plan-001-blog-site.md` Phase 2.

## Notes on Implementation

- Each check is wrapped in a `try/catch` so a single throw cannot mask other results.
- `<article>`, `<h1>`, and `<style>` counts use opening-tag regexes (`<tag\b[^>]*>`) to avoid double-counting closing tags.
- The `<section>`-inside-`<aside>` check slices between the first `<aside>` opening tag and the next `</aside>` closing tag, then counts `<section>` opening tags within that slice — a regex-approximation sufficient for this deliverable per the task instructions.
- The external-URL check inspects three attribute contexts: `href="http(s)://..."`, `src="http(s)://..."`, and `url(http(s)://...)`.
- The event-handler check matches the attribute-position pattern `\son[a-z]+\s*=` which reliably catches `onclick=`, `onload=`, `onerror=`, `onmouseover=`, etc., without false positives against ordinary text.
- The copyright check accepts any of the three variants specified: `© 2026`, `&copy; 2026`, or `Copyright 2026` (case-insensitive).
