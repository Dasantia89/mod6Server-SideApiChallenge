var key = '40799473c0f8af4234bae3f870dc5940'
var forecast = 'https://api.openweathermap.org/data/2.5/forecast'; 
// lat={lat}&lon={lon}
var geocode = 'http://api.openweathermap.org/geo/1.0/direct';
var citySearch = $('#weatherForm');
var submitBtn = $('#submitBtn');
var stateSelect = $('#stateSelect');
var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
"Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
"Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
"New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
"South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

for(var x=0; x<states.length;x++){
    var state = states[x];
    var option = $(`<option value="${state}">${state}</option>`);
    stateSelect.append(option)
}

citySearch.on('submit',displayWeather);
function displayWeather(event){
    event.preventDefault();
    console.log(event.target[0].value)
    var latLong = getLatLong(event.target[0].value);
    // $('#exampleModal').modal('show');
}

function getLatLong (city){
    var link = geocode + '?q=' + city + '&limit=1&appid=' + key;
    console.log(link)
    fetch(link, )
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
}