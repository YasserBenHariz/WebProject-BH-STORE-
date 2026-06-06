window.currentUser = null;

window.productPageWasOpen = false;

window.savedProductPage = null;

async function checkSession() {
  try {
    const res = await fetch('check_session.php', {
      credentials: 'include'
    });
    const data = await res.json();
    if (data.loggedIn) {
      window.currentUser = data.user;
      updateNavUI();
    } else {
      window.currentUser = null;
    }
  } catch (e) {
    console.error('Session check failed:', e);
    window.currentUser = null;
  }
}


let currentProductModal = null;

function openProductModal(productId) {
  const product = prods.find(p => p.id === productId);
  if (!product) return;
  
  currentProductModal = product;
  
  document.getElementById('productModalImg').src = product.img;
  document.getElementById('productModalBrand').textContent = product.b;
  document.getElementById('productModalName').textContent = product.n;
  document.getElementById('productModalPrice').textContent = product.p.toLocaleString() + ' DT';
  
  const oldPriceEl = document.getElementById('productModalOldPrice');
  if (product.op) {
    oldPriceEl.textContent = product.op.toLocaleString() + ' DT';
    oldPriceEl.style.display = 'inline';
  } else {
    oldPriceEl.style.display = 'none';
  }
  
  const specsHtml = product.s.map(spec => `<span class="product-modal-spec">${spec}</span>`).join('');
  document.getElementById('productModalSpecs').innerHTML = specsHtml;
  
  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
  currentProductModal = null;
}

function openProductPage(productId) {
  const product = prods.find(p => p.id === productId);
  if (!product) return;
  
  const page = document.getElementById('productPage');
  if (!page) return;
  
  
  document.getElementById('productPageBrand').textContent = product.b;
  document.getElementById('productPageName').textContent = product.n;
  document.getElementById('productPageImage').src = product.img;
  document.getElementById('productPagePrice').textContent = product.p.toLocaleString() + ' DT';
  document.getElementById('productPageRef').textContent = 'REF-' + product.id;
  document.getElementById('productQty').value = '1';
  
  const oldPriceEl = document.getElementById('productPageOldPrice');
  if (product.op) {
    oldPriceEl.textContent = product.op.toLocaleString() + ' DT';
    oldPriceEl.style.display = 'inline';
  } else {
    oldPriceEl.style.display = 'none';
  }
  
  
  const specsHtml = product.s.map(spec => `<div class="pp-spec">✓ ${spec}</div>`).join('');
  document.getElementById('productPageSpecs').innerHTML = specsHtml;
  
  
  const catDesc = {
    'phones': 'Smartphone dernier modèle avec toutes les fonctionnalités avancées et haute performance.',
    'iphone': 'iPhone authentique avec garantie complète et assistance technique.',
    'samsung': 'Samsung dernier modèle haute performance avec technologie avancée.',
    'xiaomi': 'Xiaomi fiable et abordable avec excellent rapport qualité-prix.',
    'acc': 'Accessoire de qualité premium pour votre mobile.',
    'protection': 'Protection optimale pour votre appareil avec design élégant.',
    'chargeur': 'Chargeur rapide et compatible avec tous les appareils.',
    'audio': 'Audio premium pour une meilleure expérience musicale.',
    'cables': 'Câble de qualité et durable pour charge rapide.'
  };
  
  const desc = catDesc[product.c] || catDesc[product.cat] || 'Produit de qualité BH STORE avec service client excellent.';
  document.getElementById('productPageDescription').textContent = desc;
  
  
  window.currentProductPage = product;
  
  
  page.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductPage() {
  const page = document.getElementById('productPage');
  if (page) {
    page.classList.remove('open');
    document.body.style.overflow = '';
    window.currentProductPage = null;
  }
}

function incQty() {
  const qtyInput = document.getElementById('productQty');
  qtyInput.value = parseInt(qtyInput.value) + 1;
}

function decQty() {
  const qtyInput = document.getElementById('productQty');
  if (parseInt(qtyInput.value) > 1) {
    qtyInput.value = parseInt(qtyInput.value) - 1;
  }
}

function addToCartFromPage() {
  if (window.currentProductPage) {
    const qty = parseInt(document.getElementById('productQty').value);
    for (let i = 0; i < qty; i++) {
      addCart(window.currentProductPage.id);
    }
  }
}

function closeSuccessModal() {
  document.getElementById('successModal').classList.remove('open');
  document.body.style.overflow = '';
}

function showSuccessModal(orderId) {
  const userName = window.currentUser ? window.currentUser.name.split(' ')[0] : 'Client';
  document.getElementById('successUserName').textContent = userName;
  document.getElementById('successOrderId').textContent = orderId;
  document.getElementById('successModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function addToCartFromModal() {
  if (currentProductModal) {
    addCart(currentProductModal.id);
    closeProductModal();
  }
}


document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('productModal');
  const successModal = document.getElementById('successModal');
  
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeProductModal();
      }
    });
  }
  
  if (successModal) {
    successModal.addEventListener('click', function(e) {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }
  
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (document.getElementById('productModal').classList.contains('open')) {
        closeProductModal();
      }
      if (document.getElementById('successModal').classList.contains('open')) {
        closeSuccessModal();
      }
    }
  });
});


