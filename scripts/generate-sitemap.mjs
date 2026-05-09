#!/usr/bin/env node
/**
 * generate-sitemap.mjs
 *
 * Build-time dynamic sitemap generator for SellerActions.
 * Mirrors the resilience pattern from 4fillment's sitemap.php and
 * ezcommerce-website's app/sitemap.ts, adapted for static GitHub Pages
 * deploys (build-time fetch + file rewrite, no PHP/runtime).
 *
 * Pipeline:
 *   1. Fetch RankAI's dedicated /sitemap endpoint
 *   2. Rewrite each `/{slug}` URL → `/post.html?slug={slug}` so the entries
 *      map to the URL pattern that actually serves articles today (top-level
 *      `/{slug}` URLs return 404 on GitHub Pages without a 404.html SPA
 *      fallback; this is the same trade-off documented in the README).
 *   3. Inject the rewritten URLs into the existing static sitemap.xml just
 *      before the closing </urlset> tag.
 *
 * Resilience:
 *   - 5s AbortSignal timeout
 *   - Any failure (timeout, non-2xx, parse error) is logged + the script
 *     exits 0 leaving the committed static sitemap.xml unchanged. The
 *     deploy step keeps `continue-on-error: true` as defense-in-depth.
 *
 * Run via the GitHub Actions workflow on every deploy. Locally, you can
 * dry-run with `node scripts/generate-sitemap.mjs` then
 * `git checkout sitemap.xml` to restore.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const RANKAI_PROJECT_ID = 'cmn0yf2020001yog8zmfr7miu';
const RANKAI_SITEMAP_URL = `https://rankai.ai/api/projects/${RANKAI_PROJECT_ID}/sitemap`;
const FETCH_TIMEOUT_MS = 5000;
const SITEMAP_PATH = 'sitemap.xml';
const SITE_BASE = 'https://www.selleractions.com';

async function fetchRankAiUrls() {
  try {
    const res = await fetch(RANKAI_SITEMAP_URL, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'User-Agent': 'selleractions-sitemap/1.0' },
    });
    if (!res.ok) {
      console.warn(`[sitemap] RankAI returned HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
    return matches.map((m) => m[1].trim()).filter(Boolean);
  } catch (err) {
    console.warn(`[sitemap] RankAI fetch failed: ${err.message}`);
    return [];
  }
}

/**
 * Rewrite RankAI's `/{slug}` URLs to the working `/post.html?slug={slug}`
 * pattern. Returns null if the URL doesn't match the expected shape (root
 * path with a single non-empty slug segment from this site's domain).
 *
 * NOTE: when the canonical URL routing is fixed (e.g., a 404.html SPA
 * fallback or per-slug static pages generated at build time), remove this
 * rewrite — the URLs from RankAI will then work as-is.
 */
function rewriteUrl(url) {
  const prefix = `${SITE_BASE}/`;
  if (!url.startsWith(prefix)) return null;
  const slug = url.slice(prefix.length).replace(/\/$/, '');
  if (!slug || slug.includes('/') || slug.includes('?') || slug.includes('#')) {
    return null;
  }
  return `${SITE_BASE}/post.html?slug=${encodeURIComponent(slug)}`;
}

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const urls = await fetchRankAiUrls();
console.log(`[sitemap] Fetched ${urls.length} URLs from RankAI`);

if (urls.length === 0) {
  console.log('[sitemap] No RankAI URLs to merge — keeping static sitemap.xml');
  process.exit(0);
}

const rewritten = urls.map(rewriteUrl).filter(Boolean);
const skipped = urls.length - rewritten.length;
console.log(
  `[sitemap] Rewrote ${rewritten.length} URLs to /post.html?slug=... format` +
    (skipped > 0 ? ` (skipped ${skipped} non-matching)` : ''),
);

const original = readFileSync(SITEMAP_PATH, 'utf8');

const blogEntries = rewritten
  .map(
    (u) =>
      `  <url><loc>${escapeXml(u)}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`,
  )
  .join('\n');

const merged = original.replace(
  '</urlset>',
  `\n  <!-- RankAI Articles (auto-generated at deploy time by scripts/generate-sitemap.mjs) -->\n${blogEntries}\n</urlset>`,
);

if (merged === original) {
  console.warn('[sitemap] Could not find </urlset> to inject before — aborting');
  process.exit(0);
}

writeFileSync(SITEMAP_PATH, merged);
const totalUrls = (merged.match(/<url>/g) || []).length;
console.log(`[sitemap] Wrote merged sitemap.xml (${totalUrls} total <url> entries)`);
