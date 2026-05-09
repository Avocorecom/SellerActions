# SellerActions — Micro SaaS Tools for E-Commerce Sellers

**Current Version: v1.6.0** (footer auto-stamps as `v{major}.{minor}.{commitCount}` per deploy — see VERSIONING)
Stack: Pure HTML5 · CSS3 · Vanilla JavaScript · Supabase (PostgreSQL + REST) · Formspree · GitHub Pages · No frameworks · No build step

A dynamic, SEO-friendly static website showcasing affordable micro-SaaS tools for Amazon, Shopify, Walmart, eBay, and TikTok Shop sellers.

**Live Site (custom domain):** [https://www.selleractions.com/](https://www.selleractions.com/) — CNAME: `selleractions.com`
**GitHub Pages URL:** [https://avocorecom.github.io/SellerActions/](https://avocorecom.github.io/SellerActions/)

---

## Overview

SellerActions is a marketplace-style landing site for micro-SaaS tools designed to solve specific pain points for e-commerce sellers. Each tool is a small, focused application — fee auditors, profit trackers, inventory guards, listing optimizers, reimbursement helpers, and more.

The site is fully static (HTML/CSS/JS) with dynamic behavior powered by vanilla JavaScript and localStorage. No frameworks, no build step, no backend required.

---

## Features

### Product Catalog
- **41 products** across 9 categories
- **14 live** tools (currently operational)
- **27 coming soon** tools (scored and prioritized from market analysis)
- **6 featured** products highlighted as "TOP PICK"
- Each product has a dedicated detail page with features, how-it-works, and use cases

### Categories
- Financial & Fees
- Cash Flow & Payments
- Reimbursement & Claims
- Inventory & Stock
- Listing & Content
- Ads & PPC
- Returns & Refunds
- Operations & Automation
- Multi-Channel

### Supported Platforms
- Amazon
- Shopify
- Walmart
- eBay
- TikTok Shop
- Etsy

### Working Mechanisms
- **Search** — Real-time filtering across product names, descriptions, platforms, and categories
- **Category Filters** — Filter tools by category or live/coming-soon status
- **Add to Cart** — localStorage-based cart system with badge counter
- **Notify Me** — Modal form for coming-soon products; sends email to Formspree
- **Store Integration Flow** — 3-step checkout: Review Cart → Connect Store → Start Trial
- **14-Day Free Trial** — All products include a free trial with no credit card required
- **Bundle Discount** — 50%+ discount automatically applied when 2 or more tools are in the cart. A persistent discount banner is shown site-wide.
- **Toast Notifications** — Success/info toasts for all user actions

### Feature Request System
A community-driven roadmap where users can submit tool ideas, vote on requests, and leave comments. Accessible at `/requests.html` and via the floating "Request a Feature" button on every page.

- **Submit Ideas** — Users describe a pain point, select a platform, and provide their email
- **Vote** — Upvote/downvote requests; votes are deduplicated per browser fingerprint
- **Comment** — Leave comments on any request
- **Email Prompt** — A popup optionally collects the user's email before voting or commenting. Email is saved to localStorage so users are only asked once. Skipping is always allowed.
- **Status Lifecycle** — Requests go through: `pending` → `open` → `popular` → `planned` → `building` → `launched`
- **Admin Control** — Change request status directly in the Supabase dashboard (Table Editor → `feature_requests` → edit `status`)
- **Sorting** — Sort by most voted or newest

### Supabase Backend
The feature request system is powered by [Supabase](https://supabase.com) (PostgreSQL + REST API). Three tables:

| Table | Purpose |
|-------|---------|
| `feature_requests` | Stores all submitted ideas with title, description, email, platform, status, vote count |
| `votes` | One row per vote, deduplicated by browser fingerprint. Optional email column. |
| `comments` | User comments on requests. Optional email column. |

Row Level Security (RLS) policies allow:
- **Public read** for all non-pending requests
- **Public insert** for new requests, votes, and comments
- **Public update** for vote counts

If Supabase is not configured, the system falls back to localStorage + hardcoded seed data.

### SEO
- Semantic HTML5 structure
- JSON-LD structured data (SoftwareApplication schema)
- Dynamic `<title>` and `<meta description>` per product page
- Open Graph tags
- Canonical URLs
- Responsive design (mobile-first)

---

## Project Structure

```
SellerActions/
├── index.html              # Homepage — hero, featured tools, categories, all tools, search/filter
├── product.html            # Dynamic product detail page (via ?slug=xxx)
├── category.html           # Dynamic category listing page (via ?cat=xxx)
├── cart.html               # Cart + store integration flow (3-step) with bundle discount
├── requests.html           # Feature requests — submit ideas, vote, comment
├── css/
│   └── style.css           # All shared styles (dark theme, responsive, email prompt modal)
├── js/
│   ├── data.js             # Product catalog, categories, platforms, helper functions
│   ├── app.js              # Cart, toast, modals, shared components, discount logic
│   └── db.js               # Supabase integration — feature requests, votes, comments
├── supabase-schema.sql     # SQL schema for Supabase tables, RLS policies, and seed data
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment workflow
├── .gitignore
└── README.md
```

---

## How It Works

### Pages & Routing
All pages are static HTML files. Dynamic content is rendered client-side using URL parameters:
- `product.html?slug=buybox-watchdog` — loads the BuyBox Watchdog product detail
- `category.html?cat=financial` — loads the Financial & Fees category page

### Data Layer (`js/data.js`)
All product and category data lives in a single JS file. Each product includes:
- `slug` — unique URL-safe identifier
- `name`, `shortDesc`, `longDesc` — display text
- `price`, `priceLabel` — pricing info
- `cat` — category key (maps to `CATEGORIES` object)
- `platforms` — array of platform keys (maps to `PLATFORMS` object)
- `live` — boolean (live vs. coming soon)
- `score` — market impact score (1-10)
- `featured` — boolean for TOP PICK badge
- `features` — array of `{title, desc}` for the detail page
- `howItWorks` — array of `{step, desc}` for the detail page
- `useCases` — array of strings for the detail page

Helper functions:
- `getProductBySlug(slug)` — find product by URL slug
- `getProductsByCategory(catSlug)` — filter products by category
- `getLiveProducts()` / `getComingSoonProducts()` / `getFeaturedProducts()`
- `searchProducts(query)` — full-text search across name, desc, platform, category
- `getCategoryCount(catSlug)` — count products per category

### App Logic (`js/app.js`)
- **Cart** — `Cart.addItem(slug)`, `Cart.removeItem(slug)`, `Cart.getProducts()`, etc. Stored in localStorage.
- **Discount** — `Discount.isEligible()`, `Discount.apply(price)` — 50%+ off for 2+ items in cart.
- **Notify** — `Notify.subscribe(slug, email)` saves to localStorage AND sends to Formspree.
- **Toast** — `Toast.show(title, message, type)` for success/info notifications.
- **Modal** — `Modal.showNotifyForm(product)` opens the notify-me modal.
- **Shared Components** — `renderNav()`, `renderFooter()`, `renderToolCard()`, `renderCategoryCard()`.

### Supabase Layer (`js/db.js`)
- **`db`** — Low-level REST client for Supabase (query, insert, update, delete).
- **`RequestsDB`** — High-level API for the feature request system:
  - `RequestsDB.getAll(sortBy)` — Fetch all approved requests with comments
  - `RequestsDB.vote(requestId, email)` — Toggle vote (with optional email)
  - `RequestsDB.addComment(requestId, author, text, email)` — Post a comment (with optional email)
  - `RequestsDB.submitRequest(title, desc, email, platform)` — Submit a new idea
  - `RequestsDB.hasVoted(requestId)` — Check local vote state
- Falls back to localStorage if Supabase is not configured.

### Form Submissions (Formspree)
All form submissions (Notify Me + Trial Signup) are sent to Formspree. The endpoint is configured at the top of `js/app.js`:

```js
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwpkgkqz';
```

**Submission types:**

| Type | Trigger | Data Sent |
|------|---------|-----------|
| `notify_me` | User clicks "Notify Me" on a coming-soon product | email, product_name, product_slug, product_category, product_price, platforms |
| `trial_signup` | User completes the cart checkout flow | email, store_name, store_type, seller_id, tools (list), tools_count |

To use your own Formspree form:
1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form
3. Copy the form endpoint (e.g., `https://formspree.io/f/xxxxxxxx`)
4. Replace the `FORMSPREE_ENDPOINT` value in `js/app.js`

Submissions will arrive in your Formspree dashboard and optionally forward to your email.

### Supabase Setup
Feature requests, votes, and comments are stored in Supabase. Configuration is in `js/db.js`:

```js
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_KEY = 'your-anon-public-key';
```

**Initial setup:**
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in the Supabase dashboard
3. Copy and run the contents of `supabase-schema.sql` — this creates all tables, indexes, RLS policies, and seed data
4. Go to Settings → API → copy the Project URL and `anon` `public` key
5. Paste them into `js/db.js`

**Adding email columns (for collecting voter/commenter emails):**
```sql
ALTER TABLE votes ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS email text;
```

**Managing requests:**
- New submissions go to `pending` status (hidden from public)
- To approve: open Table Editor → `feature_requests` → change `status` to `open`
- To highlight: set `status` to `popular` or `planned`

---

## Deployment

The site is deployed to GitHub Pages via a GitHub Actions workflow.

### Automatic Deployment
Every push to `main` triggers the `.github/workflows/deploy.yml` workflow which:
1. Checks out the code with **full git history** (`fetch-depth: 0` — required for the auto-incrementing commit count below)
2. **Stamps the version** into `js/app.js` (see VERSIONING below)
3. Uploads the entire directory as a GitHub Pages artifact
4. Deploys to GitHub Pages

### VERSIONING (auto-stamped on every commit)

The footer displays a build-stamped version derived from a **VERSION** file at the
repo root + git. Every commit produces a new, monotonically-increasing version
visible in production with **no manual bookkeeping**.

This pattern is mirrored from the sibling `ezcommerce-website` project so all
Avocorecom sites version themselves the same way.

**Format:** `v{major}.{minor}.{commitCount}` — e.g., `v1.6.57`
- `major.minor` come from the [VERSION](VERSION) file (single source of truth)
- `commitCount` = `git rev-list --count HEAD` — auto-increments by 1 on every commit
- Short commit SHA is appended after a ` · ` for traceability

**Mechanism:**
1. [.github/workflows/deploy.yml](.github/workflows/deploy.yml) reads `VERSION` + git, replaces tokens in `js/app.js` via `sed`
2. Two placeholders are replaced at deploy time:

   | Token (in source) | Replaced with | Source |
   |---|---|---|
   | `__VERSION__` | `v{major}.{minor}.{commitCount}` | `VERSION` file + `git rev-list --count HEAD` |
   | `__COMMIT__` | `{shortSha}` | `git rev-parse --short HEAD` |

3. Footer renders: `v1.6.57 · 0397bfa` (with hover tooltip showing the commit SHA) — see [js/app.js](js/app.js) line 670

**Local stamping (optional, for testing):**
- Run `bash scripts/generate-version.sh` to apply the same stamp locally — useful if you want to see the rendered version before pushing
- Restore placeholders before committing: `git checkout js/app.js`
- The placeholders `__VERSION__` and `__COMMIT__` are the canonical source of truth in git; the deploy workflow is the only thing that should produce stamped values in the deployed artifact

**Bumping major.minor:**
1. Edit [VERSION](VERSION) — bump `1.6.0` to `1.7.0` (or whatever)
2. Update **Current Version** at the top of this README and add an entry to **VERSION HISTORY**
3. Commit and push — the new version stamp ships on the next deploy
4. `commitCount` keeps incrementing across releases (it doesn't reset)

**Why `fetch-depth: 0` matters:**
GitHub Actions defaults `actions/checkout` to a shallow clone (depth=1), which would make `git rev-list --count HEAD` always return `1`. Setting `fetch-depth: 0` pulls the full history so the commit count reflects reality.

### Custom Domain
To use a custom domain (e.g., `tools.selleractions.com`):
1. Go to repo Settings → Pages
2. Enter your custom domain
3. Add a CNAME record in your DNS pointing to `avocorecom.github.io`
4. Wait for DNS propagation and SSL provisioning

---

## Local Development

No build step required. Just serve the files:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# Then open http://localhost:8080
```

---

## Adding / Editing Products

1. Open `js/data.js`
2. Add a new object to the `PRODUCTS` array following the existing format
3. Ensure the `cat` field matches a key in `CATEGORIES`
4. Ensure `platforms` entries match keys in `PLATFORMS`
5. Commit and push — the site deploys automatically

### Required Fields for a New Product
```js
{
  slug: "my-new-tool",           // unique, URL-safe
  name: "My New Tool",
  shortDesc: "One-line pitch.",
  longDesc: "Detailed description for the product page.",
  price: 19.99,
  priceLabel: "$19.99/mo",
  cat: "financial",              // must match a CATEGORIES key
  platforms: ["amazon", "shopify"], // must match PLATFORMS keys
  live: false,                   // true = live, false = coming soon
  score: 8.5,                   // 1-10 market impact score
  featured: false,               // true = TOP PICK badge
  trialDays: 14,
  features: [
    { title: "Feature Name", desc: "Feature description." }
  ],
  useCases: ["Use case description"],
  howItWorks: [
    { step: "Step Name", desc: "Step description." }
  ]
}
```

---

## Product Scoring

Products are scored on a 1-10 scale based on three weighted factors from market analysis:

| Factor | Weight | Description |
|--------|--------|-------------|
| Market Demand | High | Reddit mentions, forum activity, search volume |
| Competition | Medium | Existing solutions, gap in market |
| Differentiation | High | Unique value proposition vs. existing tools |

**Formula:** `SCORE = weighted_average(demand, competition_inverse, differentiation)`

Top-scored products (8.5+) are automatically marked as "Featured / TOP PICK."

---

## Tech Stack

- **HTML5** — Semantic markup, accessibility attributes
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — No frameworks, no dependencies
- **Google Fonts** — DM Sans + JetBrains Mono
- **Formspree** — Form submission handling (Notify Me + Trial Signup)
- **Supabase** — PostgreSQL database for feature requests, votes, and comments (REST API + RLS)
- **GitHub Pages** — Hosting and deployment
- **GitHub Actions** — CI/CD pipeline

---

## VERSION HISTORY

This log was started retroactively. Versions before v1.5.0 are inferred from
[.github/workflows/deploy.yml](.github/workflows/deploy.yml) where `v1.5.0` is
hardcoded as the current baseline; the actual change set behind earlier tags
lives only in git history (`git log --oneline`).

```
v1.0.0  Initial static site — homepage, product pages, category pages,
        cart with localStorage, Formspree integration. (inferred baseline)
v1.x.0  Iterative product catalog growth (14 live + 27 → 36 coming-soon),
        category filters, search, bundle discount logic, dark theme.
        Specific minor versions not logged at the time.
v1.5.0  Stamped automatically into js/app.js at deploy time as
        `v1.5.0-${COMMIT_SHORT}` via .github/workflows/deploy.yml.
        Includes: Supabase-backed feature request system (with localStorage
        fallback), email-prompt modal for vote/comment, status lifecycle
        (pending → open → popular → planned → building → launched),
        custom domain selleractions.com (GitHub Pages), CNAME file,
        Amazon SP-API authorize-amazon-seller-account flow folder, and
        services/ folder with two custom-order-update integrations
        (ShipStation, Veeqo). README.md updated with full version-control
        section and this version log.
v1.6.0  Aligned versioning mechanism with the sibling ezcommerce-website
        project. Every commit now produces a monotonically-increasing
        version stamp of the form `v{major}.{minor}.{commitCount}`, where
        major.minor come from a new VERSION file at the repo root and
        commitCount = `git rev-list --count HEAD`. The deploy workflow now
        clones with full git history (`fetch-depth: 0`) so the count is
        accurate. Footer template in js/app.js:670 changed from
        `__VERSION__ · deployed __DEPLOY_TIME__` to `__VERSION__ · __COMMIT__`,
        matching ezcommerce. Added scripts/generate-version.sh for local
        testing (mirror of ezcommerce's scripts/generate-version.mjs,
        adapted for shell + sed). README VERSIONING section rewritten.
        Changed files: VERSION (new), .github/workflows/deploy.yml,
        js/app.js, scripts/generate-version.sh (new), README.md
```

**To start logging future changes here**, follow the same format used by the
sibling projects (4fillment, ezcommerce-website):

```
vX.Y.Z  Short sentence on the change. Why it was made. What files were
        touched. Any rollout/migration notes.
        Changed files: ...
```

Bump rules of thumb:
- **Patch (`v1.5.x`)** — bug fixes, copy edits, single product additions
- **Minor (`v1.x.0`)** — new feature (new page, new system, schema change), batch product changes
- **Major (`vX.0.0`)** — breaking change in URL structure, removal of a feature, framework migration

---

## License

Copyright 2026 SellerActions / Avocore. All rights reserved.

---

selleractions.com · README v1.6.0
