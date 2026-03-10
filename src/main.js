import { db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// If you have custom global styles, import them as well:
// import "../styles/style.css";

// Helper function to add sample gems
function addGemData() {
  const gemsRef = collection(db, "gems");
  console.log("Adding sample gem data...");
  addDoc(gemsRef, {
    name: "Haidilao",
    location: "Brentwood Town Centre",
    cuisine: "Hot Pot",
    cost: "$$",
    lat: 49.26759839133271,
    lng: -123.0010676417778,
    last_updated: serverTimestamp(),
  });
  addDoc(gemsRef, {
    name: "Chipotle",
    location: "Metropolis at Metrotown",
    cuisine: "Mexican",
    cost: "$$",
    lat: 49.22614960451131,
    lng: -123.00216282514073,
    last_updated: serverTimestamp(),
  });
}

// Seeds the "gems" collection with initial data if it is empty
function seedGems() {
  // Get a reference to the "gems" collection
  const gemsRef = collection(db, "gems");
  // Retrieve all documents currently in the collection
  getDocs(gemsRef)
    .then(function (querySnapshot) {
      // If no documents exist, the collection is empty
      if (querySnapshot.empty) {
        console.log("Gems collection is empty. Seeding data...");

        // Call function to insert default hike documents
        addGemData();
      } else {
        // If documents already exist, do not reseed
        console.log("Gems collection already contains data. Skipping seed.");
      }
    })
    .catch(function (error) {
      console.error("Error checking gems collection:", error);
    });
}

function displayCardsDynamically() {
  let cardTemplate = document.getElementById("restaurantCardTemplate");
  const gemsCollectionRef = collection(db, "gems");

  getDocs(gemsCollectionRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Clone the template
        let newcard = cardTemplate.content.cloneNode(true);
        const gem = doc.data();

        // Populate the card
        newcard.querySelector(".card-title").textContent = gem.name;
        newcard.querySelector(".card-location").textContent = gem.location;
        newcard.querySelector(".card-cuisine").textContent = gem.cuisine;
        newcard.querySelector(".card-cost").textContent = gem.cost;

        // Append to container
        document.getElementById("gems-go-here").appendChild(newcard);
      });
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}

// Call the seeding function when the main.html page loads.
seedGems();
displayCardsDynamically();
