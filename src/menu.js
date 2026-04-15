import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

// Get gem id from URL
const params = new URLSearchParams(window.location.search);
const gemId = params.get("id");

async function loadRestaurant() {
  if (!gemId) return;

  const docRef = doc(db, "gems", gemId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    document.getElementById("restaurant-name").innerText = data.name;
    document.getElementById("restaurant-info").innerText =
      `${data.location} | ${data.cuisine} | ${data.cost}`;
  } else {
    console.log("No such restaurant!");
  }
}

loadRestaurant();
