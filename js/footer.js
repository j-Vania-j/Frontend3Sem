// js/footer.js
const footerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-column">
                    <a href="/" class="footer-logo">
                        <div class="logo-icon">
                            <span>T</span>
                        </div>
                        <span class="logo-text">TechStore</span>
                    </a>
                    <p class="footer-description">
                        Your trusted destination for premium electronics and tech accessories. Quality products, competitive prices, exceptional service.
                    </p>
                    <div class="social-links">
                        <a href="#" class="social-link" aria-label="Facebook">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="Twitter">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="Instagram">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="YouTube">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                            </svg>
                        </a>
                    </div>
                </div>

                <div class="footer-column">
                    <h3 class="footer-title">Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="#shop" class="footer-link">Shop All Products</a></li>
                        <li><a href="#deals" class="footer-link">Special Deals</a></li>
                        <li><a href="#about" class="footer-link">About Us</a></li>
                        <li><a href="#contact" class="footer-link">Contact Support</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h3 class="footer-title">Customer Service</h3>
                    <ul class="footer-links">
                        <li><a href="#shipping" class="footer-link">Shipping Information</a></li>
                        <li><a href="#returns" class="footer-link">Returns & Exchanges</a></li>
                        <li><a href="#faq" class="footer-link">FAQ</a></li>
                        <li><a href="#track" class="footer-link">Track Order</a></li>
                    </ul>
                    <div class="footer-contact">
                        <p>Customer Support:</p>
                        <p class="footer-phone">1-800-TECH-SHOP</p>
                        <p class="footer-email">support@techstore.com</p>
                    </div>
                </div>

                <div class="footer-column">
                    <h3 class="footer-title">Newsletter</h3>
                    <p class="footer-newsletter-text">
                        Subscribe to get special offers, free giveaways, and updates.
                    </p>
                    <form class="newsletter-form" onsubmit="event.preventDefault();">
                        <input type="email" placeholder="Enter your email" class="newsletter-input">
                        <button type="submit" class="newsletter-btn">Subscribe</button>
                    </form>
                </div>
            </div>

            <div class="footer-bottom">
                <p class="copyright">© 2026 TechStore. All rights reserved.</p>
                <div class="footer-policies">
                    <a href="#privacy" class="footer-policy-link">Privacy Policy</a>
                    <a href="#terms" class="footer-policy-link">Terms of Service</a>
                    <a href="#cookies" class="footer-policy-link">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>
`;

document.body.insertAdjacentHTML('beforeend', footerHTML);