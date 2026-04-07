import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const params = new URLSearchParams(window.location.search);

// restaurant, name, or id in URL
const restaurantName =
  params.get("restaurant") || params.get("name") || params.get("id");

const title = document.getElementById("restaurant-title");
const container = document.getElementById("reviews-container");
const submitBtn = document.getElementById("submitReview");
const userNameInput = document.getElementById("userName");
const reviewTextInput = document.getElementById("reviewText");
const ratingInput = document.getElementById("rating");

let editReviewId = null;
let gemId = null;

if (restaurantName) {
  title.textContent = `${restaurantName} Reviews`;
} else {
  title.textContent = "Restaurant Reviews";
}

async function getGemId() {
  if (!restaurantName) {
    return null;
  }

  try {
    // first try matching by name
    const q = query(
      collection(db, "gems"),
      where("name", "==", restaurantName),
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }

    // if not found by name, assume URL value might already be the gem doc id
    const allGems = await getDocs(collection(db, "gems"));
    const foundGem = allGems.docs.find(
      (gemDoc) => gemDoc.id === restaurantName,
    );

    if (foundGem) {
      return foundGem.id;
    }

    return null;
  } catch (error) {
    console.error("Error finding gem:", error);
    return null;
  }
}

async function loadReviews() {
  container.innerHTML = "";

  if (!restaurantName) {
    container.innerHTML = "<p>No restaurant selected.</p>";
    return;
  }

  if (!gemId) {
    gemId = await getGemId();
  }

  if (!gemId) {
    container.innerHTML = "<p>Restaurant not found.</p>";
    return;
  }

  try {
    const snapshot = await getDocs(collection(db, "gems", gemId, "reviews"));
    const currentUser = auth.currentUser;

    if (snapshot.empty) {
      container.innerHTML = "<p>No reviews yet.</p>";
      return;
    }

    snapshot.forEach((reviewDoc) => {
      const data = reviewDoc.data();
      const isOwner = currentUser && data.userId === currentUser.uid;

      const div = document.createElement("div");
      div.className = "review-card";
      div.innerHTML = `
        <h3>${data.userName || "Anonymous"}</h3>
        <p>${data.reviewText || ""}</p>
        <p><strong>Rating:</strong> ${data.rating || "N/A"} / 5</p>
        ${
          isOwner
            ? `
              <button class="edit-review-btn">Edit</button>
              <button class="delete-review-btn">Delete</button>
            `
            : ""
        }
      `;

      const editBtn = div.querySelector(".edit-review-btn");
      const deleteBtn = div.querySelector(".delete-review-btn");

      if (editBtn) {
        editBtn.addEventListener("click", () => {
          userNameInput.value = data.userName || "";
          reviewTextInput.value = data.reviewText || "";
          ratingInput.value = data.rating || "";
          editReviewId = reviewDoc.id;
          submitBtn.textContent = "Update Review";
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener("click", async () => {
          const confirmDelete = confirm(
            "Are you sure you want to delete this review?",
          );

          if (!confirmDelete) {
            return;
          }

          try {
            await deleteDoc(doc(db, "gems", gemId, "reviews", reviewDoc.id));

            if (editReviewId === reviewDoc.id) {
              editReviewId = null;
              submitBtn.textContent = "Submit Review";
              userNameInput.value = "";
              reviewTextInput.value = "";
              ratingInput.value = "";
            }

            loadReviews();
          } catch (error) {
            console.error("Error deleting review:", error);
            alert("Error deleting review");
          }
        });
      }

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
  const currentUser = auth.currentUser;

  if (!restaurantName) {
    alert("No restaurant selected.");
    return;
  }

  if (!currentUser) {
    alert("You must be logged in to submit a review.");
    return;
  }

  if (!gemId) {
    gemId = await getGemId();
  }

  if (!gemId) {
    alert("Restaurant not found.");
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
      await updateDoc(doc(db, "gems", gemId, "reviews", editReviewId), {
        userName: userName,
        reviewText: reviewText,
        rating: Number(rating),
      });

      editReviewId = null;
      submitBtn.textContent = "Submit Review";
    } else {
      await addDoc(collection(db, "gems", gemId, "reviews"), {
        userName: userName,
        reviewText: reviewText,
        rating: Number(rating),
        userId: currentUser.uid,
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
