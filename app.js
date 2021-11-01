const weatherEl = document.getElementById("weather");
getWeather();

async function getWeather() {
  try {
    const locationData = await fetch(
      "http://api.ipstack.com/check?access_key=7db328531371ba5a408ae03e30c0fb59"
    ).then((r) => r.json());
    console.log(locationData);
    const weatherData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${locationData.city}&units=metric&appid=80a466d15d019f2b76bc5d87f144c4cb`
    ).then((r) => r.json());
    console.log(weatherData);
    const forecastData = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${locationData.city}&units=metric&cnt=3&appid=80a466d15d019f2b76bc5d87f144c4cb`
    ).then((r) => r.json());
    console.log(forecastData);
    weatherData.list = forecastData.list;
    render(createWeatherCard(weatherData), weatherEl);
  } catch (error) {
    alert(error);
  }
}

function createWeatherCard(data) {
  return `
    <div class="card">
    <div class="card__current">
    <time class="card__time" datetime="${getDate(data.dt, "json")}">${getDate(
    data.dt,
    "string"
  )}</time>
    <h1 class="card__city">${data.name}, ${data.sys.country}</h1>
    <div class="card__current-temp">
        <img class="card__icon" src="https://openweathermap.org/img/w/${
          data.weather[0].icon
        }.png" alt="${
    data.weather[0].main
  }" width="1" height="1" loading="lazy" decoding="async">
        <h2 class="card__temperature">${Math.round(
          data.main.temp
        )}&nbsp;&#8451;</h2>
    </div>
    <h3 class="card__description">
        <span>Feels like: ${Math.round(
          data.main.feels_like
        )}&nbsp;&#8451;, </span><span>${capitalize(
    data.weather[0].description
  )}</span>
    </h3>
    </div>
    <dl class="card__details">
        <div>
            <dt>Wind:</dt>
            <dd><i style="transform: rotateZ(${
              data.wind.deg + 90
            }deg)">&#10148;</i>&nbsp;${data.wind.speed} m/s</dd>
        </div>
        <div>
            <dt>Pressure:</dt>
            <dd>${data.main.pressure} hPa</dd>
        </div>
        <div>
            <dt>Humidity:</dt>
            <dd>${data.main.humidity} %</dd>
        </div>
        <div>
            <dt>Visibility:</dt>
            <dd>${data.visibility} m</dd>
        </div>
    </dl>
    <div class="card__forecast">
        ${createForecast(data.list)}
    </div>
</div>
    `;
}

function createForecast(forecast) {
  return forecast
    .map((item) => {
      return `<div class="card__forecast-item">
            <time class="card__time" datetime="${getDate(
              item.dt,
              "json"
            )}">${getDate(item.dt, "timestring")}</time>
            <img class="card__icon" src="https://openweathermap.org/img/w/${
              item.weather[0].icon
            }.png" alt="${
        item.weather[0].main
      }" width="1" height="1" loading="lazy" decoding="async">
            <h4>${item.weather[0].main}</h4>
            <h5>${Math.floor(item.main.temp)}&nbsp;&#8451;<h5>
        </div>`;
    })
    .join("");
}

function render(htmlStr, htmlEl) {
  htmlEl.innerHTML = htmlStr;
}

function getDate(timestamp, type) {
  if (type === "string") {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  }
  if (type === "timestring") {
    return new Date(Number(timestamp) * 1000).toLocaleTimeString();
  }
  if (type === "json") {
    return new Date(Number(timestamp) * 1000).toJSON();
  }
}
function capitalize(str = "") {
  return str[0].toUpperCase() + str.slice(1);
}
