const headerHTML = `
    <header class="header">
        <div class="container">
            <div class="header-wrapper">
                <a href="catalog.html" class="logo">
                    <div class="logo-icon">
                        <span>T</span>
                    </div>
                    <span class="logo-text">TechStore</span>
                </a>

                <nav class="nav">
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="catalog.html" class="nav-link">Products</a>
                        </li>
                        <li class="nav-item">
                            <a href="#categories" class="nav-link">Categories</a>
                        </li>
                        <li class="nav-item">
                            <a href="#deals" class="nav-link">Deals</a>
                        </li>
                        <li class="nav-item">
                            <a href="#about" class="nav-link">About</a>
                        </li>
                    </ul>
                </nav>

                <div class="header-actions">
                    <button class="icon-btn search-btn" aria-label="Search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
                    <a href="cart.html" class="cart-link" aria-label="Shopping cart">
                        <button class="icon-btn cart-btn" type="button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <span class="cart-badge" id="cartBadge"></span>
                        </button>
                    </a>
                    <button class="burger-btn" aria-label="Menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </div>

        <div class="mobile-menu">
            <nav class="mobile-nav">
                <ul class="mobile-nav-list">
                    <li class="mobile-nav-item">
                        <a href="#products" class="mobile-nav-link">Products</a>
                    </li>
                    <li class="mobile-nav-item">
                        <a href="#categories" class="mobile-nav-link">Categories</a>
                    </li>
                    <li class="mobile-nav-item">
                        <a href="#deals" class="mobile-nav-link">Deals</a>
                    </li>
                    <li class="mobile-nav-item">
                        <a href="#about" class="mobile-nav-link">About</a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
`;

document.body.insertAdjacentHTML('afterbegin', headerHTML);

function getCart() {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        console.error('Ошибка чтения корзины:', e);
        return [];
    }
}

function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => {
        const qty = item.quantity ?? item.qty ?? 1;
        return sum + qty;
    }, 0);
    
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'inline-flex';
        } else {
            badge.textContent = '';
            badge.style.display = 'none';
        }
    });
}

function initBurgerMenu() {
    const burgerBtn = document.querySelector('.burger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!burgerBtn || !mobileMenu) {
        return;
    }

    burgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

function initHeader() {
    initBurgerMenu();
    updateCartBadge();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
} else {
    initHeader();
}