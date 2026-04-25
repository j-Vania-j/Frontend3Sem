// js/catalog/catalog.js
document.addEventListener('DOMContentLoaded', async () => {
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.querySelector('.products-count');
    const sortSelect = document.getElementById('sort');
    
    // Элементы фильтров
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
    
    // Загрузка товаров из JSON
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
    
    // Применение фильтров и сортировки
    function applyFiltersAndSort() {
        let filteredProducts = [...products];
        
        // Фильтр по рейтингу
        if (currentFilters.minRating > 0) {
            filteredProducts = filteredProducts.filter(product => 
                product.rating >= currentFilters.minRating
            );
        }
        
        // Фильтр по цене
        filteredProducts = filteredProducts.filter(product => 
            product.price >= currentFilters.minPrice && 
            product.price <= currentFilters.maxPrice
        );
        
        // Сортировка
        if (sortSelect) {
            const sortValue = sortSelect.value;
            filteredProducts = sortProducts(filteredProducts, sortValue);
        }
        
        renderProducts(filteredProducts);
        updateProductsCount(filteredProducts.length);
    }
    
    // Сортировка товаров
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
            case 'rating':
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
        }
        
        return sortedProducts;
    }
    
    // Обработка фильтра по рейтингу
    function handleRatingFilter() {
        const checkedRatings = Array.from(ratingCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => parseInt(cb.value));
        
        if (checkedRatings.length > 0) {
            // Берём минимальный выбранный рейтинг (если выбрано 4+ и 5+, показываем 4+)
            currentFilters.minRating = Math.min(...checkedRatings);
        } else {
            currentFilters.minRating = 0;
        }
        
        applyFiltersAndSort();
    }
    
    // Обработка фильтра по цене
    function handlePriceFilter() {
        if (minPriceInput && maxPriceInput) {
            currentFilters.minPrice = parseInt(minPriceInput.value);
            currentFilters.maxPrice = parseInt(maxPriceInput.value);
            applyFiltersAndSort();
        }
    }
    
    // Сброс всех фильтров
    function clearAllFilters() {
        // Сброс рейтинга
        ratingCheckboxes.forEach(cb => cb.checked = false);
        currentFilters.minRating = 0;
        
        // Сброс цены (
        if (minPriceInput) minPriceInput.value = 0;
        if (maxPriceInput) maxPriceInput.value = 2600;
        currentFilters.minPrice = 0;
        currentFilters.maxPrice = 2600;
        
        
        updatePriceSliderVisual();
        
        // Сброс сортировки
        if (sortSelect) sortSelect.value = 'name-asc';
        
        applyFiltersAndSort();
    }
    
    // Обновление визуального слайдера
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
    
    // Отрисовка товаров
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
            <div class="product-card" data-id="${product.id}" onclick="window.location.href='../html/card/card.html?id=${product.id}'">
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
                </div>
            </div>
        `).join('');
    }
    
    // Генерация звёзд рейтинга
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
    
    // Обновление количества товаров
    function updateProductsCount(count) {
        if (productsCount) {
            productsCount.textContent = `${count} product${count !== 1 ? 's' : ''}`;
        }
    }
    
    //Слушатели событий 
    
    // Фильтр по рейтингу
    ratingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleRatingFilter);
    });
    
    // Фильтр по цене
    if (minPriceInput) minPriceInput.addEventListener('input', handlePriceFilter);
    if (maxPriceInput) maxPriceInput.addEventListener('input', handlePriceFilter);
    
    // Кнопка сброса
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Сортировка
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFiltersAndSort);
    }
    
    // Загружаем товары при загрузке страницы
    await loadProducts();
});