let prods = [];
let cart = [];


async function loadProducts() {
  try {
    const res = await fetch('get_products.php');
    const data = await res.json();
    
    if (data.success) {
      prods = data.data;
      render(prods);
      buildMq();
    } else {
      console.error('Failed to load products:', data.error);
    }
  } catch (e) {
    console.error('Error loading products:', e);
  }
}

function filterCategory(x, el) {
   let filtered;
   if (x == 'all') {
      filtered = prods;
   } else {
      filtered = prods.filter(p => p.c == x || p.cat == x);
   }
   render(filtered);
}

const BL = {new: 'bn', sale: 'bs', hot: 'bh'};
const BT = {new: 'Nouveau', sale: 'Promo', hot: 'Pop'};
const EMOJI = {phones: '📱', audio: '🎧', acc: '⚡', parts: '🔧'};

function card(p) {
  const badge = p.bd ? `<div class="pbadge ${BL[p.bd]}">${BT[p.bd]}</div>` : '';
  const img = `<img src="${p.img}" alt="${p.n}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
               <span class="emoji-fallback" style="display:none">${EMOJI[p.c] || '📦'}</span>`;
  return `<div class="pc" onclick="openProductPage(${p.id})" style="cursor:pointer;">
    ${badge}
    <div class="pc-wish" title="Favori">♡</div>
    <div class="pvis">${img}</div>
    <div class="pinf">
      <div class="pbr">${p.b}</div>
      <div class="pnm">${p.n}</div>
      <div class="psps">${p.s.map(x => `<span class="sp">${x}</span>`).join('')}</div>
      <div class="pbt">
        <div class="pbt-left">
          <div class="ppr">${p.p.toLocaleString()} DT</div>
          ${p.op ? `<div class="pol">${p.op.toLocaleString()} DT</div>` : ''}
        </div>
      </div>
    </div>
  </div>`;
}

function render(list) {
  const pg = document.getElementById('pg');
  if (!pg) return;
  pg.innerHTML = list.length
    ? list.map(card).join('')
    : `<div style="grid-column:1/-1;padding:3rem;text-align:center;color:var(--text3);font-size:.82rem">Aucun produit trouvé.</div>`;
  requestAnimationFrame(initCardReveal);
}

function filt(cat, el) {
  
  closeProductPage();

  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  render(cat === 'all'
    ? prods
    : prods.filter(p => p.c === cat || p.cat === cat)
  );
}


function filterByProduct(productId) {
  const product = prods.find(p => p.id === productId);
  if (product) {
    closeProductPage();  // Close product page when clicking search result
    render([product]);
    scrollTo('prods');
    closeAuth();
  }
}

function doSearch() {
  const si = document.getElementById('si');
  if (!si) return;
  
  closeProductPage();
  const q = si.value.toLowerCase().trim();
  if (!q) { render(prods); return; }
  render(prods.filter(p =>
    p.n.toLowerCase().includes(q) ||
    p.b.toLowerCase().includes(q) ||
    p.s.some(x => x.toLowerCase().includes(q))
  ));
  scrollTo('prods');
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
  document.querySelector('.ftab').classList.add('active');
}

const si = document.getElementById('si');
if (si) {
  si.addEventListener('keydown', e => e.key === 'Enter' && doSearch());
}


function addCart(id) {
  const p = prods.find(x => x.id === id);
  if (!p) {
    console.error('Product not found:', id);
    return;
  }
  
  const ci = cart.findIndex(x => x.id === id);
  if (ci >= 0) {
    cart[ci].q++;
  } else {
    cart.push({...p, q: 1});
  }
  
  updateCartUI();
  showCartFeedback();
  showAddNotification(p.n);
  console.log('Added to cart:', p.n, 'Cart items:', cart.length);
}

function removeCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartUI();
  openCart();
}

