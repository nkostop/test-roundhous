# Small Blog Site — Team Workflow Demo

## Goal

Create a small static blog demonstrating the team-workflow pipeline.

## Scope

A multi-page static blog:

- `index.html` — home page with site header and a reverse-chronological list of post summaries (title, date, excerpt, "read more" link).
- `posts/hello-world.html` — first post.
- `posts/second-post.html` — second post.
- `posts/third-post.html` — third post.
- `styles.css` — shared stylesheet for the home page and all posts.
- `README.md` — explains what the site is, the file layout, and how to view it locally.

## Content

- **Site header (every page)**: blog title "Nikos's Notebook", short tagline ("Notes on software, by Nikos Kostopoulos"), and a "Home" link back to `index.html`.
- **Home page**: three post entries (one per post above), each with title, date, 1–2 sentence excerpt, and a link to the full post.
- **Each post page**: title, date, 3–5 short paragraphs of placeholder body content, and a "← Back to home" link to `index.html`.
- **Footer (every page)**: mailto link to `nikos@papergo.io` and a tiny copyright line.

## Constraints

- No build step. Plain HTML/CSS — open `index.html` directly in a browser and navigate with file:// links.
- No external CDNs, no JS frameworks, no JS at all.
- Mobile-responsive (single column at narrow widths; comfortable reading width on desktop).
- Semantic HTML5 (`header`, `main`, `article`, `time`, `footer`).
- Posts live under `posts/` and link relatively so the whole site works from `file://`.

## Acceptance

- Opening `index.html` in a browser shows the header, three post entries, and the footer.
- Clicking a post entry navigates to the corresponding post page; "← Back to home" returns to `index.html`.
- `README.md` documents the layout (`index.html`, `posts/*.html`, `styles.css`) and how to view the site locally.
