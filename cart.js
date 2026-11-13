
/* =============================================
   SURESH MASALA - COMPLETE CART JAVASCRIPT
============================================= */

(() => {

    "use strict";

    const CART_KEY = "sureshCartV2";
    const DELIVERY_CHARGE = 22;

    /* PRODUCT DATABASE */

    const products = {
        1: {
            name: "Haldi Powder",
            price: 240,
            image: "images/haldi.png"
        },
        2: {
            name: "Red Mirchi Powder",
            price: 300,
            image: "images/chilli.png"
        },
        3: {
            name: "Dhaniya Powder",
            price: 240,
            image: "images/dhaniya.png"
        },
        4: {
            name: "Pure Sarso Oil",
            price: 230,
            image: "images/sarso-oil.png"
        }
    };


    /* =============================================
       CART FUNCTIONS
    ============================================= */

    function getCart() {

        try {
            const savedCart = JSON.parse(
                localStorage.getItem(CART_KEY)
            );

            return savedCart && typeof savedCart === "object"
                ? savedCart
                : {};

        } catch (error) {

            console.error("Cart loading error:", error);
            return {};

        }

    }


    function saveCart(cart) {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    }


    function formatPrice(price) {

        return Number(price).toFixed(2);

    }


    /* =============================================
       UPDATE CART COUNT
    ============================================= */

    function updateCartCount() {

        const cart = getCart();

        let totalQuantity = 0;

        Object.values(cart).forEach(quantity => {

            totalQuantity += Number(quantity) || 0;

        });

        document.querySelectorAll(".cart-count").forEach(element => {

            element.textContent = totalQuantity;

        });

    }


    /* =============================================
       RENDER CART PRODUCTS
    ============================================= */

    function renderCart() {

        const cartItems = document.getElementById("cartItems");

        if (!cartItems) return;

        const cart = getCart();

        let subtotal = 0;
        let totalQuantity = 0;

        cartItems.innerHTML = "";

        for (const key in cart) {

            const [productId, grams] = key.split("_");

            const product = products[productId];

            const weight = Number(grams);
            const quantity = Number(cart[key]);

            if (
                !product ||
                !Number.isFinite(weight) ||
                !Number.isFinite(quantity) ||
                weight <= 0 ||
                quantity <= 0
            ) {
                continue;
            }

            const unitPrice = product.price * weight / 1000;
            const itemTotal = unitPrice * quantity;

            subtotal += itemTotal;
            totalQuantity += quantity;


            /* CREATE PRODUCT ITEM */

            const item = document.createElement("div");

            item.className = "cart-item";


            /* PRODUCT IMAGE */

            const imageBox = document.createElement("div");

            imageBox.className = "cart-item-image";

            const image = document.createElement("img");

            image.src = product.image;
            image.alt = product.name;

            image.onerror = function () {

                this.onerror = null;
                this.src = "images/hero-masala.png";

            };

            imageBox.appendChild(image);


            /* PRODUCT DETAILS */

            const details = document.createElement("div");

            details.className = "cart-item-details";

            details.innerHTML = `

                <h3>${product.name}</h3>

                <p class="cart-weight">
                    ${weight}g × ${quantity}
                </p>

                <p class="cart-unit-price">
                    Price per pack: ₹${formatPrice(unitPrice)}
                </p>

                <div class="cart-quantity">

                    <button
                        type="button"
                        class="quantity-btn"
                        data-action="decrease"
                        data-key="${key}">
                        −
                    </button>

                    <span>${quantity}</span>

                    <button
                        type="button"
                        class="quantity-btn"
                        data-action="increase"
                        data-key="${key}">
                        +
                    </button>

                </div>

            `;


            /* PRICE AND REMOVE BUTTON */

            const priceBox = document.createElement("div");

            priceBox.className = "cart-item-price";

            priceBox.innerHTML = `

                <strong>₹${formatPrice(itemTotal)}</strong>

                <button
                    type="button"
                    class="remove-item"
                    data-action="remove"
                    data-key="${key}">

                    <i class="fa-solid fa-trash"></i>
                    Remove

                </button>

            `;


            item.appendChild(imageBox);
            item.appendChild(details);
            item.appendChild(priceBox);

            cartItems.appendChild(item);

        }


        /* EMPTY CART */

        if (totalQuantity === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <i class="fa-solid fa-cart-shopping"></i>

                    <h3>Your Cart is Empty</h3>

                    <p>
                        You haven't added any products to your cart yet.
                    </p>

                    <a href="index.html#products">
                        Explore Products
                    </a>

                </div>

            `;

        }


        /* BILLING CALCULATION */

        const delivery = totalQuantity > 0
            ? DELIVERY_CHARGE
            : 0;

        const grandTotal = subtotal + delivery;

        const subtotalElement =
            document.getElementById("cartSubtotal");

        const deliveryElement =
            document.getElementById("deliveryTotal");

        const grandTotalElement =
            document.getElementById("grandTotal");


        if (subtotalElement) {

            subtotalElement.textContent = formatPrice(subtotal);

        }

        if (deliveryElement) {

            deliveryElement.textContent = formatPrice(delivery);

        }

        if (grandTotalElement) {

            grandTotalElement.textContent = formatPrice(grandTotal);

        }

        updateCartCount();

    }


    /* =============================================
       QUANTITY AND REMOVE BUTTONS
    ============================================= */

    document.addEventListener("click", function(event) {

        const button = event.target.closest(
            "#cartItems [data-action]"
        );

        if (!button) return;

        const action = button.dataset.action;
        const key = button.dataset.key;

        if (!key) return;

        const cart = getCart();

        if (!(key in cart)) return;


        if (action === "increase") {

            cart[key] = Number(cart[key]) + 1;

        }

        else if (action === "decrease") {

            cart[key] = Number(cart[key]) - 1;

            if (cart[key] <= 0) {

                delete cart[key];

            }

        }

        else if (action === "remove") {

            delete cart[key];

        }

        else {

            return;

        }

        saveCart(cart);
        renderCart();

    });


    /* =============================================
       CHECKOUT BUTTON
    ============================================= */

    const checkoutBtn = document.getElementById("checkoutBtn");

    if (checkoutBtn) {

        checkoutBtn.addEventListener("click", function() {

            const cart = getCart();

            const hasProducts = Object.entries(cart).some(
                ([key, quantity]) => {

                    const [productId, grams] = key.split("_");

                    return (
                        products[productId] &&
                        Number(grams) > 0 &&
                        Number(quantity) > 0
                    );

                }
            );

            if (!hasProducts) {

                alert("Your cart is empty! Please add products first.");
                return;

            }

            window.location.href = "checkout.html";

        });

    }


    /* =============================================
       INITIALIZE CART
    ============================================= */

    renderCart();
    updateCartCount();

})();
