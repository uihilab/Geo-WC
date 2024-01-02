async function fetchRemoteData(url) {
  var jsonData = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }).then(r => r.json());
  return jsonData;
}

async function fetchUsgsSiteData() {
  var data = await fetch("https://waterservices.usgs.gov/nwis/site/?format=gm,1.0&stateCd=ia&siteStatus=all&outputDataTypeCd=dv", {
    method: "GET",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml",
    }
  }).then(response => response.text());
  return data;
}

export { fetchRemoteData, fetchUsgsSiteData }