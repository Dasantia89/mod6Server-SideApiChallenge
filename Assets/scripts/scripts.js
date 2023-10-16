var key = '0015257cf3d37453b04b0cfba52caeed'
var forecast = 'https://api.openweathermap.org/data/2.5/forecast'; 
var weather = 'https://api.openweathermap.org/data/2.5/weather';
var geocode = 'http://api.openweathermap.org/geo/1.0/direct';
var citySearch = $('#weatherForm');
var submitBtn = $('#submitBtn');
var stateSelect = $('#stateSelect');
const today = [];
var cities = [];
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
for(var x=0; x<states.length;x++){
    var state = states[x];
    var code = stateCodes[x]
    var option = $(`<option value="${code}">${state}</option>`);
    stateSelect.append(option)
}

citySearch.on('submit',displayWeather);

function displayWeather(event){
    event.preventDefault();    
    if(event.target[1].value == 'State' || event.target[0].value.length<1){
    $('#exampleModal').modal('show');
    }else{
        var latLong;
        latLong = getLatLong(event.target[0].value,event.target[1].value);   
        console.log(today)     
    }
}

function getLatLong (city,state){
  var link = `${geocode}?q=${city},${state},1&limit=1&appid=${key}`;
  fetch(link)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  if(data.length == 0){
      $('#exampleModal').modal('show');
      coordinates = 0;
  }else{
    var coordinates = [data[0].lat, data[0].lon];
      getForecast(coordinates);
  }
});
}

