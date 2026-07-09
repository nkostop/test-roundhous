#!/usr/bin/env node
// verify-blog-site.mjs
//
// Acceptance-criteria-driven verifier for the single-file blog deliverable
// (`index.html` at the repository root).
//
// Reads index.html, runs a series of independent checks, and prints a PASS/FAIL
// line per check with a short reason. Exits 0 if all pass, 1 otherwise.
//
// Only uses Node built-ins (node:fs, node:path, node:url) — no dependencies.
// Node 18+.

import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Resolve index.html relative to this script's location so cwd doesn't matter.
// Script lives at <repo>/test_scripts/verify-blog-site.mjs, so the repo root
// is one directory up.
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');
const indexPath = resolve(repoRoot, 'index.html');

// ---------------------------------------------------------------------------
// Tiny check runner: collect { name, pass, reason } tuples and report.
// Each check is wrapped in try/catch so one throw can't kill the whole run.
// ---------------------------------------------------------------------------
const results = [];

function check(name, fn) {
  try {
    const out = fn();
    if (out === true) {
      results.push({ name, pass: true, reason: 'ok' });
    } else if (out && typeof out === 'object' && 'pass' in out) {
      results.push({ name, pass: !!out.pass, reason: out.reason || (out.pass ? 'ok' : 'failed') });
    } else {
      results.push({ name, pass: false, reason: 'check returned no result' });
    }
  } catch (err) {
    results.push({ name, pass: false, reason: `error: ${err && err.message ? err.message : String(err)}` });
  }
}

// ---------------------------------------------------------------------------
// Check 1: File exists and is readable.
// Also loads `html` for use by all subsequent checks; if this fails we bail
// out early because nothing else can run without the file contents.
// ---------------------------------------------------------------------------
let html = null;
let byteSize = 0;
try {
  const stat = statSync(indexPath);
  byteSize = stat.size;
  html = readFileSync(indexPath, 'utf8');
  results.push({ name: '01 file exists and is readable', pass: true, reason: `read ${byteSize} bytes from ${indexPath}` });
} catch (err) {
  results.push({ name: '01 file exists and is readable', pass: false, reason: `cannot read ${indexPath}: ${err.message}` });
}

