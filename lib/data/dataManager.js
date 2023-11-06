import DataStorage from './dataStorage.js';
import { fetchRemoteData } from './remoteData.js';

var lastDataKey = null;

const DataManager = {
    async getData(key, apiEndpoint) {
        var data;
        const storedData = DataStorage.retrieveData(key);
        if (storedData) {
            data = storedData;
            lastDataKey = key;
        } else {
            if (apiEndpoint) {
                try {
                    data = await fetchRemoteData(apiEndpoint);
                    DataStorage.storeData(key, data);
                    lastDataKey = key;
                } catch (error) {
                    console.error(`Error fetching or storing data: ${error}`);
                    return null;
                }
            }
        }
        return data;
    },
    async getLastData()
    {
        return await this.getData(lastDataKey, null);
    }
};

export { DataManager as default, lastDataKey };
