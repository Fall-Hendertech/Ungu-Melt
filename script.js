const products = [
    {
        id: 1,
        name: "Es Biji Salak",
        price: 11000,
        image: "images/es-biji-salak.jpg",
        category: "Dessert Tradisional"
    }
];

let cart = [];

const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartIcon = document.querySelector('.cart-icon');
const closeModal = document.querySelector('.close');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function renderProducts() {
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">Rp ${formatRupiah(product.price)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCart();
    showNotification('Produk ditambahkan ke keranjang!');
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    renderCartItems();
}

function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Keranjang kosong</p>';
        return;
    }
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Rp ${formatRupiah(item.price)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Hapus</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Rp ${formatRupiah(total)}`;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function checkout() {
    console.log("🚀 Checkout dimulai...");
    
    if (cart.length === 0) {
        alert('❌ Keranjang kosong!');
        return;
    }
   
    const nomorPenjual = "6287744236209"; 
    
    if (!nomorPenjual || nomorPenjual.length < 10) {
        alert('❌ Nomor WA penjual belum diset dengan benar!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const pesan = formatPesanWhatsApp(total);
    
    console.log("📱 Pesan WA:", pesan);
    
    const waUrl = `https://wa.me/${nomorPenjual}?text=${encodeURIComponent(pesan)}`;
    
    showNotification('✅ Mengalihkan ke WhatsApp...');
    cartModal.style.display = 'none';
    
    setTimeout(() => {
        window.open(waUrl, '_blank');
    }, 800);
}

function formatPesanWhatsApp(total) {
    let pesan = `*PESANAN BARU - Ungu Melt Shop*\n\n`;
    pesan += `_*${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}*_\n\n`;
    pesan += `*DAFTAR BELANJA:*\n`;
    
    cart.forEach((item, index) => {
        pesan += `${index+1}. *${item.name}*\n`;
        pesan += `   QTY: ${item.quantity} × Rp ${formatRupiah(item.price)}\n`;
        pesan += `   = Rp ${formatRupiah(item.price * item.quantity)}\n\n`;
    });
    
    pesan += `*GRAND TOTAL: Rp ${formatRupiah(total)}*\n\n`;
    pesan += `*Mohon konfirmasi pesanan secepatnya*\n\n`;
    pesan += `Ungu Melt Shop | Online Shop Terpercaya \u{1F64F}`;
    
    return pesan;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        navMenu.classList.remove('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        aboutSection.style.opacity = '0';
        aboutSection.style.transform = 'translateY(50px)';
        aboutSection.style.transition = 'all 0.8s ease';
        observer.observe(aboutSection);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCart();
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});

function saveCartToStorage() {
    localStorage.setItem('blackbox_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('blackbox_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}
