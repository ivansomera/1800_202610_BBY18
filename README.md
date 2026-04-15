# Foogem

## Overview

Foogem is a mobile-first web application that helps World Cup visitors discover locally-recommended food trucks in Vancouver, with gems added by locals.

---

## Features

- Mobile-first responsive design
- Browse a list of locally-recommended food trucks
- Edit, delete, and review food trucks
- Filter through different types cuisines to narrow down search
- View points in leaderboard
- User authentication (user signup/login)

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend (Authentication and hosting)**: Firebase
- **Database**: Firestore
- **Map**: MapLibre

---

## Usage

To run the application locally:

1.  **Clone** the repository.
2.  **Install dependencies** by running `npm install` in the project root directory.
3.  **Start the development server** by running the command: `npm run dev`.
4.  Open your browser and visit the local address shown in your terminal (usually `http://localhost:5173` or similar).
5.  Update .env file with keys in firebase and maplibre

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
│   ├── createGem.js
│   ├── editGem.js
│   ├── favorites.js
│   ├── leaderboard.js
│   ├── menu.js
│   └──  reviews.js
├── components/
│   ├── site-footer.js
│   └── site-navbar.js
├── styles/
│   └── style.css
├── public/
│   └── images
├── index.html
├── createGem.html
├── editGem.html
├── favorites.html
├── leaderboard.html
├── login.html
├── main.html
├── map.html
├── reviews.html
├── package.json
├── vite.config.js
├── README.md
```

---

## Contributors

- Harman Kaur - BCIT Student who enjoy spending time on reading books, watching movies.
- Zyllian James Franz Saab - BCIT Student who has a wide variety of geeky hobbies from tech to warhammer who may or may not living under a rock when it comes to mainstream things. Fun fact: Has not finished a singular book for 2 years and is still on page 133
- Ivan Somera - BCIT CST Student who likes going to the gym occasionally and watching youtube videos.
- Ghazi Abbas - BCIT CST Student who enjoys learning new stuff, and playing games

## Acknowledgments

- Icons sourced from [FlatIcon](https://www.flaticon.com/).

---

## Limitations and Future Work

### Limitations

- Gamified features weren't fully implemented.
- Time contraint

### Future Work

- More comprehensive points system.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
