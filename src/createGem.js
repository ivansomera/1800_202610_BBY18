//import functions as needed
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./styles/style.css";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

//------------------------------------------------------------
// Add event listener to the "Save Post" button
//-------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
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

  const desc = document.getElementById("description").value;

  try {
    const docRef = await addDoc(collection(db, "gems"), {
      owner: user.uid,
      description: desc,
      last_updated: serverTimestamp(),
    });

    console.log("1. Post document added!");
    console.log(docRef.id);

    // Optional: savePostIDforUser(docRef.id);
    // Do you want to keep track if what posts the user has done?
  } catch (error) {
    console.error("Error adding post:", error);
  }
}
