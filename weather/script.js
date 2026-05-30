const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

const cityElement = document.getElementById('city');
const weatherElement = document.getElementById('weather');
const tempElement = document.getElementById('temp');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const cityInput = document.getElementById('cityInput');

async function searchWeather() {
    let cityName = cityInput.value.trim();
    
    if (cityName == '') {
        cityName = 'Kyiv';
    }
    
    cityElement.textContent = cityName;
    weatherElement.textContent = 'Завантаження...';
    tempElement.textContent = '--°';
    humidityElement.textContent = '--%';
    windElement.textContent = '-- km/h';
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=ua`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Місто "${cityName}" не знайдено`);
            } else {
                throw new Error('Помилка отримання даних');
            }
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (error) {
        weatherElement.textContent = 'Помилка!';
        tempElement.textContent = '--°';
        humidityElement.textContent = '--%';
        windElement.textContent = '-- km/h';
        cityElement.textContent = 'Не знайдено';
    }
}

function displayWeather(data) {
    const city = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = (data.wind.speed * 3.6).toFixed(1);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    
    let weatherEmoji = '';
    if (iconCode.includes('01')) weatherEmoji = '☀️';
    else if (iconCode.includes('02')) weatherEmoji = '⛅️';
    else if (iconCode.includes('03')) weatherEmoji = '☁️';
    else if (iconCode.includes('04')) weatherEmoji = '☁️';
    else if (iconCode.includes('09')) weatherEmoji = '🌧';
    else if (iconCode.includes('10')) weatherEmoji = '🌦';
    else if (iconCode.includes('11')) weatherEmoji = '⛈';
    else if (iconCode.includes('13')) weatherEmoji = '❄️';
    else if (iconCode.includes('50')) weatherEmoji = '🌫';
    else weatherEmoji = '🌡';
    
    cityElement.textContent = `${city}, ${country}`;
    weatherElement.textContent = `${weatherEmoji} ${description}`;
    tempElement.innerHTML = `${temp}°<span style="font-size:20px;">C</span>`;
    humidityElement.textContent = `${humidity}%`;
    windElement.textContent = `${windSpeed} km/h`;
    
    changeBackgroundByTemp(temp);
}

function changeBackgroundByTemp(temp) {
    const body = document.body;
    
    if (temp <= 0) {
        body.style.background = 'linear-gradient(135deg, #1e3c72, #2a5298)';
    } else if (temp <= 15) {
        body.style.background = 'linear-gradient(135deg, #2193b0, #6dd5ed)';
    } else if (temp <= 25) {
        body.style.background = 'linear-gradient(135deg, #f2994a, #f2c94c)';
    } else {
        body.style.background = 'linear-gradient(135deg, #e65c00, #f9d423)';
    }
}

window.searchWeather = searchWeather;

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchWeather();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    cityInput.value = 'Kyiv';
    searchWeather();
});

setInterval(() => {
    if (cityInput.value.trim() !== '') {
        searchWeather();
    }
}, 600000);