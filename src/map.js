import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Get gems from Firestore
async function getGems() {
  const snapshot = await getDocs(collection(db, "gems"));

  return snapshot.docs.map((doc) => doc.data());
}

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
    // create a DOM element for the marker
    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url('/images/diamond.png')`;
    el.style.backgroundRepeat = "no-repeat";
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.backgroundSize = "contain";

    // add marker to map
    new maplibregl.Marker({ element: el })
      .setLngLat([doc.lng, doc.lat])
      .addTo(map);

    // add a popup
    map.on("click", () => {
      let description = "";

      description += ` 
          <div class="card-body">
            <h5 class="card-title">${doc.name}</h5>
            <ul class="d-flex gap-3 p-0">
              <li class="card-location">${doc.location}</li>
              <li class="card-cuisine">${doc.cuisine}</li>
              <li class="card-cost">${doc.cost}</li>
            </ul>
            <ul class="d-flex p-0 gap-3 list-unstyled">
              <li>
                <a
                  href="#"
                  class="d-flex flex-column card-link text-decoration-none align-items-center"
                  ><img
                    src="public/images/menu.svg"
                    alt="Menu icon"
                    width="24"
                    height="24"
                  />Menu</a
                >
              </li>
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
            </ul>
          </div>
        `;

      new maplibregl.Popup()
        .setLngLat([doc.lng, doc.lat])
        .setHTML(description)
        .addTo(map);
    });
  });
}

showMap();
