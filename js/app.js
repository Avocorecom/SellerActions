// SellerActions - Core Application Logic

// ===== CONFIG =====
// Create a free form at https://formspree.io and paste your endpoint below.
// Notify Me submissions AND trial signups are sent here.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgonybaq';

// ===== CART SYSTEM =====
const Cart = {
  KEY: 'selleractions_cart',

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch { return []; }
  },

  addItem(slug) {
    const items = this.getItems();
    if (items.includes(slug)) return false;
    items.push(slug);
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
    return true;
  },

  removeItem(slug) {
    const items = this.getItems().filter(s => s !== slug);
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  hasItem(slug) {
    return this.getItems().includes(slug);
  },

  count() {
    return this.getItems().length;
  },

  getProducts() {
    return this.getItems().map(slug => getProductBySlug(slug)).filter(Boolean);
  },

  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.count();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.classList.toggle('visible', count > 0);
    });
  }
};

// ===== NOTIFY SYSTEM =====
const Notify = {
  KEY: 'selleractions_notify',

  getEmails() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || {};
    } catch { return {}; }
  },

  async subscribe(slug, email) {
    const data = this.getEmails();
    if (!data[slug]) data[slug] = [];
    if (!data[slug].includes(email)) data[slug].push(email);
    localStorage.setItem(this.KEY, JSON.stringify(data));

    const product = getProductBySlug(slug);
    await this.sendToFormspree({
      _subject: `Notify Me: ${product?.name || slug}`,
      type: 'notify_me',
      email: email,
      product_name: product?.name || slug,
      product_slug: slug,
      product_category: CATEGORIES[product?.cat]?.name || '',
      product_price: product?.priceLabel || '',
      platforms: product?.platforms?.map(p => PLATFORMS[p]?.name).join(', ') || '',
      timestamp: new Date().toISOString()
    });
  },

  async sendToFormspree(data) {
    if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) return;
    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.warn('Form submission failed:', e);
    }
  },

  isSubscribed(slug) {
    const data = this.getEmails();
    return data[slug] && data[slug].length > 0;
  }
};

