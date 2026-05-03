const weatherApi = {
    key: "b46b5c619021b3149c676633461ec58d", // ⚠️ Replace this
    baseUrl: "https://api.openweathermap.org/data/2.5/weather"
};

const inputBox = document.getElementById("input-box");
const searchBtn = document.getElementById("search-btn");
const weatherBody = document.getElementById("weather-body");
const loading = document.getElementById("loading");

// Enter key
inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getWeatherReport(inputBox.value);
    }
});

// Button click
searchBtn.addEventListener("click", () => {
    getWeatherReport(inputBox.value);
});

async function getWeatherReport(city) {
    if (!city) {
        swal("Empty Input", "Please enter a city name", "error");
        return;
    }

    try {
        loading.style.display = "block";
        weatherBody.style.display = "none";

        const res = await fetch(
            `${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`
        );

        if (!res.ok) {
            throw new Error("City not found");
        }

        const data = await res.json();
        showWeatherReport(data);

    } catch (error) {
        swal("Error", error.message, "error");
    } finally {
        loading.style.display = "none";
        inputBox.value = "";
    }
}

function showWeatherReport(weather) {
    weatherBody.style.display = "block";

    const today = new Date();

    weatherBody.innerHTML = `
        <div class="location">
            <h3>${weather.name}, ${weather.sys.country}</h3>
            <p>${formatDate(today)}</p>
        </div>

        <div class="temp">
            ${Math.round(weather.main.temp)}°C
        </div>

        <div class="weather">
         <div class="icon">
           <i class="${getIcon(weather.weather[0].main)}"></i>
         </div>
         ${weather.weather[0].description}
        </div>

        <div class="details">
          <div class="card">🌡 Feels like<br>${weather.main.feels_like}°C</div>
          <div class="card">💧 Humidity<br>${weather.main.humidity}%</div>
          <div class="card">🌬 Wind<br>${weather.wind.speed} km/h</div>
        </div>
    `;

    changeBackground(weather.weather[0].description);
}

function formatDate(date) {
    return date.toDateString();
}

function getIcon(condition) {
    const icons = {
        Clear: "fas fa-sun",
        Clouds: "fas fa-cloud",
        Rain: "fas fa-cloud-showers-heavy",
        Drizzle: "fas fa-cloud-rain",
        Thunderstorm: "fas fa-bolt",
        Snow: "fas fa-snowflake",
        Mist: "fas fa-smog",
        Haze: "fas fa-smog",
        Fog: "fas fa-smog",
        Smoke: "fas fa-smog"
    };

    return icons[condition] || "fas fa-cloud";
}

function changeBackground(condition) {
    const bgMap = {
    Clear: "linear-gradient(to right, #fceabb, #f8b500)",
    Clouds: "linear-gradient(to right, #d7d2cc, #304352)",
    Rain: "linear-gradient(to right, #4e54c8, #8f94fb)",
    Thunderstorm: "linear-gradient(to right, #232526, #414345)",
    Drizzle: "linear-gradient(to right, #89f7fe, #66a6ff)",
    Snow: "linear-gradient(to right, #e6dada, #274046)"
    };

    document.body.style.background = bgMap[condition] || "#4facfe";
}