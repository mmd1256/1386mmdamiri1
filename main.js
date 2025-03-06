class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.discount = 0;
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateCartDisplay();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateTotal();
        }
    }

    setupEventListeners() {
        // دکمه‌های افزودن به سبد خرید
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => this.addToCart(e));
        });

        // دکمه نمایش سبد خرید
        document.getElementById('cart-button').addEventListener('click', () => {
            document.getElementById('cart-modal').style.display = 'block';
        });

        // دکمه بستن سبد خرید
        document.querySelector('.close-cart').addEventListener('click', () => {
            document.getElementById('cart-modal').style.display = 'none';
        });

        // دکمه خالی کردن سبد
        document.getElementById('clear-cart').addEventListener('click', () => this.clearCart());

        // دکمه اعمال کد تخفیف
        document.getElementById('apply-discount').addEventListener('click', () => this.applyDiscount());

        // دکمه تکمیل خرید
        document.getElementById('checkout-btn').addEventListener('click', () => this.checkout());
    }

    addToCart(e) {
        const product = e.target.closest('.product');
        const id = product.dataset.id;
        const name = product.querySelector('h3').textContent;
        const price = this.extractPrice(product.querySelector('.price').textContent);
        const image = product.querySelector('img').src;

        const existingItem = this.items.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ id, name, price, image, quantity: 1 });
        }

        this.updateCart();
        this.showNotification(`${name} به سبد خرید اضافه شد`);
    }

    updateCart() {
        this.updateTotal();
        this.saveCart();
        this.updateCartDisplay();
    }

    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartItems = document.querySelector('.cart-items');
        const cartCount = document.getElementById('cart-count');
        const totalItems = document.getElementById('total-items');
        const subtotal = document.getElementById('subtotal');
        const discountElement = document.getElementById('discount');
        const totalPrice = document.getElementById('total-price');

        // بروزرسانی تعداد آیتم‌ها
        const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = itemCount;
        totalItems.textContent = itemCount;

        // بروزرسانی محتویات سبد
        cartItems.innerHTML = this.items.map(item => this.createCartItemHTML(item)).join('');

        // بروزرسانی مبالغ
        subtotal.textContent = this.formatPrice(this.total);
        discountElement.textContent = this.formatPrice(this.discount);
        totalPrice.textContent = this.formatPrice(this.total - this.discount);

        // اضافه کردن event listener برای دکمه‌های کنترل تعداد
        this.setupQuantityControls();
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-item">×</button>
                </div>
            </div>
        `;
    }

    setupQuantityControls() {
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const id = cartItem.dataset.id;
                const item = this.items.find(item => item.id === id);

                if (e.target.classList.contains('plus')) {
                    item.quantity++;
                } else if (e.target.classList.contains('minus')) {
                    item.quantity = Math.max(0, item.quantity - 1);
                    if (item.quantity === 0) {
                        this.items = this.items.filter(i => i.id !== id);
                    }
                }

                this.updateCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.cart-item').dataset.id;
                this.items = this.items.filter(item => item.id !== id);
                this.updateCart();
            });
        });
    }

    clearCart() {
        this.items = [];
        this.discount = 0;
        this.updateCart();
        this.showNotification('سبد خرید خالی شد');
    }

    applyDiscount() {
        const code = document.getElementById('discount-code').value;
        // اینجا می‌توانید منطق اعمال تخفیف را پیاده‌سازی کنید
        this.discount = this.total * 0.1; // مثال: 10% تخفیف
        this.updateCartDisplay();
        this.showNotification('کد تخفیف اعمال شد');
    }

    checkout() {
        if (this.items.length === 0) {
            this.showNotification('سبد خرید خالی است!', 'error');
            return;
        }
        // اینجا می‌توانید منطق تکمیل خرید را پیاده‌سازی کنید
        window.location.href = 'checkout.html';
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#ff4444';
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    extractPrice(priceString) {
        return parseInt(priceString.replace(/[^\d]/g, ''));
    }

    formatPrice(price) {
        return price.toLocaleString() + ' تومان';
    }
}

// راه‌اندازی سبد خرید
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});



document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;

    // تابع نمایش اسلاید
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    // تنظیم اسلاید اتوماتیک
    function startSlideShow() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000); // تغییر اسلاید هر 5 ثانیه
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // دکمه‌های قبلی و بعدی
    prevButton.addEventListener('click', () => {
        stopSlideShow();
        showSlide(currentSlide - 1);
        startSlideShow();
    });

    nextButton.addEventListener('click', () => {
        stopSlideShow();
        showSlide(currentSlide + 1);
        startSlideShow();
    });

    // نشانگرهای اسلاید
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });

    // توقف اسلاید اتوماتیک با hover
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', stopSlideShow);
    sliderContainer.addEventListener('mouseleave', startSlideShow);

    // شروع اسلایدشو
    startSlideShow();

    // پشتیبانی از swipe برای دستگاه‌های لمسی
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // swipe به چپ
                showSlide(currentSlide + 1);
            } else {
                // swipe به راست
                showSlide(currentSlide - 1);
            }
        }
    }
});
// شمارنده معکوس تخفیف
function startCountdown() {
    const timerElement = document.getElementById('timer');
    let hours = 23;
    let minutes = 59;
    let seconds = 59;

    setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    hours = 23;
                }
            }
        }
        timerElement.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// منوی موبایل
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.mobile-nav').classList.add('active');
});

document.querySelector('.close-menu').addEventListener('click', () => {
    document.querySelector('.mobile-nav').classList.remove('active');
});

// اجرای توابع
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
});