// ===== TOAST NOTIFICATIONS =====
const Toast = {
  container: null,

  init() {
    if (document.getElementById('toastContainer')) return;
    this.container = document.createElement('div');
    this.container.id = 'toastContainer';
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },

  show(title, message, type = 'success') {
    this.init();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconContent = type === 'success' ? '&#10003;' : 'i';
    toast.innerHTML = `
      <div class="toast-icon">${iconContent}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    `;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// ===== MODAL =====
const Modal = {
  overlay: null,

  init() {
    if (document.getElementById('modalOverlay')) return;
    this.overlay = document.createElement('div');
    this.overlay.id = 'modalOverlay';
    this.overlay.className = 'modal-overlay';
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.body.appendChild(this.overlay);
  },

  open(content) {
    this.init();
    this.overlay.innerHTML = `<div class="modal">${content}</div>`;
    requestAnimationFrame(() => this.overlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  showNotifyForm(product) {
    this.open(`
      <h3>Get Notified</h3>
      <p><strong>${product.name}</strong> is coming soon. Enter your email and we'll notify you when it launches.</p>
      <div class="form-group">
        <label for="notifyEmail">Email Address</label>
        <input type="email" id="notifyEmail" placeholder="you@example.com" required>
      </div>
      <div class="modal-actions">
        <button class="btn-primary btn-full" onclick="handleNotifySubmit('${product.slug}')">Notify Me</button>
        <button class="btn-ghost" onclick="Modal.close()">Cancel</button>
      </div>
    `);
    setTimeout(() => document.getElementById('notifyEmail')?.focus(), 100);
  },

  showStartNowForm(slug, productName) {
    this.open(`
      <h3>Get Started with ${productName}</h3>
      <p>Leave your details and our team will reach out to set up your account and get you started.</p>
      <div class="form-group">
        <label for="startName">Full Name</label>
        <input type="text" id="startName" placeholder="John Doe" required>
      </div>
      <div class="form-group">
        <label for="startEmail">Email Address</label>
        <input type="email" id="startEmail" placeholder="you@example.com" required>
      </div>
      <div class="form-group">
        <label for="startStore">Store URL (optional)</label>
        <input type="text" id="startStore" placeholder="amazon.com/shops/yourstore">
      </div>
      <div class="modal-actions">
        <button class="btn-primary btn-full" onclick="handleStartNowSubmit('${slug}', '${productName.replace(/'/g, "\\'")}')">Submit</button>
        <button class="btn-ghost" onclick="Modal.close()">Cancel</button>
      </div>
    `);
    setTimeout(() => document.getElementById('startName')?.focus(), 100);
  }
};

function showStartNowModal(slug, productName) {
  Modal.showStartNowForm(slug, productName);
}

async function handleStartNowSubmit(slug, productName) {
  const name = document.getElementById('startName')?.value?.trim();
  const email = document.getElementById('startEmail')?.value?.trim();
  const store = document.getElementById('startStore')?.value?.trim();

  if (!name) {
    Toast.show('Name Required', 'Please enter your name.', 'info');
    return;
  }
  if (!email || !email.includes('@')) {
    Toast.show('Invalid Email', 'Please enter a valid email address.', 'info');
    return;
  }

  const btn = document.querySelector('.modal .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

  await Notify.sendToFormspree({
    _subject: `Start Now: ${productName}`,
    type: 'start_now',
    name: name,
    email: email,
    store_url: store || 'Not provided',
    product_name: productName,
    product_slug: slug,
    timestamp: new Date().toISOString()
  });

  Modal.close();
  Toast.show('Request Received!', "Thanks! We'll reach out within 24 hours to get you set up.", 'success');
}

async function handleNotifySubmit(slug) {
  const email = document.getElementById('notifyEmail')?.value?.trim();
  if (!email || !email.includes('@')) {
    Toast.show('Invalid Email', 'Please enter a valid email address.', 'info');
    return;
  }
  const product = getProductBySlug(slug);
  const btn = document.querySelector('.modal .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Subscribing...'; }

  await Notify.subscribe(slug, email);
  Modal.close();
  Toast.show('Subscribed!', `We'll notify you when ${product?.name || 'this tool'} launches.`, 'success');
}

async function submitTrialSignup(data) {
  if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) return;
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `New Trial Signup: ${data.store_type}`,
        type: 'trial_signup',
        ...data,
        timestamp: new Date().toISOString()
      })
    });
  } catch (e) {
    console.warn('Trial signup submission failed:', e);
  }
}

// ===== ADD TO CART HANDLER =====
function handleAddToCart(slug, redirect = false) {
  const product = getProductBySlug(slug);
  if (!product) return;

  if (Cart.hasItem(slug)) {
    if (redirect) window.location.href = 'cart.html';
    else Toast.show('Already in Cart', `${product.name} is already in your cart.`, 'info');
    return;
  }

  Cart.addItem(slug);
  const count = Cart.count();
  const discountMsg = count >= 2 ? ' — 50% off with 2+ tools!' : '';
  Toast.show('Added to Cart', `${product.name}${discountMsg}`, 'success');

  if (redirect) {
    setTimeout(() => { window.location.href = 'cart.html'; }, 600);
  }
}

function handleTryFree(slug) {
  handleAddToCart(slug, true);
}

function addBundleToCart() {
  const liveProducts = getLiveProducts();
  let added = 0;
  liveProducts.forEach(p => {
    if (!Cart.hasItem(p.slug)) {
      Cart.addItem(p.slug);
      added++;
    }
  });
  if (added > 0) {
    Toast.show('Bundle Added', `${added} tool${added > 1 ? 's' : ''} added to cart — 50% off!`, 'success');
  } else {
    Toast.show('Already in Cart', 'All bundle tools are already in your cart.', 'info');
  }
  setTimeout(() => { window.location.href = 'cart.html'; }, 800);
}

