
/* =====================================
   SURESH MASALA - MAIN JAVASCRIPT
===================================== */


/* =====================================
   NAVBAR MENU
===================================== */

const menuIcon = document.getElementById("menuIcon");
const navLinks = document.getElementById("navLinks");

if (menuIcon && navLinks) {

    menuIcon.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        menuIcon.innerHTML = navLinks.classList.contains("active")
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

    });

    document.querySelectorAll(".nav-links a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");
            menuIcon.innerHTML = '<i class="fa-solid fa-bars"></i>';

        });

    });

}


/* =====================================
   PRODUCTS DATA
===================================== */

const products = [

    {
        id: 1,
        name: "Haldi Powder",
        image: "images/haldi.png",
        price: 240
    },

    {
        id: 2,
        name: "Red Mirchi Powder",
        image: "images/chilli.png",
        price: 300
    },

    {
        id: 3,
        name: "Dhaniya Powder",
        image: "images/dhaniya.png",
        price: 240
    },

    {
        id: 4,
        name: "Pure Sarso Oil",
        image: "images/sarso-oil.png",
        price: 230
    }

];


/* =====================================
   PACK SIZES
===================================== */

const packSizes = [

    { name: "100g", grams: 100 },
    { name: "250g", grams: 250 },
    { name: "500g", grams: 500 },
    { name: "1kg", grams: 1000 }

];


/* =====================================
   CART DATA
===================================== */

let cart = {};

try {

    cart = JSON.parse(
        localStorage.getItem("sureshCartV2")
    ) || {};

} catch (error) {

    cart = {};

}


/* =====================================
   PRICE CALCULATION
===================================== */

function getProductPrice(product, grams) {

    return product.price * grams / 1000;

}


/* =====================================
   DISPLAY PRODUCTS
===================================== */

function displayProducts() {

    const productsGrid = document.getElementById("productsGrid");

    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => {

        const selectedPack = packSizes[0];

        const key = `${product.id}_${selectedPack.grams}`;

        const quantity = Number(cart[key]) || 0;

        const price = getProductPrice(
            product,
            selectedPack.grams
        );

        return `

            <div class="product-card">

                <div class="product-img">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-details">

                    <h3>${product.name}</h3>


                    <div class="pack-options">

                        ${packSizes.map((pack, index) => `

                            <button
                                class="pack-btn ${index === 0 ? "active" : ""}"
                                data-action="pack"
                                data-id="${product.id}"
                                data-grams="${pack.grams}">

                                ${pack.name}

                            </button>

                        `).join("")}

                    </div>


                    <p class="product-price">

                        ₹<span class="price-value">

                            ${price}

                        </span>

                    </p>


                    <button
                        class="add-btn"
                        data-action="add"
                        data-id="${product.id}"
                        data-grams="100"
                        ${quantity > 0 ? "hidden" : ""}>

                        Add to Cart

                    </button>


                    <div
                        class="quantity-control"
                        ${quantity === 0 ? "hidden" : ""}>

                        <button
                            data-action="minus"
                            data-id="${product.id}">

                            −

                        </button>


                        <span class="quantity-value">

                            ${quantity}

                        </span>


                        <button
                            data-action="plus"
                            data-id="${product.id}">

                            +

                        </button>

                    </div>

                </div>

            </div>

        `;

    }).join("");

}


/* =====================================
   PRODUCT BUTTON EVENTS
===================================== */

const productsGrid = document.getElementById("productsGrid");

if (productsGrid) {

    productsGrid.addEventListener("click", function (e) {

        const button = e.target.closest("button");

        if (!button) return;

        const action = button.dataset.action;

        const productId = Number(button.dataset.id);

        const product = products.find(
            p => p.id === productId
        );

        const card = button.closest(".product-card");

        if (!product || !card) return;


        /* PACK SELECTION */

        if (action === "pack") {

            const grams = Number(button.dataset.grams);

            card.querySelectorAll(".pack-btn").forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            const price = getProductPrice(product, grams);

            card.querySelector(".price-value").textContent =
                price.toFixed(2).replace(/\.00$/, "");

            card.querySelector(".add-btn").dataset.grams = grams;

            updateProductQuantity(productId, grams);

        }


        /* ADD TO CART / INCREASE */

        if (action === "add" || action === "plus") {

            const grams = Number(
                card.querySelector(".add-btn").dataset.grams
            );

            const key = `${productId}_${grams}`;

            cart[key] = (Number(cart[key]) || 0) + 1;

            updateProductQuantity(productId, grams);

            saveCart();

        }


        /* DECREASE QUANTITY */

        if (action === "minus") {

            const grams = Number(
                card.querySelector(".add-btn").dataset.grams
            );

            const key = `${productId}_${grams}`;

            if (cart[key]) {

                cart[key]--;

                if (cart[key] <= 0) {

                    delete cart[key];

                }

            }

            updateProductQuantity(productId, grams);

            saveCart();

        }

    });

}


/* =====================================
   UPDATE PRODUCT QUANTITY
===================================== */

function updateProductQuantity(productId, grams) {

    const key = `${productId}_${grams}`;

    const quantity = Number(cart[key]) || 0;

    const card = [...document.querySelectorAll(".product-card")]
        .find(card => {

            const addButton = card.querySelector(".add-btn");

            return Number(addButton.dataset.id) === productId;

        });

    if (!card) return;

    const addButton = card.querySelector(".add-btn");

    const quantityControl = card.querySelector(
        ".quantity-control"
    );

    card.querySelector(".quantity-value").textContent = quantity;

    addButton.hidden = quantity > 0;

    quantityControl.hidden = quantity === 0;

}


/* =====================================
   SAVE CART AND UPDATE CART COUNT
===================================== */

function saveCart() {

    // Save cart data in LocalStorage

    localStorage.setItem(
        "sureshCartV2",
        JSON.stringify(cart)
    );


    // Calculate total quantity

    let totalQuantity = 0;

    Object.values(cart).forEach(quantity => {

        totalQuantity += Number(quantity) || 0;

    });


    // Update all cart count badges

    document.querySelectorAll(".cart-count").forEach(badge => {

        badge.textContent = totalQuantity;

    });

}


/* =====================================
   LOAD PRODUCTS AND CART
===================================== */

displayProducts();

saveCart();
