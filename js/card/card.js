function renderStars(rating) {
    const fullStar = '★';
    const emptyStar = '☆';
    const halfStar = '⯪'; // Символ половинки
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) starsHTML += fullStar;
        else if (rating >= i - 0.5) starsHTML += halfStar;
        else starsHTML += emptyStar;
    }
    return starsHTML;
}

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}


function initGallery(images) {
    const mainImg = document.getElementById('main-image');
    const thumbsContainer = document.getElementById('thumbs-container');
    const prevBtn = document.querySelector('.gallery-nav--prev');
    const nextBtn = document.querySelector('.gallery-nav--next');
    let currentIndex = 0;

    thumbsContainer.innerHTML = images.map((src, i) => `
        <button class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
            <img src="${src}" alt="View ${i + 1}">
        </button>
    `).join('');

    const thumbs = thumbsContainer.querySelectorAll('.thumb');

    const updateView = (index) => {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        currentIndex = index;
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.src = images[currentIndex];
            mainImg.style.opacity = '1';
        }, 150);
        thumbs.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
    };

    prevBtn.addEventListener('click', () => updateView(currentIndex - 1));
    nextBtn.addEventListener('click', () => updateView(currentIndex + 1));
    thumbs.forEach(t => t.addEventListener('click', () => updateView(+t.dataset.index)));
    if (images.length > 0) mainImg.src = images[0];
}

function initQuantityControls() {
    const input = document.querySelector('.qty-input');
    document.querySelector('.qty-btn--minus').addEventListener('click', () => {
        if (parseInt(input.value) > 1) input.value--;
    });
    document.querySelector('.qty-btn--plus').addEventListener('click', () => {
        input.value++;
    });
}

function initAccordionLogic() {
    const accordion = document.getElementById('specs-accordion');
    const trigger = accordion.querySelector('.accordion-trigger');
    const content = accordion.querySelector('.accordion-content');

    trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            content.style.maxHeight = null;
            trigger.setAttribute('aria-expanded', 'false');
            accordion.classList.remove('is-open');
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            trigger.setAttribute('aria-expanded', 'true');
            accordion.classList.add('is-open');
        }
    });
}

function renderSpecs(specs) {
    const container = document.getElementById('specs-container');
    if (!container || !specs) return;

    let rowsHTML = '';
    for (const [key, value] of Object.entries(specs)) {
        rowsHTML += `
            <div class="spec-row">
                <span class="spec-key">${key}</span>
                <span class="spec-value">${value}</span>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="specs-accordion" id="specs-accordion">
            <button class="accordion-trigger" aria-expanded="false">
                <span>Technical Specifications</span>
                <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div class="accordion-content">
                ${rowsHTML}
            </div>
        </div>
    `;
    initAccordionLogic();
}

function initCartButton(product) {
    const btn = document.getElementById('add-to-cart-btn');
    const quantityInput = document.querySelector('.qty-input');
    if (!btn) return;

    const isInCart = () => getCart().some(item => item.id === product.id);
    
    const updateButtonState = () => {
        if (isInCart()) {
            btn.classList.add('in-cart');
            btn.querySelector('.btn-text').textContent = '✓ In Cart';
            btn.disabled = true;
        } else {
            btn.classList.remove('in-cart');
            btn.querySelector('.btn-text').textContent = 'Add to Cart';
            btn.disabled = false;
        }
    };

    updateButtonState();

    btn.addEventListener('click', () => {
        if (isInCart()) return;
        const quantity = parseInt(quantityInput.value) || 1;
        const cartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            currency: product.currency,
            quantity: quantity,
            image: product.images[0],
            addedAt: new Date().toISOString()
        };
        const cart = getCart();
        cart.push(cartItem);
        saveCart(cart);
        updateButtonState();
    });
}


async function initProductPage() {
    console.log('Запуск инициализации карточки товара...');
    console.log('Путь к JSON:', '../data/products.json');

    try {
        const response = await fetch('../data/products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const products = await response.json();
        const product = products[0]; 
        
        if (!product) throw new Error('Товар не найден в JSON');

        console.log('Данные успешно загружены:', product.title);

        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-price').textContent = `${product.currency}${product.price.toFixed(2)}`;
        document.getElementById('shipping-text').textContent = product.shipping;
        
        const starsContainer = document.getElementById('rating-stars');
        if (starsContainer) starsContainer.innerHTML = renderStars(product.rating);
        
        document.getElementById('rating-score').textContent = `(${product.rating})`;
        document.getElementById('rating-reviews').textContent = `Based on ${product.reviewCount} reviews`;

        const highlightsList = document.getElementById('highlights-list');
        if (highlightsList) {
            highlightsList.innerHTML = product.highlights.map(text => {
                const parts = text.split(':');
                return parts.length > 1 
                    ? `<li><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</li>`
                    : `<li>${text}</li>`;
            }).join('');
        }

        document.getElementById('description-text').textContent = product.description;
        
        renderSpecs(product.specs);

        initGallery(product.images);
        initQuantityControls();
        initCartButton(product);
        updateCartBadge();

    } catch (error) {
        console.error('Ошибка инициализации:', error);
        const titleEl = document.getElementById('product-title');
        if (titleEl) {
            titleEl.textContent = 'Error loading product';
            titleEl.style.color = '#EF4444';
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPage);
} else {
    initProductPage();
}