if (html !== null) {
  // -------------------------------------------------------------------------
  // Check 2: File size < 30 KB (30720 bytes).
  // Uses statSync's size (byte count on disk), not string length.
  // -------------------------------------------------------------------------
  check('02 file size under 30 KB (30720 bytes)', () => {
    return byteSize < 30720
      ? { pass: true, reason: `${byteSize} bytes < 30720` }
      : { pass: false, reason: `${byteSize} bytes >= 30720` };
  });

  // -------------------------------------------------------------------------
  // Check 3: Starts with <!DOCTYPE html> (case-insensitive).
  // Uses trimStart() so a BOM or leading whitespace does not fail the check.
  // -------------------------------------------------------------------------
  check('03 starts with <!DOCTYPE html>', () => {
    const head = html.trimStart().slice(0, 20).toLowerCase();
    return head.startsWith('<!doctype html>')
      ? true
      : { pass: false, reason: `first bytes: ${JSON.stringify(html.slice(0, 20))}` };
  });

  // -------------------------------------------------------------------------
  // Check 4: <html lang="en"> — attribute may have any whitespace around `=`
  // and inside the tag. Also allow single or double quotes.
  // -------------------------------------------------------------------------
  check('04 contains <html lang="en">', () => {
    // <html ... lang [ws] = [ws] ("en"|'en') ... >
    const re = /<html\b[^>]*\blang\s*=\s*["']en["'][^>]*>/i;
    return re.test(html) ? true : { pass: false, reason: '<html lang="en"> not found' };
  });

  // -------------------------------------------------------------------------
  // Check 5: <meta charset="utf-8"> (case-insensitive value; quote-flexible).
  // -------------------------------------------------------------------------
  check('05 contains <meta charset="utf-8">', () => {
    const re = /<meta\b[^>]*\bcharset\s*=\s*["']?utf-8["']?[^>]*>/i;
    return re.test(html) ? true : { pass: false, reason: '<meta charset="utf-8"> not found' };
  });

  // -------------------------------------------------------------------------
  // Check 6: viewport meta tag with width=device-width.
  // Matches the meta tag and confirms its content string contains
  // `width=device-width` (case-insensitive, whitespace-tolerant).
  // -------------------------------------------------------------------------
  check('06 viewport meta with width=device-width', () => {
    // capture the whole <meta ... name="viewport" ...> element
    const metaRe = /<meta\b[^>]*\bname\s*=\s*["']viewport["'][^>]*>/i;
    const m = html.match(metaRe);
    if (!m) return { pass: false, reason: 'no <meta name="viewport"> found' };
    // then check the content attribute for width=device-width
    const contentRe = /content\s*=\s*["'][^"']*width\s*=\s*device-width[^"']*["']/i;
    return contentRe.test(m[0])
      ? true
      : { pass: false, reason: `viewport meta lacks width=device-width: ${m[0]}` };
  });

  // -------------------------------------------------------------------------
  // Check 7: Exactly one <style> block.
  // Count opening <style ...> tags (case-insensitive). Word-boundary avoids
  // matching hypothetical <styles> variants.
  // -------------------------------------------------------------------------
  check('07 exactly one <style> block', () => {
    const matches = html.match(/<style\b[^>]*>/gi) || [];
    return matches.length === 1
      ? { pass: true, reason: `found ${matches.length}` }
      : { pass: false, reason: `expected 1, found ${matches.length}` };
  });

  // -------------------------------------------------------------------------
  // Check 8: No <link rel="stylesheet" (any casing / quote style / whitespace).
  // -------------------------------------------------------------------------
  check('08 no <link rel="stylesheet">', () => {
    const re = /<link\b[^>]*\brel\s*=\s*["']?stylesheet["']?[^>]*>/i;
    return re.test(html)
      ? { pass: false, reason: 'found a <link rel="stylesheet"> element' }
      : true;
  });

  // -------------------------------------------------------------------------
  // Check 9: No <script (any casing) — opening tag anywhere.
  // -------------------------------------------------------------------------
  check('09 no <script tags', () => {
    const re = /<script\b/i;
    return re.test(html)
      ? { pass: false, reason: 'found a <script> tag' }
      : true;
  });

  // -------------------------------------------------------------------------
  // Check 10: Exactly one <h1> tag.
  // Counts opening tags only, so paired </h1> is not double-counted.
  // -------------------------------------------------------------------------
  check('10 exactly one <h1>', () => {
    const matches = html.match(/<h1\b[^>]*>/gi) || [];
    return matches.length === 1
      ? { pass: true, reason: `found ${matches.length}` }
      : { pass: false, reason: `expected 1, found ${matches.length}` };
  });

  // -------------------------------------------------------------------------
  // Check 11: Exactly three <article> opening tags.
  // -------------------------------------------------------------------------
  check('11 exactly three <article> opening tags', () => {
    const matches = html.match(/<article\b[^>]*>/gi) || [];
    return matches.length === 3
      ? { pass: true, reason: `found ${matches.length}` }
      : { pass: false, reason: `expected 3, found ${matches.length}` };
  });

  // -------------------------------------------------------------------------
  // Check 12: Presence of each of <header>, <main>, <aside>, <footer>, <nav>.
  // Each is a separate assertion so a single missing tag can be pinpointed.
  // -------------------------------------------------------------------------
  const semanticTags = ['header', 'main', 'aside', 'footer', 'nav'];
  for (const tag of semanticTags) {
    check(`12 contains <${tag}>`, () => {
      const re = new RegExp(`<${tag}\\b[^>]*>`, 'i');
      return re.test(html)
        ? true
        : { pass: false, reason: `<${tag}> not found` };
    });
  }

  // -------------------------------------------------------------------------
  // Check 13: At least three <section> tags inside <aside>...</aside>.
  // Regex-approximation: find the first <aside opening tag, then the next
  // </aside>, and count <section opening tags between them.
  // -------------------------------------------------------------------------
  check('13 at least three <section> inside <aside>', () => {
    const openRe = /<aside\b[^>]*>/i;
    const closeRe = /<\/aside\s*>/i;
    const openMatch = html.match(openRe);
    if (!openMatch) return { pass: false, reason: '<aside> opening tag not found' };
    const openIdx = openMatch.index + openMatch[0].length;
    const afterOpen = html.slice(openIdx);
    const closeMatch = afterOpen.match(closeRe);
    if (!closeMatch) return { pass: false, reason: '</aside> closing tag not found' };
    const inside = afterOpen.slice(0, closeMatch.index);
    const sections = inside.match(/<section\b[^>]*>/gi) || [];
    return sections.length >= 3
      ? { pass: true, reason: `found ${sections.length}` }
      : { pass: false, reason: `expected >= 3, found ${sections.length}` };
  });

  // -------------------------------------------------------------------------
  // Check 14: @media (min-width: 768px) — whitespace-flexible around parens
  // and colon; case-insensitive @media keyword.
  // -------------------------------------------------------------------------
  check('14 contains @media (min-width: 768px)', () => {
    const re = /@media\s*\(\s*min-width\s*:\s*768px\s*\)/i;
    return re.test(html)
      ? true
      : { pass: false, reason: '@media (min-width: 768px) not found' };
  });

  // -------------------------------------------------------------------------
  // Check 15: prefers-color-scheme: dark (whitespace-flexible).
  // -------------------------------------------------------------------------
  check('15 contains prefers-color-scheme: dark', () => {
    const re = /prefers-color-scheme\s*:\s*dark/i;
    return re.test(html)
      ? true
      : { pass: false, reason: 'prefers-color-scheme: dark not found' };
  });

  // -------------------------------------------------------------------------
  // Check 16: @media print (whitespace-flexible).
  // -------------------------------------------------------------------------
  check('16 contains @media print', () => {
    const re = /@media\s+print\b/i;
    return re.test(html)
      ? true
      : { pass: false, reason: '@media print not found' };
  });

  // -------------------------------------------------------------------------
  // Check 17: box-sizing: border-box (whitespace-flexible).
  // -------------------------------------------------------------------------
  check('17 contains box-sizing: border-box', () => {
    const re = /box-sizing\s*:\s*border-box/i;
    return re.test(html)
      ? true
      : { pass: false, reason: 'box-sizing: border-box not found' };
  });

  // -------------------------------------------------------------------------
  // Check 18: No external URLs in href=, src=, or url(...).
  // We look for the literal schemes http:// or https:// in those contexts.
  // -------------------------------------------------------------------------
  check('18 no external URLs (http:// or https://) in href/src/url()', () => {
    const patterns = [
      { label: 'href="http(s)://..."',  re: /\bhref\s*=\s*["']https?:\/\//i },
      { label: 'src="http(s)://..."',   re: /\bsrc\s*=\s*["']https?:\/\//i  },
      { label: 'url(http(s)://...)',    re: /\burl\s*\(\s*["']?https?:\/\//i },
    ];
    const found = patterns.filter(p => p.re.test(html)).map(p => p.label);
    return found.length === 0
      ? true
      : { pass: false, reason: `found external references: ${found.join(', ')}` };
  });

  // -------------------------------------------------------------------------
  // Check 19: No javascript: scheme in any href.
  // -------------------------------------------------------------------------
  check('19 no javascript: scheme in href', () => {
    const re = /\bhref\s*=\s*["']\s*javascript:/i;
    return re.test(html)
      ? { pass: false, reason: 'found href="javascript:..."' }
      : true;
  });

  // -------------------------------------------------------------------------
  // Check 20: No inline event handler attributes (onclick=, onload=, etc.).
  // Uses a case-insensitive pattern for on<word>= to catch all common ones.
  // The preceding whitespace boundary avoids matching legitimate identifiers
  // that happen to end in "on" followed by an equals inside e.g. text.
  // -------------------------------------------------------------------------
  check('20 no inline event handler attributes (on*=)', () => {
    // \son[a-z]+\s*=  — an attribute-position occurrence of onXxx=
    const re = /\son[a-z]+\s*=/i;
    const m = html.match(re);
    return m
      ? { pass: false, reason: `found event handler attribute near: ${JSON.stringify(m[0])}` }
      : true;
  });

  // -------------------------------------------------------------------------
  // Check 21: No literal "Lorem ipsum" (case-insensitive).
  // -------------------------------------------------------------------------
  check('21 no "Lorem ipsum" placeholder text', () => {
    const re = /lorem\s+ipsum/i;
    return re.test(html)
      ? { pass: false, reason: 'found "Lorem ipsum" in the document' }
      : true;
  });

  // -------------------------------------------------------------------------
  // Check 22: Copyright with year 2026 — one of the three accepted variants:
  //   "© 2026", "&copy; 2026", or "Copyright 2026" (case-insensitive).
  // -------------------------------------------------------------------------
  check('22 copyright with 2026 present', () => {
    const variants = [
      { label: '© 2026',         re: /©\s*2026/ },
      { label: '&copy; 2026',    re: /&copy;\s*2026/i },
      { label: 'Copyright 2026', re: /copyright\s*2026/i },
    ];
    const hit = variants.find(v => v.re.test(html));
    return hit
      ? { pass: true, reason: `matched "${hit.label}"` }
      : { pass: false, reason: 'none of "© 2026" / "&copy; 2026" / "Copyright 2026" found' };
  });
}

// ---------------------------------------------------------------------------
// Report.
// ---------------------------------------------------------------------------
let passed = 0;
let failed = 0;
for (const r of results) {
  const tag = r.pass ? 'PASS' : 'FAIL';
  if (r.pass) passed++; else failed++;
  console.log(`[${tag}] ${r.name} — ${r.reason}`);
}
console.log('');
console.log(`${passed} of ${results.length} checks passed`);

process.exit(failed === 0 ? 0 : 1);
