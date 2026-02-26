/* ================================
   BREW POD — MAIN JS
   Edit product data and logic here
   ================================ */

// ── PRODUCT DATA ── (edit here)
const PRODUCTS = [
  { id:1, name:"Arabian Espresso", brand:"Single Origin", price:19.56, oldPrice:24.00, rating:4.8, reviews:142, badge:"Bestseller", emoji:"☕", category:"espresso" },
  { id:2, name:"Viciila Premium", brand:"Medium Roast", price:19.56, oldPrice:null, rating:4.6, reviews:89, badge:"New", emoji:"🫘", category:"blend" },
  { id:3, name:"Cacilla Dark", brand:"Dark Roast", price:16.99, oldPrice:null, rating:4.7, reviews:203, badge:null, emoji:"🍫", category:"dark" },
  { id:4, name:"Golden Reserve", brand:"Limited Edition", price:24.99, oldPrice:32.00, rating:5.0, reviews:56, badge:"Limited", emoji:"✨", category:"special" },
  { id:5, name:"Morning Ritual", brand:"Light Roast", price:17.50, oldPrice:null, rating:4.5, reviews:178, badge:null, emoji:"🌅", category:"light" },
  { id:6, name:"Velvet Mocha", brand:"Flavored", price:21.00, oldPrice:null, rating:4.9, reviews:94, badge:"Popular", emoji:"🍬", category:"flavored" },
  { id:7, name:"Cold Brew Kit", brand:"Brew Kit", price:28.00, oldPrice:35.00, rating:4.7, reviews:61, badge:"Sale", emoji:"🧊", category:"kit" },
  { id:8, name:"Hazelnut Blend", brand:"Flavored", price:18.75, oldPrice:null, rating:4.4, reviews:112, badge:null, emoji:"🌰", category:"flavored" },
];

// ── CART STATE ──
let cart = JSON.parse(localStorage.getItem('bp_cart') || '[]');
let chatOpen = false;
let cartOpen = false;

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCart();
  initChat();
  initScrollReveal();
  initImageUploads();
  renderProducts();
  startCountdown();
  updateCartBadge();
  setActivePage();
  initFAQ();
  initOccasionBtns();
  initReserveForm();
});

// ── NAV ──
function initNav() {
  let last = 0;
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    nav.classList.toggle('hidden', cur > last && cur > 100);
    last = cur;
  });

  // Burger
  const burger = document.querySelector('.nav-burger');
  const drawer = document.querySelector('.nav-drawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      drawer.classList.toggle('open');
    });
  }
}

function setActivePage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

// ── CART ──
function initCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (!sidebar) return;

  document.getElementById('cartBtn')?.addEventListener('click', () => toggleCart(true));
  document.getElementById('cartClose')?.addEventListener('click', () => toggleCart(false));
  overlay?.addEventListener('click', () => { toggleCart(false); closeChat(); });

  renderCart();
}

function toggleCart(open) {
  cartOpen = open;
  document.getElementById('cartSidebar')?.classList.toggle('open', open);
  document.getElementById('overlay')?.classList.toggle('on', open || chatOpen);
}

function addToCart(id) {
  const prod = PRODUCTS.find(p => p.id === id);
  if (!prod) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...prod, qty: 1, img: null });
  saveCart();
  renderCart();
  updateCartBadge();
  showToast(`${prod.emoji} ${prod.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart(); renderCart(); updateCartBadge();
}

function changeCartQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  if (item.qty === 0) removeFromCart(id);
  else { saveCart(); renderCart(); updateCartBadge(); }
}

function saveCart() { localStorage.setItem('bp_cart', JSON.stringify(cart)); }

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = total);
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty">
      <div class="empty-icon">🛒</div>
      <p>Your cart is empty.<br/>Add some delicious coffee!</p>
    </div>`;
    if (foot) foot.style.display = 'none';
    return;
  }

  if (foot) foot.style.display = 'block';
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.img ? `<img src="${item.img}" alt="${item.name}"/>` : item.emoji}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="item-price">₱${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-ctrl">
          <button class="cart-qty-btn" onclick="changeCartQty(${item.id},-1)">−</button>
          <span class="cart-qty-val">${item.qty}</span>
          <button class="cart-qty-btn" onclick="changeCartQty(${item.id},1)">+</button>
          <button class="cart-remove" onclick="removeFromCart(${item.id})">✕ Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('cartSubtotal').textContent = '₱' + subtotal.toFixed(2);
}

// ── CHAT ──
const CHAT_RESPONSES = [
  "Hello! Welcome to Brew Pod ☕ How can I help you today?",
  "Sure! Our bestseller is the Arabian Espresso — bold with cardamom notes 🫘",
  "We're open Mon–Sat 7am–9pm and Sunday 8am–7pm!",
  "You can reserve a table through our Reservation page 📅",
  "We offer free delivery for orders above ₱500! 🛵",
  "Our coffee is sourced from single-origin farms in Ethiopia & Colombia ☕",
];
let chatRespIndex = 0;

function initChat() {
  const fab = document.getElementById('chatFab');
  const panel = document.getElementById('chatPanel');
  if (!fab || !panel) return;

  fab.addEventListener('click', () => {
    chatOpen = !chatOpen;
    panel.classList.toggle('open', chatOpen);
    fab.querySelector('.notif-dot')?.remove();
    if (chatOpen) document.getElementById('chatInput')?.focus();
  });

  document.getElementById('chatSend')?.addEventListener('click', sendChat);
  document.getElementById('chatInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendChat();
  });
}

