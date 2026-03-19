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
  });
}

showMap();
