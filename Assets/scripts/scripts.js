// api key 
var key = '0015257cf3d37453b04b0cfba52caeed'
// api links 
var forecast = 'https://api.openweathermap.org/data/2.5/forecast';
var weather = 'https://api.openweathermap.org/data/2.5/weather';
var geocode = 'http://api.openweathermap.org/geo/1.0/direct';
// element references 
var searchContainer = $('#searchContainer');
var citySearch = $('#weatherForm');
var stateSelect = $('#stateSelect');
var today = $('#today');
var fiveDay = $('#fiveDay');
var heading = $('#heading');
var textArea = $('#city');
// grab city history from localstorage 
var cities = JSON.parse(localStorage.getItem("cities")) || [];

// create dropdown list with every state and dynamically create each option and append it
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
// iterate through stored cities and compare with repeat array to eliminate repeats. 
// Then create a button with city and state stored in data attributes and append the latest 10.
//  After buttons are appended display the latest city forecast 
var repeat = [];
if (cities.length > 0) {
  for (var x = 0; x < cities.length; x++) {
    var cont = false;
    if (repeat.length === 10) {
      break;
    }
    for (var y = 0; y < repeat.length; y++) {
      if (cities[x].city == repeat[y].city && cities[x].state == repeat[y].state) {
        cont = true;
      }
    }
    if (cont) {
      continue;
    }
    repeat.unshift({ state: cities[x].state, city: cities[x].city })
    searchContainer.append(`<button  class="cityBtn m-1 Btn rounded fs-6" data-state = "${cities[x].state}" data-city = "${cities[x].city}"> ${cities[x].city}</button>`);
  }
  getLatLong(cities[0].city, cities[0].state);

}

// listener for form submit 
citySearch.on('submit', formSubmit);
// listener for city history buttons 
searchContainer.on('click', '.cityBtn', cityBtnPress)

// function to display city from localstorage by pulling data attributes of the button pressed 
function cityBtnPress(event) {
  var city = $(event.target).attr('data-city');
  var state = $(event.target).attr('data-state');
  clearForecasts();
  getLatLong(city, state);
}

// clear out the data from the last forecast
function clearForecasts() {
  heading.removeClass('d-block').addClass('d-none');
  today.html('');
  fiveDay.html('');
}

// if invalid input show modal. If valid input store city and state into localStorage. 
// create a button for entered data. Display forecast for entered city 
function formSubmit(event) {
  event.preventDefault();
  if (event.target[1].value == 'default' || event.target[0].value.length < 1) {
    $('#exampleModal').modal('show');
  } else {
    if (cities.length > 0) {
      clearForecasts();
    }
    cities.unshift({ city: event.target[0].value, state: event.target[1].value })
    localStorage.setItem("cities", JSON.stringify(cities));
    citySearch.after(`<button class="cityBtn m-1 Btn rounded fs-6" data-city = "${event.target[0].value}" data-state = "${event.target[1].value}">${event.target[0].value}</button>`);
    getLatLong(event.target[0].value, event.target[1].value);
    textArea.val('');
    stateSelect.prop('selectedIndex', 0);
  }
}

// construct geocode link and get the coordinates for a city 
function getLatLong(city, state) {
  var link = `${geocode}?q=${city},${state},1&limit=1&appid=${key}`;
  fetch(link)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length == 0) {
        $('#exampleModal').modal('show');
        var badCity = $('#searchContainer').children('').eq(2);
        var city = badCity.attr('data-city');
        badCity.remove();
        var history = JSON.parse(localStorage.getItem("cities"));
        cities = history;
        for (var x = 0; x < history.length; x++) {
          if (history[x].city == city) {
            history.splice(x, 1);
          }
        }
        localStorage.setItem("cities", JSON.stringify(history));
        coordinates = 0;
        var latestCity = history[0];
        getLatLong(latestCity.city, latestCity.state);
      } else {
        var coordinates = [data[0].lat, data[0].lon];
        getForecast(coordinates);
      }
    });
}

// construct link for todays weather and 5 day forecast and send each data to display function 
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
      displayFiveDay(data);
    })
}

// display the forecast for today 
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

// display the 5 day forecast 
function displayFiveDay(data) {
  var icon;
  heading.removeClass('d-none').addClass('d-block');
  for (var x = 0; x < data.list.length; x++) {
    var today = dayjs().format('DD');
    var y = 0;
    if (dayjs().format('DD') == today && dayjs().format('H') < 9 && x === (data.list.length - 1)) {
      y = 1;
    } else if (dayjs(data.list[x].dt_txt).format('DD') == today) {
      continue;
    }
    if (dayjs(data.list[x].dt_txt).format('H') != '12' && y != 1) {
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
    var hum = $(`<h3>Humidity: ${data.list[x].main.humidity} %</h3>`);
    day.append(hum);

    fiveDay.append(day);
  }
}
