import USGS from './config/datasources/usgs.js';

// Define the endpoint you want to use, e.g., "instant-values" or "daily-values"
const endpoint = USGS['instant-values']; // or USGS['daily-values']

// Construct the URL for the API request using the parameters from the configuration
const apiUrl = `${endpoint.endpoint}?` +
  Object.keys(endpoint.params)
    .map(param => {
      if (endpoint.params[param] !== null) {
        return `${param}=${endpoint.params[param]}`;
      }
      return '';
    })
    .filter(param => param !== '')
    .join('&');

// Select the HTML element where you want to display the data
const dataContainer = document.getElementById('test-component');


function getData(params) {
    fetch("https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=ia&siteStatus=all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
    
      })
        .then(r => r.json())
        .then(data => console.log("data returned:", data))
}


// // Make the API request using the fetch API
// fetch(apiUrl, { method: endpoint.requirements.method })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(data => {
//     // Display the retrieved data in the dataContainer div
//     dataContainer.innerHTML = JSON.stringify(data, null, 2);
//   })
//   .catch(error => {
//     // Handle any errors that occurred during the fetch
//     console.error('Error:', error);
//   });

export {getData}