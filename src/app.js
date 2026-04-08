import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

//--------------------------------------------------------------
// If you have custom global styles, import them as well:
//--------------------------------------------------------------
import "/src/styles/style.css";

//--------------------------------------------------------------
// Custom global JS code (shared with all pages)can go here.
//--------------------------------------------------------------

import { onAuthReady } from "./authentication.js";

function checkLogin() {
  onAuthReady((user) => {
    if (!user) {
      if (window.location.pathname.endsWith("/main.html")) {
        location.href = "index.html";
      }
      return;
    } else {
      if (
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname.endsWith("/")
      ) {
        location.href = "main.html";
      }
      return;
    }
  });
}

checkLogin();
