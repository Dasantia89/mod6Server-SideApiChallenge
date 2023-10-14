https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=40799473c0f8af4234bae3f870dc5940

var citySearch = $('#weatherForm');
var submitBtn = $('#submitBtn');
citySearch.on('submit',displayWeather);
console.log(citySearch)

function displayWeather(event){
    event.preventDefault();
    console.log(event.target[0].value)
    $('#exampleModal').modal('show');
}