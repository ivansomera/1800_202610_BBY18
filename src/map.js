import { db } from "./firebaseConfig.js";
import { collection, getDocs, deleteDoc, query, where, doc as firestoreDoc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { documentId } from "firebase/firestore/lite";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const auth = getAuth();

// Get gems from Firestore
async function getGems() {
  const snapshot = await getDocs(collection(db, "gems"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

console.log("URL:", window.location.search);

const appState = {
  gems: [],
  userLngLat: null,
};

let markers = [];

function showMap() {
  // Initialize MapLibre
  // Centered at BCIT
  const map = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
    center: [-123.00163752324765, 49.25324576104826],
    zoom: 10,
    attributionControl: false,
  });

  map.once("load", async () => {
    showGems(map);
  });
}

// Display gems from database
async function showGems(map) {
  const snapshot = await getGems();
  appState.gems = snapshot;
  renderMarkers(map, appState.gems);

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");

      const selected = e.target.dataset.cuisine;
      const filtered =
        selected === "all"
          ? appState.gems
          : appState.gems.filter((doc) => doc.cuisine === selected);
      renderMarkers(map, filtered);
    });
  });
}

function renderMarkers(map, gems) {
  markers.forEach((m) => m.remove());
  markers = [];

  gems.forEach((doc) => {
    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url('/images/gem.svg')`;
    el.style.backgroundRepeat = "no-repeat";
    el.style.filter =
      "invert(52%) sepia(80%) saturate(600%) hue-rotate(330deg)";
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.backgroundSize = "contain";

    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div class="card-body">            
            <h5 class="card-title">${doc.name}</h5>        
            <ul class="d-flex gap-3 mb-0 p-0 justify-content-between">              
              <li class="card-cuisine"><p class="mb-0 card-subheading">${doc.cuisine}</p></li> 
              ${doc.spiceLevel ? `<li class="mb-0 card-subheading">Spice Level: ${doc.spiceLevel}</li>` : ""}                              
            </ul>
            <ul class="d-flex mb-1 p-0 flex-column">              
                <li class="mb-0">${doc.dateFrom} – ${doc.dateTo}</li>              
                ${doc.openTime ? `<li class="mb-0">${doc.openTime} – ${doc.closeTime}</li>` : ""}              
            </ul>
            <p class="card-text">${doc.description}</p>
            <ul class="d-flex p-0 gap-3 w-100 justify-content-center list-unstyled mb-0">        
              <li>
                <a
                  href="#"
                  class="review-link d-flex flex-column card-link text-decoration-none align-items-center"
                  ><img
                    src="public/images/reviews.svg"
                    alt="Reviews icon"
                    width="24"
                    height="24"
                    class="card-icons"
                  />Reviews</a
                >
              </li>             
              <li>
                <a
                  href="#"
                  class="favorite-btn d-flex flex-column card-link text-decoration-none align-items-center"
                  ><img
                    src="public/images/favorite.svg"
                    alt="Heart icon"
                    width="24"
                    height="24"
                    class="card-icons favorite-icon"
                  />Favorite</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="edit-Btn d-flex flex-column card-link text-decoration-none align-items-center"
                  ><img
                    src="public/images/edit.svg"
                    alt="Edit icon"
                    width="24"
                    height="24"
                    class="card-icons"
                  />Edit Gem</a
                >
              </li>
            </ul>
          </div>
        `);

    popup.on("open", async () => {
      const popupElement = popup.getElement();
      const reviewLink = popupElement.querySelector(".review-link");

      if (reviewLink) {
        reviewLink.addEventListener("click", (event) => {
          event.preventDefault();
          window.location.href = `reviews.html?restaurant=${encodeURIComponent(doc.name)}`;
        });
      }
      // FAVORITE BUTTON
      const favoriteBtn = popupElement.querySelector(".favorite-btn");
      const icon = favoriteBtn.querySelector("img");

      const userId = auth.currentUser?.uid;

      if (!userId) {
        alert("User not logged in");
        return;
      }
      const favDocRef = firestoreDoc(db, "gems", doc.id, "favorites", userId);
      const favSnap = await getDoc(favDocRef);

      if (favSnap.exists()) {
        icon.src = "/images/favorite-filled.png";

      } else {
        icon.src = "/images/favorite.svg";
      }

      favoriteBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        await toggleFavorite(doc, icon);
      });
    });

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([doc.location.lng, doc.location.lat])
      .setPopup(popup)
      .addTo(map);

    markers.push(marker);
  });
}

async function toggleFavorite(gem, icon) {

  const userId = auth.currentUser?.uid;

  if (!userId) {
    alert("User not logged in");
    return;
  }

  const favDocRef = firestoreDoc(db, "gems", gem.id, "favorites", userId);

  //check if gem already exists
  const favSnap = await getDoc(favDocRef);

  //If alraedy Favorite - remove it
  if (favSnap.exists()) {

    await deleteDoc(favDocRef);

    icon.src = "public/images/favorite.svg";
    alert("Removed from favorites");
  }

  else {

    //If Not Favorite -> Add
    await setDoc(favDocRef, {
      userId: userId,
      gemId: gem.id,
      name: gem.name,
      cuisine: gem.cuisine || "Not specified",
      spiceLevel: gem.spiceLevel || "Not specified",
      description: gem.description || "",
    });

    icon.src = "public/images/favorite-filled.png";
    alert("Added to favorites!");

  }
}

showMap();
