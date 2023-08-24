const API_KEY = "52883561070485dc5f3f77c9697060a7";

const date = document.querySelector(".date");
const temperature = document.getElementById("temp");
const tempMinTempMax = document.querySelector(".hi-low");
const weatherDescription = document.querySelector(".weather");
const city = document.querySelector(".city");
let countryCodes;
// Example usage
fetchCountryData().then((countryCs) => {
  countryCodes = countryCs;
});

async function fetchCountryData() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    const countryCodes = {};
    countries.forEach((country) => {
      const countryCode = country.cca2;
      const countryName = country.name.common;
      if (countryCode && countryName) {
        countryCodes[countryCode] = countryName;
      }
    });
    console.log(countryCodes);
    return countryCodes;
  } catch (error) {
    console.error("Error fetching country data:", error);
    return {};
  }
}

async function fetchWeathercondition(long, lat) {
  let weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`
  );
  weatherData = await weatherData.json();
  return weatherData;
}

function fahrenheitToCelsius(fahrenheit) {
  const celsius = ((fahrenheit - 32) * 5) / 9;
  return celsius;
}

function kelvinToCelsius(kelvin) {
  const celsius = kelvin - 273.15;
  return parseInt(celsius);
}

function formatCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return currentDate.toLocaleDateString("en-US", options);
}

function renderUI({
  temp,
  humidity,
  pressure,
  windSpeed,
  main,
  description,
  icon,
  country,
  temp_min,
  temp_max,
}) {
  date.textContent = formatCurrentDate();
  let tempMax = kelvinToCelsius(temp_max);
  let tempMin = kelvinToCelsius(temp_min);
  temperature.textContent = kelvinToCelsius(temp);

  weatherDescription.textContent = description;
  console.log(countryCodes);
  city.textContent = `${countryCodes[country]} ${country}`;
  tempMinTempMax.textContent = `${tempMax}°C / ${tempMin}°C`;
}

navigator.geolocation.getCurrentPosition(
  async function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
    let weatherData = await fetchWeathercondition(longitude, latitude);
    console.log(weatherData.main);
    let { temp, humidity, pressure, temp_max, temp_min } = weatherData.main;
    let { main, description, icon } = weatherData.weather[0];
    let { country } = weatherData.sys;
    let windSpeed = weatherData.wind.speed;
    console.log(temp, humidity, pressure, windSpeed, main, description, icon);
    renderUI({
      temp,
      humidity,
      pressure,
      windSpeed,
      main,
      description,
      icon,
      country,
      temp_min,
      temp_max,
    });
  },
  function (error) {
    console.error("Error getting location:", error);
  }
);
