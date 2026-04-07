import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./styles/style.css";
import { auth, db } from "./firebaseConfig.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

//------------------------------------------------------------
// Add event listener to the "Save Post" button
//-------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    savePost();

    const msg = document.getElementById("successMsg");
    msg.classList.remove("d-none");

    // hide it again after 3 seconds
    setTimeout(() => msg.classList.add("d-none"), 3000);
  });
});

//------------------------------------------------------------
// This function saves the post data (description and image) to Firestore
// when the "Save Post" button is clicked.
//-------------------------------------------------------------
//------------------------------------------------------------
// This function saves the post data (description and image) to Firestore
// when the "Save Post" button is clicked.
// The map selected location is global variable.
//-------------------------------------------------------------
//------------------------------------------------------------
// This function saves the post data (description and image) to Firestore
// when the "Save Post" button is clicked.
// The map selected location is global variable.
//-------------------------------------------------------------
async function savePost() {
  const user = auth.currentUser;
  if (!user) {
    console.log("Error, no user signed in");
    return;
  }

  const name = document.getElementById("name").value;
  const desc = document.getElementById("description").value;
  const cuisine = document.querySelector('input[name="cuisine"]:checked').value;
  const dateFrom = document.getElementById("dateFrom").value;
  const dateTo = document.getElementById("dateTo").value;
  const spiceLevel =
    document.querySelector('input[name="spiceLevel"]:checked')?.value || null;
  const openTime = document.getElementById("openTime").value;
  const closeTime = document.getElementById("closeTime").value;

  // 2️⃣ Get the lnglat from global variable that saved when we clicked map

  if (!selectedLngLat) {
    alert("Please select a location on the map.");
    return;
  }
  const [longitude, latitude] = selectedLngLat;

  try {
    const docRef = await addDoc(collection(db, "gems"), {
      owner: user.uid,
      name: name,
      dateFrom: dateFrom,
      dateTo: dateTo,
      description: desc,
      cuisine: cuisine,
      spiceLevel: spiceLevel,
      openTime: openTime,
      closeTime: closeTime,
      last_updated: serverTimestamp(),
      location: {
        lat: latitude,
        lng: longitude,
      },
    });

    // Points system
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const uid = user.uid;
        console.log("Current user ID:", uid);

        const userRef = doc(db, "users", uid);
        var currentPoints = 0;
        setDoc(userRef, {
          points: increment(5)
        }, { merge: true } )

      }
    });

    window.location.href = "main.html";
    // console.log("1. Post document added!");
    // console.log(docRef.id);

    // Optional: savePostIDforUser(docRef.id);
  } catch (error) {
    console.error("Error adding post:", error);
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
function initPickMap() {
  // Initialize the Maplibre map centered on BCIT with a zoom level of 10
  pickMap = new maplibregl.Map({
    container: "pickMap",
    style: `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
    center: [-123.00163752324765, 49.25324576104826],
    zoom: 10,
    attributionControl: false,
  });

  // Add navigation controls (zoom and rotation) to the top-right corner of the map
  pickMap.addControl(new maplibregl.NavigationControl(), "top-right");

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

initPickMap();
