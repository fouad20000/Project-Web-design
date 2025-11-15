// ===== ITEMS =====
const items = [
  { id: "blink_dagger", name: "Blink Dagger", image: "images\Blink Dagger.png", category: "Mobility", type: "Mobility", description: "Short-distance teleport for instant positioning.", price: 2250, action: "buy", stock: 5 },
  { id: "bkb", name: "Black King Bar", image: "images\BlackKingbar.png", category: "Strength", type: "Core / Defensive", description: "Spell immunity for initiating and team fights.", price: 4050, action: "sell", stock: 3 },
  { id: "shadow_blade", name: "Shadow Blade", image: "images\Shadowblade.png", category: "Agility", type: "Initiation / Damage", description: "Temporary invisibility and bonus damage on hit.", price: 3000, action: "sell", stock: 4 },
  { id: "force_staff", name: "Force Staff", image: "images\Forcestaff.png", category: "Mobility", type: "Support / Mobility", description: "Push units in the direction they are facing.", price: 2200, action: "buy", stock: 6 },
  { id: "mekansm", name: "Mekansm", image: "images\Mekanesm.png", category: "Intelligence", type: "Support", description: "Team heal and armor aura.", price: 1775, action: "sell", stock: 5 },
  { id: "ac", name: "Assault Cuirass", image: "images\Assault.png", category: "Strength", type: "Armor / Attack Speed", description: "Armor aura and attack speed for your team.", price: 5125, action: "buy", stock: 2 },
  { id: "aghanims", name: "Aghanim's Scepter", image: "images\aghs.png", category: "Intelligence", type: "Core / Upgrade", description: "Upgrades your ultimate or grants a new ability.", price: 4200, action: "sell", stock: 4 },
  { id: "glimmer_cape", name: "Glimmer Cape", image: "images\Glimmercape.png", category: "Intelligence", type: "Support / Utility", description: "Invisibility and magic resistance buff.", price: 1950, action: "buy", stock: 7 },
  { id: "heart", name: "Heart of Tarrasque", image: "images\heart.png", category: "Strength", type: "Tank / Core", description: "Huge HP and regen for frontliners.", price: 5200, action: "sell", stock: 1 },
  { id: "mkb", name: "Monkey King Bar", image: "images\MonkeyKingBar.png", category: "Agility", type: "Damage", description: "True strike and bonus damage versus evasive heroes.", price: 4975, action: "buy", stock: 3 },
  { id: "linkens", name: "Linken's Sphere", image: "images\Linken.png", category: "Intelligence", type: "Defensive", description: "Blocks single-target spells.", price: 4600, action: "sell", stock: 2 },
  { id: "guardian_greaves", name: "Guardian Greaves", image: "images\Gaurd.png", category: "Intelligence", type: "Support / Aura", description: "Strong team heal + dispel.", price: 4950, action: "buy", stock: 3 }
];

// ===== STATE =====
const backpack = {};
const inventory = {};
let walletGold = 20000;

// ===== DOM =====
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const transactionFilter = document.getElementById("transactionFilter");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const itemsBody = document.getElementById("itemsBody");
const resultsCount = document.getElementById("resultsCount");
const backpackBody = document.getElementById("backpackBody");
const backpackCount = document.getElementById("backpackCount");
const backpackTotal = document.getElementById("backpackTotal");
const clearBackpackBtn = document.getElementById("clearBackpack");
const buyAllButton = document.getElementById("buyAllButton");
const moveAllButton = document.getElementById("moveAllButton");
const walletGoldEl = document.getElementById("walletGold");

// ===== RENDER WALLET =====
function renderWallet() {
  walletGoldEl.textContent = walletGold.toLocaleString();
}

// ===== RENDER ITEMS =====
function renderItems(list) {
  if (!list.length) {
    itemsBody.innerHTML = `<tr><td colspan="7" class="no-results">No items match your search.</td></tr>`;
    resultsCount.textContent = "0 items found";
    return;
  }

  itemsBody.innerHTML = list.map(item => `
    <tr>
      <td>
        <div class="item-cell">
          <img src="images/${item.image}" class="item-icon" alt="${item.name}">
          <span class="item-name">${item.name}</span>
        </div>
      </td>
      <td class="item-type">${item.type}</td>
      <td>${item.description}</td>
      <td><span class="item-category">${item.category}</span></td>
      <td>
        <span class="item-price"><span class="gold-icon">🪙</span>${item.price}</span>
      </td>
      <td>
        <span class="stock-badge ${item.stock === 0 ? "stock-empty" : ""}">
          ${item.stock > 0 ? item.stock + " in stock" : "Out of stock"}
        </span>
      </td>
      <td>
        <button class="buy-button" data-id="${item.id}" ${item.stock === 0 ? "disabled" : ""}>
          Add
        </button>
      </td>
    </tr>
  `).join("");

  resultsCount.textContent = `${list.length} items found`;
}

