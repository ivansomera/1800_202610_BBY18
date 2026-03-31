import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", loadRestaurants);

async function loadRestaurants() {

  const container = document.getElementById("restaurant-list");

  console.log("Loading restaurants...");

  const querySnapshot = await getDocs(
    collection(db, "recommended")
  );

  console.log("docs:", querySnapshot.size);

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    const card = `
      <div class="col-md-4 mt-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5>${data.name}</h5>
            <p>📍 ${data.location}</p>
            <p>${data.description}</p>
            <p>💲 Cost Level: ${data.cost}</p>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += card;

  });

}