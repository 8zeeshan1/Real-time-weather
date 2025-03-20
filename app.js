let countryselect = document.querySelector(".country select");
let stateselect = document.querySelector(".state select");
let cityselect = document.querySelector(".city select");
let data = [];
let ctlatlongdata = {};
let BASE_URL =
  "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=dc52495632d45ddadf2a48104af1a6f9";
// Fetch JSON data
fetch("/data.json")
  .then((response) => response.json())
  .then((jsonData) => {
    data = jsonData; // Since the JSON starts with an array

    data.forEach((country) => {
      let opt = document.createElement("option");
      opt.innerText = country.name;
      opt.value = country.name;
      countryselect.append(opt);
    });

    countryselect.addEventListener("change", function () {
      stateselect.innerHTML = "<option> Select a state </option>";
      cityselect.innerHTML = "<option> Select a city </option>";
      const selectedcountry = this.value;
      const countrydata = data.find(
        (country) => country.name === selectedcountry
      );

      countrydata.states.forEach((state) => {
        let opt = document.createElement("option");
        opt.innerText = state.name;
        opt.value = state.name;
        stateselect.append(opt);
      });

      ctlatlongdata[countrydata.name] = {
        latitude: countrydata.latitude,
        longitude: countrydata.longitude,
      };
    });


    stateselect.addEventListener("change", function () {
      const selectedstate = this.value;
      cityselect.innerHTML = "<option>Select a city</option>";
      const selectedcountry = document.querySelector(".country select").value;
      const countrydata = data.find(
        (country) => country.name === selectedcountry
      );
      const statedata = countrydata.states.find(
        (state) => state.name === selectedstate
      );

      statedata.cities.forEach((city) => {
        let opt = document.createElement("option");
        opt.innerText = city.name;
        opt.value = city.name;
        addcitydata(city.name, city.latitude, city.longitude);
        cityselect.append(opt);
      });

      ctlatlongdata[statedata.name] = {
        latitude: statedata.latitude,
        longitude: statedata.longitude,
      };
    });
  });

function addcitydata(cityName, latitude, longitude) {
  ctlatlongdata[cityName] = {
    latitude: latitude,
    longitude: longitude,
  };
}

let coordinates;
let button = document.querySelector("form button");
button.addEventListener("click", async (evt) => {
  evt.preventDefault();
  if (stateselect.value === "Select a state") {
    coordinates = getCoordinates(countryselect.value);
  } else if (cityselect.value === "Select a city") {
    coordinates = getCoordinates(stateselect.value);
  } else {
    const selectedcity = cityselect.value;
    coordinates = getCoordinates(selectedcity);
  }
  function getCoordinates(cityName) {
    if (ctlatlongdata[cityName]) {
      const { latitude, longitude } = ctlatlongdata[cityName];
      return { latitude, longitude };
    }
  }

  // console.log(coordinates.latitude);
  // console.log(coordinates.longitude);
  // console.log(BASE_URL);
  BASE_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=dc52495632d45ddadf2a48104af1a6f9`;
  let response = await fetch(BASE_URL);
  let data = await response.json();
  console.log(data);
  const ctemp = Math.round(data.main.temp - 273.14);
  document.querySelector("#temp").innerText = `Temperature: ${ctemp}° C`;
  document.querySelector(
    "#humidity"
  ).innerText = `Humidity: ${data.main.humidity}%`;
  document.querySelector(
    "#atmprsr"
  ).innerText = `Pressure: ${data.main.pressure}hPa`;
  document.querySelector("#visibility").innerText = `Visibility: ${
    data.visibility / 1000
  }km`;
  document.querySelector(
    "#weather"
  ).innerText = `Weather: ${data.weather[0].main}`;
});
