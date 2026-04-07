import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./styles/style.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig.js";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const params = new URLSearchParams(window.location.search);

async function populateGemInfo() {
  const params = new URLSearchParams(window.location.search);

  try {
    const gemRef = doc(db, "gems", gemID);
    const gemSnap = await getDoc(gemRef);
    if (gemSnap.exists()) {
      const gemData = gemSnap.data();
      const {
        name = "",
        description = "",
        dateFrom = "",
        dateTo = "",
        openTime = "",
        closeTime = "",
        cuisine = "",
        spiceLevel = "",
        location = null,
      } = gemData;

      document.getElementById("name").value = name;
      document.getElementById("description").value = description;
      document.getElementById("dateFrom").value = dateFrom;
      document.getElementById("dateTo").value = dateTo;
      document.getElementById("openTime").value = openTime;
      document.getElementById("closeTime").value = closeTime;

      const cuisineRadio = document.querySelector(
        `input[name="cuisine"][value="${cuisine}"]`,
      );
      if (cuisineRadio) cuisineRadio.checked = true;

      const spiceRadio = document.querySelector(
        `input[name="spiceLevel"][value="${spiceLevel}"]`,
      );
      if (spiceRadio) spiceRadio.checked = true;

      if (location) {
        selectedLngLat = [location.lng, location.lat];
        selectedMarker = new maplibregl.Marker()
          .setLngLat(selectedLngLat)
          .addTo(pickMap);
        pickMap.setCenter(selectedLngLat);
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting gem document:", error);
  }
}

//------------------------------------------------------------
// Add event listener to the "Edit Post" button
//-------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();

    const [longitude, latitude] = selectedLngLat;
    const nameEdit = document.getElementById("name").value;
    const descEdit = document.getElementById("description").value;
    const cuisineEdit = document.querySelector(
      'input[name="cuisine"]:checked',
    ).value;
    const dateFromEdit = document.getElementById("dateFrom").value;
    const dateToEdit = document.getElementById("dateTo").value;
    const spiceLevelEdit =
      document.querySelector('input[name="spiceLevel"]:checked')?.value || null;
    const openTimeEdit = document.getElementById("openTime").value;
    const closeTimeEdit = document.getElementById("closeTime").value;

    editPost(
      nameEdit,
      descEdit,
      longitude,
      latitude,
      cuisineEdit,
      dateFromEdit,
      dateToEdit,
      spiceLevelEdit,
      openTimeEdit,
      closeTimeEdit,
    );

    const msg = document.getElementById("successMsg");
    msg.classList.remove("d-none");

    // hide it again after 3 seconds
    setTimeout(() => msg.classList.add("d-none"), 3000);
  });
});

//------------------------------------------------------------
// Deletes the gem.
//-------------------------------------------------------------
document.querySelector("#delete").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const currentGem = doc(db, "gems", gemID);
    console.log("gemID:", gemID);
    await deleteDoc(currentGem);
    console.log("Gem deleted!");
    window.location.href = "main.html";
  } catch (error) {
    console.error("Error deleting gem:", error);
  }
});

//------------------------------------------------------------
// This function edits the post data (description and image) to Firestore
// when the "Edit Post" button is clicked.
// The map selected location is global variable.
//-------------------------------------------------------------
async function editPost(
  name,
  description,
  longitude,
  latitude,
  cuisine,
  datefrom,
  dateto,
  spicelevel,
  opentime,
  closetime,
) {
  const user = auth.currentUser;
  if (!user) {
    console.log("Error, no user signed in");
    return;
  }

  // 2️⃣ Get the lnglat from global variable that Editd when we clicked map

  if (!selectedLngLat) {
    alert("Please select a location on the map.");
    return;
  }

  try {
    const docRef = doc(db, "gems", gemID);
    await updateDoc(docRef, {
      description: description,
      last_updated: serverTimestamp(),
      name: name,
      cuisine: cuisine,
      dateFrom: datefrom,
      dateTo: dateto,
      spiceLevel: spicelevel,
      openTime: opentime,
      closeTime: closetime,
    });
    await updateDoc(docRef, {
      location: {
        lng: longitude,
        lat: latitude,
      },
    });

    window.location.href = "main.html";
    console.log("1. Post document added!");
    console.log(docRef.id);

    // Optional: EditPostIDforUser(docRef.id);
  } catch (error) {
    console.error("Error editing gem:", error);
  }
}

// Global variables for the map and selected location
let pickMap;
let selectedMarker = null;
let selectedLngLat = null;

//------------------------------------------------------------
// This function initializes the Maplibre map for picking a location.
// It sets up the map and adds a click event listener to allow the user
// to select a location by clicking on the map. The selected location's
// coordinates are stored in the global variable "selectedLngLat".
//-------------------------------------------------------------
function currentGemLocation() {
  // Initialize the Maplibre map centered on the current gem's location with a zoom level of 10
  pickMap = new maplibregl.Map({
    container: "pickMap",
    style: `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
    center: [-123.00163752324765, 49.25324576104826],
    zoom: 10,
    attributionControl: false,
  });

  // Listen for click events on the map to allow the user to select a location
  pickMap.on("click", (e) => {
    const { lng, lat } = e.lngLat;
    selectedLngLat = [lng, lat];
    // If a marker already exists, move it to the new location. Otherwise, create a new marker.
    if (selectedMarker) {
      selectedMarker.setLngLat([lng, lat]);
    } else {
      selectedMarker = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(pickMap);
    }
    // Update the hidden form fields with the selected coordinates (rounded to 6 decimal places)
    document.getElementById("latitude").value = lat.toFixed(6);
    document.getElementById("longitude").value = lng.toFixed(6);
  });
}

function initProfilePage() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    await populateGemInfo();
  });
}

currentGemLocation();
initProfilePage();
