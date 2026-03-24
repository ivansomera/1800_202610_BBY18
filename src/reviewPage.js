import { db } from "./firebaseConfig.js";
import { auth } from "./firebaseConfig.js";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as bootstrap from "bootstrap";

//-----------------------------------------------------------
// Get gem ID from Local Storage
// Go to firestore to get the name of the gem (using this ID) 
// and display in title of the page
//-----------------------------------------------------------
var gemDocID = localStorage.getItem('gemDocID');
displaygemName(gemDocID);
async function displaygemName(id) {
    try {
        const gemRef = doc(db, "gems", id);
        const gemSnap = await getDoc(gemRef);

        if (gemSnap.exists()) {
            const gemName = gemSnap.data().name;
            document.getElementById("name").textContent = gemName;
        } else {
            console.log("No such gem found!");
        }
    } catch (error) {
        console.error("Error getting gem document:", error);
    }
}

//Add event listener to stars after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    manageStars();
});

let gemRating = 0;
function manageStars() {
    // ⭐ Make star icons clickable and calculate rating
    const stars = document.querySelectorAll('.star');

    // Step 1️⃣ – Add click behavior for each star
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            // Fill all stars up to the one clicked
            stars.forEach((s, i) => {
                s.textContent = i <= index ? 'star' : 'star_outline';
            });
            // Save rating value
            gemRating = index + 1;
            console.log("Current rating:", gemRating);
        });
    });
}

//---------------------------------------------------------------------
// Function to write review data into Firestore
// Triggered when the authenticated user clicks the "Submit" button
// Collects form data and adds a new document to the selected gem's
// "reviews" subcollection: gems/{gemDocID}/reviews/{reviewDocID}
// Redirects to eachgem page upon success
//---------------------------------------------------------------------

async function writeReview() {
    console.log("Inside write review");

    // 🧾 Collect form data
    const gemTitle = document.getElementById("title").value;
    const gemLevel = document.getElementById("level").value;
    const gemSeason = document.getElementById("season").value;
    const gemDescription = document.getElementById("description").value;
    const gemFlooded = document.querySelector('input[name="flooded"]:checked')?.value;
    const gemScrambled = document.querySelector('input[name="scrambled"]:checked')?.value;

    // Log collected data for verification
    console.log("inside write review, rating =", gemRating);
    console.log("gemDocID =", gemDocID);
    console.log("Collected review data:");
    console.log(gemTitle, gemLevel, gemSeason, gemDescription, gemFlooded, gemScrambled);

    // simple validation
    if (!gemTitle || !gemDescription) {
        alert("Please complete all required fields.");
        return;
    }

    // get a pointer to the user who is logged in
    const user = auth.currentUser;

    if (user) {
        try {
            const userID = user.uid;

            // ✅ Store review as subcollection under this gem
            // Path: gems/{gemDocID}/reviews/{autoReviewID}
            await addDoc(collection(db, "gems", gemDocID, "reviews"), {
                userID: userID,
                title: gemTitle,
                level: gemLevel,
                season: gemSeason,
                description: gemDescription,
                flooded: gemFlooded,
                scrambled: gemScrambled,
                rating: gemRating,
                timestamp: serverTimestamp()
            });

            console.log("Review successfully written!");


            // Show thank-you modal
            const thankYouModalEl = document.getElementById("thankYouModal");
            const thankYouModal = new bootstrap.Modal(thankYouModalEl);
            thankYouModal.show();

            // Redirect AFTER user closes the modal
            thankYouModalEl.addEventListener("hidden.bs.modal", () => {
                window.location.href = `eachgem.html?docID=${gemDocID}`;
            }, { once: true });

        } catch (error) {
            console.error("Error adding review:", error);
        }
    } else {
        console.log("No user is signed in");
        //window.location.href = "review.html";
    }
}

// Add event listener to stars after DOM content is loaded
// Add event listener to submit button after DOM content is loaded (It’s like the browser’s built-in bell that rings automatically.)
document.addEventListener('DOMContentLoaded', () => {
		manageStars();
    
    // 👇👇👇 Add these two lines
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', writeReview);
});