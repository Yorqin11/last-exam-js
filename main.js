let cart = [];
let likedItems = new Set();

// DOM elements
const cartSection = document.getElementById('cartSection');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartToggle = document.getElementById('cartToggle');
const clearCart = document.getElementById('clearCart');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const productPrice = parseFloat(productCard.dataset.price);
            const productName = productCard.querySelector('h2').textContent;
            const productDescription = productCard.querySelector('.text-xs').textContent;
            
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                description: productDescription
            });
        });
    });

    // Like buttons
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const heartIcon = this.querySelector('.heart-icon');
            
            if (likedItems.has(productId)) {
                likedItems.delete(productId);
                heartIcon.classList.remove('heart-liked');
                heartIcon.textContent = '♥️';
            } else {
                likedItems.add(productId);
                heartIcon.classList.add('heart-liked');
                heartIcon.textContent = '♥️';
            }
        });
    });

    // Cart toggle
    cartToggle.addEventListener('click', function() {
        cartSection.classList.toggle('hidden');
    });

    // Clear cart
    clearCart.addEventListener('click', function() {
        cart = [];
        updateCartDisplay();
    });
});

function addToCart(product) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCartDisplay();
    
    // Show cart if hidden
    if (cartSection.classList.contains('hidden')) {
        cartSection.classList.remove('hidden');
    }
    
    // Visual feedback
    const button = document.querySelector(`[data-id="${product.id}"] .add-to-cart`);
    const originalText = button.innerHTML;
    button.innerHTML = '✅ Added!';
    button.style.backgroundColor = '#10b981';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = '';
    }, 1000);
}


function updateCartDisplay() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Update cart total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toFixed(2);
  
  // Update cart items display
  cartItems.innerHTML = '';
  
  cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item bg-white/20 backdrop-blur-sm rounded-xl p-4';
      cartItem.innerHTML = `
          <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-white text-sm">${item.name}</h3>
              <button onclick="removeFromCart('${item.id}')" class="text-red-300 hover:text-red-100 text-xl">&times;</button>
          </div>
          <p class="text-white/80 text-xs mb-2">${item.description}</p>
          <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                  <button onclick="changeQuantity('${item.id}', -1)" class="bg-white/20 text-white w-6 h-6 rounded-full hover:bg-white/30">-</button>
                  <span class="text-white font-semibold">${item.quantity}</span>
                  <button onclick="changeQuantity('${item.id}', 1)" class="bg-white/20 text-white w-6 h-6 rounded-full hover:bg-white/30">+</button>
              </div>
              <span class="text-white font-bold">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
      `;
      cartItems.appendChild(cartItem);
  });
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartDisplay();
}

function changeQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
          removeFromCart(productId);
      } else {
          updateCartDisplay();
      }
  }
}
