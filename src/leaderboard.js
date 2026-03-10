import { collection, getDocs, query,orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

async function loadLeaderboard() {

    const leaderboardContainer = document.getElementById("leaderboard-container");

    leaderboardContainer.innerHTML = "";

    const q = query(collection(db, "userPoints"), orderBy("points", "desc"));
    const querySnapshot = await getDocs(q);

    let rank = 1;

    querySnapshot.forEach((doc) => {

        const user = doc.data();

        const userHTML = `
        <div class="d-flex justify-content-between align-items-center bg-light p-3 mb-3 rounded">

            <div class="d-flex align-items-center">
                <h5 class="me-3">${rank}.</h5>

                <i class="bi bi-person-circle fs-3 me-3"></i>

                <div>
                    <div>${user.name}</div>
                    <small class="text-muted">Level ${user.level}</small>
                </div>
            </div>

            <div>
                <i class="bi bi-award"></i> ${user.points}pts
            </div>

        </div>
        `;

        leaderboardContainer.innerHTML += userHTML;

        rank++;
    });
}

document.addEventListener("DOMContentLoaded", loadLeaderboard);