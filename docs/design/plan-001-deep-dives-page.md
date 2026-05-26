# Plan 001 — Deep Dives page

## Request summary
Add a new `deep-dives.html` listing page plus at least one sample long-form
technical post under `posts/deep-dive-*.html`. Link the new page from the
shared site-nav on every existing page. Do not modify `styles.css`.

## Investigation / approach
The site is a small static HTML+CSS project. The existing
`posts.html` → `posts/<slug>.html` pattern is a perfect template for the new
section: the listing page uses `.post-list / .post-summary / .post-meta /
.post-excerpt / .read-more`, and post detail pages use `.post-full / .back-link`.
Reusing those classes means no `styles.css` changes are needed for the
list page itself.

The deep-dive post needs styling for `<pre>` and `<code>` blocks which
the stylesheet does not currently provide. Per the acceptance constraint
("do NOT modify `styles.css`"), the required code-block styles will live in
an inline `<style>` block in the `<head>` of each deep-dive post page,
scoped tightly so they cannot leak into other pages.

## Files to create
1. `deep-dives.html` — listing page (root), mirrors `posts.html` structure.
2. `posts/deep-dive-event-loop.html` — sample post: "How the JavaScript
   event loop actually schedules your code." ~1100 words with code snippets
   demonstrating the call stack, microtask vs macrotask ordering,
   `queueMicrotask`, and the render step.

## Files to modify (add "Deep Dives" link to shared site-nav and footer Links)
- `index.html`
- `posts.html`
- `about.html`
- `news.html`
- `weather.html`
- `communication.html`
- `posts/hello-world.html`
- `posts/second-post.html`
- `posts/third-post.html`

The acceptance criteria explicitly require the link on the six root-level
pages. The three existing post pages are updated for navigational
consistency — every page that uses the shared `site-nav` should expose the
same set of destinations.

## Nav placement
The current order is: Home · Posts · News · Weather · About · Contact.
"Deep Dives" sits naturally between Posts (short-form) and News, giving:
Home · Posts · Deep Dives · News · Weather · About · Contact.
Footer Links list gets the same insertion point.

## Acceptance check
- [ ] `deep-dives.html` renders with site header, tagline, "Home" link,
      and a reverse-chronological list of deep-dive entries.
- [ ] At least one `posts/deep-dive-*.html` file exists with code blocks
      and ~800–1500 words.
- [ ] All listed pages link to `deep-dives.html` from the header nav.
- [ ] `styles.css` is unchanged (`git diff styles.css` is empty).
- [ ] No JavaScript, no external resources.

## Risks
- Forgetting to update one of the nine nav blocks → mitigated by an
  explicit `grep` after the edits.
- Footer Links list drift → also updated for consistency.
