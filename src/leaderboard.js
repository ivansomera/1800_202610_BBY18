import { db } from "./firebaseConfig.js";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

let ascending = false;

// Fetch users ordered by points and render the leaderboard table
async function renderLeaderboard() {
  let i = 1;
  const order = ascending ? "asc" : "desc";
  const q = query(collection(db, "users"), orderBy("points", "desc"));
  const snapshot = await getDocs(q);

  const list = document.querySelector("#leaderboard");
  list.innerHTML = "";

  snapshot.forEach((doc) => {
    const { name, points } = doc.data();
    const row = document.createElement("tr");
    const rowHeadStart = document.createElement("th");
    const rowBodyStart = document.createElement("td");
    const rowPoints = document.createElement("td");

    if (i % 2 != 0) {
      row.classList.add("table-warning");
    } else {
      row.classList.add("table-info");
    }

    rowHeadStart.textContent = `${i}`;
    rowBodyStart.textContent = `${name}`;
    rowPoints.textContent = `${points}`;
    row.append(rowHeadStart, rowBodyStart, rowPoints);
    list.append(row);
    i++;
  });
}

renderLeaderboard();
