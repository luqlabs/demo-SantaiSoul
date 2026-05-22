/**
 * SantaiSoul.com - High-End Wellness E-Commerce & Membership Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let cart = JSON.parse(localStorage.getItem('santaisoul_cart')) || [];
  let user = JSON.parse(localStorage.getItem('santaisoul_user')) || null;

  // --- SELECTORS ---
  const header = document.querySelector('header');
  const cartToggleBtn = document.getElementById('cart-toggle');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartCountPills = document.querySelectorAll('.cart-count');
  const cartSubtotalElement = document.getElementById('cart-subtotal');
  
  // Checkout Modal
  const checkoutBtn = document.getElementById('checkout-btn');
  const stripeModal = document.getElementById('stripe-checkout-modal');
  const stripeSubmitBtn = document.getElementById('stripe-submit-btn');
  const stripeCloseBtn = document.getElementById('stripe-close');
  const stripeForm = document.getElementById('stripe-payment-form');
  
  // Memberstack Mock Modals
  const loginBtn = document.getElementById('login-nav-btn');
  const msModal = document.getElementById('memberstack-modal');
  const msCloseBtn = document.getElementById('ms-close');
  const msForm = document.getElementById('ms-form');
  const msSwitchLink = document.getElementById('ms-switch-type');
  const msSubmitBtn = document.getElementById('ms-submit-btn');
  const msModalTitle = document.getElementById('ms-modal-title');
  const msModalSubtitle = document.getElementById('ms-modal-subtitle');
  let msMode = 'signup'; // signup or login

  // --- HEADER SCROLL ACTION ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- CART FUNCTIONS ---
  function saveCart() {
    localStorage.setItem('santaisoul_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    // Update quantities
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountPills.forEach(pill => {
      pill.textContent = totalItems;
      pill.style.display = totalItems > 0 ? 'flex' : 'none';
    });

    // Populate drawer
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <svg class="empty-cart-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1,0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0,1-1.12-1.243l1.264-12A1.125 1.125 0 0,1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Zm7.5 0a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Z" />
          </svg>
          <p>Your sanctuary bag is empty.</p>
          <a href="product.html" class="gold-accent-text" style="margin-top: 1rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em;">Shop Our Collection</a>
        </div>
      `;
      cartSubtotalElement.textContent = '$0.00';
      if (checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
      let subtotal = 0;
      cartItemsContainer.innerHTML = '';
      
      cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="cart-item-qty-actions">
              <span class="cart-item-qty">Qty: ${item.quantity}</span>
              <button class="cart-remove-item" data-index="${index}">Remove</button>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(itemEl);
      });
      
      cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
      if (checkoutBtn) checkoutBtn.style.display = 'block';

      // Bind remove buttons
      document.querySelectorAll('.cart-remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.getAttribute('data-index'));
          cart.splice(index, 1);
          saveCart();
        });
      });
    }
  }

  window.addToCart = function(id, name, price, image, quantity = 1) {
    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ id, name, price, image, quantity });
    }
    saveCart();
    openCartDrawer();
  };

  function openCartDrawer() {
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
  }

  function closeCartDrawer() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', () => {
    closeCartDrawer();
    closeStripeModal();
    closeMSModal();
  });

  // --- STRIPE CHECKOUT MODAL SIMULATION ---
  function openStripeModal() {
    closeCartDrawer();
    if (stripeModal) stripeModal.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
  }

  function closeStripeModal() {
    if (stripeModal) stripeModal.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
  }

  if (checkoutBtn) checkoutBtn.addEventListener('click', openStripeModal);
  if (stripeCloseBtn) stripeCloseBtn.addEventListener('click', closeStripeModal);

  if (stripeForm) {
    stripeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate Processing
      stripeSubmitBtn.disabled = true;
      stripeSubmitBtn.innerHTML = `
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: breathingOrb 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Processing Payment...
      `;

      setTimeout(() => {
        alert("✨ Payment Confirmed! Thank you for purchasing SantaiSoul's luxury healing candle. Check your email for purchase confirmation & NFC pairing guidelines.");
        cart = [];
        saveCart();
        closeStripeModal();
        stripeSubmitBtn.disabled = false;
        stripeSubmitBtn.textContent = 'Pay Now';
        stripeForm.reset();
      }, 2500);
    });
  }

  // --- MEMBERSTACK MOCK AUTH MODAL ---
  function openMSModal(mode = 'signup') {
    msMode = mode;
    updateMSModalUI();
    if (msModal) msModal.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
  }

  function closeMSModal() {
    if (msModal) msModal.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
  }

  function updateMSModalUI() {
    if (msMode === 'signup') {
      msModalTitle.innerHTML = 'Join the <span>Sanctuary</span>';
      msModalSubtitle.textContent = 'Sign up to unlock custom digital healing pathways, meditations, and sensory tracks.';
      msSubmitBtn.textContent = 'Begin Your Journey';
      msSwitchLink.innerHTML = 'Already a member? <a href="#" id="switch-mode-action">Sign In</a>';
    } else {
      msModalTitle.innerHTML = 'Welcome <span>Back</span>';
      msModalSubtitle.textContent = 'Enter your details to rejoin your quiet digital sanctuary.';
      msSubmitBtn.textContent = 'Enter Sanctuary';
      msSwitchLink.innerHTML = 'New to SantaiSoul? <a href="#" id="switch-mode-action">Create Account</a>';
    }

    // Rebind action
    const switchAction = document.getElementById('switch-mode-action');
    if (switchAction) {
      switchAction.addEventListener('click', (e) => {
        e.preventDefault();
        openMSModal(msMode === 'signup' ? 'login' : 'signup');
      });
    }
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (user) {
        // Log out
        localStorage.removeItem('santaisoul_user');
        user = null;
        alert("Logged out of SantaiSoul Sanctuary.");
        window.location.reload();
      } else {
        openMSModal('login');
      }
    });
  }

  if (msCloseBtn) msCloseBtn.addEventListener('click', closeMSModal);

  if (msForm) {
    msForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('ms-email').value;
      const name = msMode === 'signup' ? document.getElementById('ms-name').value : email.split('@')[0];
      
      user = { name, email, premium: true };
      localStorage.setItem('santaisoul_user', JSON.stringify(user));
      
      msSubmitBtn.textContent = 'Connecting...';
      msSubmitBtn.disabled = true;

      setTimeout(() => {
        closeMSModal();
        alert(`Welcome to SantaiSoul Sanctuary, ${name}! Your Premium Membership is active.`);
        window.location.href = 'membership.html';
      }, 1500);
    });
  }

  // --- INITIALIZE ---
  updateCartUI();
  updateAuthNavBar();

  function updateAuthNavBar() {
    if (loginBtn) {
      if (user) {
        loginBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1,1-7.5 0 3.75 3.75 0 0,1 7.5 0ZM4.501 20.118a7.5 7.5 0 0,1 14.998 0A17.933 17.933 0 0,1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-left: 0.5rem;">Sanctuary Portal (Sign Out)</span>
        `;
      } else {
        loginBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1,1-7.5 0 3.75 3.75 0 0,1 7.5 0ZM4.501 20.118a7.5 7.5 0 0,1 14.998 0A17.933 17.933 0 0,1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-left: 0.5rem;">Sanctuary Login</span>
        `;
      }
    }
  }

  // Exposed helper
  window.triggerMSModal = function(mode) {
    openMSModal(mode);
  };
});