function updateQty(id, val) {
  const ci = cart.findIndex(x => x.id === id);
  if (ci >= 0) {
    cart[ci].q += val;
    if (cart[ci].q < 1) {
      removeCart(id);
    } else {
      updateCartUI();
      openCart();
    }
  }
}


function updateCartUI() {
  const cb = document.getElementById('cb');
  if (!cb) return;
  const qty = cart.reduce((sum, x) => sum + x.q, 0);
  cb.textContent = qty;
}

function showCartFeedback() {
  const badge = document.getElementById('cb');
  if (!badge) return;
  badge.style.animation = 'none';
  setTimeout(() => { badge.style.animation = 'pulse .3s ease'; }, 10);
}


function openCart() {
  const cp = document.getElementById('cartBody');
  const cf = document.getElementById('cartFoot');
  if (!cp || !cf) return;
  
  if (cart.length === 0) {
    cp.innerHTML = '<div class="cart-empty">Panier vide</div>';
    cf.style.display = 'none';
  } else {
    let html = '<div class="cart-items">';
    cart.forEach(item => {
      html += `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.n}"/>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.n}</div>
            <div class="cart-item-price">${item.p.toLocaleString()} DT</div>
          </div>
          <div class="cart-item-qty">
            <button onclick="updateQty(${item.id}, -1)">−</button>
            <span>${item.q}</span>
            <button onclick="updateQty(${item.id}, 1)">+</button>
          </div>
          <button class="cart-remove" onclick="removeCart(${item.id})">✕</button>
        </div>
      `;
    });
    html += '</div>';
    cp.innerHTML = html;
    
    const total = cart.reduce((sum, x) => sum + (x.p * x.q), 0);
    const cartTotalEl = document.getElementById('cartTotal');
    if (cartTotalEl) {
      cartTotalEl.textContent = total.toLocaleString() + ' DT';
    }
    cf.style.display = 'block';
  }
  
  
  const cs = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');

  if (cs) cs.classList.add('open');
  if (overlay) overlay.classList.add('open');
}

function closeCart() {
    const cs = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');

    if (cs) {
        cs.classList.remove('open');
    }

    if (overlay) {
        overlay.classList.remove('open');
    }
}

function checkout() {
  const productPage = document.getElementById('productPage');
  const wasProductPageOpen = productPage && productPage.classList.contains('open');
  window.productPageWasOpen = wasProductPageOpen;
  
  if (wasProductPageOpen) {
    window.savedProductPage = window.currentProductPage;
  }
  
 
  closeProductPage();
  
  
  if (!window.currentUser || !window.currentUser.name) {
    openAuth('login');
    return false;
  }
  
  
  if (!cart || cart.length === 0) {
    alert('❌ Votre panier est vide.');
    return false;
  }
  
  const items = cart.map(x => ({
    product_id: x.id,
    name: x.n,      
    brand: x.b,     
    price: x.p,
    quantity: x.q
  }));
  const total = cart.reduce((sum, x) => sum + (x.p * x.q), 0);
  
  fetch('save_commande.php', {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({items, total})
  })
  .then(r => {
    if (r.status === 401 || r.status === 403) {
      window.currentUser = null;
      updateNavUI();
      openAuth('login');
      return Promise.reject('Unauthorized');
    }
    
    if (!r.ok) {
      return Promise.reject('HTTP Error: ' + r.status);
    }
    
    return r.json();
  })
  .then(d => {
    if (d && d.success) {
      cart = [];
      updateCartUI();
      closeCart();
      showSuccessModal(d.order_id);
    } else if (d && !d.success) {
      alert('❌ Erreur: ' + d.message);
    }
  })
  .catch(e => {
    if (e !== 'Unauthorized') {
    }
  });
  
  return false;
}


(function() {
  const input = document.getElementById('si');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;

  function closeDropdown() {
    results.style.display = 'none';
    results.innerHTML = '';
  }

  input.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    results.innerHTML = '';

    if (q.length < 1) { closeDropdown(); return; }
    
    const filtered = prods.filter(p =>
      p.n.toLowerCase().includes(q) ||
      p.b.toLowerCase().includes(q) ||
      p.s.some(x => x.toLowerCase().includes(q))
    ).slice(0, 8);

    if (filtered.length === 0) {
      results.style.display = 'block';
      results.innerHTML = '<div style="padding:1rem;text-align:center;color:var(--text3);font-size:.82rem;">Aucun résultat</div>';
      return;
    }

    results.style.display = 'block';
    results.innerHTML = filtered.map(p =>
      `<div class="search-result-item" onclick="filterByProduct(${p.id});document.getElementById('si').value='';closeDropdown();event.stopPropagation();">
        <img src="${p.img}" alt="${p.n}" class="search-result-img"/>
        <div class="search-result-info">
          <div class="search-result-brand">${p.b}</div>
          <div class="search-result-name">${p.n}</div>
          <div class="search-result-price">${p.p.toLocaleString()} DT</div>
        </div>
      </div>`
    ).join('');
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !results.contains(e.target)) closeDropdown();
  });
  input.addEventListener('blur', () => setTimeout(closeDropdown, 200));
})();


