# Nikos's Notebook

A tiny static blog — "Notes on software, by Nikos Kostopoulos." Built as a
demo for the team-workflow pipeline: plain HTML and CSS, no build step, no
JavaScript, no external dependencies.

## File layout

```
.
├── index.html              # Home page: site header + reverse-chronological post list
├── styles.css              # Shared stylesheet for the home page and all post pages
├── posts/
│   ├── hello-world.html    # Post 1 — April 12, 2026
│   ├── second-post.html    # Post 2 — April 28, 2026
│   └── third-post.html     # Post 3 — May 15, 2026
└── README.md               # This file
```

Every page shares:

- a **site header** with the blog title, tagline, and a "Home" link,
- a **main** content area,
- a **footer** with a `mailto:` link and a short copyright line.

Pages use semantic HTML5 elements (`header`, `main`, `article`, `time`,
`footer`).

## How to view locally

No server or build step is required. Either:

1. **Open directly in a browser.** Double-click `index.html`, or from a
   terminal:

   ```sh
   # macOS
   open index.html

   # Linux
   xdg-open index.html

   # Windows (PowerShell)
   start index.html
   ```

   The site uses relative links, so navigation works fine from `file://`.

2. **Or serve it with any static file server**, e.g.:

   ```sh
   python3 -m http.server 8000
   ```

   Then visit <http://localhost:8000/>.

## Navigation

- From `index.html`, click any post title or its "Read more →" link to open
  that post.
- From any post page, click "← Back to home" (or the header title / "Home"
  link) to return to `index.html`.

## Design notes

- **Mobile-first, responsive.** Single column on narrow viewports; a
  comfortable ~720px reading width on desktop (`@media (min-width: 640px)`).
- **System font stack.** No web fonts, no CDN requests — the site renders
  completely offline.
- **No JavaScript.** Anywhere. Intentionally.
