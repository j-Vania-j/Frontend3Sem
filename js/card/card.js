
function renderStars(rating) {
    const fullStar = '★';
    const emptyStar = '☆';
    const halfStar = '⯪';
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
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}


function initGallery(images) {
    const mainImg = document.getElementById('main-image');
    const thumbsContainer = document.getElementById('thumbs-container');
    const prevBtn = document.querySelector('.gallery-nav--prev');
    const nextBtn = document.querySelector('.gallery-nav--next');
    
    if (!mainImg || !thumbsContainer) return;
    
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
            mainImg.alt = `Product view ${currentIndex + 1}`;
            mainImg.style.opacity = '1';
        }, 150);
        thumbs.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
    };

    prevBtn?.addEventListener('click', () => updateView(currentIndex - 1));
    nextBtn?.addEventListener('click', () => updateView(currentIndex + 1));
    thumbs.forEach(t => t.addEventListener('click', () => updateView(+t.dataset.index)));
    
    if (images.length > 0) mainImg.src = images[0];
}


function initQuantityControls() {
    const input = document.querySelector('.qty-input');
    const minusBtn = document.querySelector('.qty-btn--minus');
    const plusBtn = document.querySelector('.qty-btn--plus');
    
    if (!input || !minusBtn || !plusBtn) return;

    minusBtn.addEventListener('click', () => {
        if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
    });
    
    plusBtn.addEventListener('click', () => {
        input.value = parseInt(input.value) + 1;
    });
}


function initAccordionLogic() {
    const accordion = document.getElementById('specs-accordion');
    if (!accordion) return;
    
    const trigger = accordion.querySelector('.accordion-trigger');
    const content = accordion.querySelector('.accordion-content');

    trigger?.addEventListener('click', () => {
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
                <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
    const btnText = btn?.querySelector('.btn-text');
    const quantityInput = document.querySelector('.qty-input');
    if (!btn) return;

    const isInCart = () => {
        const cart = getCart();
        return cart.some(item => String(item.id) === String(product.id));
    };
    
    const updateButtonState = () => {
        if (isInCart()) {
            btn.classList.add('in-cart');
            if (btnText) btnText.textContent = 'In Cart';
        } else {
            btn.classList.remove('in-cart');
            if (btnText) btnText.textContent = 'Add to Cart';
        }
    };

    updateButtonState();

    btn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput?.value) || 1;
        
        const cartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            currency: product.currency || '$',
            category: product.category || 'Electronics',
            quantity: quantity,
            image: product.images?.[0] || '',
            addedAt: new Date().toISOString()
        };

        const cart = getCart();
        const existingItem = cart.find(item => String(item.id) === String(product.id));
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push(cartItem);
        }
        
        saveCart(cart);
        updateButtonState();
    });
}


async function initProductPage() {
   
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    const productContent = document.querySelector('.product-layout');
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    
    if (!productId) {
        if (productContent) productContent.innerHTML = '<p style="color: red; text-align: center;">Product ID not specified</p>';
        return;
    }

    try {
        const response = await fetch('../../data/products.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const products = await response.json();
       
        const product = products.find(p => String(p.id) === String(productId));
        
        if (!product) {
            if (productContent) productContent.innerHTML = '<p style="color: red; text-align: center;">Product not found</p>';
            return;
        }

       
        document.title = `${product.title} - TechStore`;
        if (breadcrumbProduct) breadcrumbProduct.textContent = product.title;

     
        const titleEl = document.getElementById('product-title');
        if (titleEl) titleEl.textContent = product.title;
        
        const priceEl = document.getElementById('product-price');
        if (priceEl) priceEl.textContent = `${product.currency || '$'}${product.price.toFixed(2)}`;
        
        const shippingEl = document.getElementById('shipping-text');
        if (shippingEl) shippingEl.textContent = product.shipping || '';
        
        const starsContainer = document.getElementById('rating-stars');
        if (starsContainer) starsContainer.innerHTML = renderStars(product.rating);
        
        const scoreEl = document.getElementById('rating-score');
        if (scoreEl) scoreEl.textContent = `(${product.rating})`;
        
        const reviewsEl = document.getElementById('rating-reviews');
        if (reviewsEl) reviewsEl.textContent = `Based on ${product.reviewCount || 0} reviews`;

        const highlightsList = document.getElementById('highlights-list');
        if (highlightsList && product.highlights) {
            highlightsList.innerHTML = product.highlights.map(text => {
                const parts = text.split(':');
                return parts.length > 1 
                    ? `<li><strong>${parts[0]}:</strong> ${parts.slice(1).join(':')}</li>`
                    : `<li>${text}</li>`;
            }).join('');
        }

        const descEl = document.getElementById('description-text');
        if (descEl) descEl.textContent = product.description || '';
        
        renderSpecs(product.specs);
        initGallery(product.images || []);
        initQuantityControls();
        initCartButton(product);
        updateCartBadge();

    } catch (error) {
        console.error('Error loading product:', error);
        if (productContent) {
            productContent.innerHTML = '<p style="color: red; text-align: center; padding: 2rem;">Failed to load product. Please try again later.</p>';
        }
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPage);
} else {
    initProductPage();
}