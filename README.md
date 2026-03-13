# SellerActions — Micro SaaS Tools for E-Commerce Sellers

A dynamic, SEO-friendly static website showcasing affordable micro-SaaS tools for Amazon, Shopify, Walmart, eBay, and TikTok Shop sellers.

**Live Site:** [https://avocorecom.github.io/SellerActions/](https://avocorecom.github.io/SellerActions/)

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
- **Toast Notifications** — Success/info toasts for all user actions

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
├── index.html          # Homepage — hero, featured tools, categories, all tools, search/filter
├── product.html        # Dynamic product detail page (via ?slug=xxx)
├── category.html       # Dynamic category listing page (via ?cat=xxx)
├── cart.html           # Cart + store integration flow (3-step)
├── css/
│   └── style.css       # All shared styles (dark theme, responsive)
├── js/
│   ├── data.js         # Product catalog, categories, platforms, helper functions
│   └── app.js          # Cart system, toast notifications, modals, shared components
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages deployment workflow
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
- **Notify** — `Notify.subscribe(slug, email)` saves to localStorage AND sends to Formspree.
- **Toast** — `Toast.show(title, message, type)` for success/info notifications.
- **Modal** — `Modal.showNotifyForm(product)` opens the notify-me modal.
- **Shared Components** — `renderNav()`, `renderFooter()`, `renderToolCard()`, `renderCategoryCard()`.

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

---

## Deployment

The site is deployed to GitHub Pages via a GitHub Actions workflow.

### Automatic Deployment
Every push to `main` triggers the `.github/workflows/deploy.yml` workflow which:
1. Checks out the code
2. Uploads the entire directory as a GitHub Pages artifact
3. Deploys to GitHub Pages

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
- **Formspree** — Form submission handling
- **GitHub Pages** — Hosting and deployment
- **GitHub Actions** — CI/CD pipeline

---

## License

Copyright 2026 SellerActions / Avocore. All rights reserved.
