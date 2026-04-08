// This Vite config file (vite.config.js) tells Rollup (production bundler)
// to treat multiple HTML files as entry points so each becomes its own built page.

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        createGem: resolve(__dirname, "createGem.html"),
        editGem: resolve(__dirname, "editGem.html"),
        favorites: resolve(__dirname, "favorites.html"),
        index: resolve(__dirname, "index.html"),
        leaderboard: resolve(__dirname, "leaderboard.html"),
        login: resolve(__dirname, "login.html"),
        main: resolve(__dirname, "main.html"),
        map: resolve(__dirname, "map.html"),
        recommended: resolve(__dirname, "recommended.html"),
        reviews: resolve(__dirname, "reviews.html"),
      },
    },
  },
});
