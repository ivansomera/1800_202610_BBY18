//import functions as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './styles/style.css';
import { addDoc, collection, serverTimestamp, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";


//------------------------------------------------------------
// This function is an Event Listener for the file (image) picker
// When an image is chosen, it will then save that image into the
// user's document in Firestore
//-------------------------------------------------------------
function uploadImage() {
    document.getElementById("inputImage").addEventListener("change", handleFileSelect);

    function handleFileSelect(event) {
        var file = event.target.files[0];

        if (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var base64String = e.target.result.split(',')[1];

                document.getElementById("mypic-goes-here").src = e.target.result;

                localStorage.setItem("inputImage", base64String); // fixed typo
            };

            reader.readAsDataURL(file);
        }
    }
}

let selectedRating = 0;

function setupStarRating() {
    const stars = document.querySelectorAll(".star");

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {

            selectedRating = index + 1;

            // reset all stars
            stars.forEach(s => {
                s.classList.remove("bi-star-fill");
                s.classList.add("bi-star");
            });

            // fill selected stars
            for (let i = 0; i <= index; i++) {
                stars[i].classList.remove("bi-star");
                stars[i].classList.add("bi-star-fill");
            }

            console.log("Selected rating:", selectedRating);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    uploadImage();
    setupStarRating();
    const postButton = document.getElementById("postButton");
    postButton.addEventListener("click", savePost);
});

//------------------------------------------------------------
// This function saves the post data (description and image) to Firestore
// when the "Save Post" button is clicked.
//-------------------------------------------------------------
async function savePost() {
    alert("SAVE POST is triggered");

    const user = auth.currentUser;
    if (!user) {
        console.log("Error, no user signed in");
        return;
    }

    const name = document.getElementById("restaurantName").value;
    const desc = document.getElementById("description").value;
    const rating = selectedRating;
    const cuisine = document.getElementById("cuisine").value;

    // 1️⃣ Get Base64 image from Local Storage
    const inputImage = localStorage.getItem("inputImage") || "";

    // 2️⃣ Get the user's geolocation (wrapped in a Promise)
    const position = await getCurrentPositionSafe();

    const latitude = position?.coords?.latitude || null;
    const longitude = position?.coords?.longitude || null;

    try {
        // 3️⃣ Save post to Firestore with geolocation
        const docRef = await addDoc(collection(db, "posts"), {
            owner: user.uid,
            restaurantName: name,
            description: desc,
            rating: rating,
            cuisine: cuisine,
            image: inputImage,
            last_updated: serverTimestamp(),
            location: {
                lat: latitude,
                lng: longitude
            }
        });


        console.log("1. Post document added!");
        console.log(docRef.id);

        console.log("NAME:", name);
        console.log("RATING ELEMENT:", document.getElementById("rating"));
        console.log("CUISINE ELEMENT:", document.getElementById("cuisine"));

        // UPDATE USER POINTS FOR LEADERBOARD

        const userRef = doc(db, "userPoints", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const currentPoints = userSnap.data().points || 0;

            await updateDoc(userRef, {
                points: currentPoints + 10
            });

        } else {

            await setDoc(userRef, {
                name: user.displayName || "User",
                points: 10,
                level: 1
            });

        }




    } catch (error) {
        console.error("Error adding post:", error);
    }
}

//------------------------------------------------------------
// This function gets the current geolocation position safely.
// It returns a Promise that resolves to the position or null if
// geolocation is not available or permission is denied.
//-------------------------------------------------------------
function getCurrentPositionSafe() {
    return new Promise(resolve => {
        if (!navigator.geolocation) return resolve(null);

        navigator.geolocation.getCurrentPosition(
            pos => resolve(pos),
            () => resolve(null),
            { enableHighAccuracy: true }
        );
    });
}
