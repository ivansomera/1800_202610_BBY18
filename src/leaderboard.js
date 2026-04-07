import { db } from "./firebaseConfig.js";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

let ascending = false;

async function renderLeaderboard() {
  const order = ascending ? "asc" : "desc";
  const q = query(collection(db, "users"), orderBy("points", "desc"));
  const snapshot = await getDocs(q);

  const list = document.querySelector("#leaderboard");
  list.innerHTML = "";

  snapshot.forEach((doc) => {
    const { name, points } = doc.data();
    const item = document.createElement("li");
    item.textContent = `${name}: ${points} points`;
    list.appendChild(item);
  });
}

renderLeaderboard();
