document.addEventListener('DOMContentLoaded', function() {
    const initialCart = [
        {
            id: 1,
            title: "Smart Fitness Watch Ultra",
            category: "Wearables",
            price: 449.99,
            image: "https://via.placeholder.com/128x128/F3F4F6/6A7282?text=Watch",
            qty: 1
        }
    ];

    let cart = JSON.parse(JSON.stringify(initialCart));
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
    const discountCode = document.getElementById('discountCode');

    let appliedPromo = null;
    const formatPrice = (price) => `$${price.toFixed(2)}`;

    function toggleCartView() {
        const isEmpty = cart.length === 0;
        if (isEmpty) {
            cartHeading.classList.add('hidden');
            cartContainer.style.display = 'none';
            if (shippingInfo) shippingInfo.style.display = 'none';
            emptyCartState.classList.remove('hidden');
            emptyCartState.style.display = 'flex';
        } else {
            cartHeading.classList.remove('hidden');
            cartContainer.style.display = 'grid';
            if (shippingInfo) shippingInfo.style.display = 'flex';
            emptyCartState.classList.add('hidden');
            emptyCartState.style.display = 'none';
        }
    }

    function createProductCard(item) {
        const itemTotal = item.price * item.qty;
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
                        <p class="product-category">${item.category}</p>
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
                        <button class="qty-btn" data-action="decrease" data-id="${item.id}" ${item.qty <= 1 ? 'disabled' : ''} aria-label="Уменьшить">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M5 12h14" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <span class="qty-value">${item.qty}</span>
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
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const discount = appliedPromo ? subtotal * appliedPromo : 0;
        const taxable = subtotal - discount;
        const tax = taxable * TAX_RATE;
        const total = taxable + tax;
        
        subtotalEl.textContent = formatPrice(subtotal);
        taxEl.textContent = formatPrice(tax);
        totalEl.textContent = formatPrice(total);
        
        if (appliedPromo) {
            discountRow.classList.add('visible');
            discountValue.textContent = `-${formatPrice(discount)}`;
            discountCode.textContent = Object.keys(PROMO_CODES).find(key => PROMO_CODES[key] === appliedPromo) || 'SAVE10';
        } else {
            discountRow.classList.remove('visible');
        }
    }

    cartItemsList.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.dataset.action;
        const id = parseInt(btn.dataset.id);
        if (action === 'remove') removeItem(id);
        else if (action === 'increase') changeQty(id, 1);
        else if (action === 'decrease') changeQty(id, -1);
    });

    function changeQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty < 1) item.qty = 1;
        renderCart();
    }

    function removeItem(id) {
        if (confirm('Удалить этот товар из корзины?')) {
            cart = cart.filter(i => i.id !== id);
            renderCart();
        }
    }

    applyPromoBtn.addEventListener('click', function() {
        const code = promoInput.value.trim().toUpperCase();
        if (!code) return;
        if (PROMO_CODES[code]) {
            appliedPromo = PROMO_CODES[code];
            promoInput.disabled = true;
            applyPromoBtn.disabled = true;
            updateTotals();
        } else {
            appliedPromo = null;
            promoInput.disabled = false;
            applyPromoBtn.disabled = false;
            updateTotals();
        }
    });

    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function(e) {
            e.preventDefault();
        });
    }

    renderCart();
});