// SellerActions - Product & Category Data
// All product definitions, categories, and platform metadata

const PLATFORMS = {
  amazon: { name: "Amazon", color: "#fb923c", class: "tag-amazon" },
  shopify: { name: "Shopify", color: "#34d399", class: "tag-shopify" },
  walmart: { name: "Walmart", color: "#60a5fa", class: "tag-walmart" },
  ebay: { name: "eBay", color: "#fbbf24", class: "tag-ebay" },
  tiktok: { name: "TikTok Shop", color: "#f472b6", class: "tag-tiktok" },
  etsy: { name: "Etsy", color: "#f97316", class: "tag-etsy" },
  multi: { name: "Multi-Platform", color: "#a78bfa", class: "tag-multi" }
};

const CATEGORIES = {
  financial: {
    name: "Financial & Fees",
    slug: "financial",
    icon: "💰",
    desc: "Track margins, audit fees, simulate pricing changes, and catch profit leaks before they drain your business.",
    longDesc: "E-commerce sellers lose thousands annually to fee overcharges, undetected margin erosion, and pricing mistakes. Our financial tools give you real-time visibility into every dollar — from FBA fees to ad spend to net profit per unit.",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)"
  },
  cashflow: {
    name: "Cash Flow & Payments",
    slug: "cashflow",
    icon: "🏦",
    desc: "Forecast payouts, plan around reserve holds, and never run out of cash for inventory restocking.",
    longDesc: "Amazon's DD+7 payout delays and reserve holds can cripple your cash flow. Our tools help you predict exactly when money arrives, plan purchases, and avoid the cash crunch that kills growing sellers.",
    color: "#34d399",
    gradient: "linear-gradient(135deg, #34d399, #059669)"
  },
  reimbursement: {
    name: "Reimbursement & Claims",
    slug: "reimbursement",
    icon: "📋",
    desc: "Find missing reimbursements, build strong cases, and recover money Amazon owes you.",
    longDesc: "Amazon regularly loses, damages, or mishandles FBA inventory — and it's on you to file the claim. Our tools scan for missed reimbursements, build organized case packets, and help you recover every dollar you're owed.",
    color: "#60a5fa",
    gradient: "linear-gradient(135deg, #60a5fa, #3b82f6)"
  },
  inventory: {
    name: "Inventory & Stock",
    slug: "inventory",
    icon: "📦",
    desc: "Prevent stockouts, manage bundles, sync across channels, and streamline FBA shipments.",
    longDesc: "Inventory mistakes — overselling, stockouts, prep errors — cost sellers dearly in lost sales and penalties. Our inventory tools keep your stock levels accurate, your shipments compliant, and your multi-channel catalog in sync.",
    color: "#fb923c",
    gradient: "linear-gradient(135deg, #fb923c, #ea580c)"
  },
  listing: {
    name: "Listing & Content",
    slug: "listing",
    icon: "✏️",
    desc: "Optimize listings for AI search, detect unauthorized changes, and maintain content quality across channels.",
    longDesc: "Your listing is your storefront. From Amazon's Rufus AI to Walmart's search algorithm, the way your product data is structured determines your visibility. Our tools keep your listings optimized, consistent, and protected from unauthorized changes.",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)"
  },
  ads: {
    name: "Ads & PPC",
    slug: "ads",
    icon: "📣",
    desc: "Analyze ad performance, auto-pause losing campaigns, and maximize true ROAS on every dollar spent.",
    longDesc: "Ad spend without visibility into true profitability is just burning cash. Our advertising tools give you granular analytics, automatic safeguards, and real ROAS calculations that account for all costs — not just revenue.",
    color: "#f472b6",
    gradient: "linear-gradient(135deg, #f472b6, #db2777)"
  },
  returns: {
    name: "Returns & Refunds",
    slug: "returns",
    icon: "🔁",
    desc: "Track return windows, catch refund abuse, file SAFE-T claims on time, and audit MCF losses.",
    longDesc: "Returns eat into margins, and missed claim deadlines mean money left on the table. Our return tools track every refund window, flag abuse patterns, and ensure you never miss a SAFE-T claim or MCF loss recovery.",
    color: "#f87171",
    gradient: "linear-gradient(135deg, #f87171, #dc2626)"
  },
  operations: {
    name: "Operations & Automation",
    slug: "operations",
    icon: "⚙️",
    desc: "Monitor BuyBox, detect hijackers, automate reviews, and audit your app stack for wasted spend.",
    longDesc: "Day-to-day seller operations are full of repetitive tasks and hidden threats. Our operations tools automate the grunt work, alert you to hijackers and BuyBox losses, and help you run a tighter, more profitable business.",
    color: "#00c2d1",
    gradient: "linear-gradient(135deg, #00c2d1, #0891b2)"
  },
  multichannel: {
    name: "Multi-Channel",
    slug: "multichannel",
    icon: "🔗",
    desc: "Sync listings, orders, and inventory across Amazon, Shopify, Walmart, eBay, and fulfillment platforms.",
    longDesc: "Selling on multiple platforms shouldn't mean multiple headaches. Our multi-channel tools sync your catalog, orders, and fulfillment data seamlessly — so you can expand to new marketplaces without the operational chaos.",
    color: "#818cf8",
    gradient: "linear-gradient(135deg, #818cf8, #6366f1)"
  }
};

