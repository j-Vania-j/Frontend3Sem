document.addEventListener('DOMContentLoaded', function() {
    function getCart() {
        try {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        } catch (e) {
            console.error('Ошибка чтения корзины:', e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        if (typeof updateCartBadge === 'function') {
            updateCartBadge();
        }
    }

    let cart = getCart();
    const TAX_RATE = 0.08;
    const PROMO_CODES = { 'SAVE10': 0.10, 'WELCOME5': 0.05 };

    const cartItemsList = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('subtotalValue');
    const taxEl = document.getElementById('taxValue');
    const totalEl = document.getElementById('totalValue');
    const promoInput = document.getElementById('promoInput');
    const applyPromoBtn = document.getElementById('applyPromo');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const shippingInfo = document.getElementById('shippingInfo');
    const cartHeading = document.getElementById('cartHeading');
    const cartContainer = document.getElementById('cartContainer');
    const emptyCartState = document.getElementById('emptyCartState');
    const continueShoppingBtn = document.getElementById('continueShopping');
    const discountRow = document.getElementById('discountRow');
    const discountValue = document.getElementById('discountValue');
    const discountCodeEl = document.getElementById('discountCode');
    const promoErrorEl = document.getElementById('promoError');

    let appliedPromo = null;
    const formatPrice = (price) => `$${price.toFixed(2)}`;

    function toggleCartView() {
        const isEmpty = cart.length === 0;
        if (isEmpty) {
            cartHeading?.classList.add('hidden');
            if (cartContainer) cartContainer.style.display = 'none';
            if (shippingInfo) shippingInfo.style.display = 'none';
            emptyCartState?.classList.remove('hidden');
            if (emptyCartState) emptyCartState.style.display = 'flex';
        } else {
            cartHeading?.classList.remove('hidden');
            if (cartContainer) cartContainer.style.display = 'grid';
            if (shippingInfo) shippingInfo.style.display = 'flex';
            emptyCartState?.classList.add('hidden');
            if (emptyCartState) emptyCartState.style.display = 'none';
        }
    }

    function createProductCard(item) {
        const qty = item.quantity ?? item.qty ?? 1;
        const itemTotal = item.price * qty;

        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.id = item.id;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-header">
                    <div class="product-text-group">
                        <h3 class="product-title">${item.title}</h3>
                        ${item.category ? `<p class="product-category">${item.category}</p>` : ''}
                    </div>
                    <button class="remove-btn" data-action="remove" data-id="${item.id}" aria-label="Удалить товар">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" x2="10" y1="11" y2="17"></line>
                            <line x1="14" x2="14" y1="11" y2="17"></line>
                        </svg>
                    </button>
                </div>
                <div class="product-footer">
                    <div class="quantity-control">
                        <button class="qty-btn" data-action="decrease" data-id="${item.id}" ${qty <= 1 ? 'disabled' : ''} aria-label="Уменьшить">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M5 12h14" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <span class="qty-value">${qty}</span>
                        <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Увеличить">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M12 5v14M5 12h14" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="product-price">
                        <span class="price-main">${formatPrice(itemTotal)}</span>
                        <span class="price-each">${formatPrice(item.price)} each</span>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    function renderCart() {
        if (!cartItemsList) return;
        
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<div style="text-align:center;padding:40px;color:#6A7282;font-size:14px;">Ваша корзина пуста</div>';
        } else {
            cart.forEach(item => cartItemsList.appendChild(createProductCard(item)));
        }
        updateTotals();
        toggleCartView();
    }

    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => {
            const qty = item.quantity ?? item.qty ?? 1;
            return sum + item.price * qty;
        }, 0);
        
        const discount = appliedPromo ? subtotal * appliedPromo : 0;
        const taxable = subtotal - discount;
        const tax = taxable * TAX_RATE;
        const total = taxable + tax;
        
        if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
        if (taxEl) taxEl.textContent = formatPrice(tax);
        if (totalEl) totalEl.textContent = formatPrice(total);
        
        if (appliedPromo && discountRow) {
            discountRow.classList.remove('hidden');
            discountRow.classList.add('visible');
            if (discountValue) discountValue.textContent = `-${formatPrice(discount)}`;
            if (discountCodeEl) {
                const code = Object.keys(PROMO_CODES).find(key => PROMO_CODES[key] === appliedPromo);
                discountCodeEl.textContent = code || 'SAVE10';
            }
        } else if (discountRow) {
            discountRow.classList.remove('visible');
            discountRow.classList.add('hidden');
        }
        
        if (checkoutBtn) {
            checkoutBtn.disabled = cart.length === 0;
        }
    }

    cartItemsList?.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (!action || !id) return;
        
        if (action === 'remove') removeItem(id);
        else if (action === 'increase') changeQty(id, 1);
        else if (action === 'decrease') changeQty(id, -1);
    });

    function changeQty(id, delta) {
        const item = cart.find(i => String(i.id) === String(id));
        if (!item) return;
        
        const qtyKey = item.quantity !== undefined ? 'quantity' : 'qty';
        item[qtyKey] = Math.max(1, (item[qtyKey] ?? 1) + delta);
        
        saveCart(cart);
        renderCart();
    }

    function removeItem(id) {
        cart = cart.filter(i => String(i.id) !== String(id));
        saveCart(cart);
        renderCart();
    }

    applyPromoBtn?.addEventListener('click', function() {
        const code = promoInput.value.trim().toUpperCase();
        if (!code) return;
        
        if (PROMO_CODES[code]) {
            appliedPromo = PROMO_CODES[code];
            promoInput.disabled = true;
            applyPromoBtn.disabled = true;
            promoInput.value = code;
            promoInput.classList.remove('error');
            promoErrorEl?.classList.add('hidden');
            updateTotals();
        } else {
            promoInput.classList.add('error');
            promoErrorEl?.classList.remove('hidden');
            appliedPromo = null;
            promoInput.disabled = false;
            applyPromoBtn.disabled = false;
            promoInput.value = '';
            promoInput.focus();
            updateTotals();
        }
    });

    promoInput?.addEventListener('input', function() {
        promoInput.classList.remove('error');
        promoErrorEl?.classList.add('hidden');
    });

    checkoutBtn?.addEventListener('click', function(e) {
        e.preventDefault();
        if (cart.length === 0) return;
    });

    renderCart();
    
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
});