import { auth, db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// Handle navbar category button click (active state)
const navButtons = document.querySelectorAll(".main-nav-btn");

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

// Hamburger dropdown
const menuButton = document.querySelector(".nav-menu");
const dropdownMenu = document.getElementById("dropdownMenu");

if (menuButton && dropdownMenu) {
  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    if (
      !dropdownMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      dropdownMenu.classList.remove("show");
    }
  });
}

// Logout functionality
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      await signOut(auth);
      window.location.href = "/login.html"; // redirect to your login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  });
}