// ===== DISCOUNT LOGIC =====
const Discount = {
  THRESHOLD: 2,
  PERCENT: 50,

  applies(itemCount) {
    return itemCount >= this.THRESHOLD;
  },

  label() {
    return `${this.PERCENT}% off`;
  },

  calculate(price, itemCount) {
    if (!this.applies(itemCount)) return price;
    return price * (1 - this.PERCENT / 100);
  }
};

// ===== FEATURE REQUEST SYSTEM =====
const Votes = {
  KEY: 'selleractions_votes',

  getAll() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; } catch { return {}; }
  },

  hasVoted(id) {
    return !!this.getAll()[id];
  },

  toggle(id) {
    const data = this.getAll();
    if (data[id]) { delete data[id]; } else { data[id] = Date.now(); }
    localStorage.setItem(this.KEY, JSON.stringify(data));
    return !data[id] ? false : true;
  },

  localCount(id) {
    return this.hasVoted(id) ? 1 : 0;
  }
};

async function submitFeatureRequest(data) {
  if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) return;
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ _subject: `Feature Request: ${data.title}`, type: 'feature_request', ...data, timestamp: new Date().toISOString() })
    });
  } catch (e) { console.warn('Feature request submission failed:', e); }
}

async function submitVote(requestId, title) {
  if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) return;
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ _subject: `Vote: ${title}`, type: 'vote', request_id: requestId, timestamp: new Date().toISOString() })
    });
  } catch (e) { console.warn('Vote submission failed:', e); }
}

async function submitComment(requestId, title, comment, author) {
  if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) return;
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ _subject: `Comment on: ${title}`, type: 'comment', request_id: requestId, author, comment, timestamp: new Date().toISOString() })
    });
  } catch (e) { console.warn('Comment submission failed:', e); }
}

// ===== SHARED COMPONENTS =====
function getIconGradient(cat) {
  const map = {
    financial: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
    cashflow: 'linear-gradient(135deg,#34d399,#059669)',
    reimbursement: 'linear-gradient(135deg,#60a5fa,#3b82f6)',
    inventory: 'linear-gradient(135deg,#fb923c,#ea580c)',
    listing: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
    ads: 'linear-gradient(135deg,#f472b6,#db2777)',
    returns: 'linear-gradient(135deg,#f87171,#dc2626)',
    operations: 'linear-gradient(135deg,#00c2d1,#0891b2)',
    multichannel: 'linear-gradient(135deg,#818cf8,#6366f1)'
  };
  return map[cat] || map.operations;
}

function getCatIcon(cat) {
  return CATEGORIES[cat]?.icon || '🔧';
}

function getPlatformClass(platform) {
  return PLATFORMS[platform]?.class || 'tag-multi';
}

function getPlatformName(platform) {
  return PLATFORMS[platform]?.name || platform;
}

function renderToolCard(product) {
  const badgeHtml = product.featured
    ? '<div class="badge-top badge-featured">TOP PICK</div>'
    : product.live
      ? '<div class="badge-top badge-live">LIVE</div>'
      : '';

  const liveHtml = product.live
    ? '<div class="live-indicator"><span class="dot"></span> LIVE</div>'
    : '';

  const inCart = Cart.hasItem(product.slug);

  let footerHtml;
  if (product.live) {
    footerHtml = `
      <a class="btn-card-cart${inCart ? ' in-cart' : ''}" href="#" onclick="event.preventDefault(); event.stopPropagation(); handleAddToCart('${product.slug}')">
        ${inCart ? '&#10003; In Cart' : '+ Add to Cart'}
      </a>
      <a class="btn-card-trial" href="#" onclick="event.preventDefault(); event.stopPropagation(); handleTryFree('${product.slug}')">
        14 Days Free &rarr;
      </a>
    `;
  } else {
    footerHtml = `
      <div class="tool-score">
        <span>Score ${product.score.toFixed(1)}</span>
        <div class="score-bar"><div class="score-fill" style="width:${(product.score / 10) * 100}%"></div></div>
      </div>
      <a class="btn-card-trial" href="#" onclick="event.preventDefault(); event.stopPropagation(); showStartNowModal('${product.slug}', '${product.name.replace(/'/g, "\\'")}')">Start Now &rarr;</a>
    `;
  }

  return `
    <article class="tool-card">
      ${badgeHtml}
      <a href="product.html?slug=${product.slug}" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; flex:1;">
        <div class="tool-card-top">
          <div class="tool-icon" style="background:${getIconGradient(product.cat)}">${getCatIcon(product.cat)}</div>
          <div style="text-align:right">
            <div class="tool-price">${product.priceLabel}</div>
            ${liveHtml}
          </div>
        </div>
        <h3>${product.name}</h3>
        <p class="desc">${product.shortDesc}</p>
        <div class="tool-tags">
          ${product.platforms.map(p => `<span class="tool-tag ${getPlatformClass(p)}">${getPlatformName(p)}</span>`).join('')}
        </div>
      </a>
      <div class="tool-card-footer">${footerHtml}</div>
    </article>
  `;
}