const PRODUCTS = [
  // ===== LIVE PRODUCTS =====
  {
    slug: "buybox-watchdog",
    name: "BuyBox Watchdog",
    shortDesc: "Real-time BuyBox monitoring with instant alerts when you lose ownership. Know exactly who's stealing your sales.",
    longDesc: "Losing the BuyBox means losing sales — often without realizing it. BuyBox Watchdog monitors your listings 24/7 and sends instant alerts the moment another seller wins the BuyBox. See who took it, at what price, and how long you've been losing revenue. Take action before the damage stacks up.",
    price: 19.99,
    priceLabel: "$19.99/mo",
    cat: "operations",
    platforms: ["amazon"],
    live: true,
    score: 8.5,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Real-Time Monitoring", desc: "Continuous BuyBox ownership tracking across all your ASINs with sub-minute detection." },
      { title: "Instant Alerts", desc: "Email and in-app notifications the moment you lose the BuyBox — with competitor details." },
      { title: "Competitor Intelligence", desc: "See exactly who won the BuyBox, their price, fulfillment method, and seller rating." },
      { title: "Win-Rate Analytics", desc: "Track your BuyBox win percentage over time and identify which ASINs need attention." },
      { title: "Multi-ASIN Dashboard", desc: "Monitor hundreds of ASINs from a single dashboard with priority-based alerts." }
    ],
    useCases: ["Private label sellers losing sales to unauthorized resellers", "Brands monitoring MAP compliance across their catalog", "Wholesale sellers competing for BuyBox share"],
    howItWorks: [
      { step: "Connect", desc: "Link your Amazon Seller Central account securely via SP-API." },
      { step: "Configure", desc: "Select which ASINs to monitor and set your alert preferences." },
      { step: "Protect", desc: "Get instant alerts when BuyBox changes happen — and take action fast." }
    ]
  },
  {
    slug: "keyword-guardian-alert",
    name: "Keyword Guardian Alert",
    shortDesc: "Track your keyword rankings and get alerts when positions drop. Protect your organic visibility on Amazon search.",
    longDesc: "Organic keyword rankings drive the majority of Amazon sales, but they can drop overnight without warning. Keyword Guardian Alert tracks your most important keywords daily and sends alerts when positions drop — so you can react before losing significant revenue.",
    price: 29.99,
    priceLabel: "$29.99/mo",
    cat: "listing",
    platforms: ["amazon"],
    live: true,
    score: 8.2,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Daily Rank Tracking", desc: "Track keyword positions daily for all your important search terms." },
      { title: "Drop Alerts", desc: "Instant notifications when any tracked keyword drops below your threshold." },
      { title: "Historical Trends", desc: "Visualize ranking trends over time to correlate with sales velocity." },
      { title: "Competitor Comparison", desc: "See where competitors rank for the same keywords." },
      { title: "Bulk Keyword Import", desc: "Import hundreds of keywords via CSV and start tracking immediately." }
    ],
    useCases: ["Sellers investing in PPC who want to track organic lift", "Brands protecting high-value keywords from competitors", "Agencies managing keyword performance across multiple accounts"],
    howItWorks: [
      { step: "Add Keywords", desc: "Enter your target keywords or import them from your PPC campaigns." },
      { step: "Set Thresholds", desc: "Define when you want to be alerted — e.g., drop of 5+ positions." },
      { step: "Stay Protected", desc: "Receive daily reports and instant alerts on ranking changes." }
    ]
  },
  {
    slug: "ad-precision-analytics",
    name: "Ad Precision Analytics",
    shortDesc: "Granular PPC analytics that break down ad spend, ACoS, and true ROAS at the keyword and ASIN level.",
    longDesc: "Amazon's native ad reports are limited and delayed. Ad Precision Analytics gives you real-time, granular insights into every dollar of ad spend — broken down by keyword, ASIN, campaign, and time period. See your true ROAS when all costs are factored in, not just the rosy numbers Amazon shows you.",
    price: 9.99,
    priceLabel: "$9.99/mo",
    cat: "ads",
    platforms: ["amazon"],
    live: true,
    score: 8.0,
    featured: false,
    trialDays: 14,
    features: [
      { title: "True ROAS Calculation", desc: "Factor in FBA fees, returns, and COGS to see real return on ad spend." },
      { title: "Keyword-Level Insights", desc: "Drill down to individual keyword performance with spend, clicks, and conversions." },
      { title: "ASIN-Level Breakdown", desc: "See which ASINs are profitable from ads and which are burning cash." },
      { title: "Custom Date Ranges", desc: "Compare performance across any time period — daily, weekly, monthly." },
      { title: "Export & Share", desc: "Download reports in CSV/PDF for team reviews or client presentations." }
    ],
    useCases: ["Sellers spending $1K+/mo on PPC who need granular visibility", "Agencies reporting true ROAS to clients", "Brands optimizing ad spend allocation across ASINs"],
    howItWorks: [
      { step: "Connect Ads", desc: "Link your Amazon Advertising account via API." },
      { step: "Import Costs", desc: "Add COGS and other costs for true profitability calculations." },
      { step: "Analyze", desc: "Get instant dashboards with actionable PPC insights." }
    ]
  },
  {
    slug: "suppressed-product-notification",
    name: "Suppressed Product Notification",
    shortDesc: "Instant alerts when any of your products get suppressed. Fix listing issues before they kill your sales velocity.",
    longDesc: "A suppressed listing means zero sales and zero visibility — and Amazon doesn't always notify you promptly. Our tool monitors your entire catalog and sends instant alerts the moment any product gets suppressed, with the specific reason and a fix recommendation.",
    price: 9.99,
    priceLabel: "$9.99/mo",
    cat: "listing",
    platforms: ["amazon"],
    live: true,
    score: 8.5,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Instant Suppression Alerts", desc: "Know within minutes when any listing gets suppressed — not hours or days." },
      { title: "Reason Classification", desc: "See exactly why the listing was suppressed with Amazon's error codes." },
      { title: "Fix Recommendations", desc: "Get actionable suggestions to resolve the suppression quickly." },
      { title: "Catalog-Wide Monitoring", desc: "Monitor your entire catalog from one dashboard — from 10 to 10,000 ASINs." },
      { title: "Historical Log", desc: "Track suppression patterns over time to identify recurring issues." }
    ],
    useCases: ["High-volume sellers who can't manually check every listing daily", "Brands with seasonal catalogs prone to compliance changes", "Agencies managing multiple seller accounts"],
    howItWorks: [
      { step: "Connect", desc: "Link your Seller Central account via SP-API." },
      { step: "Monitor", desc: "We continuously check all your listings for suppression events." },
      { step: "Fix Fast", desc: "Get alerted instantly with the reason and recommended fix." }
    ]
  },
  {
    slug: "order-guard-max",
    name: "Order Guard Max",
    shortDesc: "Monitor maximum order quantity changes and protect against abuse or unexpected bulk purchases on your listings.",
    longDesc: "Unexpected changes to your maximum order quantity can lead to abuse — competitors buying out your stock, or customers placing abnormally large orders. Order Guard Max monitors these settings and alerts you instantly when something changes, protecting your inventory and revenue.",
    price: 9.00,
    priceLabel: "$9/mo",
    cat: "operations",
    platforms: ["amazon"],
    live: true,
    score: 7.5,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Quantity Change Alerts", desc: "Instant notification when max order quantity settings change on any ASIN." },
      { title: "Abuse Detection", desc: "Flag suspicious bulk orders that could indicate competitor manipulation." },
      { title: "Auto-Restore Rules", desc: "Set rules to automatically request quantity limit restoration." },
      { title: "Order History Analysis", desc: "Review order patterns to identify abuse trends over time." }
    ],
    useCases: ["Sellers experiencing competitor-driven stock manipulation", "Brands wanting to limit bulk purchases of promotional items", "FBA sellers protecting against inventory draining attacks"],
    howItWorks: [
      { step: "Connect", desc: "Link your Amazon account securely." },
      { step: "Set Limits", desc: "Define your preferred maximum order quantities per ASIN." },
      { step: "Guard", desc: "Get alerts when limits change and take action immediately." }
    ]
  },
  {
    slug: "hijacker-report-service",
    name: "Hijacker Report Service",
    shortDesc: "Detect unauthorized sellers on your listings and generate organized reports for Amazon Brand Registry complaints.",
    longDesc: "Unauthorized sellers on your listings can tank your pricing, damage your brand reputation, and steal your BuyBox. Hijacker Report Service automatically detects new sellers appearing on your ASINs and generates professionally organized complaint reports ready to submit through Brand Registry.",
    price: 9.99,
    priceLabel: "$9.99/mo",
    cat: "operations",
    platforms: ["amazon"],
    live: true,
    score: 8.8,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Automatic Hijacker Detection", desc: "24/7 monitoring for new unauthorized sellers appearing on your listings." },
      { title: "Complaint Report Generator", desc: "One-click generation of formatted reports for Brand Registry submission." },
      { title: "Seller Intelligence", desc: "Gather data on hijacker sellers — storefront, ratings, other listings." },
      { title: "Trend Analysis", desc: "Track hijacking patterns to identify serial offenders." },
      { title: "Multi-ASIN Monitoring", desc: "Protect your entire catalog with a single subscription." }
    ],
    useCases: ["Brand-registered sellers fighting counterfeit listings", "Private label sellers losing BuyBox to unauthorized resellers", "Distributors monitoring their exclusive brand agreements"],
    howItWorks: [
      { step: "Add ASINs", desc: "Enter the ASINs you want to protect from hijackers." },
      { step: "Detect", desc: "We monitor 24/7 and alert you when a new seller appears." },
      { step: "Report", desc: "Generate a professional complaint package and submit to Brand Registry." }
    ]
  },
  {
    slug: "review-request-for-amazon",
    name: "Review Request for Amazon",
    shortDesc: "Automate review request emails within Amazon's TOS. Boost your review velocity without risking account health.",
    longDesc: "Reviews drive conversions, but manually requesting them is tedious and inconsistent. This tool automates the 'Request a Review' button across all your orders — staying 100% within Amazon's Terms of Service — to maximize your review velocity without any risk to your account.",
    price: 9.90,
    priceLabel: "$9.90/mo",
    cat: "operations",
    platforms: ["amazon"],
    live: true,
    score: 7.8,
    featured: false,
    trialDays: 14,
    features: [
      { title: "TOS-Compliant Automation", desc: "Uses Amazon's official 'Request a Review' button — zero risk to your account." },
      { title: "Smart Timing", desc: "Send requests at the optimal time after delivery for maximum response rate." },
      { title: "Bulk Processing", desc: "Process hundreds of orders automatically — no manual clicking." },
      { title: "Exclusion Rules", desc: "Skip orders from certain customers, return-prone ASINs, or specific regions." }
    ],
    useCases: ["New product launches needing review velocity", "Established sellers wanting consistent review flow", "Sellers transitioning from risky third-party review tools"],
    howItWorks: [
      { step: "Connect", desc: "Link your Seller Central account securely." },
      { step: "Configure", desc: "Set timing rules and exclusion criteria." },
      { step: "Automate", desc: "Review requests are sent automatically for every eligible order." }
    ]
  },
  {
    slug: "fba-shipment-workflow",
    name: "FBA Shipment Workflow",
    shortDesc: "Streamlined FBA shipment creation and tracking. Manage your inbound shipments with fewer errors and clicks.",
    longDesc: "Creating FBA shipments through Seller Central is slow, error-prone, and frustrating. FBA Shipment Workflow streamlines the entire process — from shipment creation to tracking — reducing errors, saving time, and giving you a clear view of every inbound shipment's status.",
    price: 49.00,
    priceLabel: "$49/mo",
    cat: "inventory",
    platforms: ["amazon"],
    live: true,
    score: 7.5,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Streamlined Creation", desc: "Create FBA shipments faster with a simplified, guided workflow." },
      { title: "Error Prevention", desc: "Built-in validation catches common mistakes before submission." },
      { title: "Shipment Tracking", desc: "Track all inbound shipments from creation to receiving in one dashboard." },
      { title: "Bulk Operations", desc: "Create and manage multiple shipments simultaneously." },
      { title: "Receiving Reconciliation", desc: "Compare what you sent vs. what Amazon received to catch discrepancies." }
    ],
    useCases: ["High-volume FBA sellers sending weekly shipments", "3PL providers managing shipments for multiple sellers", "Sellers frustrated with Seller Central's inbound workflow"],
    howItWorks: [
      { step: "Connect", desc: "Link your Amazon account and import your product catalog." },
      { step: "Create", desc: "Use our streamlined workflow to build shipments quickly." },
      { step: "Track", desc: "Monitor every shipment from door to Amazon receiving." }
    ]
  },
  {
    slug: "amazon-mfn-to-shopify",
    name: "Amazon MFN to Shopify",
    shortDesc: "Sync your Amazon MFN orders, inventory, and fulfillment data directly into your Shopify store.",
    longDesc: "Selling on both Amazon and Shopify shouldn't mean double the work. This integration syncs your Amazon merchant-fulfilled orders, inventory levels, and fulfillment data directly into Shopify — keeping both channels in perfect sync without manual updates.",
    price: 29.99,
    priceLabel: "$29.99/mo",
    cat: "multichannel",
    platforms: ["amazon", "shopify"],
    live: true,
    score: 8.0,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Order Sync", desc: "Amazon MFN orders automatically appear in Shopify for unified fulfillment." },
      { title: "Inventory Sync", desc: "Real-time stock level synchronization between Amazon and Shopify." },
      { title: "Fulfillment Updates", desc: "Tracking numbers and shipment status push back to Amazon automatically." },
      { title: "SKU Mapping", desc: "Flexible SKU mapping for products with different identifiers across platforms." },
      { title: "Error Handling", desc: "Automatic retry and error logging so no order falls through the cracks." }
    ],
    useCases: ["Sellers expanding from Amazon to Shopify", "D2C brands maintaining Amazon presence", "Sellers using Shopify as their central order management hub"],
    howItWorks: [
      { step: "Connect Both", desc: "Link your Amazon and Shopify accounts securely." },
      { step: "Map Products", desc: "Match Amazon SKUs to Shopify products with our mapping tool." },
      { step: "Sync", desc: "Orders, inventory, and fulfillment data flow automatically." }
    ]
  },
  {
    slug: "amazon-mfn-to-walmart",
    name: "Amazon MFN to Walmart",
    shortDesc: "Cross-list and sync Amazon merchant-fulfilled products to Walmart Marketplace with inventory parity.",
    longDesc: "Expand to Walmart without the operational headache. This tool cross-lists your Amazon MFN products to Walmart Marketplace and keeps inventory synchronized in real-time — so you can tap into Walmart's growing customer base without overselling or manual updates.",
    price: 29.99,
    priceLabel: "$29.99/mo",
    cat: "multichannel",
    platforms: ["amazon", "walmart"],
    live: true,
    score: 8.2,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Product Cross-Listing", desc: "List Amazon products on Walmart with automatic format conversion." },
      { title: "Inventory Parity", desc: "Real-time stock sync prevents overselling across both platforms." },
      { title: "Price Management", desc: "Set pricing rules for Walmart relative to your Amazon pricing." },
      { title: "Order Routing", desc: "Walmart orders sync to your fulfillment workflow seamlessly." },
      { title: "Compliance Checks", desc: "Ensure listings meet Walmart's specific content requirements." }
    ],
    useCases: ["Amazon sellers looking to diversify revenue channels", "Brands wanting presence on both top US marketplaces", "Sellers taking advantage of Walmart's lower competition"],
    howItWorks: [
      { step: "Connect Both", desc: "Link your Amazon and Walmart seller accounts." },
      { step: "Select Products", desc: "Choose which Amazon products to cross-list to Walmart." },
      { step: "Launch", desc: "Products go live on Walmart with automated sync running 24/7." }
    ]
  },
  {
    slug: "amazon-mfn-to-ebay",
    name: "Amazon MFN to eBay",
    shortDesc: "Expand to eBay by syncing your Amazon MFN catalog — listings, prices, and stock levels stay updated.",
    longDesc: "eBay remains one of the largest marketplaces globally, and expanding from Amazon is a natural growth move. This tool syncs your Amazon MFN catalog to eBay — keeping listings, prices, and stock levels automatically updated so you can sell more without more work.",
    price: 29.99,
    priceLabel: "$29.99/mo",
    cat: "multichannel",
    platforms: ["amazon", "ebay"],
    live: true,
    score: 7.8,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Listing Sync", desc: "Amazon products automatically listed on eBay with format adaptation." },
      { title: "Price Sync", desc: "Keep eBay prices aligned with your Amazon pricing strategy." },
      { title: "Stock Sync", desc: "Real-time inventory updates prevent overselling." },
      { title: "Category Mapping", desc: "Automatic Amazon-to-eBay category mapping for proper placement." }
    ],
    useCases: ["Amazon sellers expanding to eBay for incremental revenue", "Liquidation sellers moving slow stock through eBay", "Multi-channel sellers wanting centralized catalog management"],
    howItWorks: [
      { step: "Connect Both", desc: "Link your Amazon and eBay accounts." },
      { step: "Map & List", desc: "Select products and map to eBay categories." },
      { step: "Sell", desc: "Listings go live with automated inventory and price sync." }
    ]
  },
  {
    slug: "amazon-custom-order-update-on-veeqo",
    name: "Amazon Custom Order Update On Veeqo",
    screenshot: "img/screenshots/veeqo-custom-order.png",
    shortDesc: "Automate the process of retrieving customized data from Amazon Custom/Handmade orders and updating Veeqo — syncing every 15 minutes.",
    longDesc: "If you sell personalized products on Amazon and have trouble because Veeqo is not fully integrated with Amazon Custom, SellerActions is the ultimate solution. We've developed an automated process that leverages Veeqo's open API to update customization details and import Amazon Handmade orders. Save time, avoid errors, and focus on growing your business — knowing that the tedious task of data management is taken care of.",
    price: 49.00,
    priceLabel: "$49/mo",
    cat: "multichannel",
    platforms: ["amazon"],
    live: true,
    score: 8.5,
    featured: true,
    trialDays: 7,
    features: [
      { title: "15-Minute Auto Sync", desc: "Customization data from Amazon is automatically retrieved and updated in Veeqo every 15 minutes." },
      { title: "Amazon Custom & Handmade Support", desc: "Full support for Amazon Custom and Amazon Handmade personalized order data — font names, colors, custom text, and more." },
      { title: "Multi-Field Updates", desc: "Update multiple fields on Veeqo simultaneously, ensuring all relevant customization information is accurate and up to date." },
      { title: "Seamless Integration", desc: "Save time and avoid manual errors with a fully automated bridge between Amazon Custom orders and Veeqo." },
      { title: "Zero Manual Work", desc: "Focus on growing your business — the tedious task of copying customization data between platforms is completely automated." }
    ],
    useCases: ["Amazon sellers of personalized/customized products using Veeqo for fulfillment", "Amazon Handmade sellers who need customization details visible in Veeqo for production", "Print-on-demand and made-to-order businesses shipping through Veeqo"],
    howItWorks: [
      { step: "Register", desc: "Sign up on SellerActions and select your plan — starts at $49/mo with a 7-day free trial. Cancel anytime." },
      { step: "Connect Amazon", desc: "Connect your Amazon Seller account with SellerActions by logging in with your Amazon Seller credentials." },
      { step: "Submit Veeqo API Key", desc: "Submit your Veeqo API key — and you're done. Customization data starts syncing automatically every 15 minutes." }
    ],
    integrations: [
      { platform: "veeqo", label: "Veeqo API Key", field: "api_key", type: "text", placeholder: "Enter your Veeqo API key", helpText: "Find your API key in Veeqo under Settings > API.", required: true }
    ]
  },
  {
    slug: "amazon-custom-order-update-on-shipstation",
    name: "Amazon Custom Order Update On ShipStation",
    screenshot: "img/screenshots/shipstation-custom-order.png",
    shortDesc: "Automate the process of retrieving customized data from Amazon Custom/Handmade orders and updating ShipStation — syncing every 15 minutes.",
    longDesc: "If you sell personalized products on Amazon and have trouble because ShipStation is not fully integrated with Amazon Custom, SellerActions is the ultimate solution. We've developed an automated process that leverages ShipStation's open API to update customization details and import Amazon Handmade orders. Save time, avoid errors, and focus on growing your business — knowing that the tedious task of data management is taken care of.",
    price: 49.00,
    priceLabel: "$49/mo",
    cat: "multichannel",
    platforms: ["amazon"],
    live: true,
    score: 8.5,
    featured: true,
    trialDays: 7,
    features: [
      { title: "15-Minute Auto Sync", desc: "Customization data from Amazon is automatically retrieved and updated in ShipStation every 15 minutes." },
      { title: "Amazon Custom & Handmade Support", desc: "Full support for Amazon Custom and Amazon Handmade personalized order data — font names, colors, custom text, and more." },
      { title: "Multi-Field Updates", desc: "Update multiple fields on ShipStation simultaneously, ensuring all relevant customization information is accurate and up to date." },
      { title: "Seamless Integration", desc: "Save time and avoid manual errors with a fully automated bridge between Amazon Custom orders and ShipStation." },
      { title: "Zero Manual Work", desc: "Focus on growing your business — the tedious task of copying customization data between platforms is completely automated." }
    ],
    useCases: ["Amazon sellers of personalized/customized products using ShipStation for fulfillment", "Amazon Handmade sellers who need customization details visible in ShipStation for production", "Print-on-demand and made-to-order businesses shipping through ShipStation"],
    howItWorks: [
      { step: "Register", desc: "Sign up on SellerActions and select your plan — starts at $49/mo with a 7-day free trial. Cancel anytime." },
      { step: "Connect Amazon", desc: "Connect your Amazon Seller account with SellerActions by logging in with your Amazon Seller credentials." },
      { step: "Submit ShipStation API Key & Secret", desc: "Submit your ShipStation API key and API secret — and you're done. Customization data starts syncing automatically every 15 minutes." }
    ],
    integrations: [
      { platform: "shipstation", label: "ShipStation API Key", field: "api_key", type: "text", placeholder: "Enter your ShipStation API key", helpText: "Find your API key in ShipStation under Account > API Settings.", required: true },
      { platform: "shipstation", label: "ShipStation API Secret", field: "api_secret", type: "password", placeholder: "Enter your ShipStation API secret", helpText: "The API secret is shown alongside the API key.", required: true }
    ]
  },
  {
    slug: "shipper-act",
    name: "Shipper Act",
    shortDesc: "Shipping carrier comparison and rate optimization. Find the best shipping rates across multiple carriers.",
    longDesc: "Shipping costs directly impact your margins, but comparing rates across carriers is time-consuming. Shipper Act compares rates from multiple carriers in real-time, helping you find the best price for every shipment — whether you're sending FBM orders or inventory to Amazon.",
    price: 29.00,
    priceLabel: "$29/mo",
    cat: "operations",
    platforms: ["multi"],
    live: true,
    score: 7.0,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Multi-Carrier Comparison", desc: "Compare rates from UPS, FedEx, USPS, DHL, and regional carriers instantly." },
      { title: "Rate Optimization", desc: "Automatically find the cheapest option for each shipment's size and destination." },
      { title: "Bulk Label Creation", desc: "Generate shipping labels in bulk for high-volume operations." },
      { title: "Savings Dashboard", desc: "Track how much you're saving compared to default carrier rates." }
    ],
    useCases: ["FBM sellers looking to reduce shipping costs", "Sellers comparing carrier rates for FBA inbound shipments", "Multi-channel sellers optimizing shipping across platforms"],
    howItWorks: [
      { step: "Connect Carriers", desc: "Link your carrier accounts (UPS, FedEx, USPS, etc.)." },
      { step: "Enter Shipment", desc: "Input package details and destination." },
      { step: "Compare & Ship", desc: "See all rates side-by-side and print the cheapest label." }
    ]
  },

  // ===== COMING SOON - TOP SCORED =====
  {
    slug: "rufus-readiness-checker",
    name: "Rufus Readiness Checker",
    shortDesc: "Score how well your listing performs for Amazon's Rufus AI assistant. Optimize Q&A, A+ Content, and review signals.",
    longDesc: "Amazon's Rufus AI is changing how shoppers discover products. If your listing isn't optimized for Rufus, you're invisible to a growing segment of buyers. This tool scores your listing's Rufus-readiness across Q&A quality, A+ Content structure, bullet point clarity, and review signals — then gives you a prioritized action plan to rank higher in AI-powered recommendations.",
    price: 14.99,
    priceLabel: "$14.99/mo",
    cat: "listing",
    platforms: ["amazon"],
    live: true,
    score: 9.3,
    featured: true,
    trialDays: 14,
    features: [
      { title: "Rufus Compatibility Score", desc: "Get a 0-100 score measuring how well Rufus can understand and recommend your product." },
      { title: "Q&A Optimization", desc: "Analyze your Q&A section and suggest improvements that Rufus prioritizes." },
      { title: "A+ Content Analysis", desc: "Check if your A+ Content structure helps or hurts AI discoverability." },
      { title: "Bullet Point Clarity", desc: "Score your bullet points for AI parseability and information density." },
      { title: "Competitive Benchmarking", desc: "Compare your Rufus score against top competitors in your category." }
    ],
    useCases: ["Sellers noticing decreased organic visibility after Rufus launch", "Brands investing in A+ Content who want to maximize AI reach", "Agencies optimizing listings for the AI-first shopping era"],
    howItWorks: [
      { step: "Enter ASIN", desc: "Input any ASIN to start the analysis." },
      { step: "Get Score", desc: "Receive a detailed Rufus readiness score with breakdown by section." },
      { step: "Optimize", desc: "Follow the prioritized action plan to improve your AI visibility." }
    ]
  },
  {
    slug: "ai-traffic-lens",
    name: "AI Traffic Lens",
    shortDesc: "Track and attribute traffic coming from AI assistants (ChatGPT, Perplexity, Rufus). See what traditional analytics can't.",
    longDesc: "A growing percentage of your store traffic is coming from AI assistants like ChatGPT, Perplexity, Google AI Overviews, and Amazon Rufus — but traditional analytics tools can't see it. AI Traffic Lens identifies, tracks, and attributes this invisible traffic so you can understand how AI is driving (or not driving) your sales.",
    price: 29.00,
    priceLabel: "From $29/mo",
    cat: "listing",
    platforms: ["shopify"],
    live: true,
    score: 9.3,
    featured: true,
    trialDays: 14,
    features: [
      { title: "AI Source Detection", desc: "Identify traffic from ChatGPT, Perplexity, Google AI, and other AI assistants." },
      { title: "Attribution Tracking", desc: "See which AI sources drive actual conversions, not just visits." },
      { title: "Trend Analysis", desc: "Track how AI-driven traffic is growing over time for your store." },
      { title: "Product-Level Insights", desc: "See which products AI assistants recommend most frequently." },
      { title: "Competitive Intelligence", desc: "Understand how often AI assistants mention your brand vs. competitors." }
    ],
    useCases: ["D2C brands wanting to understand AI's impact on their traffic", "Marketing teams optimizing content for AI discovery", "Shopify stores seeing unexplained traffic patterns"],
    howItWorks: [
      { step: "Install Pixel", desc: "Add our lightweight tracking snippet to your Shopify store." },
      { step: "Collect Data", desc: "We identify and classify AI-driven traffic in real-time." },
      { step: "Analyze", desc: "See dashboards showing AI traffic sources, trends, and conversions." }
    ]
  },
  {
    slug: "pack-size-pivot-advisor",
    name: "Pack-Size Pivot Advisor",
    shortDesc: "Data-driven analysis of whether switching to 2-pack or 3-pack makes financial sense for your products.",
    longDesc: "Should you sell a 2-pack instead of a single unit? The answer depends on fee structures, conversion rates, competition, and customer behavior. Pack-Size Pivot Advisor models all these variables for your specific ASINs and gives you a clear recommendation backed by data — not guesswork.",
    price: 19.00,
    priceLabel: "From $19/mo",
    cat: "financial",
    platforms: ["amazon"],
    live: true,
    score: 9.0,
    featured: true,
    trialDays: 14,
    features: [
      { title: "Fee Savings Model", desc: "Calculate exact FBA fee differences between single and multi-pack configurations." },
      { title: "Conversion Analysis", desc: "Estimate conversion impact based on category data and competitor multi-packs." },
      { title: "Competition Scanner", desc: "See how many competitors already offer multi-packs in your category." },
      { title: "Profit Simulation", desc: "Model net profit per unit for every pack size option before committing." },
      { title: "Recommendation Engine", desc: "Get a clear go/no-go recommendation with confidence scores." }
    ],
    useCases: ["Sellers looking to optimize FBA fees through pack-size strategy", "Brands considering bundle options to increase average order value", "Sellers in competitive categories seeking a pricing edge"],
    howItWorks: [
      { step: "Enter ASIN", desc: "Input the ASIN you want to analyze for pack-size potential." },
      { step: "Set Costs", desc: "Add your COGS, freight, and current pricing." },
      { step: "Get Advice", desc: "Receive a data-backed recommendation on optimal pack size." }
    ]
  },
  {
    slug: "negative-margin-kill-switch",
    name: "Negative Margin Kill Switch",
    shortDesc: "Automatically pauses ads and offers when profit turns negative. Set margin threshold rules so you never burn cash.",
    longDesc: "When fees rise, ad costs spike, or returns surge, your profitable SKU can silently turn into a cash burner. Negative Margin Kill Switch monitors your real-time margins and automatically pauses ads or adjusts offers when profit drops below your threshold — protecting your bottom line 24/7.",
    price: 19.00,
    priceLabel: "$19–79/mo",
    cat: "financial",
    platforms: ["amazon"],
    live: true,
    score: 8.7,
    featured: true,
    trialDays: 14,
    features: [
      { title: "Real-Time Margin Monitoring", desc: "Track net profit per SKU in real-time, factoring in all costs." },
      { title: "Automatic Pause Rules", desc: "Set margin thresholds that automatically pause ads when breached." },
      { title: "Offer Adjustment", desc: "Optionally adjust pricing or pause offers on negative-margin SKUs." },
      { title: "Alert Dashboard", desc: "See which SKUs triggered kill-switch actions and why." },
      { title: "Recovery Tracking", desc: "Monitor when paused SKUs return to profitability for reactivation." }
    ],
    useCases: ["Sellers with large catalogs who can't monitor every SKU daily", "Brands running aggressive PPC campaigns", "Sellers in categories with volatile fee structures"],
    howItWorks: [
      { step: "Set Rules", desc: "Define margin thresholds for each SKU or category (e.g., pause ads if margin < 5%)." },
      { step: "Monitor", desc: "We calculate real-time margins from fees, ad spend, and refunds." },
      { step: "Auto-Protect", desc: "Ads and offers are paused automatically when margins go negative." }
    ]
  },
  {
    slug: "dd7-cashflow-planner",
    name: "DD+7 Cashflow Planner",
    shortDesc: "Plan around Amazon's DD+7 payout delays. Visualize reserve releases and forecast cash availability.",
    longDesc: "Amazon's DD+7 payout cycle means your money is always delayed. Add in reserve holds, and cash planning becomes a nightmare. DD+7 Cashflow Planner visualizes exactly when each payout will arrive, forecasts your cash position, and helps you plan inventory purchases without running dry.",
    price: 19.00,
    priceLabel: "$19–59/mo",
    cat: "cashflow",
    platforms: ["amazon"],
    live: true,
    score: 8.7,
    featured: true,
    trialDays: 14,
    features: [
      { title: "Payout Calendar", desc: "Visual calendar showing exactly when each disbursement will hit your bank." },
      { title: "Reserve Visualization", desc: "See how much is held in reserves and when each hold expires." },
      { title: "Cash Forecast", desc: "Project your cash position 30/60/90 days out based on sales velocity." },
      { title: "Inventory Planning", desc: "Know exactly when you'll have cash available for restock orders." },
      { title: "Alert System", desc: "Get warned when projected cash drops below your safety threshold." }
    ],
    useCases: ["Growing sellers managing tight cash flow on Amazon", "Sellers frequently running out of cash for restocks", "Brands planning large inventory purchases around payout cycles"],
    howItWorks: [
      { step: "Connect", desc: "Link your Amazon account to import payout and reserve data." },
      { step: "Forecast", desc: "See your cash position projected forward with visual charts." },
      { step: "Plan", desc: "Schedule inventory purchases when cash availability is confirmed." }
    ]
  },
  {
    slug: "reserve-release-forecaster",
    name: "Reserve Release Forecaster",
    shortDesc: "See exactly when each held payment will be released. Order-level reserve aging view for better planning.",
    longDesc: "Amazon holds a portion of your revenue in reserves, and the timing of releases is opaque. Reserve Release Forecaster gives you order-level visibility into every reserve hold — showing exactly when each payment will be released so you can plan purchases and ad spend with confidence.",
    price: 9.00,
    priceLabel: "$9–29/mo",
    cat: "cashflow",
    platforms: ["amazon"],
    live: false,
    score: 8.7,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Order-Level Tracking", desc: "See reserve status for every individual order, not just aggregate totals." },
      { title: "Release Predictions", desc: "Estimated release dates based on historical patterns and order age." },
      { title: "Aging Report", desc: "View reserve holds sorted by age to identify unusually long holds." },
      { title: "Cash Impact Analysis", desc: "See how reserves affect your available cash for operations." }
    ],
    useCases: ["New sellers with high reserve percentages", "Sellers with seasonal sales patterns affecting reserves", "Growing sellers needing precise cash flow planning"],
    howItWorks: [
      { step: "Connect", desc: "Link your Amazon account to access reserve data." },
      { step: "View", desc: "See every reserve hold with estimated release dates." },
      { step: "Plan", desc: "Use release forecasts to time your purchases and ad spend." }
    ]
  },
  {
    slug: "cash-flow-forecaster",
    name: "Cash Flow Forecaster",
    shortDesc: "Combines disbursement schedules, inventory purchases, and ad spend into a unified cash flow prediction model.",
    longDesc: "Cash flow kills more e-commerce businesses than lack of sales. This tool combines your Amazon disbursement schedule, planned inventory purchases, ad spend commitments, and operating expenses into a single cash flow forecast — so you always know exactly where you stand financially.",
    price: 19.99,
    priceLabel: "$19.99/mo",
    cat: "cashflow",
    platforms: ["amazon", "multi"],
    live: false,
    score: 8.0,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Unified Forecast", desc: "All income and expenses in one projection — disbursements, inventory, ads, overhead." },
      { title: "Scenario Modeling", desc: "Model best/worst/expected scenarios to stress-test your cash position." },
      { title: "Break-Even Alerts", desc: "Know exactly when you'll run out of cash if trends continue." },
      { title: "Multi-Platform Support", desc: "Combine cash flows from Amazon, Shopify, and other channels." }
    ],
    useCases: ["Sellers planning major inventory purchases", "Growing businesses managing cash across multiple channels", "Seasonal sellers preparing for high-volume periods"],
    howItWorks: [
      { step: "Connect Accounts", desc: "Link your marketplace and bank accounts for automatic data import." },
      { step: "Add Expenses", desc: "Input planned purchases, subscriptions, and recurring costs." },
      { step: "Forecast", desc: "Get a 90-day rolling forecast updated daily with actual data." }
    ]
  },
  {
    slug: "listing-drift-detector",
    name: "Listing Drift Detector",
    shortDesc: "Monitors your listing attributes, categories, and variations for unauthorized changes before they tank your sales.",
    longDesc: "Amazon listings can change without your knowledge — category reassignments, attribute modifications, variation merges, and even title changes can happen through Amazon's catalog system or malicious competitor actions. Listing Drift Detector takes daily snapshots and alerts you instantly when any attribute changes.",
    price: 19.00,
    priceLabel: "From $19/mo",
    cat: "listing",
    platforms: ["amazon"],
    live: true,
    score: 8.7,
    featured: true,
    trialDays: 14,
    features: [
      { title: "Daily Snapshots", desc: "Complete listing snapshot every day — title, bullets, images, category, attributes." },
      { title: "Change Detection", desc: "Instant alerts when any listing element changes from your last approved version." },
      { title: "Diff View", desc: "Side-by-side comparison showing exactly what changed and when." },
      { title: "Rollback Export", desc: "Generate flat files to quickly restore listings to their correct state." },
      { title: "Variation Monitoring", desc: "Track parent-child relationship changes that can break your listings." }
    ],
    useCases: ["Brand-registered sellers protecting catalog integrity", "Sellers in competitive categories with frequent hijacking", "Agencies managing listings for multiple brands"],
    howItWorks: [
      { step: "Select ASINs", desc: "Choose which listings to monitor (or monitor your entire catalog)." },
      { step: "Baseline", desc: "We capture a complete snapshot as your approved listing state." },
      { step: "Detect & Alert", desc: "Any change triggers an instant notification with a detailed diff." }
    ]
  },
  {
    slug: "ai-feed-readiness-checker",
    name: "AI Feed Readiness Checker",
    shortDesc: "Audit your product data for AI shopping surfaces — Google Shopping AI, Rufus, Walmart Spark.",
    longDesc: "AI-powered shopping is the future, and your product feed needs to be ready. This tool audits your product data against the requirements of Google Shopping AI, Amazon Rufus, Walmart Spark, and other AI shopping surfaces — identifying schema gaps, missing attributes, and optimization opportunities before your competitors fix theirs.",
    price: 19.00,
    priceLabel: "From $19/mo",
    cat: "listing",
    platforms: ["shopify", "walmart"],
    live: false,
    score: 8.8,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Multi-Surface Audit", desc: "Check readiness for Google AI, Walmart Spark, and other AI shopping platforms." },
      { title: "Schema Gap Detection", desc: "Identify missing structured data that AI surfaces need to recommend you." },
      { title: "Readiness Score", desc: "Get a score per product showing how AI-optimized your data is." },
      { title: "Fix Recommendations", desc: "Prioritized list of fixes to improve your AI feed readiness." }
    ],
    useCases: ["Shopify stores wanting to appear in AI shopping recommendations", "Walmart sellers optimizing for Spark AI", "Brands preparing for the agentic commerce revolution"],
    howItWorks: [
      { step: "Connect Feed", desc: "Import your product feed or connect your store." },
      { step: "Audit", desc: "We scan every product against AI shopping surface requirements." },
      { step: "Fix", desc: "Follow the prioritized fix list to improve your AI readiness score." }
    ]
  },
  {
    slug: "case-packet-builder",
    name: "Case Packet Builder",
    shortDesc: "Build organized seller support cases with timelines, attachments, and PDF exports for higher win rates.",
    longDesc: "Winning a Seller Support case requires organization and evidence. Case Packet Builder helps you assemble professional case packets with timelines, screenshots, shipment records, and supporting documents — then exports them as clean PDFs ready to submit. Better evidence means higher win rates.",
    price: 19.00,
    priceLabel: "$19–49/mo",
    cat: "reimbursement",
    platforms: ["amazon", "walmart"],
    live: false,
    score: 8.4,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Case Templates", desc: "Pre-built templates for common case types — reimbursement, IP complaints, account issues." },
      { title: "Evidence Organizer", desc: "Attach and organize screenshots, invoices, shipment records in one place." },
      { title: "Timeline Builder", desc: "Create visual timelines showing the sequence of events for your case." },
      { title: "PDF Export", desc: "Generate professional PDF packets ready to submit to Seller Support." },
      { title: "Case Tracker", desc: "Track all your open cases and their resolution status." }
    ],
    useCases: ["Sellers filing FBA reimbursement claims", "Brands submitting IP complaints through Brand Registry", "Sellers dealing with account health issues"],
    howItWorks: [
      { step: "Select Template", desc: "Choose from pre-built templates matching your case type." },
      { step: "Add Evidence", desc: "Upload documents, screenshots, and build your timeline." },
      { step: "Submit", desc: "Export a professional PDF and submit to Seller Support." }
    ]
  },
  {
    slug: "return-timer-safet-watchdog",
    name: "Return Timer & SAFE-T Watchdog",
    shortDesc: "Countdown timers for refund windows and SAFE-T claim eligibility. Never miss a claim deadline again.",
    longDesc: "Amazon's return and SAFE-T claim windows are strict — miss the deadline, and you lose your right to file. This tool tracks every return with countdown timers, monitors SAFE-T eligibility windows, and sends alerts before deadlines expire so you recover every dollar you're entitled to.",
    price: 19.00,
    priceLabel: "$19–69/mo",
    cat: "returns",
    platforms: ["amazon"],
    live: false,
    score: 8.3,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Countdown Timers", desc: "Visual countdown for every return window and SAFE-T eligibility period." },
      { title: "Deadline Alerts", desc: "Get notified 48 hours, 24 hours, and 6 hours before any deadline expires." },
      { title: "SAFE-T Eligibility Check", desc: "Automatically identify which returns qualify for SAFE-T claims." },
      { title: "Claim History", desc: "Track all filed claims and their outcomes for pattern analysis." }
    ],
    useCases: ["FBM sellers managing high return volumes", "Sellers losing money to missed SAFE-T claim windows", "Teams needing systematic return management"],
    howItWorks: [
      { step: "Connect", desc: "Link your Amazon account to import return data automatically." },
      { step: "Track", desc: "See all active return windows with countdown timers." },
      { step: "Claim", desc: "File claims before deadlines with one-click SAFE-T submission." }
    ]
  },
  {
    slug: "reimbursement-recovery-copilot",
    name: "Reimbursement Recovery Copilot",
    shortDesc: "Scans for missed FBA reimbursements — lost inventory, damaged goods, fee errors — and generates claim packages.",
    longDesc: "Amazon regularly loses, damages, or mishandles FBA inventory, and the responsibility to file claims falls on you. Reimbursement Recovery Copilot scans your account for every missed reimbursement opportunity — lost shipments, damaged goods, fee overcharges, customer return discrepancies — and generates ready-to-submit claim packages.",
    price: 39.00,
    priceLabel: "$39–149/mo",
    cat: "reimbursement",
    platforms: ["amazon"],
    live: false,
    score: 5.5,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Full Account Scan", desc: "Deep scan of your entire FBA history for missed reimbursement opportunities." },
      { title: "Claim Package Generator", desc: "Auto-generate organized claim packages with all required evidence." },
      { title: "Category Tracking", desc: "Track reimbursements by type — lost, damaged, fee errors, returns." },
      { title: "Recovery Dashboard", desc: "See total money recovered and outstanding claims in real-time." }
    ],
    useCases: ["Sellers who've never filed FBA reimbursement claims", "High-volume sellers with too many transactions to check manually", "Brands wanting to recover historical losses"],
    howItWorks: [
      { step: "Scan", desc: "We analyze your FBA history for reimbursement opportunities." },
      { step: "Review", desc: "See every identified opportunity with estimated recovery amount." },
      { step: "Claim", desc: "Submit generated claim packages to Amazon Seller Support." }
    ]
  },
  {
    slug: "fee-leak-auditor",
    name: "Fee Leak Auditor",
    shortDesc: "Detects FBA fee overcharges from incorrect dimensions or weight. Flags remeasurement opportunities.",
    longDesc: "Amazon measures your products to determine FBA fees, but their measurements are often wrong — costing you money on every single order. Fee Leak Auditor compares Amazon's recorded dimensions and weight against your actual product specs, identifies overcharges, and guides you through the remeasurement request process.",
    price: 19.00,
    priceLabel: "$19–79/mo",
    cat: "financial",
    platforms: ["amazon"],
    live: false,
    score: 6.8,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Dimension Comparison", desc: "Compare Amazon's measurements against your actual product dimensions." },
      { title: "Fee Delta Calculator", desc: "See exactly how much you're overpaying per unit and per month." },
      { title: "Remeasurement Guide", desc: "Step-by-step process to request Amazon remeasure your products." },
      { title: "Historical Analysis", desc: "Scan past orders for retroactive reimbursement eligibility." }
    ],
    useCases: ["Sellers suspecting FBA fees are too high for their product size", "High-volume sellers where even $0.10/unit adds up significantly", "Sellers who've recently changed product packaging"],
    howItWorks: [
      { step: "Import Products", desc: "Connect your account and input your actual product dimensions." },
      { step: "Compare", desc: "We compare Amazon's recorded measurements against yours." },
      { step: "Recover", desc: "File remeasurement requests and claim reimbursements for past overcharges." }
    ]
  },
  {
    slug: "catalog-diff-reporter",
    name: "Catalog Diff Reporter",
    shortDesc: "Daily snapshots of your catalog across channels. Detects unauthorized price, content, and attribute changes.",
    longDesc: "Your catalog is constantly at risk — unauthorized price changes, content modifications, stock discrepancies, and attribute edits can happen across any channel without warning. Catalog Diff Reporter takes daily snapshots of your entire catalog across Amazon, Walmart, and Shopify, and alerts you to any changes instantly.",
    price: 19.00,
    priceLabel: "From $19/mo",
    cat: "multichannel",
    platforms: ["amazon", "walmart", "shopify"],
    live: false,
    score: 8.4,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Cross-Channel Snapshots", desc: "Daily catalog snapshots across Amazon, Walmart, and Shopify." },
      { title: "Change Detection", desc: "Instant alerts for price, content, stock, or attribute changes." },
      { title: "Diff Reports", desc: "Visual side-by-side comparison of what changed and when." },
      { title: "Bulk Monitoring", desc: "Monitor thousands of SKUs across multiple channels efficiently." }
    ],
    useCases: ["Multi-channel sellers needing catalog consistency", "Brands protecting pricing integrity across platforms", "Agencies managing catalogs for multiple clients"],
    howItWorks: [
      { step: "Connect Channels", desc: "Link your Amazon, Walmart, and Shopify accounts." },
      { step: "Baseline", desc: "We capture your approved catalog state as the reference." },
      { step: "Monitor", desc: "Daily scans detect and report any unauthorized changes." }
    ]
  },
  {
    slug: "prep-compliance-qa",
    name: "Prep Compliance QA",
    shortDesc: "Pre-shipment checklist for FBA prep and labeling. Catches errors before Amazon charges penalties.",
    longDesc: "FBA prep and labeling mistakes lead to penalties, shipment rejections, and delays. Prep Compliance QA provides pre-shipment checklists based on Amazon's latest requirements, catches errors before you ship, and keeps you compliant as rules change — saving you from costly mistakes.",
    price: 29.00,
    priceLabel: "$29–99/mo",
    cat: "inventory",
    platforms: ["amazon"],
    live: false,
    score: 8.3,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Dynamic Checklists", desc: "Auto-generated checklists based on your product types and Amazon's latest rules." },
      { title: "Rule Updates", desc: "Automatically updated when Amazon changes prep or labeling requirements." },
      { title: "Exception Reporting", desc: "Flag items that need special prep or have changed requirements." },
      { title: "Team Workflows", desc: "Assign prep tasks to team members with completion tracking." }
    ],
    useCases: ["FBA sellers sending weekly shipments", "3PL providers processing prep for multiple sellers", "Sellers dealing with frequent prep-related penalties"],
    howItWorks: [
      { step: "Import Shipment", desc: "Enter your planned shipment or import from your workflow." },
      { step: "Check", desc: "Review the auto-generated checklist for every item." },
      { step: "Ship Clean", desc: "Send your shipment knowing it meets all Amazon requirements." }
    ]
  },
  {
    slug: "suppression-inbox",
    name: "Suppression Inbox",
    shortDesc: "Unified queue for all suppressed, stranded, and inactive listings across Amazon & Walmart with SLA tracking.",
    longDesc: "Suppressed, stranded, and inactive listings are scattered across different screens in Seller Central and Walmart Seller Center. Suppression Inbox unifies them into a single queue with SLA tracking, bulk actions, and priority scoring — so you fix the most impactful issues first.",
    price: 19.00,
    priceLabel: "$19–69/mo",
    cat: "listing",
    platforms: ["amazon", "walmart"],
    live: false,
    score: 8.0,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Unified Queue", desc: "All suppressed, stranded, and inactive listings in one dashboard." },
      { title: "Priority Scoring", desc: "Issues ranked by revenue impact so you fix the most important first." },
      { title: "SLA Tracking", desc: "Track how long each issue has been unresolved with aging alerts." },
      { title: "Bulk Actions", desc: "Fix common issues across multiple listings with one click." },
      { title: "Cross-Platform", desc: "Amazon and Walmart suppression issues in one view." }
    ],
    useCases: ["High-volume sellers with large catalogs", "Sellers on both Amazon and Walmart", "Teams needing organized listing health management"],
    howItWorks: [
      { step: "Connect", desc: "Link your Amazon and/or Walmart accounts." },
      { step: "Scan", desc: "We pull all suppressed, stranded, and inactive listings into one queue." },
      { step: "Fix", desc: "Work through issues by priority with guided resolution steps." }
    ]
  },
  {
    slug: "oversell-guard",
    name: "Oversell Guard",
    shortDesc: "Shared inventory ledger across Amazon, Shopify, and Walmart. Safety stock buffers prevent overselling.",
    longDesc: "Overselling destroys your seller metrics, leads to cancellations, and erodes customer trust. Oversell Guard maintains a shared inventory ledger across Amazon, Shopify, and Walmart with configurable safety stock buffers — automatically freezing listings when stock gets dangerously low.",
    price: 29.00,
    priceLabel: "$29–79/mo",
    cat: "inventory",
    platforms: ["amazon", "shopify", "walmart"],
    live: false,
    score: 7.3,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Shared Ledger", desc: "Single source of truth for inventory across Amazon, Shopify, and Walmart." },
      { title: "Safety Buffers", desc: "Configurable safety stock per channel to prevent overselling." },
      { title: "Auto-Freeze", desc: "Automatically pause listings when stock drops below safety threshold." },
      { title: "Reconciliation", desc: "Regular checks to ensure platform quantities match your ledger." }
    ],
    useCases: ["Multi-channel sellers experiencing oversell issues", "Sellers with limited stock selling on 3+ platforms", "Brands launching on new platforms without inventory risk"],
    howItWorks: [
      { step: "Connect Channels", desc: "Link all your marketplace accounts." },
      { step: "Set Buffers", desc: "Configure safety stock levels per channel." },
      { step: "Protect", desc: "Inventory auto-syncs with oversell protection active 24/7." }
    ]
  },
  {
    slug: "bundle-sync-studio",
    name: "Bundle Sync Studio",
    shortDesc: "Parent-child SKU mapping with automatic component stock deduction. Sell bundles without breaking inventory.",
    longDesc: "Selling bundles and multi-packs is great for margins, but managing component-level inventory across channels is a nightmare. Bundle Sync Studio handles parent-child SKU mapping with automatic component deduction — so when a bundle sells, individual component stock updates everywhere.",
    price: 29.00,
    priceLabel: "$29–89/mo",
    cat: "inventory",
    platforms: ["shopify", "amazon", "walmart"],
    live: false,
    score: 7.3,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Bundle Mapping", desc: "Map bundles to their component SKUs with quantity ratios." },
      { title: "Auto-Deduction", desc: "Component stock automatically decreases when a bundle sells." },
      { title: "Cross-Channel Sync", desc: "Bundle inventory reflected accurately across all platforms." },
      { title: "Threshold Alerts", desc: "Warnings when component stock threatens bundle availability." }
    ],
    useCases: ["Sellers offering multi-pack and bundle variations", "Brands with component products sold individually and in kits", "Multi-channel sellers with complex bundle structures"],
    howItWorks: [
      { step: "Define Bundles", desc: "Map which products make up each bundle and their quantities." },
      { step: "Connect", desc: "Link your marketplace accounts for cross-channel sync." },
      { step: "Sell", desc: "Bundles and components stay in sync automatically across all channels." }
    ]
  },
  {
    slug: "fee-change-simulator",
    name: "Fee Change Simulator",
    shortDesc: "What-if margin calculator. Change price, fees, or pack size and instantly see the impact on net profit.",
    longDesc: "Before making pricing or packaging changes, you need to know exactly how they'll affect your margins. Fee Change Simulator lets you model any combination of price changes, fee updates, pack-size modifications, and cost adjustments — showing you the net profit impact per unit before you commit.",
    price: 19.00,
    priceLabel: "$19–69/mo",
    cat: "financial",
    platforms: ["amazon", "walmart"],
    live: false,
    score: 8.0,
    featured: false,
    trialDays: 14,
    features: [
      { title: "What-If Modeling", desc: "Change any variable and see instant margin impact." },
      { title: "Fee Calculator", desc: "Accurate fee calculations for Amazon and Walmart's latest fee structures." },
      { title: "Pack-Size Comparison", desc: "Compare profitability across different pack configurations." },
      { title: "Scenario Saving", desc: "Save and compare multiple scenarios side-by-side." }
    ],
    useCases: ["Sellers evaluating price changes before implementation", "Brands considering pack-size or bundle strategies", "Finance teams modeling fee impact scenarios"],
    howItWorks: [
      { step: "Select Product", desc: "Choose the product you want to simulate changes for." },
      { step: "Adjust Variables", desc: "Change price, fees, COGS, pack size, or any cost component." },
      { step: "Compare", desc: "See net profit per unit for current vs. simulated scenarios." }
    ]
  },
  {
    slug: "sku-margin-sentinel",
    name: "SKU Margin Sentinel",
    shortDesc: "Daily net margin alerts per SKU. Catches when ad spend, fees, or refunds quietly push a product into the red.",
    longDesc: "A profitable SKU can silently turn unprofitable as ad costs creep up, fees change, or return rates increase. SKU Margin Sentinel monitors every SKU's net margin daily and alerts you the moment any product drops below your threshold — so you can take action before the losses accumulate.",
    price: 29.00,
    priceLabel: "$29–99/mo",
    cat: "financial",
    platforms: ["amazon", "shopify", "walmart"],
    live: false,
    score: 7.3,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Daily Margin Tracking", desc: "Net margin calculated daily for every SKU including all cost components." },
      { title: "Threshold Alerts", desc: "Instant notification when any SKU drops below your margin threshold." },
      { title: "Trend Detection", desc: "Identify margin erosion trends before they become critical." },
      { title: "Multi-Platform", desc: "Track margins across Amazon, Shopify, and Walmart." }
    ],
    useCases: ["Sellers with 50+ SKUs who can't monitor each one daily", "Brands seeing margin erosion but unsure which SKUs are the culprit", "Teams needing automated profitability monitoring"],
    howItWorks: [
      { step: "Import Costs", desc: "Add COGS and set margin thresholds for your catalog." },
      { step: "Monitor", desc: "We track margins daily factoring in fees, ads, returns, and refunds." },
      { step: "Act", desc: "Get alerted when margins drop and see exactly what caused the decline." }
    ]
  },
  {
    slug: "tiktok-shop-profit-tracker",
    name: "TikTok Shop Profit Tracker",
    shortDesc: "Lightweight profit tracker for TikTok Shop sellers. Reconcile payouts, commissions, and shipping costs.",
    longDesc: "TikTok Shop is growing explosively, but its native analytics don't tell you your true profit. This lightweight tracker reconciles your payouts with actual commissions, shipping costs, and product costs — giving you clear visibility into what you're actually making on every TikTok Shop sale.",
    price: 14.99,
    priceLabel: "$14.99/mo",
    cat: "financial",
    platforms: ["tiktok"],
    live: false,
    score: 7.3,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Payout Reconciliation", desc: "Match TikTok payouts against actual order data for accuracy." },
      { title: "Commission Tracking", desc: "Track platform and affiliate commissions per order." },
      { title: "Shipping Cost Analysis", desc: "Monitor actual shipping costs vs. what TikTok charges customers." },
      { title: "Profit Dashboard", desc: "Clean dashboard showing true profit per product and overall." }
    ],
    useCases: ["TikTok Shop sellers who don't know their real margins", "Sellers scaling TikTok Shop and needing financial visibility", "Multi-channel sellers wanting TikTok profitability data"],
    howItWorks: [
      { step: "Connect TikTok", desc: "Link your TikTok Shop seller account." },
      { step: "Add Costs", desc: "Input product costs for profit calculations." },
      { step: "Track", desc: "See real profit per product with payout reconciliation." }
    ]
  },
  {
    slug: "ad-spend-auto-pause",
    name: "Ad Spend Auto-Pause",
    shortDesc: "Set simple rules (ACoS > X%, ROAS < Y) and automatically pause underperforming campaigns.",
    longDesc: "You can't watch your ad campaigns 24/7, but bad performance doesn't stop when you sleep. Ad Spend Auto-Pause lets you set simple rules — if ACoS exceeds your threshold or ROAS drops too low, campaigns pause automatically. Protect your margin from runaway ad spend without constant monitoring.",
    price: 19.99,
    priceLabel: "$19.99/mo",
    cat: "ads",
    platforms: ["amazon", "shopify"],
    live: false,
    score: 6.7,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Rule Engine", desc: "Set ACoS, ROAS, spend, and conversion rules for auto-pause triggers." },
      { title: "Automatic Execution", desc: "Campaigns pause automatically when rules are breached." },
      { title: "Recovery Mode", desc: "Campaigns can auto-resume when performance improves." },
      { title: "Activity Log", desc: "See every auto-pause action with the metrics that triggered it." }
    ],
    useCases: ["Sellers running PPC on autopilot who need guardrails", "Agencies managing ad budgets for multiple clients", "Sellers with tight margins who can't afford runaway ACoS"],
    howItWorks: [
      { step: "Set Rules", desc: "Define your ACoS, ROAS, or spend thresholds." },
      { step: "Activate", desc: "Turn on auto-pause for selected campaigns." },
      { step: "Relax", desc: "Underperforming campaigns pause automatically, protecting your margin." }
    ]
  },
  {
    slug: "tariff-impact-calculator",
    name: "Tariff Impact Calculator",
    shortDesc: "Calculate how tariff changes affect your margins at the SKU level. Model de minimis exemption changes.",
    longDesc: "Tariff changes and de minimis exemption updates can dramatically affect your per-unit margins — especially for imported goods. This calculator lets you model the impact of tariff changes at the SKU level, helping you adjust pricing, sourcing, or pack-size strategies before the changes hit your P&L.",
    price: 14.99,
    priceLabel: "$14.99/mo",
    cat: "financial",
    platforms: ["multi"],
    live: false,
    score: 7.6,
    featured: false,
    trialDays: 14,
    features: [
      { title: "SKU-Level Impact", desc: "Calculate tariff impact for each SKU based on HS codes and sourcing." },
      { title: "De Minimis Modeling", desc: "Model how changes to de minimis thresholds affect your costs." },
      { title: "Scenario Planning", desc: "Compare current vs. proposed tariff rates across your catalog." },
      { title: "Margin Alerts", desc: "Flag SKUs where tariff changes push margins below viability." }
    ],
    useCases: ["Sellers importing goods affected by tariff changes", "Brands evaluating sourcing alternatives based on tariff impact", "Finance teams modeling tariff scenarios for budget planning"],
    howItWorks: [
      { step: "Import Catalog", desc: "Add your products with HS codes, sourcing countries, and costs." },
      { step: "Set Scenarios", desc: "Input current and proposed tariff rates." },
      { step: "Analyze", desc: "See per-SKU margin impact and identify at-risk products." }
    ]
  },
  {
    slug: "manufacturing-cost-optimizer",
    name: "Manufacturing Cost Optimizer",
    shortDesc: "Optimize your manufacturing cost declarations for Amazon's cost-based reimbursement policy.",
    longDesc: "Amazon's new cost-based reimbursement policy means your declared manufacturing cost directly affects how much you recover. This tool helps you optimize your cost declarations legally — ensuring you're not leaving money on the table when filing reimbursement claims.",
    price: 14.99,
    priceLabel: "$14.99/mo",
    cat: "reimbursement",
    platforms: ["amazon"],
    live: false,
    score: 7.2,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Cost Analysis", desc: "Analyze your manufacturing costs and compare with Amazon's reimbursement values." },
      { title: "Optimization Guide", desc: "Legal strategies to declare costs that maximize your reimbursement amounts." },
      { title: "Policy Tracker", desc: "Stay updated on Amazon's evolving reimbursement policies." },
      { title: "Claim Maximizer", desc: "Ensure every claim uses the optimal cost declaration." }
    ],
    useCases: ["FBA sellers who haven't updated their manufacturing cost declarations", "Sellers losing money on reimbursements due to low cost declarations", "Brands wanting to maximize claim recovery values"],
    howItWorks: [
      { step: "Input Costs", desc: "Enter your actual manufacturing costs per product." },
      { step: "Optimize", desc: "Get recommendations for optimal cost declarations." },
      { step: "Update", desc: "Apply optimized costs and start recovering more on claims." }
    ]
  },
  {
    slug: "app-sprawl-auditor",
    name: "App Sprawl Auditor",
    shortDesc: "Audit your Shopify app stack for redundancies, conflicts, and wasted spend. Get a cleanup plan.",
    longDesc: "Most Shopify stores accumulate apps over time without regular audits. App Sprawl Auditor analyzes your installed apps for redundant functionality, potential conflicts, performance impact, and wasted spend — then gives you a cleanup plan with estimated monthly savings.",
    price: 9.00,
    priceLabel: "$9–29/mo",
    cat: "operations",
    platforms: ["shopify"],
    live: false,
    score: 8.3,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Redundancy Detection", desc: "Find apps with overlapping functionality you're paying for twice." },
      { title: "Conflict Scanner", desc: "Identify apps that may conflict with each other or slow down your store." },
      { title: "Cost Analysis", desc: "See total monthly app spend with savings recommendations." },
      { title: "Cleanup Plan", desc: "Prioritized removal recommendations with estimated impact." }
    ],
    useCases: ["Shopify stores spending $200+/mo on apps", "Store owners who've never audited their app stack", "Agencies optimizing client store performance"],
    howItWorks: [
      { step: "Connect Store", desc: "Link your Shopify store to scan installed apps." },
      { step: "Audit", desc: "We analyze every app for redundancy, conflicts, and cost." },
      { step: "Clean Up", desc: "Follow the prioritized plan to remove waste and save money." }
    ]
  },
  {
    slug: "mcf-loss-refund-checker",
    name: "MCF Loss Refund Checker",
    shortDesc: "Audit Multi-Channel Fulfillment orders for lost packages and shipping overcharges. Auto-generates refund claims.",
    longDesc: "If you use Amazon MCF to fulfill Shopify or other channel orders, you're likely losing money to undetected lost packages and shipping overcharges. This tool audits your MCF orders, identifies losses and overcharges, and auto-generates refund claims to recover your money.",
    price: 19.00,
    priceLabel: "$19–59/mo",
    cat: "returns",
    platforms: ["amazon", "shopify"],
    live: false,
    score: 8.3,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Loss Detection", desc: "Identify MCF orders where packages were lost but not refunded." },
      { title: "Overcharge Audit", desc: "Find shipping fee overcharges on MCF orders." },
      { title: "Claim Generation", desc: "Auto-generate refund claims with all required evidence." },
      { title: "Recovery Tracking", desc: "Track submitted claims and recovered amounts." }
    ],
    useCases: ["Sellers using MCF for Shopify order fulfillment", "Brands with high MCF volume looking for cost recovery", "Sellers who've never audited their MCF charges"],
    howItWorks: [
      { step: "Connect", desc: "Link your Amazon MCF and Shopify accounts." },
      { step: "Audit", desc: "We scan MCF orders for losses and overcharges." },
      { step: "Recover", desc: "Submit auto-generated claims and track recoveries." }
    ]
  },
  {
    slug: "ai-listing-consistency-checker",
    name: "AI Listing Consistency Checker",
    shortDesc: "Compare title, bullets, and attributes across Amazon, Walmart, and TikTok Shop for inconsistencies.",
    longDesc: "Selling the same product on multiple marketplaces? Inconsistencies in your titles, bullet points, and attributes can confuse AI algorithms and hurt your visibility. This tool lets you enter any ASIN/SKU and instantly see a cross-platform comparison highlighting every inconsistency.",
    price: 14.99,
    priceLabel: "$14.99/mo",
    cat: "listing",
    platforms: ["multi"],
    live: false,
    score: 8.0,
    featured: false,
    trialDays: 14,
    features: [
      { title: "Cross-Platform Comparison", desc: "Side-by-side view of your listing across Amazon, Walmart, and TikTok Shop." },
      { title: "Inconsistency Highlighting", desc: "Visual flags for mismatched titles, bullets, images, and attributes." },
      { title: "AI Impact Score", desc: "How much each inconsistency affects your visibility in AI-powered search." },
      { title: "Bulk Scanning", desc: "Scan your entire catalog for cross-platform inconsistencies at once." }
    ],
    useCases: ["Multi-channel sellers with content drift across platforms", "Brands maintaining consistent messaging everywhere", "Sellers optimizing for AI-powered search across marketplaces"],
    howItWorks: [
      { step: "Enter SKU", desc: "Input your ASIN or SKU to start the comparison." },
      { step: "Compare", desc: "See your listing side-by-side across all connected platforms." },
      { step: "Fix", desc: "Address highlighted inconsistencies to improve AI visibility." }
    ]
  }
];

function getProductBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug) || null;
}

function getProductsByCategory(catSlug) {
  return PRODUCTS.filter(p => p.cat === catSlug);
}

function getLiveProducts() {
  return PRODUCTS.filter(p => p.live);
}

function getComingSoonProducts() {
  return PRODUCTS.filter(p => !p.live);
}

function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.featured);
}

function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.shortDesc.toLowerCase().includes(q) ||
    p.platforms.some(pl => PLATFORMS[pl]?.name.toLowerCase().includes(q)) ||
    CATEGORIES[p.cat]?.name.toLowerCase().includes(q)
  );
}

function getCategoryCount(catSlug) {
  return PRODUCTS.filter(p => p.cat === catSlug).length;
}

// ===== FEATURE REQUESTS =====
// status: open | popular | planned | building | launched
// Approved requests appear here. New submissions go through Formspree.
const FEATURE_REQUESTS = [
  {
    id: "fr-001",
    title: "Inventory Demand Forecasting with AI",
    description: "I need a tool that predicts when I'll run out of stock based on sales velocity, seasonality, and trends. Current restock planning is all guesswork.",
    author: "FBA Seller",
    date: "2026-03-01",
    status: "popular",
    votes: 47,
    platform: "Amazon",
    comments: [
      { author: "Multi-Channel Mike", text: "This would save me so much time. I restock based on gut feeling and it's not working.", date: "2026-03-03" },
      { author: "PL Sarah", text: "Especially useful if it factors in lead times from my supplier in China.", date: "2026-03-05" }
    ]
  },
  {
    id: "fr-002",
    title: "Automated Competitor Price Monitoring",
    description: "I want real-time alerts when my competitors change prices on the same ASINs. Need to react fast to stay competitive without manually checking every day.",
    author: "Wholesale Seller",
    date: "2026-03-02",
    status: "planned",
    votes: 38,
    platform: "Amazon",
    comments: [
      { author: "BrandOwner22", text: "Yes! Especially for MAP monitoring across authorized resellers.", date: "2026-03-04" }
    ]
  },
  {
    id: "fr-003",
    title: "TikTok Shop to Shopify Order Sync",
    description: "I sell on TikTok Shop and Shopify but orders don't sync. I need one dashboard for both channels, including inventory levels.",
    author: "D2C Brand Owner",
    date: "2026-03-05",
    status: "open",
    votes: 29,
    platform: "TikTok Shop",
    comments: []
  },
  {
    id: "fr-004",
    title: "Automated VAT/Sales Tax Calculator for EU Expansion",
    description: "As a US seller expanding to EU marketplaces, calculating VAT for each country is a nightmare. Need something that auto-calculates and generates reports.",
    author: "Global Seller",
    date: "2026-03-06",
    status: "open",
    votes: 22,
    platform: "Multi-Platform",
    comments: [
      { author: "EUSeller", text: "This is desperately needed. IOSS compliance is confusing.", date: "2026-03-07" }
    ]
  },
  {
    id: "fr-005",
    title: "Return Fraud Pattern Detector",
    description: "Some buyers are clearly abusing return policies — buying items, using them, and returning. I need a tool that identifies suspicious return patterns per customer.",
    author: "Amazon Seller",
    date: "2026-03-08",
    status: "popular",
    votes: 53,
    platform: "Amazon",
    comments: [
      { author: "FBASeller99", text: "I lose thousands a month to return abuse. This would be a game changer.", date: "2026-03-09" },
      { author: "BrandProtector", text: "Would be great if it also flagged serial returners before they buy.", date: "2026-03-10" }
    ]
  },
  {
    id: "fr-006",
    title: "Walmart Listing Quality Score Tracker",
    description: "Walmart has a listing quality score but it's hard to monitor across hundreds of SKUs. Need a tool that tracks score changes and recommends fixes.",
    author: "Walmart Seller",
    date: "2026-03-09",
    status: "open",
    votes: 15,
    platform: "Walmart",
    comments: []
  }
];

function getFeatureRequests(sortBy = 'votes') {
  const sorted = [...FEATURE_REQUESTS];
  if (sortBy === 'votes') sorted.sort((a, b) => b.votes - a.votes);
  else if (sortBy === 'newest') sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted;
}
