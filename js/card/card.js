function renderStars(rating) {
    const fullStar = '★';
    const emptyStar = '☆';
    const halfStar = '⯪';

    let starsHTML = '';

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            starsHTML += fullStar;
        } else if (rating >= i - 0.5) {
            starsHTML += halfStar;
        } else {
            starsHTML += emptyStar;
        }
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
            <img src="${src}" alt="Product view ${i + 1}">
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
            mainImg.alt = `Product view ${currentIndex + 1}`;
            mainImg.style.opacity = '1';
        }, 150);

        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });
    };

    prevBtn.addEventListener('click', () => updateView(currentIndex - 1));
    nextBtn.addEventListener('click', () => updateView(currentIndex + 1));

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            updateView(+thumb.dataset.index);
        });
    });

    if (mainImg && images.length > 0) {
        mainImg.src = images[0];
    }
}


function initQuantityControls() {
    const input = document.querySelector('.qty-input');
    const btnMinus = document.querySelector('.qty-btn--minus');
    const btnPlus = document.querySelector('.qty-btn--plus');

    btnMinus.addEventListener('click', () => {
        const currentValue = parseInt(input.value) || 1;
        if (currentValue > 1) {
            input.value = currentValue - 1;
        }
    });

    btnPlus.addEventListener('click', () => {
        const currentValue = parseInt(input.value) || 1;
        input.value = currentValue + 1;
    });
}


function initAccordion() {
    const toggle = document.querySelector('.accordion-toggle');
    const content = document.querySelector('.accordion-content');
    const icon = document.querySelector('.accordion-icon');

    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
        const isOpen = content.style.display === 'block';

        if (isOpen) {
            content.style.display = 'none';
            if (icon) icon.style.transform = 'rotate(0deg)';
            toggle.setAttribute('aria-expanded', 'false');
        } else {
            content.style.display = 'block';
            if (icon) icon.style.transform = 'rotate(180deg)';
            toggle.setAttribute('aria-expanded', 'true');
        }
    });
}



function initCartButton(product) {
    const btn = document.getElementById('add-to-cart-btn');
    const quantityInput = document.querySelector('.qty-input');

    if (!btn) return;


    const isInCart = () => {
        const cart = getCart();
        return cart.some(item => item.id === product.id);
    };


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

        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    });
}


async function initProductPage() {
    try {
        const response = await fetch('../data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products = await response.json();

        const product = products[0];

        if (!product) {
            throw new Error('Product not found');
        }

        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-price').textContent = `${product.currency}${product.price.toFixed(2)}`;
        document.getElementById('shipping-text').textContent = product.shipping || 'Free shipping';

        const starsContainer = document.getElementById('rating-stars');
        if (starsContainer) {
            starsContainer.innerHTML = renderStars(product.rating || 0);
        }
        document.getElementById('rating-score').textContent = `(${product.rating})`;
        document.getElementById('rating-reviews').textContent = `Based on ${product.reviewCount} reviews`;

        const highlightsList = document.getElementById('highlights-list');
        if (highlightsList && product.highlights) {
            highlightsList.innerHTML = product.highlights.map(text => {
                const parts = text.split(':');
                if (parts.length > 1) {
                    return `<li><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</li>`;
                }
                return `<li>${text}</li>`;
            }).join('');
        }

        document.getElementById('description-text').textContent = product.description || '';

        const specsContent = document.getElementById('specs-content');
        if (specsContent && product.specs) {
            let specsHTML = '<div class="specs-table">';
            for (const [key, value] of Object.entries(product.specs)) {
                specsHTML += `
                    <div class="spec-row">
                        <span class="spec-key">${key}</span>
                        <span class="spec-val">${value}</span>
                    </div>`;
            }
            specsHTML += '</div>';
            specsContent.innerHTML = specsHTML;
        }

        initGallery(product.images || []);
        initQuantityControls();
        initAccordion();
        initCartButton(product);

        updateCartBadge();

        console.log('Product page initialized successfully:', product.title);

    } catch (error) {
        console.error('Error initializing product page:', error);

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