// @ts-nocheck
"use strict";

let cart = [];

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

function renderProducts(products = STORE_CONFIG.products) {
  productList.innerHTML = "";

  if (!products.length) {
    productList.textContent = "Produk tidak ditemukan.";
    return;
  }

  products.forEach(function(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const image = document.createElement("div");
    image.className = "product-image";
    image.textContent = product.icon;

    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.className = "add-btn";
    button.textContent = "＋ Tambah ke Keranjang";

    button.addEventListener("click", function() {
      addToCart(product.id);
    });

    info.append(name, description, price, button);
    card.append(image, info);
    productList.appendChild(card);
  });
}

function addToCart(id) {
  const product = STORE_CONFIG.products.find(function(item) {
    return item.id === id;
  });

  if (!product) return;

  const existing = cart.find(function(item) {
    return item.id === id;
  });

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let quantity = 0;

  if (cart.length === 0) {
    cartItems.textContent = "Keranjang masih kosong.";
  }

  cart.forEach(function(item) {
    total += item.price * item.quantity;
    quantity += item.quantity;

    const row = document.createElement("div");
    row.textContent =
      item.name + " × " + item.quantity +
      " = " + formatPrice(item.price * item.quantity);

    cartItems.appendChild(row);
  });

  cartCount.textContent = quantity;
  cartTotal.textContent = "Total: " + formatPrice(total);
}

function toggleCart() {
  cartOverlay.classList.toggle("active");
}

function checkout() {
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  const phone = STORE_CONFIG.whatsapp.replace(/\D/g, "");

  if (!/^62\d{8,13}$/.test(phone)) {
    alert("Nomor WhatsApp toko belum benar.");
    return;
  }

  let message = "Halo " + STORE_CONFIG.name +
    ", saya ingin memesan:\n\n";

  cart.forEach(function(item) {
    message += item.name + " x" + item.quantity + "\n";
    message += formatPrice(item.price * item.quantity) + "\n\n";
  });

  const total = cart.reduce(function(sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  message += "Total: " + formatPrice(total);

  const url = "https://wa.me/" + 6285719046064 +
    "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
}

// Event listener
document.getElementById("cart-open")
  ?.addEventListener("click", toggleCart);

document.getElementById("cart-close")
  ?.addEventListener("click", toggleCart);

document.getElementById("checkout-button")
  ?.addEventListener("click", checkout);

searchInput.addEventListener("input", function() {
  const keyword = searchInput.value.toLowerCase();

  const filtered = STORE_CONFIG.products.filter(function(product) {
    return product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword);
  });

  renderProducts(filtered);
});

renderProducts();
updateCart();
