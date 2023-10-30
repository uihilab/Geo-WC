

async function getData(url) {
  var jsonData = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }).then(r => r.json());
  return jsonData;
}

export { getData }