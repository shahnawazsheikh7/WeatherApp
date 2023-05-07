const yourweathertab = document.querySelector("[tab1]");
const searchweathertab = document.querySelector("[tab2]");

const searchWeather = document.querySelector('.search-weather-container');
const weatherInfo = document.querySelector('.weather-info-container');
const loadingScreen = document.querySelector('.loading-screen-container');
const grantAccess = document.querySelector('.grant-access-container');

const grantAccessButton = document.querySelector(".grant-access-btn");

const searchForm = document.querySelector('.search-weather-container');
const searchInput = document.querySelector('[searchCity]');
const searchButton = document.querySelector('.search-btn');


const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"; 
// 


//GETTING STARTED

let currenttab = yourweathertab;
currenttab.classList.add('current-tab');
getFromSessionStorage();

//TAB SWITCH LOGIC

function tabswitch(clickedtab){
    if(clickedtab!=currenttab){
        currenttab.classList.remove('current-tab');
        currenttab = clickedtab;
        currenttab.classList.add('current-tab');

        if(!searchWeather.classList.contains('active')){
            searchWeather.classList.add('active');
            loadingScreen.classList.remove('active');
            grantAccess.classList.remove('active');
            weatherInfo.classList.remove('active');
        }
        else{
            searchWeather.classList.remove('active');
            loadingScreen.classList.add('active');
            getFromSessionStorage();
        }
    }
    else{
        return;
    }
}


//FUNCTIONS

function getFromSessionStorage(){
    const data = sessionStorage.getItem('user-data');
    if(data){
        const coordinates = JSON.parse(data);
        fetchUserWeatherInfo(coordinates);
    }
    else{
            searchWeather.classList.remove('active');
            loadingScreen.classList.remove('active');
            weatherInfo.classList.remove('active');
            grantAccess.classList.add('active');

    }
}

function renderWeatherOnUI(response){
    loadingScreen.classList.remove('active');
    grantAccess.classList.remove('active');
    weatherInfo.classList.add('active');

    const weatherCity = document.querySelector(".weather-city");
    const weatherCityIcon = document.querySelector(".weather-city-icon");
    const weatherDescription = document.querySelector(".weather-description");
    const weatherIcon = document.querySelector(".weather-icon");
    const weatherTemperature = document.querySelector(".temperature");
    const weatherWindspeed = document.querySelector("[windspeed]");
    const weatherHumidity = document.querySelector("[humidity]");
    const weatherCloud = document.querySelector("[cloud]");

    weatherCity.innerText = response?.name;
    weatherCityIcon.src = `https://flagcdn.com/144x108/${response?.sys?.country.toLowerCase()}.png`;
    weatherDescription.innerText = response?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${response?.weather?.[0]?.icon}.png`;
    weatherTemperature.innerText = `${response?.main?.temp} °C`;
    weatherWindspeed.innerText = `${response?.wind?.speed} m/s`;
    weatherHumidity.innerText = `${response?.main?.humidity} %`; 
    weatherCloud.innerText = `${response?.clouds?.all} %`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-data", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;
    searchWeather.classList.remove('active');
    grantAccess.classList.remove('active');
    weatherInfo.classList.remove('active');
    loadingScreen.classList.add('active');

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();
        renderWeatherOnUI(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW

    }

}
async function getWeatherInfoFromCity(city){
    searchWeather.classList.add('active');
    loadingScreen.classList.add('active');
    grantAccess.classList.remove('active');
    weatherInfo.classList.remove('active');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        renderWeatherOnUI(data);

    }
    catch{
        console.log(e);
    }

}


//EVENT LISTENERS

yourweathertab.addEventListener('click',()=>{
    tabswitch(yourweathertab);
});
searchweathertab.addEventListener('click',()=>{
    tabswitch(searchweathertab);
});
grantAccessButton.addEventListener('click',getLocation);

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName==="")
    return;

    else{
        searchInput.value = "";
        searchWeather.classList.add('active');
        loadingScreen.classList.add('active');
        grantAccess.classList.remove('active');
        weatherInfo.classList.remove('active');
        getWeatherInfoFromCity(cityName);
    }
});
