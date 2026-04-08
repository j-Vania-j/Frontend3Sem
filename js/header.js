
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
                </div>
            </div>
        </div>
    </header>
`;

document.body.insertAdjacentHTML('afterbegin', headerHTML);