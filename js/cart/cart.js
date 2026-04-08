/**
 * Cart Page Logic
 * Vanilla JS ES6+ | TailwindCSS | localStorage persistence
 */

// ==================== CONFIG ====================
const STORAGE_KEY = 'ecommerce_cart';
const PROMO_CODES = {
  'SAVE10': { type: 'percent', value: 10 }
};

// ==================== STATE ====================
const state = {
  items: [],
  promo: null,
  discount: 0
};

// ==================== DOM SELECTORS ====================
const selectors = {
  emptyState: '#empty-state',
  cartContent: '#cart-content',
  cartItems: '#cart-items',
  itemsCount: '#items-count',
  subtotal: '#subtotal',
  discountRow: '#discount-row',
  discountAmount: '#discount-amount',
  total: '#total',
  promoInput: '#promo-input',
  promoApply: '#promo-apply',
  promoMessage: '#promo-message',
  checkoutBtn: '#checkout-btn'
};

// ==================== UTILS ====================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const formatPrice = (price) => 
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    items: state.items,
    promo: state.promo
  }));
};

const loadFromStorage = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data?.items) {
      state.items = data.items;
      if (data.promo && PROMO_CODES[data.promo]) {
        state.promo = data.promo;
        calculateDiscount();
      }
    }
  } catch (e) {
    console.error('Failed to load cart:', e);
  }
};

// ==================== CART LOGIC ====================
const calculateItemTotal = (item) => item.price * item.quantity;

const calculateSubtotal = () => 
  state.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

const calculateDiscount = () => {
  if (!state.promo || !PROMO_CODES[state.promo]) {
    state.discount = 0;
    return;
  }
  const promo = PROMO_CODES[state.promo];
  if (promo.type === 'percent') {
    state.discount = calculateSubtotal() * (promo.value / 100);
  }
};

const getTotal = () => Math.max(0, calculateSubtotal() - state.discount);

// ==================== RENDER ====================
const renderEmptyState = () => {
  $(selectors.emptyState).classList.remove('hidden');
  $(selectors.cartContent).classList.add('hidden');
};

const renderCart = () => {
  if (state.items.length === 0) {
    renderEmptyState();
    return;
  }

  $(selectors.emptyState).classList.add('hidden');
  $(selectors.cartContent).classList.remove('hidden');
  renderCartItems();
  updateSummary();
};

const renderCartItems = () => {
  const container = $(selectors.cartItems);
  container.innerHTML = '';

  state.items.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item item-enter';
    itemEl.dataset.id = item.id;
    itemEl.innerHTML = `
      <div class="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
        <img src="${item.image || 'https://via.placeholder.com/96x96?text=No+Image'}" 
             alt="${item.name}" 
             class="w-full h-full object-cover"
             onerror="this.src='https://via.placeholder.com/96x96?text=No+Image'">
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="flex justify-between gap-4">
          <div class="min-w-0">
            <h4 class="font-medium text-gray-900 truncate">${item.name}</h4>
            <p class="text-sm text-gray-500 mt-0.5">${item.subtitle || ''}</p>
          </div>
          <button class="btn-icon remove-item" data-id="${item.id}" aria-label="Удалить товар">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="flex items-end justify-between mt-3">
          <div class="flex items-center gap-2">
            <button class="quantity-btn decrease-qty" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>
              −
            </button>
            <span class="w-8 text-center font-medium text-gray-900">${item.quantity}</span>
            <button class="quantity-btn increase-qty" data-id="${item.id}">
              +
            </button>
          </div>
          <div class="text-right">
            <span class="font-semibold text-gray-900 item-total">${formatPrice(calculateItemTotal(item))}</span>
            <p class="text-xs text-gray-500 mt-0.5">${formatPrice(item.price)} за шт.</p>
          </div>
        </div>
      </div>
    `;
    container.appendChild(itemEl);
  });

  attachItemEventListeners();
};

const updateSummary = () => {
  $(selectors.itemsCount).textContent = state.items.reduce((sum, i) => sum + i.quantity, 0);
  $(selectors.subtotal).textContent = formatPrice(calculateSubtotal());
  
  if (state.discount > 0) {
    $(selectors.discountRow).classList.remove('hidden');
    $(selectors.discountAmount).textContent = `−${formatPrice(state.discount)}`;
  } else {
    $(selectors.discountRow).classList.add('hidden');
  }
  
  $(selectors.total).textContent = formatPrice(getTotal());
};

