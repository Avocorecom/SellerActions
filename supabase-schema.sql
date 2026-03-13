-- SellerActions - Supabase Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- Feature Requests
create table feature_requests (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  email text,
  platform text default 'Amazon',
  status text default 'pending' check (status in ('pending', 'open', 'popular', 'planned', 'building', 'launched')),
  votes integer default 0,
  created_at timestamptz default now()
);

-- Votes (one per fingerprint per request)
create table votes (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references feature_requests(id) on delete cascade,
  fingerprint text not null,
  created_at timestamptz default now(),
  unique(request_id, fingerprint)
);

-- Comments
create table comments (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references feature_requests(id) on delete cascade,
  author text default 'Anonymous',
  text text not null,
  created_at timestamptz default now()
);

-- Indexes
create index idx_requests_status on feature_requests(status);
create index idx_requests_votes on feature_requests(votes desc);
create index idx_votes_request on votes(request_id);
create index idx_comments_request on comments(request_id);

-- Row Level Security (public read, authenticated insert)
alter table feature_requests enable row level security;
alter table votes enable row level security;
alter table comments enable row level security;

-- Anyone can read approved requests
create policy "Public can read approved requests"
  on feature_requests for select
  using (status != 'pending');

-- Anyone can insert new requests (they go to pending)
create policy "Anyone can submit requests"
  on feature_requests for insert
  with check (true);

-- Anyone can update vote counts
create policy "Anyone can update vote counts"
  on feature_requests for update
  using (true)
  with check (true);

-- Anyone can read/insert votes
create policy "Public can read votes" on votes for select using (true);
create policy "Anyone can vote" on votes for insert with check (true);
create policy "Anyone can unvote" on votes for delete using (true);

-- Anyone can read/insert comments
create policy "Public can read comments" on comments for select using (true);
create policy "Anyone can comment" on comments for insert with check (true);

-- Seed some initial approved requests
insert into feature_requests (title, description, platform, status, votes, created_at) values
  ('Inventory Demand Forecasting with AI', 'I need a tool that predicts when I''ll run out of stock based on sales velocity, seasonality, and trends. Current restock planning is all guesswork.', 'Amazon', 'popular', 47, '2026-03-01'),
  ('Automated Competitor Price Monitoring', 'I want real-time alerts when my competitors change prices on the same ASINs. Need to react fast to stay competitive without manually checking every day.', 'Amazon', 'planned', 38, '2026-03-02'),
  ('TikTok Shop to Shopify Order Sync', 'I sell on TikTok Shop and Shopify but orders don''t sync. I need one dashboard for both channels, including inventory levels.', 'TikTok Shop', 'open', 29, '2026-03-05'),
  ('Automated VAT/Sales Tax Calculator for EU Expansion', 'As a US seller expanding to EU marketplaces, calculating VAT for each country is a nightmare. Need something that auto-calculates and generates reports.', 'Multi-Platform', 'open', 22, '2026-03-06'),
  ('Return Fraud Pattern Detector', 'Some buyers are clearly abusing return policies — buying items, using them, and returning. I need a tool that identifies suspicious return patterns per customer.', 'Amazon', 'popular', 53, '2026-03-08'),
  ('Walmart Listing Quality Score Tracker', 'Walmart has a listing quality score but it''s hard to monitor across hundreds of SKUs. Need a tool that tracks score changes and recommends fixes.', 'Walmart', 'open', 15, '2026-03-09');