function closeChat() {
  chatOpen = false;
  document.getElementById('chatPanel')?.classList.remove('open');
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const msgs = document.getElementById('chatMessages');
  if (!input || !msgs || !input.value.trim()) return;

  const userMsg = input.value.trim();
  input.value = '';

  msgs.innerHTML += `<div class="msg user">${escapeHtml(userMsg)}<div class="msg-time">${timeNow()}</div></div>`;
  msgs.scrollTop = msgs.scrollHeight;

  setTimeout(() => {
    const resp = CHAT_RESPONSES[chatRespIndex % CHAT_RESPONSES.length];
    chatRespIndex++;
    msgs.innerHTML += `<div class="msg owner">${resp}<div class="msg-time">${timeNow()}</div></div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }, 800);
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function timeNow() {
  return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}

// ── SCROLL REVEAL ──
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('vis'), e.target.dataset.delay || 0);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80;
    io.observe(el);
  });
}

// ── IMAGE UPLOADS ──
function initImageUploads() {
  document.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', function() {
      const file = this.files[0];
      if (!file) return;
      const target = this.dataset.target || this.closest('[id]')?.id;
      const reader = new FileReader();
      reader.onload = e => {
        const slot = this.closest('.img-slot, .prod-img, .mimg, .about-img-wrap, .team-img');
        if (!slot) return;
        let img = slot.querySelector('img');
        if (!img) { img = document.createElement('img'); slot.appendChild(img); }
        img.src = e.target.result;
        // Hide placeholder
        slot.querySelector('.prod-placeholder, .mimg-inner, .upload-icon, .upload-txt')?.remove?.();
        slot.style.border = 'none';
      };
      reader.readAsDataURL(file);
    });
  });
}

// ── RENDER PRODUCTS ──
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => {
    const badgeHtml = p.badge ? `<span class="badge badge-${p.badge === 'Sale' ? 'red' : p.badge === 'New' ? 'green' : 'gold'}">${p.badge}</span>` : '';
    const oldPriceHtml = p.oldPrice ? `<div class="price-old">₱${p.oldPrice.toFixed(2)}</div>` : '';
    const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
    return `
      <div class="prod-card reveal" data-category="${p.category}">
        <div class="prod-img">
          <input type="file" accept="image/*" class="file-input"/>
          <div class="prod-placeholder">
            <span style="font-size:2.8rem">${p.emoji}</span>
            <span style="font-size:.65rem;color:var(--brown-mid)">📁 Upload Image</span>
          </div>
          <div class="prod-tags">${badgeHtml}</div>
          <div class="quick-actions">
            <button class="quick-btn" title="Wishlist">♡</button>
            <button class="quick-btn" title="Quick view">👁</button>
          </div>
        </div>
        <div class="prod-info">
          <div class="brand">${p.brand}</div>
          <h3>${p.name}</h3>
          <div class="rating">
            <span class="stars">${stars}</span>
            <span class="count">(${p.reviews})</span>
          </div>
          <div class="prod-price-row">
            <div class="prod-price">
              <div class="price-new">₱${p.price.toFixed(2)}</div>
              ${oldPriceHtml}
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${p.id}); this.textContent='✓ Added'; this.classList.add('added'); setTimeout(()=>{this.textContent='+ Cart';this.classList.remove('added')},1500)">+ Cart</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  initImageUploads();
  initScrollReveal();
}

// ── FILTER ──
function filterProducts(cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('on'));
  event.target.classList.add('on');

  document.querySelectorAll('.prod-card').forEach(card => {
    const show = cat === 'all' || card.dataset.category === cat;
    card.style.display = show ? '' : 'none';
  });
}

// ── COUNTDOWN ──
function startCountdown() {
  const end = new Date();
  end.setHours(end.getHours() + 3, end.getMinutes() + 30, 0, 0);

  function tick() {
    const now = new Date();
    const diff = Math.max(0, end - now);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');

    document.querySelectorAll('[data-cd]').forEach(el => {
      const type = el.dataset.cd;
      el.textContent = type === 'h' ? pad(h) : type === 'm' ? pad(m) : pad(s);
    });
  }

  tick();
  setInterval(tick, 1000);
}

// ── TOAST ──
function showToast(msg) {
  const wrap = document.getElementById('toastWrap') || createToastWrap();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
}

function createToastWrap() {
  const w = document.createElement('div');
  w.id = 'toastWrap'; w.className = 'toast-wrap';
  document.body.appendChild(w);
  return w;
}

// ── FAQ ──
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ── OCCASION BUTTONS ──
function initOccasionBtns() {
  document.querySelectorAll('.occ-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.occ-btn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
    });
  });
}

// ── RESERVE FORM ──
function initReserveForm() {
  const form = document.getElementById('reserveForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    document.getElementById('reserveSuccess').classList.add('show');
    showToast('🎉 Reservation confirmed!');
  });
}

// ── SIZE SELECT (product page) ──
let heroPrice = 5.99, heroQty = 1;
function selSize(btn, price) {
  document.querySelectorAll('.sBtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  heroPrice = price;
  updateHeroBuy();
}
function chQty(d) {
  heroQty = Math.max(1, Math.min(20, heroQty + d));
  document.getElementById('qty').textContent = heroQty;
  updateHeroBuy();
}
function updateHeroBuy() {
  const b = document.getElementById('buyBtn');
  if (b) b.textContent = 'Buy ₱' + (heroPrice * heroQty).toFixed(2);
}
