"use strict";

/* Obtenemos los elementos de HTML usando querySelector */
const locationButton = document.querySelector("#mainButton");
// console.log(locationButton);

const statusLocation = document.querySelector("#currentStatus");
// console.log(statusLocation);

let mainTitle = document.querySelector("h1");
// console.log(mainTitle);

const html = document.querySelector("html");
// console.log(html);

const darkModeButton = document.querySelector("#darkModeButton");
// console.log(darkModeButton);

const cardsZone = document.querySelector("section ul");
// console.log(cardsZone);

/* 
    Con licencia gratuita unicamente tenemos acceso a esta api la cual se "actualiza" cada 3 horas, por tanto podremos ver la previsión de 9 horas. Empieza a las 00:00, por lo que la siguiente llamada será a las 03:00. En caso de que hagamos la consulta a las 11:00, aparecerán reflejados los datos desde las 09:00 hasta las 15:00 horas. 
    https://openweathermap.org/forecast5


*/

/* 
    Llamada a la API

    api.openweathermap.org/data/2.5/forecast?lat={latitud}&lon={longitud}&units=${units}&cnt=${numberOfTimestamps}&lang=${language}&appid={API key} 

    IMPORTANTE -> Añadir https:// antes de la llamada ya que sino estaremos preguntando a nuestro servidor local (localhost:3000) y por tanto no conseguiremos la información. 
*/

/*
  Obtener iconos de la API

  https://openweathermap.org/img/wn/${icon}@4x.png -> Sustituiremos icon con el ID correspondiente. 
  
*/

/*  Variables y constantes para usar con la API */
const APIKey = "2238b138004bfdcffd5a7e524cab218e"; //Licencia de la API que usaremos cuando la llamemos
const lang = "es"; //Sacaremos los datos en español. Solamente se aplicará en el nombre de la ciudad y la descripción.
const units = "metric"; //Usaremos los datos en sistema métrico.
const numberOfTimestamps = 3; //Cambiamos a dos para debuggear @TODO cambiar a 3

/* Declaramos variables globales para poder usar donde queramos latitud y longitud. */
let latitude;
let longitude;

/* Función para conmutar modo oscuro */
function handleDarkModeButton() {
  //Nombre de la clase provisional.
  html.classList.toggle(".darkModeButton");
  console.log("DarkMode:", html.classList.contains(".darkModeButton"));
}

//Event listener onClick del boton darkMode
darkModeButton.addEventListener("click", handleDarkModeButton);

/* Conseguir coordenadas y llamada a la API */

//Obtenemos coordinadas (latitud y longitud)
function getPermissionOfLocation() {
  if ("geolocation" in navigator) {
    //Funciona la geolocalizacion en el navegador

    //Permisos de ubicacion, asi podremos ver el state en el que se encuentra actualmente
    // navigator.permissions.query({ name: "geolocation" }).then(console.log);
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      //Comprobamos el estado actual, salvo que este en denied haremos la llamada para obtener la ubicación.
      if (result.state !== "denied") {
        statusLocation.textContent = `Localizando ...`;
        navigator.geolocation.getCurrentPosition((position) => {
          latitude = position.coords.latitude.toFixed(2); //Obtenemos solamente 2 decimales usando .toFixed(2) -> https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
          longitude = position.coords.longitude.toFixed(2);
          showWeather();
        });
      } else {
        statusLocation.textContent =
          "No se pudo localizar. Activa antes la ubicación de tu dispositivo. ";
      }
    });
  } else {
    //No funciona la geolocalización en el navegador
  }
}

//Mostramos en un parrafo las coordenadas
function logCoordinates(cityName) {
  statusLocation.textContent = `Latitud: ${latitude} Longitud: ${longitude}`;
  mainTitle.textContent = `¿Lloverá en ${cityName}?`;
}

//Obtenemos la informacion en JSON de la API. Si no, lanzaremos un error
async function getDataFromURL(url) {
  try {
    let dataFetch = await fetch(url);
    let dataJSON = await dataFetch.json();
    return dataJSON;
  } catch (e) {
    throw new Error("Hay un error con la URL. ");
  }
}

async function showWeather() {
  const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${units}&cnt=${numberOfTimestamps}&lang=${lang}&appid=${APIKey}`;

  let informacionBruto = await getDataFromURL(URL);

  let { city, list } = await informacionBruto;

  getWeatherInformation(list);

  logCoordinates(city.name);
}

async function getWeatherInformation(list) {
  let dataWeatherByDate = {};
  let dataWeather = [];

  for (const dt in list) {
    let { temp, temp_max, temp_min } = list[dt].main; //Hacemos destructuring y conseguimos temperatura [temp], temperatura maxima[temp_max], temperatura minima[temp_min]

    let [fecha, hora] = list[dt].dt_txt.split(" "); //Obtenemos la fecha y la hora

    //Generamos un objeto con la informacion que necesitamos
    dataWeatherByDate = {
      fecha: fecha, //Fecha actual. Formato YYYY-MM-DD
      hora: hora, //Hora actual. Formato HH:MM:SS
      temperatura: Math.round(temp), //Temperatura actual
      temperatura_maxima: Math.round(temp_max), //Temperatura maxima
      temperatura_minima: Math.round(temp_min), //Temperatura minima
      weather: list[dt].weather, //Información meteorologica: main-> tipo de clima; description -> información detallada del clima; icon -> información que tendremos que obtener mediante la API
    };

    dataWeather.push(dataWeatherByDate);
  }
  // console.log(dataWeather);
  generateCards(dataWeather);
}

async function getIconFromAPI(arr) {
  console.log(arr.weather);
  for (const it of arr) {
    let [{ icon }] = it.weather;
    let url = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  }
}
async function getIconFromAPI(arr) {
  for (const it of arr) {
    let [{ icon }] = it.weather;
    let url = `https://openweathermap.org/img/wn/${icon}@4x.png`; //Esto lo tendremos que meter en la etiqueta img dentro del src

    console.log(url);
  }
}

function generateCards(arr) {
  cardsZone.innerHTML = "";
  for (const it in arr) {
    cardsZone.innerHTML += loadInformation(arr[it]);
  }
}

function loadInformation(arr) {
  let [{ icon, description }] = arr.weather;
  return `<li>
            <article>
              <section>
                <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="">
                <p>${
                  description.charAt(0).toUpperCase() + description.slice(1)
                }</p> 
              </section>
              <h2>${arr.hora}</h2>
              <p>Temperatura<span>${arr.temperatura}</span></p>
              <p>Temperatura Máxima<span>${arr.temperatura_maxima}</span></p>
              <p>Temperatura Minima<span>${arr.temperatura_minima}</span></p>
            </article>
          </li>`;
}

//Probamos funcion obtener coordenadas.
locationButton.addEventListener("click", getPermissionOfLocation);

//Modo dark mode
const button = document.querySelector("#darkModeButton");

button.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});
