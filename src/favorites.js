import { db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc as firestoreDoc,
  getDoc,
} from "firebase/firestore";
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
  const list = document.getElementById("favorites-body");
  list.innerHTML = "";

  const gemsSnapshot = await getDocs(collection(db, "gems"));

  const promises =  gemsSnapshot.docs.map(async (gemDoc) => {
    const favRef = firestoreDoc(db, "gems", gemDoc.id, "favorites", userId);
    const favSnap = await getDoc(favRef);

    if (favSnap.exists()) {
      const fav = favSnap.data();

      const item = document.createElement("li");
      item.className =
        "list-group-item rounded d-flex justify-content-between align-items-start";
      item.innerHTML = `
        <div class="clickable flex-grow-1" data-id="${fav.gemId}">
          <h6 class="mb-1 fw-bold ">${fav.name}</h6>
          <span class="badge me-1" style="background-color: var(--secondary);">${fav.cuisine}</span>
          <span class="badge" style="background-color: var(--light-text);">Spice: ${fav.spiceLevel}</span>
          <p class="text-muted small mt-2 mb-0">${fav.description}</p>
        </div>
        <button class="btn btn-sm btn-outline-danger ms-3 delete-btn" data-id="${userId}" data-gem="${fav.gemId}">
          Delete
        </button>
      `;
      list.appendChild(item);
    }
  });

  await Promise.all(promises);

  addClickEvents();
  addDeleteEvents();
}


// Click row → go to details page
function addClickEvents() {
  const clickable = document.querySelectorAll(".clickable");

  clickable.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;

      //go to map with gemId
      window.location.href = `/main.html?gemId=${id}`;
    });
  });
}

// Delete favorite
function addDeleteEvents() {
  const buttons = document.querySelectorAll(".delete-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const userId = btn.dataset.id;
      const gemId = btn.dataset.gem;

      await deleteDoc(firestoreDoc(db, "gems", gemId, "favorites", userId));
      btn.closest("li").remove();
    });
  });
}
