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

/* 
    Con licencia gratuita unicamente tenemos acceso a esta api la cual se "actualiza" cada 3 horas, por tanto podremos ver la previsión de 9 horas. Empieza a las 00:00, por lo que la siguiente llamada será a las 03:00. En caso de que hagamos la consulta a las 11:00, aparecerán reflejados los datos desde las 09:00 hasta las 15:00 horas. 
    https://openweathermap.org/forecast5


*/

/* 
    Llamada a la API

    api.openweathermap.org/data/2.5/forecast?lat={latitud}&lon={longitud}&units=${units}&cnt${numberOfTimestamps}&lang${language}&appid={API key} 

    IMPORTANTE -> Añadir https:// antes de la llamada ya que sino estaremos preguntando a nuestro servidor local (localhost:3000) y por tanto no conseguiremos la información. 
*/

/*  Variables y constantes para usar con la API */
const APIKey = "2238b138004bfdcffd5a7e524cab218e"; //Licencia de la API que usaremos cuando la llamemos
const lang = "es"; //Sacaremos los datos en español. Solamente se aplicará en el nombre de la ciudad y la descripción.
const units = "metric"; //Usaremos los datos en sistema métrico.

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

//Obtenemos coordinadas (latitud y longitud)
function getPermissionOfLocation() {
  if ("geolocation" in navigator) {
    //Funciona la geolocalizacion en el navegador

    //Permisos de ubicacion, asi podremos ver el state en el que se encuentra actualmente
    // navigator.permissions.query({ name: "geolocation" }).then(console.log);
    navigator.permissions.query({ name: "geolocation" }).then((result) =>
    {
      //Comprobamos el estado actual, salvo que este en denied haremos la llamada para obtener la ubicación. 
      if(result.state !== "denied")
      {
        statusLocation.textContent = `Localizando ...`;
        navigator.geolocation.getCurrentPosition((position) => {
          latitude = position.coords.latitude.toFixed(2); //Obtenemos solamente 2 decimales usando .toFixed(2) -> https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
          longitude = position.coords.longitude.toFixed(2);

          logCoordinates();
        });
      }
      else
      {
        statusLocation.textContent = "No se pudo localizar. Activa antes la ubicación de tu dispositivo. ";
      }
    });
    

  } else {
    //No funciona la geolocalización en el navegador
  }
}

//Mostramos en un parrafo las coordenadas
function logCoordinates() {
  statusLocation.textContent = `Latitud: ${latitude} Longitud: ${longitude}`;
}

//Probamos funcion obtener coordenadas.
locationButton.addEventListener("click", getPermissionOfLocation);
