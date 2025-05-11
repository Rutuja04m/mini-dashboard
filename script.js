const clock = document.getElementById("clock");
const dateElem = document.getElementById("date");
const greeting = document.getElementById("greeting");
const weatherDiv = document.getElementById("weather");
const toggleBtn = document.getElementById("toggle-theme");
const cityInput = document.getElementById("cityInput");  // Updated to match HTML ID
const apiKey = "68ce607288bf11857352b6846a4d7c4a"; // Replace with your OpenWeatherMap key

let isCelsius = true;

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString("en-GB"); // The round clock
  dateElem.textContent = now.toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const hour = now.getHours();
  let msg = "";
  if (hour >= 5 && hour < 12) msg = "Good Morning";
  else if (hour >= 12 && hour < 17) msg = "Good Afternoon";
  else if (hour >= 17 && hour < 21) msg = "Good Evening";
  else msg = "Good Night";
  greeting.textContent = msg;
}

setInterval(updateClock, 1000);
updateClock();

function getWeather() {
  const city = cityInput.value;  // Use updated input element ID
  if (!city) {
    weatherDiv.innerHTML = `<p>Please enter a city name.</p>`;
    return;
  }

  const units = isCelsius ? "metric" : "imperial";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod !== 200) {
        weatherDiv.innerHTML = `<p>City not found. Try again.</p>`;
        return;
      }

      const cityName = data.name;
      const temp = `${data.main.temp}°${isCelsius ? "C" : "F"}`;
      const condition = data.weather[0].main;
      const icon = data.weather[0].icon;

      weatherDiv.innerHTML = `
        <h3>${cityName}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}" />
        <p>${temp} - ${condition}</p>
      `;

      setBackground(condition);
    })
    .catch((error) => {
      weatherDiv.innerHTML = `<p>Error fetching weather. Try again later.</p>`;
      console.error("Weather error:", error);
    });
}

function toggleTempUnit() {
  isCelsius = !isCelsius;
  getWeather();
}

function setTheme(mode) {
  document.body.className = mode;
  localStorage.setItem("theme", mode);
}

toggleBtn.onclick = () => {
  const current = document.body.className;
  setTheme(current === "dark" ? "light" : "dark");
};

window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
};

function setBackground(condition) {
  const conditionMap = {
    Clear: 'url("https://source.unsplash.com/1600x900/?sunny,clear-sky")',
    Clouds: 'url("https://source.unsplash.com/1600x900/?cloudy")',
    Rain: 'url("https://source.unsplash.com/1600x900/?rain")',
    Snow: 'url("https://source.unsplash.com/1600x900/?snow")',
    Thunderstorm: 'url("https://source.unsplash.com/1600x900/?storm")',
    Drizzle: 'url("https://source.unsplash.com/1600x900/?drizzle")',
    Mist: 'url("https://source.unsplash.com/1600x900/?mist")',
    Haze: 'url("https://source.unsplash.com/1600x900/?haze")',
    Smoke: 'url("https://source.unsplash.com/1600x900/?smoke")',
    Fog: 'url("https://source.unsplash.com/1600x900/?fog")',
  };

  const bgUrl = conditionMap[condition] || 'url("https://source.unsplash.com/1600x900/?weather")';
  document.body.style.backgroundImage = bgUrl;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";
}
