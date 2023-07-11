const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const forecastContainer = document.getElementById('forecastContainer');
const searchHistoryList = document.getElementById('searchHistoryList');

weatherForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    getWeatherByCity(city);
    addToSearchHistory(city);
  }
});

function getWeatherByCity(city) {
  const apiKey = 'c3adaa7e48d20b2f65d6246f1225cb77';
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
    })
    .catch(error => console.log(error));

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => console.log(error));
}

function displayCurrentWeather(data) {
  cityName.textContent = data.name;
  temperature.textContent = `${data.main.temp}°F`;
  description.textContent = data.weather[0].description;
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

function displayForecast(data) {
  forecastContainer.innerHTML = '';

  const forecastList = data.list;
  const displayedDates = []; // To track displayed dates

  for (let i = 0; i < forecastList.length; i++) {
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecastItem');

    const date = new Date(forecastList[i].dt_txt);
    const day = date.getDate();

    // Check if the date is already displayed
    if (!displayedDates.includes(day)) {
      displayedDates.push(day); // Add the date to displayedDates

      const forecastDay = document.createElement('div');
      forecastDay.textContent = getDayOfWeek(date);
      forecastItem.appendChild(forecastDay);

      const forecastDate = document.createElement('div');
      forecastDate.textContent = formatDate(date);
      forecastItem.appendChild(forecastDate);

      const forecastTemperature = document.createElement('div');
      forecastTemperature.textContent = `${forecastList[i].main.temp}°F`;
      forecastItem.appendChild(forecastTemperature);

      const forecastIcon = document.createElement('img');
      forecastIcon.src = `http://openweathermap.org/img/wn/${forecastList[i].weather[0].icon}.png`;
      forecastIcon.alt = 'Weather Icon';
      forecastItem.appendChild(forecastIcon);

      forecastContainer.appendChild(forecastItem);
    }
  }
}

function getDayOfWeek(date) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysOfWeek[date.getDay()];
}

function formatDate(date) {
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

const apiKey = 'c3adaa7e48d20b2f65d6246f1225cb77';

function getCoordinates(data) {
  const lat = data.coord.lat;
  const lon = data.coord.lon;
  const geocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

  fetch(geocodingUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        document.getElementById('latitude').textContent = `Latitude: ${lat}`;
        document.getElementById('longitude').textContent = `Longitude: ${lon}`;
      } else {
        console.log('Coordinates not found for the given city.');
      }
    })
    .catch(error => console.log(error));
}

function addToSearchHistory(city) {
  const searchItem = document.createElement('li');
  searchItem.textContent = city;
  searchHistoryList.prepend(searchItem);

  // Limit the number of search history items
  const maxItems = 5;
  if (searchHistoryList.children.length > maxItems) {
    searchHistoryList.lastChild.remove();
  }
}

searchHistoryList.addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    const city = event.target.textContent;
    cityInput.value = city;
    getWeatherByCity(city);
  }
});

// Restore search history from local storage on page load
document.addEventListener('DOMContentLoaded', function() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.forEach(city => {
    const searchItem = document.createElement('li');
    searchItem.textContent = city;
    searchHistoryList.appendChild(searchItem);
  });
});

// Save search history to local storage
window.addEventListener('beforeunload', function() {
  const searchHistory = Array.from(searchHistoryList.children).map(item => item.textContent);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
});









