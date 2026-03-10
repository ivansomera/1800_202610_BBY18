import * as maplibregl from "maplibre-gl";
// ------------------------------------------------------------
// Global variable to store user location, hike data - good practice
// ------------------------------------------------------------

// Placeholder -----

const gems = {
  type: "HiddenGems",
  features: [
    {
      type: "Gem",
      properties: {
        restaurantName: "Haidilao",
        iconSize: [40, 40],
      },
      geometry: {
        type: "Point",
        coordinates: [-123.0010676417778, 49.26759839133271],
      },
    },
    {
      type: "Gem",
      properties: {
        restaurantName: "Chipotle",
        iconSize: [40, 40],
      },
      geometry: {
        type: "Point",
        coordinates: [-123.00199116377546, 49.22614960451131],
      },
    },
    {
      type: "Gem",
      properties: {
        restaurantName: "Breka",
        iconSize: [40, 40],
      },
      geometry: {
        type: "Point",
        coordinates: [-123.1268370178176, 49.279767512179944],
      },
    },
    {
      type: "Gem",
      properties: {
        restaurantName: "Green Leaf Sushi",
        iconSize: [40, 40],
      },
      geometry: {
        type: "Point",
        coordinates: [-122.89775423069463, 49.25341712894057],
      },
    },
  ],
};

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

    console.log("map loaded, placed user pin!");
    gems.features.forEach((marker) => {
      // create a DOM element for the marker
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url('/images/diamond.png')`;
      el.style.width = `${marker.properties.iconSize[0]}px`;
      el.style.height = `${marker.properties.iconSize[1]}px`;
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundSize = "contain";
      el.addEventListener("click", () => {
        window.alert(marker.properties.restaurantName);
      });

      // add marker to map
      new maplibregl.Marker({ element: el })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    });
  });

  function addControls(map) {
    // Zoom and rotation
    map.addControl(new maplibregl.NavigationControl(), "top-right");
  }
}

showMap();
