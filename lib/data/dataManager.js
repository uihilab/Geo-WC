import DataStorage from './dataStorage.js';

var lastDataKey = null;

const DataManager = {
    async getData(key, apiEndpoint) {
        var data;
        const storedData = DataStorage.retrieveData(key);
        if (storedData) {
            data = storedData;
            lastDataKey = key;
        } else {
            try {
                const response = await fetch(apiEndpoint);
                if (!response.ok) {
                    throw new Error(`API request failed with status: ${response.status}`);
                }

                data = await response.json();

                DataStorage.storeData(key, data);
                lastDataKey = key;
            } catch (error) {
                console.error(`Error fetching or storing data: ${error}`);
                return null;
            }
        }
        return data;
    },
};

export { DataManager as default, lastDataKey };
