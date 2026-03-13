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
  }
};

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
function handleAddToCart(slug) {
  const product = getProductBySlug(slug);
  if (!product) return;

  if (Cart.hasItem(slug)) {
    window.location.href = 'cart.html';
    return;
  }

  Cart.addItem(slug);
  Toast.show('Added to Cart', `${product.name} — 14-day free trial`, 'success');

  setTimeout(() => {
    window.location.href = 'cart.html';
  }, 800);
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
      : '<div class="badge-top badge-new">COMING SOON</div>';

  const liveHtml = product.live
    ? '<div class="live-indicator"><span class="dot"></span> LIVE</div>'
    : '';

  const ctaText = product.live ? 'Start Free Trial' : 'Notify Me';
  const ctaAction = product.live
    ? `onclick="event.preventDefault(); handleAddToCart('${product.slug}')" href="#"`
    : `onclick="event.preventDefault(); Modal.showNotifyForm(getProductBySlug('${product.slug}'))" href="#"`;

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
      <div class="tool-card-footer">
        <div class="tool-score">
          <span>Score ${product.score.toFixed(1)}</span>
          <div class="score-bar"><div class="score-fill" style="width:${(product.score / 10) * 100}%"></div></div>
        </div>
        <a class="tool-cta-link" ${ctaAction}>${ctaText} &rarr;</a>
      </div>
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
        <a href="index.html#tools" class="${activePage === 'tools' ? 'active' : ''}">Tools</a>
        <a href="index.html#categories" class="${activePage === 'categories' ? 'active' : ''}">Categories</a>
        <a href="index.html#how" class="${activePage === 'how' ? 'active' : ''}">How It Works</a>
      </div>
      <div class="nav-right">
        <a href="cart.html" class="nav-cart">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
          <span class="cart-badge" id="cartBadge">0</span>
        </a>
        <a href="cart.html" class="btn-nav">Start Free Trial</a>
      </div>
      <button class="mobile-toggle" onclick="toggleMobileMenu()" aria-label="Toggle menu">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  `;

  Cart.updateBadge();
}

function toggleMobileMenu() {
  let menu = document.getElementById('mobileMenu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'mobileMenu';
    menu.className = 'mobile-menu';
    menu.innerHTML = `
      <a href="index.html">Home</a>
      <a href="index.html#tools">All Tools</a>
      <a href="index.html#categories">Categories</a>
      <a href="index.html#how">How It Works</a>
      <a href="cart.html">Cart</a>
    `;
    document.body.appendChild(menu);
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
        <p>Built for sellers, by sellers.</p>
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

// ===== PAGE INIT =====
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
});
