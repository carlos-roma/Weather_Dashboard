// Add listener for the search button
document.getElementById('search-btn').addEventListener('click', function() {
    var city = document.getElementById('city-input').value;
    if (city === '') {
        alert('Please enter a city name.');
        return;
    }
    fetchWeatherData(city);
    addToSearchHistory(city);
});

// Listener for the Enter key
document.getElementById('city-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('search-btn').click();
    }
});

//fetch info from api
async function fetchWeatherData(city) {
    try {
        var apiKey = 'd4eff8ea9c527bcc4b360e5b80edb6c6';
        var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Something went wrong: ' + response.statusText);
        }
        const data = await response.json();

        if (data.cod === "200") {
            displayWeather(data);
        } else {
            alert('Could not retrieve weather data. Please try again.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch data.');
    }
}

// Displays data on the page

function displayWeather(data) {
    var todayWeather = data.list[0];
    var todayWeatherDiv = document.getElementById('today-weather');
    todayWeatherDiv.innerHTML = `
        <h2>${data.city.name} (${dayjs(todayWeather.dt * 1000).format('YYYY-MM-DD ')})</h2>
        <p>${todayWeather.weather[0].description}, Temp: ${todayWeather.main.temp}°C</p>
    `;

    var futureCardsDiv = document.getElementById('future-cards');
    futureCardsDiv.innerHTML = ''; // Clears previous cards

    // Create a card for each day
    for (let i = 1; i < data.list.length; i += 8) { 
        var forecast = data.list[i];
        var card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h3>${dayjs(forecast.dt * 1000).format('YYYY-MM-DD')}</h3>
            <p>${forecast.weather[0].description}</p>
            <p>Temp: ${forecast.main.temp}°C</p>
        `;
        futureCardsDiv.appendChild(card);
    }
}

//sends cities to history
function addToSearchHistory(city) {
    var searchHistory = document.getElementById('search-history');
    var listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', function() {
        fetchWeatherData(city);
    });
    searchHistory.appendChild(listItem);
}
