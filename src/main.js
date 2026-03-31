import { db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// If you have custom global styles, import them as well:
// import "../styles/style.css";

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
    if (!dropdownMenu.contains(event.target) && !menuButton.contains(event.target)) {
      dropdownMenu.classList.remove("show");
    }
  });
}