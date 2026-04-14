// js/header.js
const headerHTML = `
    <header class="header">
        <div class="container">
            <div class="header-wrapper">
                <a href="/" class="logo">
                    <div class="logo-icon">
                        <span>T</span>
                    </div>
                    <span class="logo-text">TechStore</span>
                </a>

                <nav class="nav">
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="#products" class="nav-link">Products</a>
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
                    <button class="icon-btn cart-btn" aria-label="Shopping cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        
                    </button>
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

initBurgerMenu();