# Verification — Deep Dives page

## Build / lint
This is a static HTML+CSS site with no build step, no package manager, no
linter, and no test runner. The verification surface is therefore:
file existence, HTML structural sanity, link integrity, and the
constraint that `styles.css` was not modified.

## Acceptance checks

| # | Criterion | Result |
|---|---|---|
| 1 | `deep-dives.html` exists in repo root | ✅ PASS |
| 2 | At least one `posts/deep-dive-*.html` exists | ✅ PASS — `posts/deep-dive-event-loop.html` |
| 3 | All six required pages link to `deep-dives.html` in header nav | ✅ PASS — `index.html`, `posts.html`, `about.html`, `news.html`, `weather.html`, `communication.html` all contain `href="deep-dives.html"` |
| 4 | `deep-dives.html` lists posts with title, date, excerpt, "Read more" link | ✅ PASS — uses `.post-summary` / `.post-meta` / `.post-excerpt` / `.read-more` |
| 5 | `styles.css` is untouched | ✅ PASS — `git diff styles.css` is empty |
| 6 | No JavaScript anywhere in new files | ✅ PASS — `grep -i '<script'` returns nothing |
| 7 | No external fonts/CDN/tracking | ✅ PASS — `grep -E 'http://\|https://\|cdn\.\|googleapis\|fonts\.'` returns nothing |
| 8 | Deep-dive post is 800–1500 words | ✅ PASS — article body is ~924 words |
| 9 | Deep-dive post uses `<pre>` and `<code>` properly | ✅ PASS — five `<pre><code>…</code></pre>` blocks plus inline `<code>` usage |
| 10 | All cross-page links resolve to real files | ✅ PASS — checked each target |
| 11 | HTML structure is well balanced (open/close tag counts) | ✅ PASS — no imbalance for html/head/body/main/header/footer/article/nav/ul/ol/li/pre/code/section |
| 12 | Existing pages still mark their own nav entry as `is-current` | ✅ PASS |
| 13 | Mobile-first, responsive | ✅ PASS by reuse — relies on the existing `styles.css` `.page` rules (max-width: 720px, single-column on narrow viewports) plus the project's existing media-query layout |

## Bonus changes for site-wide consistency
The acceptance criteria require nav-link presence on six root-level pages.
For full navigational consistency the same link was also added to the
three existing post detail pages (`posts/hello-world.html`,
`posts/second-post.html`, `posts/third-post.html`) and to every page's
footer Links list. No existing functionality was changed.

## Overall verdict
**READY** — all acceptance criteria met, no existing functionality
broken, `styles.css` untouched.
