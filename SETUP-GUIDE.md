# SellerActions — Full Setup & Deployment Guide

Complete technical guide covering the entire infrastructure: GitHub Pages hosting, custom domain, Supabase backend, Resend email, and .NET backend integration.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [GitHub Pages Hosting](#github-pages-hosting)
3. [Custom Domain Setup](#custom-domain-setup)
4. [Supabase Configuration](#supabase-configuration)
5. [Resend Email Setup](#resend-email-setup)
6. [Supabase SMTP Configuration](#supabase-smtp-configuration)
7. [Supabase Edge Function Deployment](#supabase-edge-function-deployment)
8. [.NET Backend Integration](#net-backend-integration)
9. [User Registration Flow (End-to-End)](#user-registration-flow-end-to-end)
10. [Database Schema](#database-schema)
11. [Monitoring & Logs](#monitoring--logs)
12. [Environment Variables & Secrets](#environment-variables--secrets)
13. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  GitHub Pages    │────>│  Supabase        │────>│  .NET Backend       │
│  (Static Site)   │     │  (DB + Auth +    │     │  (v1host.analision  │
│                  │     │   Edge Functions) │     │   .net/api)         │
│  - HTML/CSS/JS   │     │                  │     │                     │
│  - Product pages │     │  - PostgreSQL    │     │  - Tenant CRUD      │
│  - Cart flow     │     │  - Auth (JWT)    │     │  - Store management │
│  - OAuth callback│     │  - Edge Functions│     │  - SP-API integration│
└─────────────────┘     │  - RLS policies  │     └─────────────────────┘
                         └──────────────────┘
                                │
                         ┌──────────────────┐
                         │  Resend          │
                         │  (Email Service) │
                         │  - Welcome email │
                         │  - Magic links   │
                         │  - SMTP relay    │
                         └──────────────────┘
```

**Tech Stack:**
- **Frontend**: Static HTML/CSS/JS (no framework)
- **Hosting**: GitHub Pages (free, auto-deploy on push)
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (magic link + session management)
- **Serverless**: Supabase Edge Functions (Deno runtime)
- **Email**: Resend (SMTP + API)
- **Backend API**: ASP.NET Zero multi-tenant (.NET backend)
- **Amazon Integration**: SP-API OAuth 2.0

---

## GitHub Pages Hosting

### Current Setup

- **Repository**: `https://github.com/Avocorecom/SellerActions`
- **Branch**: `main` (auto-deploys on push)
- **URL**: `https://avocorecom.github.io/SellerActions/`

### Deploy Workflow

File: `.github/workflows/deploy.yml`

On every push to `main`:
1. Checks out code
2. Stamps version (`v1.5.0-{commit_hash}`) and deploy time into footer
3. Uploads to GitHub Pages

The version stamp replaces `__VERSION__` and `__DEPLOY_TIME__` placeholders in `js/app.js` at build time.

### Manual Deploy

Push to main triggers automatic deploy:
```bash
git add .
git commit -m "Your message"
git push origin main
```

Deploy takes ~1-2 minutes. Verify at the live URL.

---

## Custom Domain Setup

### Step 1: Purchase Domain

Buy `selleractions.com` from any registrar (Namecheap, Cloudflare, GoDaddy, etc.).

### Step 2: Configure GitHub Pages

1. Go to **GitHub Repo → Settings → Pages**
2. Under **Custom domain**, enter: `selleractions.com`
3. Click **Save**
4. Check **Enforce HTTPS** (after DNS propagates)

GitHub will create a `CNAME` file in your repo automatically.

### Step 3: Configure DNS Records

In your domain registrar's DNS management panel, add these records:

#### A Records (root domain → GitHub Pages)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `185.199.108.153` | 3600 |
| A | @ | `185.199.109.153` | 3600 |
| A | @ | `185.199.110.153` | 3600 |
| A | @ | `185.199.111.153` | 3600 |

#### CNAME Record (www subdomain)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | `avocorecom.github.io` | 3600 |

### Step 4: Wait for DNS Propagation

- Usually takes 10-30 minutes
- Can take up to 48 hours in rare cases
- Check status: `dig selleractions.com +short`
- After propagation, enable **Enforce HTTPS** in GitHub Pages settings

### Step 5: Update References

After domain is live, update these hardcoded URLs:

1. **`js/app.js`** — `renderNav()` and any absolute URLs
2. **`supabase/functions/register-tenant/index.ts`** — Dashboard link in welcome email
3. **Amazon SP-API App settings** — Update OAuth redirect URL to `https://selleractions.com/authorize-amazon-seller-account/`
4. **Supabase Dashboard → Authentication → URL Configuration** — Update Site URL and Redirect URLs

---

## Supabase Configuration

### Project Details

| Setting | Value |
|---------|-------|
| Project Ref | `ccbcmxgdzxzgqkszcddk` |
| URL | `https://ccbcmxgdzxzgqkszcddk.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIs...` (in `js/db.js`) |
| Dashboard | `https://supabase.com/dashboard/project/ccbcmxgdzxzgqkszcddk` |

### Database Schema

Run the SQL in `supabase-schema.sql` in the Supabase SQL Editor. Key tables:

#### `store_credentials` (authenticated users)
```sql
create table store_credentials (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  platform text not null,
  store_name text,
  selling_partner_id text,
  spapi_oauth_code text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- RLS: users can only see/edit their own records
```

#### `store_connections` (unauthenticated fallback)
```sql
create table store_connections (
  id uuid default gen_random_uuid() primary key,
  store_name text,
  platform text not null,
  selling_partner_id text,
  spapi_oauth_code text,
  state text,
  status text default 'active',
  created_at timestamptz default now()
);
```

#### `user_subscriptions` (which products a user subscribed to)
```sql
create table user_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_slug text not null,
  product_name text,
  created_at timestamptz default now()
);
```

#### `integration_credentials` (third-party API keys: Veeqo, ShipStation)
```sql
create table integration_credentials (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  platform text not null,
  credentials jsonb not null default '{}',
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, platform)
);
```

#### `feature_requests`, `votes`, `comments` (community features)
See `supabase-schema.sql` for full schema.

### Authentication Setup

1. **Supabase Dashboard → Authentication → Providers**
   - Email provider: **Enabled**
   - Confirm email: **Enabled**
   - Magic link: **Enabled**

2. **Supabase Dashboard → Authentication → URL Configuration**
   - Site URL: `https://avocorecom.github.io/SellerActions/` (update to custom domain later)
   - Redirect URLs:
     - `https://avocorecom.github.io/SellerActions/cart.html`
     - `https://avocorecom.github.io/SellerActions/authorize-amazon-seller-account/`
     - (add custom domain equivalents after domain setup)

### Row Level Security (RLS)

All user-facing tables have RLS enabled. Users can only access their own data:
```sql
-- Example policy
create policy "Users can view own subscriptions"
  on user_subscriptions for select
  using (auth.uid() = user_id);
```

---

## Resend Email Setup

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up (free tier: 100 emails/day)
2. Current API Key: `re_dNqjtiwZ_DCptAyLKgAKz1q9NbumVJgTQ`

### Step 2: Add and Verify Domain

1. **Resend Dashboard → Domains → Add Domain**
2. Enter: `selleractions.com`
3. Resend will provide DNS records to add:

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| TXT | `_resend` | (provided by Resend) | Domain verification |
| CNAME | `resend._domainkey` | (provided by Resend) | DKIM signing |
| TXT | @ | `v=spf1 include:amazonses.com ~all` | SPF (if required) |

4. Add these DNS records in your domain registrar
5. Click **Verify** in Resend Dashboard
6. Wait for DNS propagation (usually 5-30 minutes)

### Step 3: Verify Domain Status

After DNS records propagate, domain status should show **Verified** in Resend Dashboard.

**Before domain verification:** Can only send to `huseyin@avocore.com` (owner email).
**After domain verification:** Can send to any email from `*@selleractions.com`.

### Email Templates

The welcome email is defined in `supabase/functions/register-tenant/index.ts` in the `sendWelcomeEmail()` function. It includes:
- User's name and company
- List of activated tools with status
- Trial end date
- Dashboard link
- SellerActions branding (dark theme)

---

## Supabase SMTP Configuration

This replaces Supabase's built-in email (which has a 2-3 emails/hour limit) with Resend.

### Step 1: Open SMTP Settings

**Supabase Dashboard → Project Settings → Authentication → SMTP Settings**

### Step 2: Enable Custom SMTP

Toggle **Enable Custom SMTP** to ON.

### Step 3: Enter Resend SMTP Details

| Field | Value |
|-------|-------|
| Sender email | `noreply@selleractions.com` |
| Sender name | `SellerActions` |
| Host | `smtp.resend.com` |
| Port number | `465` |
| Minimum interval | `10` |
| Username | `resend` |
| Password | `re_dNqjtiwZ_DCptAyLKgAKz1q9NbumVJgTQ` |

### Step 4: Save

Click **Save**. All Supabase auth emails (magic links, confirmations) will now go through Resend.

**Important:** Domain must be verified in Resend first (Step 2 above), otherwise emails will fail with `"Error sending confirmation email"`.

---

## Supabase Edge Function Deployment

### Prerequisites

```bash
# Install Supabase CLI (if not installed)
brew install supabase/tap/supabase

# Login (opens browser)
supabase login

# OR use access token (non-interactive)
export SUPABASE_ACCESS_TOKEN=sbp_8bfe5f1a1016e5df29d3c41a47f707f7cdab6c58
```

### Link Project

```bash
supabase link --project-ref ccbcmxgdzxzgqkszcddk
```

### Set Secrets

```bash
supabase secrets set \
  BACKEND_API_URL=https://v1host.analision.net/api \
  BACKEND_ADMIN_USER=ApplicationUser@avocore.com \
  BACKEND_ADMIN_PASS="KG7@9jtQ!R@drNX7GdB*" \
  RESEND_API_KEY=re_dNqjtiwZ_DCptAyLKgAKz1q9NbumVJgTQ
```

### Deploy

```bash
supabase functions deploy register-tenant
```

### Verify

```bash
# Should return validation error (expected)
curl -s -X POST \
  https://ccbcmxgdzxzgqkszcddk.supabase.co/functions/v1/register-tenant \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjYmNteGdkenh6Z3Frc3pjZGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzM0ODUsImV4cCI6MjA4ODk0OTQ4NX0.hqNNI7mnp5mXsE12F_0MRjWHISx_nhZ_dsZn_STU8go" \
  -d '{}' | python3 -m json.tool

# Expected response:
# { "status": false, "error": "Missing required fields: email, name, password, companyName" }
```

### View Logs

**Supabase Dashboard → Edge Functions → register-tenant → Logs**

Or via CLI:
```bash
supabase functions logs register-tenant
```

---

## .NET Backend Integration

### Backend Details

| Setting | Value |
|---------|-------|
| Base URL | `https://v1host.analision.net/api` |
| Admin User | `ApplicationUser@avocore.com` |
| Admin Password | `KG7@9jtQ!R@drNX7GdB*` |
| Platform Name | `SellerActions` |
| Framework | ASP.NET Zero (multi-tenant) |

### API Endpoints Used

#### 1. Admin Authentication
```
POST /TokenAuth/Authenticate
Body: { userNameOrEmailAddress, password }
Response: { result: { accessToken } }
```

#### 2. Create Tenant
```
POST /services/app/Tenant/CreateTenant
Headers: Authorization: Bearer {adminToken}
Body: {
  tenancyName: "My_Store",
  name: "John Doe",
  adminEmailAddress: "john@example.com",
  adminPassword: "pass123",
  editionId: null,
  isInTrialPeriod: true,
  subscriptionEndDateUtc: "2026-03-31T00:00:00.000Z",
  isActive: true,
  platformName: "SellerActions",
  serviceTypeIdList: [
    { serviceTypeId: 20, stripeSubscriptionId: "" }
  ],
  customerId: ""
}
```

#### 3. Tenant Login
```
POST /TokenAuth/Authenticate
Body: { userNameOrEmailAddress: "john@example.com", password: "pass123" }
Response: { result: { accessToken, customerId } }
```

#### 4. Grant Store Access
```
POST /services/app/Stores/GrantAccessToStore
Headers: Authorization: Bearer {tenantToken}
Body: {
  IntegrationEndpointName: "Amazon",
  amazonMarketplaceIds: [3],
  PlatformName: "SellerActions",
  spapiOauthCode: "ABcDeFgHiJk",
  sellingPartnerId: "A1B2C3D4E5F6G7",
  name: "My Amazon Store"
}
```

#### 5. Get Service Types
```
GET /services/app/ServiceTypes/GetAll?WebsiteFilter=SellerActions
Headers: Authorization: Bearer {adminToken}
```

### Backend Database Tables

| Table | Purpose | Created By |
|-------|---------|------------|
| `Tenants` | Main tenant record | CreateTenant |
| `TenantServiceTypes` | Which services a tenant subscribed to | CreateTenant (via serviceTypeIdList) |
| `Stores` | Connected marketplace stores | GrantAccessToStore |
| `IntegrationEndpoints` | Platform definitions (Amazon, eBay, etc.) | Pre-configured |
| `ServiceTypes` | Available service definitions | Pre-configured |

### ServiceType ID Mapping

| Product Slug (Frontend) | serviceTypeId (Backend) |
|------------------------|------------------------|
| `amazon-custom-order-update-on-veeqo` | **20** |
| `amazon-custom-order-update-on-shipstation` | **3** |
| `suppressed-product-notification` | **11** |
| `order-guard-max` | **17** |
| `hijacker-report-service` | **8** |
| `review-request-for-amazon` | **7** |
| `amazon-mfn-to-shopify` | **6** |
| `amazon-mfn-to-walmart` | **9** |
| `amazon-mfn-to-ebay` | **10** |
| `shipper-act` | **18** |

Products without a `serviceTypeId` in `js/data.js` don't have a corresponding backend service yet.

---

## User Registration Flow (End-to-End)

### Flow Diagram

```
User visits site
       │
       ▼
[1] Browse products → Add to cart
       │                localStorage: ["amazon-custom-order-update-on-veeqo"]
       ▼
[2] Cart page → Review items → Click "Continue"
       │
       ▼
[3] Sign In step → Enter email → Receive magic link
       │                Supabase Auth: signInWithOtp()
       │                Email sent via Resend SMTP
       ▼
[4] Click magic link → Return to cart.html#access_token=xxx
       │                Supabase session established
       │                user_subscriptions saved to Supabase
       ▼
[5] Connect Store → Select Amazon → Enter store name
       │
       ▼
[6] Redirect to Amazon Seller Central OAuth
       │    URL: https://sellercentral.amazon.com/account-switcher/...
       │    App ID: amzn1.sp.solution.4744b25e-cf83-49bc-a0a3-d0b36118ee3f
       ▼
[7] Amazon authorizes → Redirect back with params
       │    ?spapi_oauth_code=ABcDeFg
       │    &selling_partner_id=A1B2C3D4E5F6G7
       │    &state=My%20Brand%20Store
       ▼
[8] authorize-amazon-seller-account/index.html
       │    Saves OAuth data to Supabase (store_credentials)
       │    Shows registration form
       ▼
[9] User fills registration form → Click "Create Account"
       │
       ▼
[10] Frontend calls Edge Function
       │    POST /functions/v1/register-tenant
       │    Body: { email, name, password, companyName,
       │            spapiOauthCode, sellingPartnerId,
       │            serviceTypeIds: [20],
       │            products: [{ slug, name }] }
       ▼
[11] Edge Function executes:
       │
       ├─ Step A: Admin login to .NET backend
       │          POST /TokenAuth/Authenticate
       │
       ├─ Step B: Create tenant
       │          POST /services/app/Tenant/CreateTenant
       │          (if email exists → skip, mark isExistingUser)
       │
       ├─ Step C: Login as tenant
       │          POST /TokenAuth/Authenticate
       │
       ├─ Step D: Grant Amazon store access
       │          POST /services/app/Stores/GrantAccessToStore
       │
       └─ Step E: Send welcome email via Resend API
                  POST https://api.resend.com/emails
       ▼
[12] Success response → Show "Your Free Trial Has Started!"
       │    Cart cleared
       │    Subscriptions saved to Supabase
       ▼
[13] User receives welcome email with:
       - Activated tools list
       - Trial end date (14 days)
       - Dashboard link
```

### Data Written at Each Step

| Step | Storage | Data |
|------|---------|------|
| [1] Add to cart | `localStorage` | `["amazon-custom-order-update-on-veeqo"]` |
| [4] Magic link login | Supabase Auth | User session (JWT) |
| [4] After login | Supabase `user_subscriptions` | `{ user_id, product_slug, product_name }` |
| [8] OAuth callback | Supabase `store_credentials` | `{ user_id, platform, selling_partner_id, spapi_oauth_code }` |
| [11-B] Create tenant | .NET `Tenants` | Tenant record |
| [11-B] Create tenant | .NET `TenantServiceTypes` | `{ serviceTypeId: 20 }` |
| [11-D] Grant store | .NET `Stores` | Amazon store record |
| [12] Success | Supabase `user_subscriptions` | (duplicate save for safety) |

### Extra Setup Step (Conditional)

If the product has `integrations` defined (e.g., Veeqo API key):

```
After Connect Store → Extra Setup step appears
       │
       ▼
User enters Veeqo API key
       │
       ▼
Saved to Supabase `integration_credentials`
       { user_id, platform: "veeqo", credentials: { api_key: "xxx" } }
```

---

## Monitoring & Logs

### Edge Function Logs

**Location:** Supabase Dashboard → Edge Functions → register-tenant → Logs

Every backend API call is logged with:
```
[API REQ] /services/app/Tenant/CreateTenant {"tenancyName":"My_Store",...}
[API RES] /services/app/Tenant/CreateTenant → 200 (342ms) {"result":{"tenantId":42},...}
```

Sensitive fields (passwords, tokens) are automatically masked as `***`.

**CLI access:**
```bash
supabase functions logs register-tenant --project-ref ccbcmxgdzxzgqkszcddk
```

### GitHub Actions Deploy Logs

**Location:** GitHub Repo → Actions tab → Latest workflow run

### Supabase Database

**Location:** Supabase Dashboard → Table Editor

Key tables to monitor:
- `store_credentials` — connected Amazon accounts
- `user_subscriptions` — which products users signed up for
- `integration_credentials` — third-party API keys (Veeqo, ShipStation)

---

## Environment Variables & Secrets

### Frontend (js/db.js) — Public

| Variable | Value | Purpose |
|----------|-------|---------|
| `SUPABASE_URL` | `https://ccbcmxgdzxzgqkszcddk.supabase.co` | Supabase project URL |
| `SUPABASE_KEY` | `sb_publishable_...` | REST API key |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Auth + anon access |

### Supabase Secrets (Edge Function) — Private

Set via: `supabase secrets set KEY=VALUE`

| Secret | Value | Purpose |
|--------|-------|---------|
| `BACKEND_API_URL` | `https://v1host.analision.net/api` | .NET backend URL |
| `BACKEND_ADMIN_USER` | `ApplicationUser@avocore.com` | Admin login |
| `BACKEND_ADMIN_PASS` | `KG7@9jtQ!R@drNX7GdB*` | Admin password |
| `RESEND_API_KEY` | `re_dNqjtiwZ_DCptAyLKgAKz1q9NbumVJgTQ` | Email sending |

### Supabase Access Token (CLI)

| Token | Value | Purpose |
|-------|-------|---------|
| `SUPABASE_ACCESS_TOKEN` | `sbp_8bfe5f1a1016e5df29d3c41a47f707f7cdab6c58` | CLI authentication |

### Amazon SP-API

| Setting | Value | Purpose |
|---------|-------|---------|
| App ID | `amzn1.sp.solution.4744b25e-cf83-49bc-a0a3-d0b36118ee3f` | OAuth app identifier |
| OAuth Redirect | `.../authorize-amazon-seller-account/` | Callback URL |

---

## Troubleshooting

### "Error sending confirmation email"
- **Cause:** Supabase custom SMTP not configured, or Resend domain not verified
- **Fix:** Configure SMTP in Supabase Dashboard (see [Supabase SMTP Configuration](#supabase-smtp-configuration)) and verify domain in Resend

### "Trial accounts must have subscription end date"
- **Cause:** `subscriptionEndDateUtc` missing in CreateTenant request
- **Fix:** Already fixed — Edge Function now sends `subscriptionEndDateUtc` (14 days from now)

### "Email already exist"
- **Cause:** Tenant with this email already exists in .NET backend
- **Fix:** Already handled — Edge Function falls back to login with existing credentials

### Magic link email not received
- **Cause:** Supabase built-in email has 2-3/hour limit
- **Fix:** Configure Resend as custom SMTP provider (see above)

### Edge Function returns 500
- **Check logs:** Supabase Dashboard → Edge Functions → register-tenant → Logs
- **Common causes:**
  - Backend API URL unreachable
  - Admin credentials invalid
  - Missing secrets (run `supabase secrets list` to verify)

### Amazon OAuth redirect fails
- **Check:** Amazon SP-API app settings — ensure redirect URL matches exactly
- **Check:** App ID in `cart.html` matches your Amazon developer app

### serviceTypeIds not saving to backend
- **Check:** Product has `serviceTypeId` field in `js/data.js`
- **Check:** Edge Function logs show `serviceTypeIdList` in CreateTenant request
- **Note:** Products without `serviceTypeId` won't create TenantServiceTypes records

### Deploy version not updating in footer
- **Check:** GitHub Actions workflow ran successfully
- **Check:** `js/app.js` contains `__VERSION__` and `__DEPLOY_TIME__` placeholders (not hardcoded values)

---

## Quick Reference Commands

```bash
# Deploy Edge Function
export SUPABASE_ACCESS_TOKEN=sbp_8bfe5f1a1016e5df29d3c41a47f707f7cdab6c58
supabase functions deploy register-tenant

# View Edge Function logs
supabase functions logs register-tenant --project-ref ccbcmxgdzxzgqkszcddk

# Set/update secrets
supabase secrets set KEY=VALUE

# List secrets
supabase secrets list

# Test Edge Function
curl -s -X POST \
  https://ccbcmxgdzxzgqkszcddk.supabase.co/functions/v1/register-tenant \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SUPABASE_ANON_KEY" \
  -d '{"email":"test@test.com","name":"Test","password":"test123","companyName":"TestCo"}'

# Get backend ServiceTypes
TOKEN=$(curl -s -X POST https://v1host.analision.net/api/TokenAuth/Authenticate \
  -H "Content-Type: application/json" \
  -d '{"userNameOrEmailAddress":"ApplicationUser@avocore.com","password":"KG7@9jtQ!R@drNX7GdB*"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['accessToken'])")

curl -s "https://v1host.analision.net/api/services/app/ServiceTypes/GetAll?WebsiteFilter=SellerActions" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```
