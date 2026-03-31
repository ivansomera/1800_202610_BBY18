import * as maplibregl from "maplibre-gl";
// ------------------------------------------------------------
// Global variable to store user location, hike data - good practice
// ------------------------------------------------------------
const appState = {
  hikes: [],
  userLngLat: null,
};

// ------------------------------------------------------------
// This top level function initializes the MapLibre map, adds controls
// It waits for the map to load before trying to add sources/layers.
// ------------------------------------------------------------
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

  // Once the map loads, we can add the user location and hike markers, etc.
  // We wait for the "load" event to ensure the map is fully initialized before we try to add sources/layers.
  map.once("load", async () => {
    // Choose either the built-in geolocate control or the manual pin method
    addGeolocationControl(map);
    await addUserPin(map);
    console.log("map loaded, placed user pin!");
  });

  function addControls(map) {
    // Zoom and rotation
    map.addControl(new maplibregl.NavigationControl(), "top-right");
  }

<<<<<<< HEAD
// Display gems from database
async function showGems(map) {
  const snapshot = await getGems();

  snapshot.forEach((doc) => {
    const date = doc.last_updated.toDate().toLocaleDateString();

    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url('/images/diamond.png')`;
    el.style.backgroundRepeat = "no-repeat";
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.backgroundSize = "contain";

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
                  class="review-link d-flex flex-column card-link text-decoration-none align-items-center"
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
                  id="reviewBtn"
                  class="d-flex flex-column card-link text-decoration-none align-items-center"
                  ><img
                    src="public/images/menu.svg"
                    alt="Edit icon"
                    width="24"
                    height="24"
                    id="reviewBtn"
                  />Edit Gem</a
                >
              </li>
            </ul>
          </div>
        `);

    
    popup.on("open", () => {
      const popupElement = popup.getElement();
      const reviewLink = popupElement.querySelector(".review-link");

      if (reviewLink) {
        reviewLink.addEventListener("click", (event) => {
          event.preventDefault();
          window.location.href = `reviews.html?restaurant=${encodeURIComponent(doc.name)}`;
        });
      }
    });

    new maplibregl.Marker({ element: el })
      .setLngLat([doc.location.lng, doc.location.lat])
      .setPopup(popup)
      .addTo(map);

    document.addEventListener('click', (reviewBtn) => {
      const writeReviewBtn = document.getElementById('reviewBtn');
      if (reviewBtn.target.matches('#reviewBtn')) {
        writeReviewBtn.addEventListener('click', saveGemDocumentIDAndRedirect);
      }
=======
  function addGeolocationControl(map) {
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
>>>>>>> parent of 1ded9a3 (resolved conflicts using main version)
    });
    map.addControl(geolocate, "top-right");

<<<<<<< HEAD
    function saveGemDocumentIDAndRedirect() {
      const gemID = doc.id

      if (!gemID) {
        console.warn("No gem ID detected.");
        return;
      } else {
        console.log("Gem ID acquired!")
        localStorage.setItem('gemDocID', gemID);
        window.location.href = 'editGem.html';
      }
=======
    // Optional: trigger a locate once the control is added
    geolocate.on("trackuserlocationstart", () => {
      // You can react to tracking start here if needed
    });
  }
  // ------------------------------------------------------------
  // This function manually gets the user's geolocation and adds a custom pin to the map.
  // It also adds a click event to show a popup with "You are here".
  // -------------------------------------------------------------
  async function addUserPin(map) {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not available in this browser");
      return;
>>>>>>> parent of 1ded9a3 (resolved conflicts using main version)
    }

    // Use the safe geolocation function that returns a Promise
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Store user location in global variable for later use (e.g., zooming to all points)
        appState.userLngLat = [pos.coords.longitude, pos.coords.latitude];

        // Add a GeoJSON source
        map.addSource("userLngLat", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: { type: "Point", coordinates: appState.userLngLat },
                properties: { description: "Your location" },
              },
            ],
          },
        });

        // Add a simple circle layer
        map.addLayer({
          id: "userLngLat",
          type: "circle",
          source: "userLngLat",
          paint: {
            "circle-color": "#1E90FF",
            "circle-radius": 6,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Optional: add a tooltip on hover or click
        map.on("click", "userLngLat", (e) => {
          const [lng, lat] = e.features[0].geometry.coordinates;
          new maplibregl.Popup()
            .setLngLat([lng, lat])
            .setHTML("You are here")
            .addTo(map);
        });
      },
      (err) => {
        console.error("Geolocation error", err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }
}

showMap();