function renderCategoryCard(catSlug) {
  const cat = CATEGORIES[catSlug];
  if (!cat) return '';
  const count = getCategoryCount(catSlug);
  return `
    <a href="category.html?cat=${catSlug}" class="category-card">
      <div class="category-card-icon" style="background:${cat.gradient}">${cat.icon}</div>
      <h3>${cat.name}</h3>
      <p>${cat.desc}</p>
      <span class="category-card-count">${count} tool${count !== 1 ? 's' : ''}</span>
    </a>
  `;
}

// ===== NAV RENDERER =====
function renderNav(activePage) {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">
        <div class="nav-logo-icon">SA</div>
        <div class="nav-logo-text">Seller<span>Actions</span></div>
      </a>
      <div class="nav-links" id="navLinks">
        <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a>
        <div class="nav-dropdown">
          <a href="#" class="nav-dropdown-trigger ${activePage === 'tools' ? 'active' : ''}" onclick="event.preventDefault()">
            Tools <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-left:3px;"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <div class="nav-dropdown-menu" id="toolsDropdown">
            ${Object.entries(CATEGORIES).map(([key, cat]) => {
              const catProducts = PRODUCTS.filter(p => p.cat === key && p.live);
              return `
                <div class="nav-dropdown-group">
                  <div class="nav-dropdown-cat">${cat.icon} ${cat.name}</div>
                  ${catProducts.map(p => `
                    <a href="product.html?slug=${p.slug}" class="nav-dropdown-item">${p.name}</a>
                  `).join('')}
                  ${catProducts.length === 0 ? `<span class="nav-dropdown-item" style="color:var(--text-muted);font-style:italic;">Coming soon</span>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <a href="requests.html" class="${activePage === 'requests' ? 'active' : ''}">Requests</a>
        <a href="blog.html" class="${activePage === 'blog' ? 'active' : ''}">Blog</a>
      </div>
      <div class="nav-right">
        <a href="cart.html" class="nav-cart">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
          <span class="cart-badge" id="cartBadge">0</span>
        </a>
        <span id="navAuthBtn"><a href="cart.html" class="btn-nav">14 Days Free</a></span>
      </div>
      <button class="mobile-toggle" onclick="toggleMobileMenu()" aria-label="Toggle menu">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  `;

  Cart.updateBadge();

  // Update auth button async
  if (typeof Auth !== 'undefined') {
    Auth.getUser().then(user => {
      const authBtn = document.getElementById('navAuthBtn');
      if (authBtn && user) {
        authBtn.innerHTML = `
          <a href="dashboard.html" class="btn-nav">Dashboard</a>
          <button class="btn-nav-logout" onclick="handleLogout()" title="Sign Out">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        `;
      }
    }).catch(() => {});
  }
}

async function handleLogout() {
  try {
    await Auth.signOut();
  } catch (e) {
    console.warn('Logout error:', e);
  }
  window.location.href = 'index.html';
}

function toggleMobileMenu() {
  let menu = document.getElementById('mobileMenu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'mobileMenu';
    menu.className = 'mobile-menu';
    document.body.appendChild(menu);
  }

  // Build category + product links
  const toolsLinks = Object.entries(CATEGORIES).map(([key, cat]) => {
    const catProducts = (typeof PRODUCTS !== 'undefined')
      ? PRODUCTS.filter(p => p.cat === key && p.live)
      : [];
    return `
      <div style="padding:8px 0; border-top:1px solid var(--border);">
        <a href="category.html?cat=${key}" style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); padding:4px 0; display:block;">${cat.icon} ${cat.name}</a>
        ${catProducts.map(p => `<a href="product.html?slug=${p.slug}" style="padding-left:12px; font-size:0.82rem;">${p.name}</a>`).join('')}
      </div>
    `;
  }).join('');

  const baseLinks = `
    <a href="index.html">Home</a>
    <a href="blog.html">Blog</a>
    <a href="requests.html">Feature Requests</a>
    ${toolsLinks}
    <a href="cart.html" style="margin-top:8px;">Cart</a>
  `;

  if (typeof Auth !== 'undefined') {
    Auth.getUser().then(user => {
      menu.innerHTML = baseLinks + (user
        ? `<a href="dashboard.html">Dashboard</a>
           <a href="#" onclick="event.preventDefault(); handleLogout();" style="color:var(--red);">Sign Out</a>`
        : `<a href="cart.html">Start Free Trial</a>`
      );
    }).catch(() => {
      menu.innerHTML = baseLinks + `<a href="cart.html">Start Free Trial</a>`;
    });
  } else {
    menu.innerHTML = baseLinks + `<a href="cart.html">Start Free Trial</a>`;
  }

  menu.classList.toggle('open');
}

// ===== FOOTER RENDERER =====
function renderFooter() {
  const footer = document.getElementById('mainFooter');
  if (!footer) return;

  const catLinksHtml = Object.keys(CATEGORIES).slice(0, 6).map(key =>
    `<a href="category.html?cat=${key}">${CATEGORIES[key].name}</a>`
  ).join('');

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="nav-logo">
            <div class="nav-logo-icon">SA</div>
            <div class="nav-logo-text">Seller<span>Actions</span></div>
          </a>
          <p>Affordable micro-SaaS tools built specifically for e-commerce sellers. One tool at a time, one problem at a time.</p>
        </div>
        <div class="footer-col">
          <h4>Categories</h4>
          ${catLinksHtml}
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <a href="index.html#tools">All Tools</a>
          <a href="index.html#categories">Browse Categories</a>
          <a href="blog.html">Blog</a>
          <a href="requests.html">Feature Requests</a>
          <a href="cart.html">Cart</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="index.html#how">How It Works</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 SellerActions. All rights reserved.</p>
        <p style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">__VERSION__ · deployed __DEPLOY_TIME__</p>
      </div>
    </div>
  `;
}

// ===== SEARCH ICON SVG =====
const SEARCH_ICON = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
const CHECK_ICON = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
const ARROW_ICON = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
const CHEVRON_RIGHT = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`;
const TARGET_ICON = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;

// ===== FLOATING REQUEST BUTTON =====
function renderFloatingRequestBtn() {
  if (document.getElementById('floatingRequest')) return;
  const btn = document.createElement('a');
  btn.id = 'floatingRequest';
  btn.href = 'requests.html';
  btn.className = 'floating-request-btn';
  btn.innerHTML = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg> Request a Feature`;
  document.body.appendChild(btn);
}

// ===== DISCOUNT BANNER =====
function renderDiscountBanner() {
  if (document.getElementById('discountBanner')) return;
  const banner = document.createElement('div');
  banner.id = 'discountBanner';
  banner.className = 'discount-banner';
  banner.innerHTML = `<div class="container" style="display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;"><span class="discount-badge">BUNDLE DEAL</span> <span>Add 2 or more tools and get <strong>50% off</strong> after your free trial!</span> <a href="index.html#tools" class="discount-link">Browse Tools &rarr;</a></div>`;
  const nav = document.querySelector('.nav');
  if (nav) nav.after(banner);
}

// ===== PAGE INIT =====
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  renderFloatingRequestBtn();
  renderDiscountBanner();
});