// ===== RENDER BACKPACK =====
function renderBackpack() {
  const entries = Object.entries(backpack).filter(([_, qty]) => qty > 0);

  if (!entries.length) {
    backpackBody.innerHTML = `<p class="backpack-empty">Backpack is empty.</p>`;
    backpackCount.textContent = "0";
    backpackTotal.textContent = "0";
    return;
  }

  let totalItems = 0;
  let totalGold = 0;

  backpackBody.innerHTML = entries.map(([id, qty]) => {
    const item = items.find(i => i.id === id);
    if (!item) return "";
    totalItems += qty;
    const value = item.price * qty;
    totalGold += value;

    return `
      <div class="backpack-item">
        <div class="backpack-item-main">
          <img src="images/${item.image}" class="item-icon" alt="${item.name}">
          <div>
            <div class="backpack-item-name">${item.name}</div>
            <div class="backpack-item-qty">x${qty}</div>
          </div>
        </div>
        <div class="item-price"><span class="gold-icon">🪙</span>${value}</div>
      </div>
    `;
  }).join("");

  backpackCount.textContent = totalItems;
  backpackTotal.textContent = totalGold;
}

// ===== RENDER INVENTORY =====
function renderInventory() {
  const entries = Object.entries(inventory).filter(([, qty]) => qty > 0);
  const inventoryBody = document.getElementById("inventoryBody");
  const inventoryCount = document.getElementById("inventoryCount");

  if (!entries.length) {
    inventoryBody.innerHTML = `<p class="inventory-empty">No items in inventory.</p>`;
    inventoryCount.textContent = "0";
    return;
  }

  let total = 0;
  const html = entries.map(([id, qty]) => {
    const item = items.find(i => i.id === id);
    if (!item) return "";
    total += qty;

    return `
      <div class="inventory-item">
        <div class="inventory-item-main">
          <img src="images/${item.image}" class="item-icon" alt="${item.name}">
          <div>
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-qty">x${qty}</div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  inventoryBody.innerHTML = html;
  inventoryCount.textContent = total;
}

// ===== FILTER & SORT =====
function filterAndRender() {
  const q = searchInput.value.toLowerCase();
  const mode = transactionFilter.value;
  const cat = categoryFilter.value;
  const sortBy = sortSelect.value;

  let filtered = items
    .filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    )
    .filter(item => mode === "all" || item.action === mode)
    .filter(item => cat === "all" || item.category === cat);

  filtered.sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  renderItems(filtered);
}

// ===== EVENTS =====

// single item Add
itemsBody.addEventListener("click", e => {
  const btn = e.target.closest(".buy-button");
  if (!btn) return;

  const id = btn.dataset.id;
  const item = items.find(i => i.id === id);
  if (!item || item.stock <= 0) return;

  item.stock--;
  backpack[id] = (backpack[id] || 0) + 1;

  filterAndRender();
  renderBackpack();
});

// clear backpack (returns stock)
clearBackpackBtn.addEventListener("click", () => {
  Object.entries(backpack).forEach(([id, qty]) => {
    const item = items.find(i => i.id === id);
    if (item) item.stock += qty;
  });

  Object.keys(backpack).forEach(id => { backpack[id] = 0; });

  filterAndRender();
  renderBackpack();
});

// search / filters
searchButton.addEventListener("click", filterAndRender);
searchInput.addEventListener("input", filterAndRender);
transactionFilter.addEventListener("change", filterAndRender);
categoryFilter.addEventListener("change", filterAndRender);
sortSelect.addEventListener("change", filterAndRender);

// buy all visible SELLING items
buyAllButton.addEventListener("click", () => {
  const query = searchInput.value.trim().toLowerCase();
  const mode = transactionFilter.value;
  const category = categoryFilter.value;

  let filtered = items.filter(item => {
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    const matchesMode = mode === "all" ? true : item.action === mode;
    const matchesCat = category === "all" ? true : item.category === category;

    return matchesSearch && matchesMode && matchesCat;
  });

  const purchasable = filtered.filter(i => i.action === "sell" && i.stock > 0);
  if (!purchasable.length) return;

  let totalCost = 0;
  purchasable.forEach(item => {
    totalCost += item.price * item.stock;
  });

  if (walletGold < totalCost) {
    alert("Not enough gold to purchase all items.");
    return;
  }

  walletGold -= totalCost;

  purchasable.forEach(item => {
    if (!backpack[item.id]) backpack[item.id] = 0;
    backpack[item.id] += item.stock;
    item.stock = 0;
  });

  renderWallet();
  renderBackpack();
  filterAndRender();
});

// move all from backpack to inventory
moveAllButton.addEventListener("click", () => {
  const entries = Object.entries(backpack);

  if (!entries.length) {
    alert("Backpack is empty.");
    return;
  }

  entries.forEach(([id, qty]) => {
    if (qty <= 0) return;
    if (!inventory[id]) inventory[id] = 0;
    inventory[id] += qty;
    backpack[id] = 0;
  });

  renderBackpack();
  renderInventory();
});

// ===== INITIAL RENDER =====
filterAndRender();
renderBackpack();
renderInventory();
renderWallet();
