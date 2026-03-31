import { db } from "./firebaseConfig.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// Load favorites into table
function loadFavorites() {
  const tableBody = document.getElementById("favorites-body");
  const favoritesRef = collection(db, "favorites");

  tableBody.innerHTML = "";

  getDocs(favoritesRef).then((querySnapshot) => {
    let index = 1;

    querySnapshot.forEach((favoriteDoc) => {
      const fav = favoriteDoc.data();

      const row = document.createElement("tr");
      row.classList.add("table-warning");

      row.innerHTML = `
        <th scope="row">${index}</th>
        <td class="clickable" data-id="${favoriteDoc.id}">${fav.name || "Restaurant"}</td>
        <td>${fav.cost || "$$"}</td>
        <td>${fav.rating || "N/A"}</td>
        <td>${fav.distance || "-"}</td>
        <td>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${favoriteDoc.id}">
            Delete
          </button>
        </td>
      `;

      tableBody.appendChild(row);
      index++;
    });

    addClickEvents();
    addDeleteEvents();
  });
}

// Click row → go to details page
function addClickEvents() {
  const clickable = document.querySelectorAll(".clickable");

  clickable.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;
      window.location.href = `/details.html?id=${id}`;
    });
  });
}

// Delete favorite
function addDeleteEvents() {
  const buttons = document.querySelectorAll(".delete-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      deleteFavorite(id);
    });
  });
}

function deleteFavorite(id) {
  deleteDoc(doc(db, "favorites", id)).then(() => {
    loadFavorites();
  });
}

// Load when page opens
loadFavorites();