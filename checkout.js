
// =====================================
// SURESH MASALA - WHATSAPP CHECKOUT
// =====================================

(() => {

    // Shop WhatsApp Number
    const whatsappNumber = "918579967103";

    // Product Details
    const products = {
        1: { name: "Haldi Powder", price: 240 },
        2: { name: "Red Mirchi Powder", price: 300 },
        3: { name: "Dhaniya Powder", price: 240 },
        4: { name: "Pure Sarso Oil", price: 230 }
    };

    // Delivery Charge: Per Order
    const deliveryCharge = 22;

    // Checkout Form
    const checkoutForm = document.getElementById("checkoutForm");

    if (!checkoutForm) return;

    checkoutForm.addEventListener("submit", function (e) {

        e.preventDefault();

        // Customer Details
        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const address = document.getElementById("customerAddress").value.trim();
        const village = document.getElementById("customerVillage").value.trim();
        const landmark = document.getElementById("customerLandmark").value.trim();

        // Payment Method
        const selectedPayment = document.querySelector(
            'input[name="payment"]:checked'
        );

        if (!selectedPayment) {
            alert("Please select a payment method.");
            return;
        }

        const payment = selectedPayment.value;

        // Get Cart Data
        const cart = JSON.parse(
            localStorage.getItem("sureshCartV2")
        ) || {};

        let subtotal = 0;
        let totalQuantity = 0;
        let orderDetails = "";

        for (const key in cart) {

            const [productId, grams] = key.split("_");

            const product = products[productId];
            const quantity = Number(cart[key]);
            const weight = Number(grams);

            if (!product || !quantity || !weight) continue;

            const itemPrice = product.price * weight / 1000;
            const totalItemPrice = itemPrice * quantity;

            subtotal += totalItemPrice;
            totalQuantity += quantity;

            orderDetails +=
                `\n• ${product.name}` +
                `\n  Weight: ${weight}g` +
                `\n  Quantity: ${quantity}` +
                `\n  Amount: ₹${totalItemPrice.toFixed(2)}\n`;
        }

        // Check Empty Cart
        if (totalQuantity === 0) {
            alert("Your cart is empty! Please add products first.");
            window.location.href = "cart.html";
            return;
        }

        // Calculate Total
        const delivery = deliveryCharge;
        const grandTotal = subtotal + delivery;

        // Generate Order Message
        const message = `
━━━━━━━━━━━━━━━━━━━━
🌶️ *SURESH MASALA*
   *NEW ORDER REQUEST*
━━━━━━━━━━━━━━━━━━━━

Dear Suresh Masala Team,

I would like to place an order.
Please find my details below.

👤 *CUSTOMER INFORMATION*
━━━━━━━━━━━━━━━━━━━━
Name: ${name}
Mobile: ${phone}

📍 *DELIVERY ADDRESS*
━━━━━━━━━━━━━━━━━━━━
Address: ${address}
Village/Area: ${village}
Landmark: ${landmark || "Not provided"}

🛒 *ORDER DETAILS*
━━━━━━━━━━━━━━━━━━━━
${orderDetails}
📦 Total Items: ${totalQuantity}

💰 *PAYMENT SUMMARY*
━━━━━━━━━━━━━━━━━━━━
Subtotal: ₹${subtotal.toFixed(2)}
Delivery Charge: ₹${delivery.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━
*GRAND TOTAL: ₹${grandTotal.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━

💳 *PAYMENT METHOD*
${payment}

📌 *ORDER REQUEST*
Kindly confirm the order and delivery availability.

Thank you for choosing *Suresh Masala*!

_Freshness in Every Taste._
━━━━━━━━━━━━━━━━━━━━
        `;

        // Open WhatsApp
        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");

    });

})();
