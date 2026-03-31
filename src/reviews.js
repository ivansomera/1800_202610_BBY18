import { db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const params = new URLSearchParams(window.location.search);

// supports restaurant, name, or id in URL
const restaurantName =
  params.get("restaurant") || params.get("name") || params.get("id");

const title = document.getElementById("restaurant-title");
const container = document.getElementById("reviews-container");
const submitBtn = document.getElementById("submitReview");
const userNameInput = document.getElementById("userName");
const reviewTextInput = document.getElementById("reviewText");
const ratingInput = document.getElementById("rating");

let editReviewId = null;

if (restaurantName) {
  title.textContent = `${restaurantName} Reviews`;
} else {
  title.textContent = "Restaurant Reviews";
}

async function loadReviews() {
  container.innerHTML = "";

  if (!restaurantName) {
    container.innerHTML = "<p>No restaurant selected.</p>";
    return;
  }

  try {
    const q = query(
      collection(db, "reviews"),
      where("restaurant", "==", restaurantName)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = "<p>No reviews yet.</p>";
      return;
    }

    snapshot.forEach((reviewDoc) => {
      const data = reviewDoc.data();

      const div = document.createElement("div");
      div.className = "review-card";

      div.innerHTML = `
        <h3>${data.userName || "Anonymous"}</h3>
        <p>${data.reviewText || ""}</p>
        <p><strong>Rating:</strong> ${data.rating || "N/A"} / 5</p>
        <button class="edit-review-btn">Edit</button>
      `;

      const editBtn = div.querySelector(".edit-review-btn");

      editBtn.addEventListener("click", () => {
        userNameInput.value = data.userName || "";
        reviewTextInput.value = data.reviewText || "";
        ratingInput.value = data.rating || "";
        editReviewId = reviewDoc.id;
        submitBtn.textContent = "Update Review";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading reviews:", error);
    container.innerHTML = "<p>Error loading reviews.</p>";
  }
}

submitBtn.addEventListener("click", async () => {
  const userName = userNameInput.value.trim();
  const reviewText = reviewTextInput.value.trim();
  const rating = ratingInput.value.trim();

  if (!restaurantName) {
    alert("No restaurant selected.");
    return;
  }

  if (!userName || !reviewText || !rating) {
    alert("Please fill all fields.");
    return;
  }

  if (Number(rating) < 1 || Number(rating) > 5) {
    alert("Rating must be between 1 and 5.");
    return;
  }

  try {
    if (editReviewId) {
      await updateDoc(doc(db, "reviews", editReviewId), {
        userName: userName,
        reviewText: reviewText,
        rating: Number(rating),
      });

      editReviewId = null;
      submitBtn.textContent = "Submit Review";
    } else {
      await addDoc(collection(db, "reviews"), {
        restaurant: restaurantName,
        userName: userName,
        reviewText: reviewText,
        rating: Number(rating),
      });
    }

    userNameInput.value = "";
    reviewTextInput.value = "";
    ratingInput.value = "";

    loadReviews();
  } catch (error) {
    console.error("Error adding/updating review:", error);
    alert("Error saving review");
  }
});

loadReviews();