import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";
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
    const date = doc.last_updated.toDate().toLocaleDateString();
    // create a DOM element for the marker
    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url('/images/diamond.png')`;
    el.style.backgroundRepeat = "no-repeat";
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.backgroundSize = "contain";

    // create popup
    const popup = new maplibregl.Popup({ offset: 25, maxWidth: "428px" })
      .setHTML(`
          <div class="card-body">
            <h5 class="card-title">${doc.name}</h5>
            <ul class="d-flex gap-3 mb-1 p-0">              
              <li class="card-cuisine">${doc.category}</li>     
              <li class="text-muted">Added at ${date}</li>         
            </ul>
            <p class="card-text">${doc.description}</p>
            <ul class="d-flex p-0 justify-content-between w-100 list-unstyled">        
              <li>
                <a
                  href="#"
                  class="d-flex flex-column card-link text-decoration-none align-items-center"
                  ><img
                    src="public/images/reviews.svg"
                    alt="Reviews icon"
                    width="24"
                    height="24"
                  />Reviews</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="d-flex flex-column card-link text-decoration-none align-items-center"
                  ><img
                    src="public/images/map.svg"
                    alt="Map icon"
                    width="24"
                    height="24"
                  />Location</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="d-flex flex-column card-link text-decoration-none align-items-center"
                  ><img
                    src="public/images/favorite.svg"
                    alt="Heart icon"
                    width="24"
                    height="24"
                  />Favorite</a
                >
              </li>
              <li id="reviewBtn">
                <a
                  href="#"
                  id="writeReviewBtn"
                  class="d-flex flex-column card-link text-decoration-none align-items-center"
                  ><img
                    src="public/images/menu.svg"
                    alt="Edit icon"
                    width="24"
                    height="24"
                    id="writeReviewBtn"
                  />Edit Gem</a
                >
              </li>
            </ul>
          </div>
        `);

    // add marker to map w/ popup
    new maplibregl.Marker({ element: el })
      .setLngLat([doc.location.lng, doc.location.lat])
      .setPopup(popup)
      .addTo(map);

    // Creates a new id that calls the saveGemDocumentIDAndRedirect function
    document.addEventListener('click', (reviewBtn) => {
      const writeReviewBtn = document.getElementById('writeReviewBtn');
      if (reviewBtn.target.matches('#writeReviewBtn')) {
        writeReviewBtn.addEventListener('click', saveGemDocumentIDAndRedirect);
      }
    });

    function saveGemDocumentIDAndRedirect() {
      const gemID = doc.id

      if (!gemID) {
        console.warn("No gem ID detected.");
        return;
      } else {
        console.log("Gem ID acquired!")

        // Save the hike ID locally;  provide the key, and the value
        localStorage.setItem('gemDocID', gemID);

        // Redirect to the review page
        window.location.href = 'editGem.html';

      }
    }

  });
}

showMap();