function doMobileSearch() {
  const si = document.getElementById('siMobile');
  if (!si) return;
  const q = si.value.toLowerCase().trim();
  if (!q) { return; }
  render(prods.filter(p =>
    p.n.toLowerCase().includes(q) ||
    p.b.toLowerCase().includes(q) ||
    p.s.some(x => x.toLowerCase().includes(q))
  ));
  document.getElementById('mobileSearchPanel').style.display = 'none';
  scrollTo('pg');
}


function animStats() {
  const el = document.getElementById('stats');
  if (!el) return;
  const start = Date.now();
  const dur = 1600;
  const iv = setInterval(() => {
    const prog = Math.min((Date.now() - start) / dur, 1);
    const target = 180;
    const cur = Math.floor(prog * target);
    const el2 = document.getElementById('heroCount');
    if (el2) el2.textContent = cur + '+';
    if (cur >= target) clearInterval(iv);
  }, 16);
}

const obs = new IntersectionObserver(e => {
  if (e[0].isIntersecting) { animStats(); obs.disconnect(); }
}, {threshold: .4});

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  checkSession();
  buildMq();
  updateCartUI();
});

const sw = document.getElementById('stats');
if (sw) obs.observe(sw);

function initCardReveal() {
  const cards = document.querySelectorAll('.pc');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allCards = Array.from(document.querySelectorAll('.pc'));
        const delay = (allCards.indexOf(entry.target) % 4) * 90;
        setTimeout(() => {
          entry.target.classList.add('show');
          initTilt(entry.target);
        }, delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => revealObs.observe(c));
}

function initTilt(card) {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = (y - cy) / 14;
    const rotY = (cx - x) / 14;
    card.classList.add('tilt-active');
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.classList.remove('tilt-active');
    card.style.transform = '';
  });
}

