import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./styles/style.css";
import { auth, db } from "./firebaseConfig.js";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";  

const params = new URLSearchParams(window.location.search);
const gemID = params.get("postID")
console.log(gemID);

//------------------------------------------------------------
// Add event listener to the "Edit Post" button
//-------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();



    const [longitude, latitude] = selectedLngLat;
    const nameEdit = document.getElementById("name").value;
    const descEdit = document.getElementById("description").value;
    const categoryEdit = document.querySelector(
    'input[name="category"]:checked',
    ).value;

    editPost(nameEdit, descEdit, categoryEdit, longitude, latitude);


    const msg = document.getElementById("successMsg");
    msg.classList.remove("d-none");

    // hide it again after 3 seconds
    setTimeout(() => msg.classList.add("d-none"), 3000);
  });
});


//------------------------------------------------------------
// This function edits the post data (description and image) to Firestore
// when the "Edit Post" button is clicked.
// The map selected location is global variable.
//-------------------------------------------------------------
async function editPost(name, description, category, longitude, latitude) {
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
        category: category,
        name: name,
    }) 
    await updateDoc(docRef, {
        location: {
        lng: longitude,
        lat: latitude,
        }
    }) 

    //   owner: user.uid,
    //   name: name,
    //   category: category,
    //   description: desc,
    //   last_updated: serverTimestamp(),
    //   location: {
    // lat: latitude,
    // lng: longitude,

    window.location.href = "main.html";
    console.log("1. Post document added!");
    console.log(docRef.id);

    // Optional: EditPostIDforUser(docRef.id);
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
function currentGemLocation() {

    //------------------------------------------------------------
    // Gets id of the specified gem from a local storage. 
    // NEEDS MORE WORK!!!!
    //-------------------------------------------------------------

    // gemInfo(gemID);

    // async function gemInfo(id) {
    //     try {
    //         const gemRef = doc(db, "gems", id);
    //         const gemSnap = await getDoc(gemRef);
    //         if (gemSnap.exists()) {

    //         } else {
    //             console.log("Gem not found!");
    //         }
    //     } catch (error) {
    //         console.error("Error getting gem document:", error);
    //     }
    // }

  // Initialize the Maplibre map centered on the current gem's location with a zoom level of 10
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

currentGemLocation();
