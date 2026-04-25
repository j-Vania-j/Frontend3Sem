
document.addEventListener('DOMContentLoaded', async () => {
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.querySelector('.products-count');
    
    let products = [];
    
    // Загрузка товаров из JSON
    async function loadProducts() {
        try {
            const response = await fetch('../data/products.json');
            if (!response.ok) {
                throw new Error('Failed to load products');
            }
            products = await response.json();
            renderProducts(products);
            updateProductsCount(products.length);
        } catch (error) {
            console.error('Error loading products:', error);
            productsGrid.innerHTML = '<p style="color: red; text-align: center;">Failed to load products. Please try again later.</p>';
        }
    }
    
    // Отрисовка товаров
    function renderProducts(productsToRender) {
        if (!productsGrid) return;
        
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
                        <span class="product-category">${product.category}</span>
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
    
    // Полные звёзды
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star full">★</span>';
    }
    
    // Половинка звезды
    if (hasHalfStar) {
        starsHTML += `
            <span class="star half">
                <span class="star-empty">★</span>
                <span class="star-fill">★</span>
            </span>
        `;
    }
    
    // Пустые звёзды
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
    
    
    await loadProducts();
});