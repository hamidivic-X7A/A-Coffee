
const products = [
  { id: 1, name: "Espresso", category: "coffee", price: 18000, desc: "Kuchli va xushbo'y klassik qahva.", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e76?auto=format&fit=crop&w=700&q=80" },
  { id: 2, name: "Cappuccino", category: "coffee", price: 26000, desc: "Espresso va mayin sut ko'pigi.", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=700&q=80" },
  { id: 3, name: "Caffe Latte", category: "coffee", price: 28000, desc: "Sutli va yumshoq ta'mli qahva.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80" },
  { id: 4, name: "Caramel Macchiato", category: "coffee", price: 32000, desc: "Karamel va espresso uyg'unligi.", image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=700&q=80" },
  { id: 5, name: "Mocha", category: "coffee", price: 30000, desc: "Shokolad va qahva birgalikda.", image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=700&q=80" },
  { id: 6, name: "Iced Coffee", category: "cold", price: 25000, desc: "Muzdek va tetiklantiruvchi qahva.", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80" },
  { id: 7, name: "Iced Latte", category: "cold", price: 29000, desc: "Sut, espresso va muz.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80" },
  { id: 8, name: "Berry Lemonade", category: "cold", price: 22000, desc: "Mevali va tetiklantiruvchi ichimlik.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=700&q=80" },
  { id: 9, name: "Cheesecake", category: "dessert", price: 32000, desc: "Mayin kremli pishloqli tort.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80" },
  { id: 10, name: "Chocolate Cake", category: "dessert", price: 28000, desc: "Mazali va yumshoq shokoladli tort.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80" },
  { id: 11, name: "Croissant", category: "food", price: 16000, desc: "Qarsildoq va yumshoq kruassan.", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80" },
  { id: 12, name: "Club Sandwich", category: "food", price: 38000, desc: "Yengil tushlik uchun mazali sendvich.", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80" }
];

const $ = selector => document.querySelector(selector);
const money = value => new Intl.NumberFormat("uz-UZ").format(value) + " so'm";

let category = "all";
let query = "";
const cart = new Map();

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("show"), 2500);
}

function renderMenu() {
  const filtered = products.filter(product => {
    const categoryMatch = category === "all" || product.category === category;
    const searchMatch = (product.name + " " + product.desc)
      .toLocaleLowerCase("uz-UZ")
      .includes(query.toLocaleLowerCase("uz-UZ"));

    return categoryMatch && searchMatch;
  });

  $("#menu-list").innerHTML = filtered.map(product => `
    <article class="menu-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="menu-card-body">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="menu-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}" aria-label="${product.name} qo'shish">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </article>
  `).join("");

  $("#empty-message").hidden = filtered.length !== 0;
}

$("#filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  category = button.dataset.category;

  document.querySelectorAll(".filter").forEach(item => {
    item.classList.toggle("active", item === button);
  });

  renderMenu();
});

$("#search").addEventListener("input", event => {
  query = event.target.value.trim();
  renderMenu();
});

$("#menu-list").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);
  const product = products.find(item => item.id === id);
  if (!product) return;

  const item = cart.get(id);

  if (item) {
    item.quantity++;
  } else {
    cart.set(id, { product, quantity: 1 });
  }

  renderCart();
  toast(product.name + " savatchaga qo'shildi!");
});

function cartCount() {
  return [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
}

function cartTotal() {
  return [...cart.values()].reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );
}

function renderCart() {
  const count = cartCount();

  $("#cart-count").textContent = count;
  $("#drawer-count").textContent = count;
  $("#total").textContent = money(cartTotal());

  if (cart.size === 0) {
    $("#cart-items").innerHTML =
      '<div class="empty-cart">🛒<br>Savatcha bo\'sh.<br>Menyudan mahsulot tanlang.</div>';
  } else {
    $("#cart-items").innerHTML = [...cart.values()].map(({ product, quantity }) => `
      <div class="cart-row">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h4>${product.name}</h4>
          <p>${money(product.price * quantity)}</p>
          <div class="quantity">
            <button data-change="-1" data-id="${product.id}" aria-label="Kamaytirish">−</button>
            <span>${quantity}</span>
            <button data-change="1" data-id="${product.id}" aria-label="Oshirish">+</button>
          </div>
        </div>
        <button class="remove" data-remove="${product.id}" aria-label="O'chirish">✕</button>
      </div>
    `).join("");
  }

  $("#checkout").disabled = count === 0;
}

$("#cart-items").addEventListener("click", event => {
  const change = event.target.closest("[data-change]");
  const remove = event.target.closest("[data-remove]");

  if (change) {
    const id = Number(change.dataset.id);
    const item = cart.get(id);
    if (!item) return;

    item.quantity += Number(change.dataset.change);
    if (item.quantity <= 0) cart.delete(id);
    renderCart();
  }

  if (remove) {
    cart.delete(Number(remove.dataset.remove));
    renderCart();
    toast("Mahsulot olib tashlandi.");
  }
});

const drawer = $("#cart-drawer");
const overlay = $("#overlay");

function openCart() {
  drawer.classList.add("open");
  overlay.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  drawer.classList.remove("open");
  overlay.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

$("#open-cart").addEventListener("click", openCart);
$("#close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

const navMenu = $("#nav-menu");
const menuButton = $("#menu-open");

function toggleMenu(force) {
  const open = typeof force === "boolean"
    ? force
    : !navMenu.classList.contains("open");

  navMenu.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.innerHTML = open
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
}

menuButton.addEventListener("click", () => toggleMenu());

navMenu.addEventListener("click", event => {
  if (event.target.closest("a")) toggleMenu(false);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    toggleMenu(false);
  }
});

$("#checkout").addEventListener("click", () => {
  if (!cart.size) {
    toast("Savatchaga mahsulot qo'shing.");
    return;
  }

  const name = $("#customer-name").value.trim();
  const phone = $("#customer-phone").value.trim();
  const address = $("#customer-address").value.trim();

  if (!name || !phone) {
    toast("Ism va telefon raqamingizni kiriting.");
    return;
  }

  const lines = [...cart.values()].map(({ product, quantity }) =>
    `${product.name} x ${quantity} — ${money(product.price * quantity)}`
  );

  const message = [
    "☕ COFFEE HOUSE — BUYURTMA",
    "",
    `Ism: ${name}`,
    `Telefon: ${phone}`,
    `Manzil: ${address || "Kelishiladi"}`,
    "",
    ...lines,
    "",
    `JAMI: ${money(cartTotal())}`
  ].join("\n");

  const url = "https://t.me/share/url?url=" +
    encodeURIComponent("https://t.me/") +
    "&text=" + encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
});

$("#contact-form").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("#contact-name").value.trim();
  const email = $("#contact-email").value.trim();
  const message = $("#contact-message").value.trim();

  if (!name || !email || !message) {
    toast("Barcha maydonlarni to'ldiring.");
    return;
  }

  const subject = encodeURIComponent("Coffee House saytidan xabar");
  const body = encodeURIComponent(
    `Ism: ${name}\nEmail: ${email}\n\n${message}`
  );

  // Bu manzilni o'zingizning haqiqiy emailingizga almashtiring.
  window.location.href =
    `mailto:info@coffeehouse.uz?subject=${subject}&body=${body}`;
});

document.querySelector("#year").textContent = new Date().getFullYear();

renderMenu();
renderCart(); 