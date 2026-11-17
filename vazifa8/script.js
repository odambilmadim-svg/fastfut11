const menuItems = [
    { id: 1, name: "Chizburger", category: "burger", price: 28000, desc: "Mazali mol go'shti, sir va maxsus sous.", emoji: "🍔" },
    { id: 2, name: "Double Burger", category: "burger", price: 42000, desc: "Ikki qavat go'sht va ikki qavat sir.", emoji: "🍔" },
    { id: 3, name: "Chicken Burger", category: "burger", price: 25000, desc: "Crispy tovuq filesi va salat.", emoji: "🍗" },
    { id: 4, name: "Mol Go'shtli Lavash", category: "lavash", price: 35000, desc: "Nozik lavash, maxsus sous va mol go'shti.", emoji: "🌯" },
    { id: 5, name: "Tovuqli Lavash", category: "lavash", price: 32000, desc: "Tovuq go'shti, pomidor va maxsus sous.", emoji: "🌯" },
    { id: 6, name: "Pepperoni Pitsa", category: "pizza", price: 75000, desc: "Serob kolbasa, mozzarella siri va pomidor sousi.", emoji: "🍕" },
    { id: 7, name: "Margarita Pitsa", category: "pizza", price: 65000, desc: "Klassik pitsa mozzarella siri bilan.", emoji: "🧀" },
    { id: 8, name: "Coca-Cola 0.5L", category: "drink", price: 7000, desc: "Muzdek salqin gazli ichimlik.", emoji: "🥤" },
    { id: 9, name: "Fanta 0.5L", category: "drink", price: 7000, desc: "Apelsin ta'mli gazli ichimlik.", emoji: "🍊" }
];

let cart = {};

function renderMenu(category = 'all') {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    const filtered = category === 'all' ? menuItems : menuItems.filter(item => item.category === category);

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'food-card';
        card.innerHTML = `
            <div class="food-img">${item.emoji}</div>
            <div class="food-info">
                <div class="food-title">${item.name}</div>
                <div class="food-desc">${item.desc}</div>
                <div class="food-footer">
                    <span class="food-price">${item.price.toLocaleString()} so'm</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Qo'shish</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterMenu(category) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderMenu(category);
}

function addToCart(id) {
    if (cart[id]) {
        cart[id].qty += 1;
    } else {
        const item = menuItems.find(i => i.id === id);
        cart[id] = { ...item, qty: 1 };
    }
    updateCartUI();
}

function changeQty(id, change) {
    if (cart[id]) {
        cart[id].qty += change;
        if (cart[id].qty <= 0) {
            delete cart[id];
        }
        updateCartUI();
    }
}

function toggleDelivery() {
    updateCartUI();
}

function togglePayment(type) {
    const cardDetails = document.getElementById('card-details');
    if (type === 'card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const subtotalPriceEl = document.getElementById('subtotal-price');
    const totalPriceEl = document.getElementById('total-price');
    const deliveryRow = document.getElementById('delivery-row');
    const deliveryCheckbox = document.getElementById('delivery-checkbox');

    cartItemsContainer.innerHTML = '';

    const keys = Object.keys(cart);
    if (keys.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Savatchangiz bo\'sh</div>';
        cartCount.innerText = '0';
        subtotalPriceEl.innerText = '0 so\'m';
        totalPriceEl.innerText = '0 so\'m';
        deliveryRow.style.display = 'none';
        return;
    }

    let totalCount = 0;
    let subtotal = 0;

    keys.forEach(id => {
        const item = cart[id];
        totalCount += item.qty;
        subtotal += item.price * item.qty;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${(item.price * item.qty).toLocaleString()} so'm</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQty(${id}, -1)">-</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartCount.innerText = totalCount;
    subtotalPriceEl.innerText = subtotal.toLocaleString() + ' so\'m';

    let deliveryFee = 0;
    if (deliveryCheckbox.checked) {
        deliveryFee = 15000;
        deliveryRow.style.display = 'flex';
    } else {
        deliveryRow.style.display = 'none';
    }

    let grandTotal = subtotal + deliveryFee;
    totalPriceEl.innerText = grandTotal.toLocaleString() + ' so\'m';
}

function scrollToCart() {
    document.getElementById('cart-sidebar').scrollIntoView({ behavior: 'smooth' });
}

async function checkout() {
    if (Object.keys(cart).length === 0) {
        alert("Savatchangiz bo'sh! Oldin mahsulot qo'shing.");
        return;
    }
    const paymentType = document.querySelector('input[name="payment"]:checked').value;
    const isDelivery = document.getElementById('delivery-checkbox').checked;
    const cardNumber = document.querySelector('#card-details input').value;
    
    let subtotal = 0;
    for (let id in cart) {
        subtotal += cart[id].price * cart[id].qty;
    }
    const deliveryFee = isDelivery ? 15000 : 0;
    const grandTotal = subtotal + deliveryFee;

    const BOT_TOKEN = '9291461007:AAHBL-GAcqoBEfw1DsV8JY1hz49CyE-MbQU';
    const CHAT_ID = '-1004315869272';
    
    let message = `🚨 Yangi buyurtma!\n\n`;
    message += `👤 Buyurtma turi: ${isDelivery ? '🛵 Yetkazib berish (+15,000 so\'m)' : '🏃 Olib ketish'}\n`;
    message += `💳 To\'lov turi: ${paymentType === 'cash' ? 'Naqd pul' : 'Plastik karta'}\n`;
    if (paymentType === 'card' && cardNumber) {
        message += `🔢 Karta raqami: ${cardNumber}\n`;
    }
    message += `\n📦 Mahsulotlar:\n`;
    
    for (let id in cart) {
        message += `• ${cart[id].name} (${cart[id].qty} ta) - ${(cart[id].price * cart[id].qty).toLocaleString()} so\'m\n`;
    }
    
    if (isDelivery) {
        message += `• Yetkazib berish - 15,000 so\'m\n`;
    }
    
    message += `\n💰 Jami summa: ${grandTotal.toLocaleString()} so\'m`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });
        
        if (response.ok) {
            alert(`Buyurtmangiz muvaffaqiyatli qabul qilindi va Telegram guruhga yuborildi! 🎉`);
        } else {
            alert(`Buyurtma qabul qilindi, lekin Telegramga yuborishda xatolik yuz berdi.`);
        }
    } catch (error) {
        console.error(error);
        alert(`Buyurtma qabul qilindi (Tarmoq xatosi tufayli Telegramga yetmadi).`);
    }

    cart = {};
    document.getElementById('delivery-checkbox').checked = false;
    document.querySelector('#card-details input').value = '';
    updateCartUI();
}

renderMenu();