const showPromoMessage = (text, isError = false) => {
  const msg = $(selectors.promoMessage);
  msg.textContent = text;
  msg.className = `mt-2 text-sm ${isError ? 'text-red-600 promo-error' : 'text-green-600'}`;
  msg.classList.remove('hidden');
  
  if (isError) {
    setTimeout(() => msg.classList.remove('promo-error'), 300);
  }
};

const hidePromoMessage = () => {
  $(selectors.promoMessage).classList.add('hidden');
};

// ==================== EVENT HANDLERS ====================
const attachItemEventListeners = () => {
  // Remove item
  $$('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      removeItem(id);
    });
  });

  // Quantity controls
  $$('.decrease-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      updateQuantity(id, -1);
    });
  });

  $$('.increase-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      updateQuantity(id, 1);
    });
  });
};

const addItem = (product) => {
  const existing = state.items.find(i => i.id === product.id);
  
  if (existing) {
    existing.quantity += 1;
  } else {
    state.items.push({
      ...product,
      quantity: 1,
      cartId: generateId()
    });
  }
  
  saveToStorage();
  renderCart();
};

const removeItem = (id) => {
  const index = state.items.findIndex(i => i.cartId === id || i.id === id);
  if (index > -1) {
    const itemEl = $(`[data-id="${id}"]`)?.closest('.cart-item');
    if (itemEl) {
      itemEl.style.opacity = '0';
      itemEl.style.transform = 'translateX(-20px)';
      itemEl.style.transition = 'all 0.2s ease-out';
      setTimeout(() => {
        state.items.splice(index, 1);
        saveToStorage();
        renderCart();
      }, 200);
    } else {
      state.items.splice(index, 1);
      saveToStorage();
      renderCart();
    }
  }
};

const updateQuantity = (id, delta) => {
  const item = state.items.find(i => i.cartId === id || i.id === id);
  if (!item) return;
  
  const newQty = Math.max(1, item.quantity + delta);
  if (newQty === item.quantity) return;
  
  item.quantity = newQty;
  saveToStorage();
  renderCartItems();
  updateSummary();
};

const applyPromo = () => {
  const code = $(selectors.promoInput).value.trim().toUpperCase();
  
  if (!code) {
    showPromoMessage('Введите промокод', true);
    return;
  }
  
  if (PROMO_CODES[code]) {
    state.promo = code;
    calculateDiscount();
    saveToStorage();
    updateSummary();
    showPromoMessage(`Промокод "${code}" применён! Скидка ${PROMO_CODES[code].value}%`, false);
    $(selectors.promoInput).value = '';
  } else {
    state.promo = null;
    state.discount = 0;
    saveToStorage();
    updateSummary();
    showPromoMessage('Неверный промокод', true);
  }
};

// ==================== INIT ====================
const init = () => {
  loadFromStorage();
  renderCart();

  // Promo code handler
  $(selectors.promoApply).addEventListener('click', applyPromo);
  $(selectors.promoInput).addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyPromo();
  });
  $(selectors.promoInput).addEventListener('input', hidePromoMessage);

  // Checkout handler
  $(selectors.checkoutBtn).addEventListener('click', () => {
    if (state.items.length === 0) return;
    
    const total = getTotal();
    alert(`Заказ оформлен!\nСумма: ${formatPrice(total)}\n\n(В реальном приложении здесь будет переход к оплате)`);
    
    // Clear cart after successful order
    state.items = [];
    state.promo = null;
    state.discount = 0;
    saveToStorage();
    renderCart();
  });

  // Keyboard navigation enhancement
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $(selectors.promoInput)?.blur();
    }
  });
};

// ==================== PUBLIC API ====================
window.CartAPI = {
  addItem,
  removeItem,
  updateQuantity,
  getItems: () => [...state.items],
  getTotal,
  clear: () => {
    state.items = [];
    state.promo = null;
    state.discount = 0;
    saveToStorage();
    renderCart();
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}