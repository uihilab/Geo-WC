import DataStorage from './dataStorage.js';

const DataManager = {
    async getData(key, apiEndpoint) {
        const storedData = DataStorage.retrieveData(key);

        if (storedData) {
            return storedData;
        } else {
            try {
                const response = await fetch(apiEndpoint);
                if (!response.ok) {
                    throw new Error(`API request failed with status: ${response.status}`);
                }

                const data = await response.json();

                DataStorage.storeData(key, data);

                return data;
            } catch (error) {
                console.error(`Error fetching or storing data: ${error}`);
                return null;
            }
        }
    },
};

export default DataManager;
