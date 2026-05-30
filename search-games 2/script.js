document.addEventListener('DOMContentLoaded', () => {

    const searchBtn = document.querySelector('#search-btn');
    const gameInput = document.querySelector('#game-input');
    const gameContainer = document.querySelector('#game-container');

    const API_KEY = 'fa9c5031bfdb455f8d5c3435b259f42a'; 

    async function searchGame() {

        const query = gameInput.value.trim();

        if (!query) {
            gameContainer.innerHTML = '<p>Введи назву гри!</p>';
            return;
        }

        gameContainer.innerHTML = '<p>Пошук...</p>';

        try {
            
            const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&page_size=5&key=${API_KEY}`);

            if (!response.ok) {
                throw new Error('Помилка мережі при запиті до RAWG');
            }

            const data = await response.json();

            gameContainer.innerHTML = '';

            
            if (!data.results || data.results.length === 0) {
                gameContainer.innerHTML = '<p>Ігор не знайдено</p>';
                return;
            }

            data.results.forEach(game => {

            
                const imgUrl = game.background_image 
                    ? `<img src="${game.background_image}" alt="${game.name}" style="width:100%; max-height:180px; object-fit:cover; border-radius:8px; margin-bottom:10px;">`
                    : '<div style="width:100%; height:150px; background:#ddd; display:flex; align-items:center; justify-content:center; border-radius:8px; margin-bottom:10px;">Немає фото</div>';


                const metacritic = game.metacritic ? `${game.metacritic}/100` : 'Немає';

            
                const releaseDate = game.released ? game.released : 'Невідомо';

                
                gameContainer.innerHTML += `
                    <div class="game" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: #fff;">
                        ${imgUrl}
                        <h3 style="margin: 5px 0;">${game.name}</h3>
                        <p style="margin: 5px 0;"> Реліз: <strong>${releaseDate}</strong></p>
                        <p style="margin: 5px 0;"> Рейтинг Metacritic: <strong style="color: ${game.metacritic > 75 ? 'green' : 'orange'}">${metacritic}</strong></p>
                    </div>
                `;
            });

        } catch (error) {
            gameContainer.innerHTML = '<p>Помилка при пошуку. Спробуй пізніше.</p>';
            console.error(error);
        }
    }

    searchBtn.addEventListener('click', searchGame);

    gameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchGame();
    });
});