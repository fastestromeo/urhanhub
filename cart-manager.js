/**
 * cart-manager.js
 * Manages the shopping cart payload in localStorage.
 */

const CART_KEY = 'urbanhub_cart';

export function getCart() {
    try {
        const cartStr = localStorage.getItem(CART_KEY);
        if (cartStr) return JSON.parse(cartStr);
    } catch (e) {
        console.error("Error reading cart:", e);
    }
    return [];
}

export function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

/**
 * 
 * @param {Object} item { id, name, price, img, category }
 * @param {number} qty 
 */
export function addToCart(item, qty = 1) {
    let cart = getCart();
    const existing = cart.find(i => String(i.id) === String(item.id));
    if (existing) {
        existing.qty += parseInt(qty);
    } else {
        cart.push({ ...item, qty: parseInt(qty) });
    }
    saveCart(cart);
}

export function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(i => String(i.id) !== String(id));
    saveCart(cart);
}

export function updateQuantity(id, qty) {
    let cart = getCart();
    const existing = cart.find(i => String(i.id) === String(id));
    if (existing) {
        if (qty <= 0) {
            removeFromCart(id);
            return;
        }
        existing.qty = parseInt(qty);
        saveCart(cart);
    }
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
}

export function getCartTotals() {
    const cart = getCart();
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += (parseFloat(item.price) || 0) * (item.qty || 1);
    });
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    return { subtotal, tax, total, itemCount: cart.reduce((sum, item) => sum + item.qty, 0) };
}

export function formatPrice(price) {
    return `$${parseFloat(price).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
}

export function updateCartBadge() {
    const badgeContainers = document.querySelectorAll('.cart-badge-container');
    const { itemCount } = getCartTotals();
    
    badgeContainers.forEach(container => {
        let badge = container.querySelector('.cart-badge');
        if (itemCount > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                container.appendChild(badge);
            }
            badge.textContent = itemCount > 99 ? '99+' : itemCount;
        } else {
            if (badge) badge.remove();
        }
    });
}

// Initialise badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);
