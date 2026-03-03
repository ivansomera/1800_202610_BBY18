# Restolocal

## Overview

Restolocal is a client-side JavaScript web application to help visitors coming to the World Cup to show them locally-recommended restaurants by creating a gamified and memorable experience.

---

## Features

- Browse a list of curated local restaurants
- View a leaderboard/missions
- View a personalized list of favorite restaurants
- Responsive design for desktop and mobile

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase for hosting
- **Database**: Firestore

---

## Usage

To run the application locally:

1.  **Clone** the repository.
2.  **Install dependencies** by running `npm install` in the project root directory.
3.  **Start the development server** by running the command: `npm run dev`.
4.  Open your browser and visit the local address shown in your terminal (usually `http://localhost:5173` or similar).
5.  Update .env file with keys in firebase and maptiler

Once the application is running:

1.  Browse the list of restaurants displayed on the main page.
2.  Click the heart icon (or similar) to mark a trail as a favorite.
3.  View your favorite hikes in the favorites section.

---

## Project Structure

```
1800_202610_BBY18/
├── src/
│   ├── main.js
│   ├── app.js
│   ├── authentication.js
│   ├── firebaseConfig.js
│   ├── loginSignup.js
│   assets/
│   └──images
├── styles/
│   └── style.css
├── index.html
├── package.json
├── README.md
```

---

## Contributors

- Harman Kaur - BCIT Student who enjoy spending time on reading books, watching movies.
- Zyllian James Franz Saab - BCIT Student who has a wide variety of geeky hobbies from tech to warhammer who may or may not living under a rock when it comes to mainstream things. Fun fact: Has not finished a singular book for 2 years and is still on page 133
- Ivan Somera - BCIT CST Student who likes going to the gym occasionally and watching youtube videos.
- Ghazi Abbas - BCIT CST Student who enjoys learning new stuff, and playing games

## Acknowledgments

- Trail data and images are for demonstration purposes only.
- Code snippets were adapted from resources such as [Stack Overflow](https://stackoverflow.com/) and [MDN Web Docs](https://developer.mozilla.org/).
- Icons sourced from [FontAwesome](https://fontawesome.com/) and images from [Unsplash](https://unsplash.com/).

---

## Limitations and Future Work

### Limitations

- Limited trail details (e.g., no live trail conditions).
- Accessibility features can be further improved.

### Future Work

- Implement map view and trailhead directions.
- Add filtering and sorting options (e.g., by difficulty, distance).
- Create a dark mode for better usability in low-light conditions.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
