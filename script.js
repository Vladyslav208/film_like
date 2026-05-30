const API_KEY = "a9e04f60";

const movieDiv = document.getElementById("movie");
const searchInput = document.getElementById("search");

let timer;

// =========================
// CENTER CARDS
// =========================
movieDiv.style.display = "flex";
movieDiv.style.flexWrap = "wrap";
movieDiv.style.justifyContent = "center";
movieDiv.style.gap = "20px";

// =========================
// DARK MODE
// =========================
document.body.style.background = "black";
document.body.style.color = "white";
document.body.style.fontFamily = "Arial";
document.body.style.textAlign = "center";

// =========================
// ENTER SEARCH
// =========================
searchInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    findMovie();
  }

});

// =========================
// AUTO SEARCH + DEBOUNCE
// =========================
searchInput.addEventListener("input", () => {

  clearTimeout(timer);

  timer = setTimeout(() => {
    findMovie();
  }, 500);

});

// =========================
// SAVE LAST SEARCH
// =========================
const lastSearch = localStorage.getItem("lastSearch");

if (lastSearch) {
  searchInput.value = lastSearch;
}

// =========================
// FAVORITES
// =========================
function saveFavorite(movie) {

  let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.push(movie);

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  alert("Фильм добавлен ❤️");
}

// =========================
// TRANSLATE
// =========================
async function translate(text) {

  try {

    const res = await fetch(
      "https://libretranslate.de/translate",
      {
        method: "POST",

        body: JSON.stringify({
          q: text,
          source: "en",
          target: "ru",
          format: "text"
        }),

        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data = await res.json();

    return data.translatedText;

  } catch (e) {

    return text;

  }
}

// =========================
// MAIN SEARCH
// =========================
async function findMovie() {

  const movieName = searchInput.value.trim();

  localStorage.setItem("lastSearch", movieName);

  if (!movieName) {

    movieDiv.innerHTML =
      "<h2>Введите название фильма</h2>";

    return;
  }

  // loading
  movieDiv.innerHTML =
    "<h2>⏳ Загрузка...</h2>";

  const url =
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${movieName}`;

  try {

    const response = await fetch(url);

    const data = await response.json();

    console.log(data);

    movieDiv.innerHTML = "";

    // API errors
    if (data.Response === "False") {

      movieDiv.innerHTML =
        `<h2>❌ ${data.Error}</h2>`;

      return;
    }

    // =========================
    // ONLY REAL MOVIES
    // =========================
    const moviesOnly = data.Search.filter(movie => {

      return (
        movie.Type === "movie" &&
        movie.Poster !== "N/A"
      );

    });

    // sort by year
    moviesOnly.sort((a, b) => b.Year - a.Year);

    // render movies
    for (const movie of moviesOnly) {

      const titleRU =
        await translate(movie.Title);

      const poster =
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/200x300";

      movieDiv.innerHTML += `

        <div
          style="
            margin:15px;
            padding:15px;
            border:1px solid white;
            border-radius:10px;
            width:250px;
            transition:0.3s;
            background:#111;
          "

          onmouseover="
            this.style.transform='scale(1.05)'
          "

          onmouseout="
            this.style.transform='scale(1)'
          "
        >

          <h2>${titleRU}</h2>

          <p>📅 ${movie.Year}</p>

          <a
            href="https://www.imdb.com/title/${movie.imdbID}"
            target="_blank"
          >
            <img
              src="${poster}"
              width="200"
            >
          </a>

          <br><br>

          <button
            onclick='saveFavorite(${JSON.stringify(movie)})'
          >
            ❤️ Избранное
          </button>

          <br><br>

          <!-- VIMEO TRAILER -->

          <a
            href="
              https://vimeo.com/search?q=${movie.Title}+trailer
            "
            target="_blank"
            style="color:white;"
          >
            ▶ Смотреть трейлер
          </a>

        </div>

      `;
    }

  } catch (error) {

    console.error(error);

    movieDiv.innerHTML =
      "<h2>❌ Ошибка сети</h2>";

  }
}