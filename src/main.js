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
displayPostsFromFirebase();


function displayPostsFromFirebase() {

  const container = document.getElementById("posts-go-here");
  const postsRef = collection(db, "posts");

  container.innerHTML = ""; // clear before adding

  getDocs(postsRef)
    .then((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        const post = doc.data();

        // Skip empty posts (important fix)
        if (!post.restaurantName) return;

        const card = document.createElement("div");
        card.className = "col-md-4";

        card.innerHTML = `
          <div class="card p-3 mb-4 shadow-sm">

         <div class="d-flex">
             <div class="flex-grow-1 pe-2">
        <h6 class="mb-1">${post.restaurantName}</h6>

        <small><p class="mb-1">
                  <i class="bi bi-star-fill text-warning"></i> 
                   ${post.rating || "N/A"} 
                 <span class="text-muted">| ${post.cuisine || "Unknown"}</span>
                </p>
        </small>

        <p class="mb-1 small">${post.description || ""}</p>
      </div>

            ${post.image
            ? `<img src="data:image/png;base64,${post.image}" 
                 style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">`
            : ""
          }

          </div>
        `;

        container.appendChild(card);
      });

    })
    .catch((error) => {
      console.error("Error loading posts:", error);
    });
}