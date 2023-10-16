var key = '0015257cf3d37453b04b0cfba52caeed'
var forecast = 'https://api.openweathermap.org/data/2.5/forecast';
var weather = 'https://api.openweathermap.org/data/2.5/weather';
var geocode = 'http://api.openweathermap.org/geo/1.0/direct';
var searchContainer = $('#searchContainer');
var citySearch = $('#weatherForm');
var stateSelect = $('#stateSelect');
var today = $('#today');
var fiveDay = $('#fiveDay');
var heading = $('#heading');
var cities = JSON.parse(localStorage.getItem("cities")) || [];

var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
var stateCodes = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];
for (var x = 0; x < states.length; x++) {
  var state = states[x];
  var code = stateCodes[x]
  var option = $(`<option value="${code}">${state}</option>`);
  stateSelect.append(option)
}
if (cities.length > 0) {
  getLatLong(cities[0].city, cities[0].state);

}
for (var x = 0; x < 10; x++) {
  searchContainer.append(`<button  class="cityBtn m-1 Btn rounded fs-6" data-state = "${cities[x].state}" data-city = "${cities[x].city}"> ${cities[x].city}</button>`)
}
citySearch.on('submit', displayWeather);
searchContainer.on('click', '.cityBtn', cityBtnPress)

function cityBtnPress(event) {
  var city = $(event.target).attr('data-city');
  var state = $(event.target).attr('data-state');
  clearForecasts();
  getLatLong(city, state);
}

function clearForecasts() {
  heading.removeClass('d-block').addClass('d-none');
  today.html('');
  fiveDay.html('');
}
function displayWeather(event) {
  event.preventDefault();

  if (event.target[1].value == 'State' || event.target[0].value.length < 1) {
    $('#exampleModal').modal('show');
  } else {
    if (cities.length > 0) {
      clearForecasts();
    }
    cities.unshift({ city: event.target[0].value, state: event.target[1].value })
    localStorage.setItem("cities", JSON.stringify(cities));
    citySearch.after(`<button class="cityBtn m-1 Btn rounded fs-6" data-city = "${event.target[0].value}" data-state = "${event.target[1].value}">${event.target[0].value}</button>`);
    getLatLong(event.target[0].value, event.target[1].value);
  }
}


function getLatLong(city, state) {
  var link = `${geocode}?q=${city},${state},1&limit=1&appid=${key}`;
  fetch(link)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length == 0) {
        $('#exampleModal').modal('show');
        coordinates = 0;
      } else {
        var coordinates = [data[0].lat, data[0].lon];
        getForecast(coordinates);
      }
    });
}

function getForecast(coords) {
  var link = `${weather}?lat=${coords[0]}&lon=${coords[1]}&appid=${key}&units=imperial`
  fetch(link)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayToday(data);

    })

  link = `${forecast}?lat=${coords[0]}&lon=${coords[1]}&appid=${key}&units=imperial`
  fetch(link)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      displayFiveDay(data);
    })
}

function displayToday(data) {
  today.css('border', 'solid 1px black');
  var date = dayjs().format('MM/DD/YYYY');
  var icon;
  if (data.weather[0].main == 'Clouds') {
    icon = '<i class="bi bi-clouds-fill"></i>';
  } else if (data.weather[0].main == 'Clear') {
    icon = '<i class="bi bi-brightness-high"></i>';
  } else {
    icon = '<i class="bi bi-cloud-rain-heavy"></i>';
  }
  var lineOne = $(`<h1>${data.name} ${date} ${icon}</h1>`);
  today.append(lineOne);
  var temp = $(`<h2>Temp: ${data.main.temp}°F</h2>`);
  today.append(temp);
  var wind = $(`<h2>Wind: ${data.wind.speed} MPH</h2>`);
  today.append(wind);
  var hum = $(`<h2>Humidity: ${data.main.humidity} %</h2>`);
  today.append(hum);

}

function displayFiveDay(data) {
  var icon;
  heading.removeClass('d-none').addClass('d-block');
  for (var x = 0; x < data.list.length; x++) {
    var today = dayjs().format('DD');
    var y = 0;
    if (dayjs().format('DD') == today && dayjs().format('H') < 9 && x === (data.list.length-1)){
    y = 1;
    }else if (dayjs(data.list[x].dt_txt).format('DD') == today) {
      continue;
    }
    if (dayjs(data.list[x].dt_txt).format('H') != '12' && y!=1) {
      continue;
    }

    if (data.list[x].weather[0].main == 'Clouds') {
      icon = '<h2 class="bi bi-clouds-fill "></h2>';
    } else if (data.list[x].weather[0].main == 'Clear') {
      icon = '<h2 class="bi bi bi-brightness-low-fill"></h2>';
    } else {
      icon = '<h2 class="bi bi-cloud-rain-heavy"></h2>';
    }
    var day = $('<div class="col-2 p-2 d-flex flex-column day"></div>');
    var lineOne = $(`<h3>${dayjs(data.list[x].dt_txt).format('MM/DD/YYYY')}</h2>`);
    day.append(lineOne);
    day.append(icon);
    var temp = $(`<h3>Temp: ${data.list[x].main.temp}°F</h3>`);
    day.append(temp);
    var wind = $(`<h3>Wind: ${data.list[x].wind.speed} MPH</h3>`);
    day.append(wind);
    var hum = $(`<h3>Humidity: ${data.list[x].main.humidity}</h3> %`);
    day.append(hum);

    fiveDay.append(day);
  }
}
