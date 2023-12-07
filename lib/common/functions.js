export function mergeObjects(obj1, obj2, caseSensitive = false) {
    // Use the spread operator to create a new object with the properties of obj1
    const mergedObject = { ...obj1 };

    // Iterate over the properties of obj2
    for (const key in obj2) {
        // Check if obj2 has its own property (not inherited)
        if (obj2.hasOwnProperty(key)) {
            const targetKey = caseSensitive ? key : key.toLowerCase();

            // Overwrite the property in the mergedObject
            mergedObject[targetKey] = obj2[key];
        }
    }

    return mergedObject;
}

// Function to get user's location and find the US state USPS code using OSM Nominatim
export async function getUserLocation() {
    return new Promise(async (resolve, reject) => {
        if ('geolocation' in navigator) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const { latitude, longitude } = position.coords;

                const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.address && data.address['ISO3166-2-lvl4']) {
                    const stateCode = data.address['ISO3166-2-lvl4'].split('-')[1];
                    resolve(stateCode);
                } else {
                    reject('No state code information found in the response');
                }
            } catch (error) {
                reject(`Error getting location: ${error.message}`);
            }
        } else {
            reject('Geolocation is not supported by this browser.');
        }
    });
}

export function createLoadingAnimation(message) {
    // Create the container div
    var container = document.createElement("div");

    // Create a text node
    var textNode = document.createTextNode(message);

    // Append the text node to the container
    container.appendChild(textNode);

    container.classList.add("loading-container");

    // Create the spinner div
    var spinner = document.createElement("div");
    spinner.classList.add("loading-spinner");

    // Append the spinner to the container
    container.appendChild(spinner);

    // Return the container element
    return container;
}