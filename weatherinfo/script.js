const searchTab = document.querySelector("[searchTab]");
const userTab = document.querySelector("[userTab]");
const userContainer = document.querySelector(".weathercontainer");
const grantContainer = document.querySelector("[grantContainer]");
const formContainer = document.querySelector("[formContainer]");
const loading = document.querySelector(".loding-container");
const userInfoContainer= document.querySelector(".userserch-container");
//initially vairables need????

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

//switch tab function 
function  switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab ;
        oldTab.classList.add("current-tab");
    
     if(!formContainer.classList.contains("active")){
        grantContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        formContainer.classList.add("active");
     }
     else{
        formContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
     }
    }
}
userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    
    switchTab(searchTab);
});
//check user location store hai 
function  getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantContainer.classList.add("active");  
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
     const {lat, lon} = coordinates;
     grantContainer.classList.remove("active"); 
     //loading screen 
     loading.classList.add("active");
     //api call
     try{
        const result= await fetch
        ( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const  data = await result.json();
        loading.classList.remove("active");
        userInfoContainer.classList.add("active");
       
        renderWeatherInfo(data);
     }
     catch(err){
        loading.classList.remove("active");
      
     }
}
function renderWeatherInfo(weatherInfo){
     //fistly, we have to fethc the elements 

     const cityName = document.querySelector("[cityName]");
     const flag = document.querySelector("[Flag]");
     const desc = document.querySelector("[data-weatherDisc]");
     const weatherIcon = document.querySelector("[WeatherIcon]");
     const temp = document.querySelector("[data-temp]");
     const windspeed = document.querySelector("[data-speed]");
     const humidity = document.querySelector("[data-humidity]");
     const cloud = document.querySelector("[data-cloud]");
     console.log(weatherInfo);
      //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    flag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloud.innerText = `${weatherInfo?.clouds?.all}%`;
 

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

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
const grantAccessButton = document.querySelector("[btn-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);
const searchInput = document.querySelector("[data-searchInput]");
formContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})
async function fetchSearchWeatherInfo(city) {
    loading.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantContainer.classList.remove(".active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loading.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW 
        
    }
}
