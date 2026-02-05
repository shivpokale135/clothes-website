// --- Data: Product List ---
const products = [
    { id: 1, name: "Classic White Tee", price: 25.00, image: "https://placehold.co/300x200/333/FFF?text=White+Tee" },
    { id: 2, name: "Denim Jacket", price: 89.99, image: "https://placehold.co/300x200/444/FFF?text=Denim+Jacket" },
    { id: 3, name: "Summer Dress", price: 45.00, image: "https://placehold.co/300x200/e84393/FFF?text=Summer+Dress" },
    { id: 4, name: "Cargo Shorts", price: 35.50, image: "https://placehold.co/300x200/0984e3/FFF?text=Cargo+Shorts" },
    { id: 5, name: "Casual Hoodie", price: 55.00, image: "https://placehold.co/300x200/636e72/FFF?text=Hoodie" },
    { id: 6, name: "Sneakers", price: 75.00, image: "https://placehold.co/300x200/d63031/FFF?text=Sneakers" },
];

// --- State ---
let cart = [];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
});

// --- Function: Render Products to Shop Page ---
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// --- Function: Add Item to Cart ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    alert(`${product.name} added to cart!`);
    updateCartCount();
    renderCart(); // Refresh cart view if open
}

// --- Function: Update Cart Badge Count ---
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = count;
}

// --- Function: Render Cart Section ---
function renderCart() {
    const cartContainer = document.getElementById('cart-container');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const summary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; padding:20px;">Your cart is empty.</p>';
        summary.classList.add('hidden');
        return;
    }

    summary.classList.remove('hidden');
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.qty}</p>
            </div>
            <div class="cart-controls">
                <button onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    calculateTotal();
}

// --- Function: Change Quantity ---
function changeQty(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeItem(id);
        } else {
            renderCart();
            updateCartCount();
        }
    }
}

// --- Function: Remove Item ---
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
    updateCartCount();
}

// --- Function: Calculate Total Price ---
function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

// --- Function: Router (Navigation between pages) ---
function router(pageId) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => section.classList.add('hidden'));

    // Show target section
    document.getElementById(pageId).classList.remove('hidden');

    // Update Nav Active State
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Highlight current link if exists
    const activeLink = document.getElementById(`nav-${pageId}`);
    if(activeLink) activeLink.classList.add('active');

    // Special case: If going to cart, re-render to ensure data is fresh
    if(pageId === 'cart') {
        renderCart();
    }
}

// --- Function: Toggle Payment Details ---
function togglePayment(method) {
    const upiDetails = document.getElementById('upi-details');
    const upiInput = document.getElementById('upi-id');
    
    if (method === 'upi') {
        upiDetails.classList.remove('hidden');
        upiInput.setAttribute('required', 'true');
    } else {
        upiDetails.classList.add('hidden');
        upiInput.removeAttribute('required');
    }
}

// --- Function: Place Order ---
function placeOrder(event) {
    event.preventDefault(); // Stop form from actually submitting/reloading

    // Simple validation logic
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (paymentMethod === 'upi') {
        const upiId = document.getElementById('upi-id').value;
        if (!upiId) {
            alert("Please enter a dummy UPI Transaction ID.");
            return;
        }
    }

    // Success Action
    alert("Order Placed Successfully!");
    
    // Clear Cart
    cart = [];
    updateCartCount();
    renderCart();

    // Redirect to Success Page
    router('success');
      }
  
