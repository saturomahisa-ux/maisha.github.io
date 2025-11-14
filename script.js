// 🌟 Lost & Found Portal – Premium Dark Luxe Script
let items = JSON.parse(localStorage.getItem("lostFoundItems")) || [];
const itemsContainer = document.getElementById("itemsContainer");
const addModal = document.getElementById("addModal");
const addBtn = document.getElementById("addItemBtn");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("itemForm");
const searchBox = document.getElementById("searchBox");
const imageInput = document.getElementById("itemImage");
const imagePreview = document.getElementById("imagePreview");

// 🌙 DARK / LIGHT MODE TOGGLE
const toggleTheme = document.getElementById("themeToggle");
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    toggleTheme.innerHTML = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    toggleTheme.innerHTML = "🌙";
    localStorage.setItem("theme", "light");
  }
});

// Keep theme after refresh
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleTheme.innerHTML = "☀️";
}

// 🖼️ Image Preview
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// ➕ Floating Add Button opens modal
addBtn.addEventListener("click", () => {
  addModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  addModal.style.display = "none";
  form.reset();
  imagePreview.style.display = "none";
});

// 📝 Submit Form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newItem = {
    name: form.itemName.value.trim(),
    description: form.itemDescription.value.trim(),
    status: form.itemStatus.value,
    image: imagePreview.src || "https://via.placeholder.com/200x150?text=No+Image",
  };

  if (!newItem.name || !newItem.description) {
    alert("Please fill out all fields!");
    return;
  }

  items.push(newItem);
  localStorage.setItem("lostFoundItems", JSON.stringify(items));
  displayItems();
  addModal.style.display = "none";
  form.reset();
  imagePreview.style.display = "none";
});

// 🔍 Search Functionality
searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase();
  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
  );
  displayItems(filtered);
});

// 🗑️ Delete Item
function deleteItem(index) {
  const card = document.querySelectorAll(".card")[index];
  card.classList.add("fade-out");
  setTimeout(() => {
    items.splice(index, 1);
    localStorage.setItem("lostFoundItems", JSON.stringify(items));
    displayItems();
  }, 400);
}

// 🃏 Display Items
function displayItems(list = items) {
  itemsContainer.innerHTML = "";

  if (list.length === 0) {
    itemsContainer.innerHTML = "<p class='empty'>No items found yet...</p>";
    return;
  }

  list.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <span class="delete-icon" onclick="deleteItem(${index})">✖</span>
      <div class="card-inner">
        <div class="card-front">
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <span class="status ${item.status}">${item.status}</span>
        </div>
        <div class="card-back">
          <p>${item.description}</p>
        </div>
      </div>
    `;

    itemsContainer.appendChild(card);
  });
}

displayItems();
