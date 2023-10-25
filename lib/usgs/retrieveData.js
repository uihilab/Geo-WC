import USGS from '../config/datasources/usgs.js';

async function getData(params) {
  var jsonData = await fetch("https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=ia&siteStatus=all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }).then(r => r.json());
  return jsonData;
}

export { getData }