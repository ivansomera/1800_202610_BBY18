import { db } from "./firebaseConfig.js";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { documentId } from "firebase/firestore/lite";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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

  // Add controls (zoom, rotation, etc.) shown in top-right corner of map
  addControls(map);

  map.once("load", async () => {
    showGems(map);
  });

  function addControls(map) {
    // Zoom and rotation
    map.addControl(new maplibregl.NavigationControl(), "top-right");
  }
}

// Display gems from database
async function showGems(map) {
  const snapshot = await getGems();

  snapshot.forEach((doc) => {
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
                    class="card-icons"
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

    popup.on("open", () => {
      const popupElement = popup.getElement();
      const reviewLink = popupElement.querySelector(".review-link");
      const editPost = popupElement.querySelector(".edit-Btn");

      if (reviewLink) {
        reviewLink.addEventListener("click", (event) => {
          event.preventDefault();
          window.location.href = `reviews.html?restaurant=${encodeURIComponent(doc.name)}`;
        });
      }
      // FAVORITE BUTTON
      const favoriteBtn = popupElement.querySelector(".favorite-btn");

      if (favoriteBtn) {
        favoriteBtn.addEventListener("click", async (event) => {
          event.preventDefault();
          await addToFavorites(doc);
        });
      }
    });

    new maplibregl.Marker({ element: el })
      .setLngLat([doc.location.lng, doc.location.lat])
      .setPopup(popup)
      .addTo(map);

    // document.addEventListener('click', (reviewBtn) => {
    //   const writeReviewBtn = document.getElementById('reviewBtn');
    //   if (reviewBtn.target.matches('#reviewBtn')) {
    //     writeReviewBtn.addEventListener('click', saveGemDocumentIDAndRedirect);
    //   }
    // });

    // function saveGemDocumentIDAndRedirect() {
    //   const gemID = encodeURIComponent(doc.name)

    //   if (!gemID) {
    //     console.warn("No gem ID detected.");
    //     return;
    //   } else {
    //     console.log("Gem ID acquired!")
    //     window.location.href = `editGem.html?restaurant=${encodeURIComponent(doc.name)}`;
    //   }
    // }
  });
}

showMap();

async function addToFavorites(doc) {
  try {
    await addDoc(collection(db, "favorites"), {
      gemId: doc.id,
      name: doc.name,
      category: doc.category,
      description: doc.description,
      rating: doc.rating || "N/A",
      distance: "-",
      cost: "$$",
    });

    alert("Added to favorites!");
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
}
