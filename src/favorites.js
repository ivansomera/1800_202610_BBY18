import { db } from "./firebaseConfig.js";
import { collection, getDocs, deleteDoc, doc as firestoreDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {

  if (user) {
    loadFavorites(user.uid);
  } else {
    alert("Please login first");

  }
});

// Load favorites into table
async function loadFavorites(userId) {
  const tableBody = document.getElementById("favorites-body");
  tableBody.innerHTML = "";

  const gemsSnapshot = await getDocs(collection(db, "gems"));

  let index = 1;

  for (const gemDoc of gemsSnapshot.docs) {
    const favRef = firestoreDoc(db, "gems", gemDoc.id, "favorites", userId);
    const favSnap = await getDoc(favRef);

    if (favSnap.exists()) {
      const fav = favSnap.data();

      const row = document.createElement("tr");
      row.classList.add("table-warning");

      row.innerHTML = `
        <th scope="row">${index}</th>
        <td class="clickable" data-id="${fav.gemId}">${fav.name || "Restaurant"}</td>
        <td>${fav.cuisine || "$$"}</td>
        <td>${fav.spiceLevel || "N/A"}</td>
        <td>${fav.description || "-"}</td>
        <td>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${userId}" data-gem="${fav.gemId}">
            Delete
          </button>
        </td>
      `;

      tableBody.appendChild(row);
      index++;
    }
  }

  addClickEvents();
  addDeleteEvents();

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
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const userId = btn.dataset.user;
      const gemId = btn.dataset.gem;

      await deleteDoc(firestoreDoc(db, "gems", gemId, "favorites", userId));

      location.reload();
    });
  });
}