(function() {
  function clearSession() { localStorage.removeItem('ip_session') }
  function initials(name) { return name.trim().split(' ').slice(0, 2).map(w => (w[0] || '').toUpperCase()).join('') }

  const pages = ['pageLogin', 'pageRegister', 'pageProfile'];

  function hideAll() { pages.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('open'); }); }

  function updateNavUI() {
    const s = window.currentUser;
    const lb = document.getElementById('navLoginBtn');
    const pill = document.getElementById('navUserPill');
    if (!lb || !pill) return;
    if (s) {
      lb.style.display = 'none';
      pill.classList.add('on');
      document.getElementById('navAvatar').textContent = initials(s.name);
      document.getElementById('navUserName').textContent = s.name.split(' ')[0];
    } else {
      lb.style.display = '';
      pill.classList.remove('on');
    }
  }

  window.openAuth = function(mode) {
    if (!window.productPageWasOpen) {
      const productPage = document.getElementById('productPage');
      window.productPageWasOpen = productPage && productPage.classList.contains('open');
    }
    
    if (window.productPageWasOpen && !window.savedProductPage) {
      window.savedProductPage = window.currentProductPage;
    }
    
    const productPage = document.getElementById('productPage');
    if (productPage && productPage.classList.contains('open')) {
      productPage.classList.remove('open');
    }
    
    hideAll();
    closeCart();
    ['loginEmail', 'loginPass', 'regName', 'regEmail', 'regPass'].forEach(id => {const e = document.getElementById(id); if (e) e.value = '';});
    ['loginErr', 'regErr', 'regOk'].forEach(id => {const e = document.getElementById(id); if (e) { e.classList.remove('show'); e.textContent = ''; }});

    if (mode === 'profile') {
      const s = window.currentUser;
      if (s) {
        document.getElementById('profileAvatar').textContent = initials(s.name);
        document.getElementById('profileName').textContent = s.name;
        document.getElementById('profileEmail').textContent = s.email;
        document.getElementById('pageProfile').classList.add('open');
      } else {
        document.getElementById('pageLogin').classList.add('open');
      }
    } else if (mode === 'register') {
      document.getElementById('pageRegister').classList.add('open');
    } else {
      document.getElementById('pageLogin').classList.add('open');
    }
    document.body.style.overflow = 'hidden';
  };

  window.closeAuth = function() {
    hideAll();
    document.body.style.overflow = '';
    window.productPageWasOpen = false;
    window.savedProductPage = null;
  };

  window.closeAuthAndRestore = function() {
    hideAll();
    document.body.style.overflow = '';
    
    if (window.productPageWasOpen) {
      const productPage = document.getElementById('productPage');
      if (productPage) {
        productPage.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      
      if (window.savedProductPage) {
        window.currentProductPage = window.savedProductPage;
      }
    }
    
    window.productPageWasOpen = false;
    window.savedProductPage = null;
  };

  window.doLogin = async function() {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value;
    const err = document.getElementById('loginErr');
    err.classList.remove('show');
    if (!email || !pass) { err.textContent = 'Remplissez tous les champs.'; err.classList.add('show'); return; }
    
    try {
      const res = await fetch('login.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pass })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.is_admin === true) {
          window.location.href = 'admin.php';
        } else {
          window.currentUser = data.user;
          updateNavUI();
          closeAuthAndRestore();
        }
      } else {
        err.textContent = data.message;
        err.classList.add('show');
      }
    } catch (e) {
      err.textContent = 'Erreur de connexion au serveur.';
      err.classList.add('show');
    }
  };

  window.doRegister = async function() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const pass = document.getElementById('regPass').value;
    const err = document.getElementById('regErr');
    const ok = document.getElementById('regOk');
    err.classList.remove('show');
    ok.classList.remove('show');

    if (!name || !email || !pass) {
      err.textContent = 'Remplissez tous les champs.';
      err.classList.add('show');
      return;
    }

    try {
      const res = await fetch('register.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, pass })
      });
      const data = await res.json();
      
      if (data.success) {
        ok.textContent = '✅ ' + data.message;
        ok.classList.add('show');
        setTimeout(() => {
          window.currentUser = data.user;
          updateNavUI();
          closeAuthAndRestore();
        }, 900);
      } else {
        err.textContent = data.message;
        err.classList.add('show');
      }
    } catch (e) {
      err.textContent = 'Erreur de connexion au serveur.';
      err.classList.add('show');
    }
  };

  window.doLogout = async function() {
    try {
      await fetch('logout.php', {
        credentials: 'include'
      });
      window.currentUser = null;
      updateNavUI();
      location.reload();
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAuth(); });
  document.addEventListener('click', e => {
    const pill = document.getElementById('navUserPill');
    if (pill && !pill.contains(e.target)) pill.classList.remove('open');
  });
  
  const allNavItems = document.querySelectorAll('.nav-links a, .nav-all-btn, .nav-all-btn a, .nav-has-drop a, .nav-drop a');
  allNavItems.forEach(item => {
    item.addEventListener('click', () => {
      closeAuth();
    });
  });
  
  updateNavUI();
})();

const footerEl = document.getElementById('footer');
if (footerEl) {
  const footerRevealObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      footerEl.classList.add('show');
      footerRevealObs.disconnect();
    }
  }, { threshold: 0.08 });
  footerRevealObs.observe(footerEl);
}

(function() {
  const el = document.getElementById('heroCount');
  if (!el) return;
  const suffix = el.querySelector('span');
  const suffixTxt = suffix ? suffix.outerHTML : '+';
  const target = 500;
  let current = 0;
  const step = target / 55;
  const iv = setInterval(() => {
    current = Math.min(current + step, target);
    el.innerHTML = Math.floor(current) + suffixTxt;
    if (current >= target) clearInterval(iv);
  }, 22);
})();

(function() {
  const sections = ['svcs', 'prods', 'stats', 'cta'];
  const links = document.querySelectorAll('.nav-links a');

  function setActive() {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) current = id;
    });
    links.forEach(a => {
      a.classList.remove('active');
      if (current && a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

function toggleMobileSearch() {
  const sbox = document.querySelector('.sbox');
  if (sbox) {
    sbox.classList.toggle('open');
    setTimeout(() => {
      const input = document.getElementById('si');
      if (input) input.focus();
    }, 100);
  }
}


function toggleMenu() {
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.toggle('mobile-open');
}


function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


function showAddNotification(productName) {

    const old = document.querySelector(".add-notification");
    if (old) old.remove();

    const notif = document.createElement("div");

    notif.className = "add-notification";

    notif.innerHTML = `
        <div class="notif-icon">✓</div>
        <div>
            <strong>${productName}</strong>
            <p>Ajouté au panier</p>
        </div>
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 2400);
}