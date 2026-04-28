document.addEventListener('DOMContentLoaded', async () => {
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.querySelector('.products-count');
    const sortSelect = document.getElementById('sort');
    
    const ratingCheckboxes = document.querySelectorAll('input[name="rating"]');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    
    let products = [];
    let currentFilters = {
        minRating: 0,
        minPrice: 0,
        maxPrice: 2600
    };
    
    async function loadProducts() {
        try {
            const response = await fetch('../data/products.json');
            if (!response.ok) {
                throw new Error('Failed to load products');
            }
            products = await response.json();
            applyFiltersAndSort();
        } catch (error) {
            console.error('Error loading products:', error);
            productsGrid.innerHTML = '<p style="color: red; text-align: center;">Failed to load products. Please try again later.</p>';
        }
    }
    
    function applyFiltersAndSort() {
        let filteredProducts = [...products];
        
        if (currentFilters.minRating > 0) {
            filteredProducts = filteredProducts.filter(product => 
                product.rating >= currentFilters.minRating
            );
        }
        
        filteredProducts = filteredProducts.filter(product => 
            product.price >= currentFilters.minPrice && 
            product.price <= currentFilters.maxPrice
        );
        
        if (sortSelect) {
            const sortValue = sortSelect.value;
            filteredProducts = sortProducts(filteredProducts, sortValue);
        }
        
        renderProducts(filteredProducts);
        updateProductsCount(filteredProducts.length);
    }
    
    function sortProducts(productsToSort, sortValue) {
        const sortedProducts = [...productsToSort];
        
        switch(sortValue) {
            case 'name-asc':
                sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc': 
                sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
                break;

            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
           
        }
        
        return sortedProducts;
    }
    
    function handleRatingFilter() {
        const checkedRatings = Array.from(ratingCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => parseInt(cb.value));
        
        if (checkedRatings.length > 0) {
            currentFilters.minRating = Math.min(...checkedRatings);
        } else {
            currentFilters.minRating = 0;
        }
        
        applyFiltersAndSort();
    }
    
    function handlePriceFilter() {
        if (minPriceInput && maxPriceInput) {
            currentFilters.minPrice = parseInt(minPriceInput.value);
            currentFilters.maxPrice = parseInt(maxPriceInput.value);
            applyFiltersAndSort();
        }
    }
    
    function clearAllFilters() {
        ratingCheckboxes.forEach(cb => cb.checked = false);
        currentFilters.minRating = 0;
        
        if (minPriceInput) minPriceInput.value = 0;
        if (maxPriceInput) maxPriceInput.value = 2600;
        currentFilters.minPrice = 0;
        currentFilters.maxPrice = 2600;
        
        updatePriceSliderVisual();
        
        if (sortSelect) sortSelect.value = 'name-asc';
        
        applyFiltersAndSort();
    }
    
    function updatePriceSliderVisual() {
        const range = document.getElementById('sliderRange');
        const thumbMin = document.getElementById('thumbMin');
        const thumbMax = document.getElementById('thumbMax');
        const minValue = document.getElementById('minValue');
        const maxValue = document.getElementById('maxValue');
        
        if (range && minValue && maxValue) {
            const percentMin = (currentFilters.minPrice / 2600) * 100;
            const percentMax = (currentFilters.maxPrice / 2600) * 100;
            
            range.style.left = percentMin + '%';
            range.style.width = (percentMax - percentMin) + '%';
            minValue.textContent = '$' + currentFilters.minPrice.toLocaleString();
            maxValue.textContent = '$' + currentFilters.maxPrice.toLocaleString();
            
            if (thumbMin) thumbMin.style.left = percentMin + '%';
            if (thumbMax) thumbMax.style.left = percentMax + '%';
        }
    }
    
    function renderProducts(productsToRender) {
        if (!productsGrid) return;
        
        if (productsToRender.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <h3 style="font-size: 20px; color: #666; margin-bottom: 1rem;">No products found</h3>
                    <p style="color: #999;">Try adjusting your filters or search criteria</p>
                </div>
            `;
            return;
        }
        
        productsGrid.innerHTML = productsToRender.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image-wrapper">
                    <img 
                        src="${product.images[0]}" 
                        alt="${product.title}" 
                        class="product-image"
                        loading="lazy"
                    >
                   
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating">
                        ${renderStars(product.rating)}
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${product.currency}${product.price.toFixed(2)}</span>
                        <span class="product-category">${product.category || 'Audio'}</span>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCartFromCatalog(btn.dataset.id);
            });
        });
        
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.add-to-cart-btn')) {
                    window.location.href = `html/card.html?id=${card.dataset.id}`;
                }
            });
        });
    }
    
    function renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - Math.ceil(rating);
        
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span class="star full">★</span>';
        }
        
        if (hasHalfStar) {
            starsHTML += `
                <span class="star half">
                    <span class="star-empty">★</span>
                    <span class="star-fill">★</span>
                </span>
            `;
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<span class="star empty">☆</span>';
        }
        
        return `<div class="stars-wrapper">${starsHTML}</div>`;
    }
    
    function updateProductsCount(count) {
        if (productsCount) {
            productsCount.textContent = `${count} product${count !== 1 ? 's' : ''}`;
        }
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
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    function addToCartFromCatalog(productId) {
        const product = products.find(p => String(p.id) === String(productId));
        if (!product) return;
        
        const cart = getCart();
        const existingItem = cart.find(item => String(item.id) === String(product.id));
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                currency: product.currency || '$',
                category: product.category || 'Electronics',
                quantity: 1,
                image: product.images?.[0] || '',
                addedAt: new Date().toISOString()
            });
        }
        
        saveCart(cart);
        
        const btn = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added</span>
            `;
            btn.classList.add('added');
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('added');
            }, 1500);
        }
    }
    
    ratingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleRatingFilter);
    });
    
    if (minPriceInput) minPriceInput.addEventListener('input', handlePriceFilter);
    if (maxPriceInput) maxPriceInput.addEventListener('input', handlePriceFilter);
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFiltersAndSort);
    }
    
    await loadProducts();
});