const key = "NbKdLDIvbtj4GkAv4eKcP8CHctYhVin4";
let locationID = localStorage.getItem("locationID") || "187745";
const locationContainer = document.querySelector(".location-name");
if (localStorage.getItem("locationName")) locationContainer.textContent = localStorage.getItem("locationName");
const mainURL = "https://dataservice.accuweather.com/";
const input = document.querySelector(".search-input");
input.addEventListener("input", fetchLocations(input));

//debounce function for getting available search locations
function fetchLocations() {
  let time;
  return function (inp) {
    if (time) clearInterval(time);
    time = setTimeout(() => {
      searchLocation(inp.target.value.trim());
    }, 1000);
  };
}
//search for location
async function searchLocation(locationName) {
  try {
    const locationArray = await (await fetch(`${mainURL}locations/v1/cities/autocomplete?apikey=${key}&q=${locationName}`)).json();
    console.log(locationArray);
    show_available_locations(locationArray);
  } catch (error) {
    // console.log(error.message)
  }
}
//showing available locations ...
function show_available_locations(data) {
  const container = document.querySelector("header .locations .list");
  container.style.display = "block";
  container.innerHTML = "";
  let list = [];
  list = data.map(
    (element) =>
      `<li id=${element.Key}>${element.LocalizedName}, ${element.LocalizedName != element.AdministrativeArea.LocalizedName ? element.AdministrativeArea.LocalizedName + ", " : ""} ${
        element.Country.ID
      }</li>`
  );
  list = list.join("");
  if (list.length) container.innerHTML = list;
  else container.innerHTML = "<li>Search Not Found</li>";
  const li = document.querySelectorAll(".locations .list li");
  li.forEach((list) =>
    list.addEventListener("click", function () {
      localStorage.setItem("locationID", list.id);
      getWeatherInfo(list.id);
      locationContainer.textContent = list.textContent;
      localStorage.setItem("locationName", list.textContent);
      container.style.display = "none";
      input.value = "";
    })
  );
}
//fetching all weather conditions for a specific location
getWeatherInfo(locationID);
async function getWeatherInfo(locationID) {
  try {
    const currentWeather = await (await fetch(`${mainURL}currentconditions/v1/${locationID}?apikey=${key}`)).json();
    const forcastWeather = await (await fetch(`${mainURL}forecasts/v1/daily/5day/${locationID}?apikey=${key}&metric=true`)).json();
    const hourlyWeather = await (await fetch(`${mainURL}forecasts/v1/hourly/12hour/${locationID}?apikey=${key}&metric=true`)).json();
    const airQuality = await (await fetch(`${mainURL}/indices/v1/daily/1day/${locationID}/groups/32?apikey=${key}`)).json();
    show_current_weather(currentWeather[0]);
    show_5_days_weather(forcastWeather.DailyForecasts);
    show_12_hours_weather(hourlyWeather);
    show_air_quality(airQuality);
  } catch (error) {
    locationContainer.innerHTML = `<i class="uil uil-exclamation-octagon error"></i> Internal error occured`;
  }
}

//showing current weather
function show_current_weather(data) {
  data.IsDayTime
    ? (document.querySelector(".current-weather-card").style.backgroundImage = `url("images/day.jpg")`)
    : (document.querySelector(".current-weather-card").style.backgroundImage = `url("images/night.jpg")`);
  document.querySelector(".current-weather-card").style.color = `#ffffff`;
  document.querySelector(".main-card figcaption").textContent = data.WeatherText;
  document.querySelector(".main-card img").src = `images/Weather Icons/${data.WeatherIcon}.png`;
  document.querySelector(".main-card .temp").textContent = `${data.Temperature.Metric.Value} °C`;
  document.querySelector(".main-card .time").textContent = formatTime(data.LocalObservationDateTime, "full", null).split(",").slice(1).join("");
  document.querySelector(".main-card .day").textContent = formatTime(data.LocalObservationDateTime, "full", null).split(",")[0];
}

//showing 5 days weather forcast
function show_5_days_weather(data) {
  const container = document.querySelector("._5-days-forcast-card .card-body");
  const template = document.querySelector("._5-days-forcast-card  #template");
  container.innerHTML = "";
  data.forEach((data) => {
    let div = template.content.cloneNode(true);
    div.querySelector(".date").textContent = formatTime(data.Date, "short", null);
    div.querySelector(".icon img").src = `images/Weather Icons/${data.Day.Icon}.png`;
    div.querySelector(".temp").textContent = `${data.Temperature.Maximum.Value} °C`;
    container.append(div);
  });
}
//showing 12 12 how's weather forecast
function show_12_hours_weather(data) {
  const container = document.querySelector("._12-hours-forcast-card .card-body");
  const template = document.querySelector("._12-hours-forcast-card  #template");
  container.innerHTML = "";
  data.forEach((data) => {
    let div = template.content.cloneNode(true);
    div.querySelector(".time").textContent = formatTime(data.DateTime, null, "short");
    div.querySelector(".icon img").src = `images/Weather Icons/${data.WeatherIcon}.png`;
    div.querySelector(".temp").textContent = `${data.Temperature.Value} °C`;
    container.append(div);
  });
}
//showing air quality
function show_air_quality(data) {
  const container = document.querySelector(".aqi-data");
  let AQI = data.find((indices) => indices.Name.includes("Air Quality Index") || indices.ID == "-10");
  container.textContent = AQI.Category;
}
function formatTime(str, date, time) {
  let dateString = new Date(str);
  let options;
  if (time == null) {
    date == "full" ? (options = { dateStyle: "full" }) : (options = { day: "2-digit", month: "short" });
    customeDate = dateString.toLocaleDateString("en-us", options);
  }
  if (date == null) {
    options = { hour: "2-digit", hour12: true };
    customeDate = dateString.toLocaleTimeString("en-us", options);
  }
  return customeDate;
}
