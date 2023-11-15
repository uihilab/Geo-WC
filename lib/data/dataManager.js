import DataStorage from './dataStorage.js';
import { fetchRemoteData } from './remoteData.js';

var lastDataKey = null;

const DataManager = {
    async getData(key, apiEndpoint, skipCache) {
        var data;
        if (skipCache === true) {
            DataStorage.removeData(key);
        }
        const storedData = DataStorage.retrieveData(key);
        if (storedData) {
            data = storedData;
            lastDataKey = key;
        } else {
            if (apiEndpoint) {
                try {
                    data = await fetchRemoteData(apiEndpoint);
                    DataStorage.storeData(key, data);

                } catch (error) {
                    console.error(`Error fetching or storing data: ${error}`);
                    return null;
                }
            }
        }
        return data;
    },
    async getLastData() {
        return await this.getData(lastDataKey, null);
    }
};

export { DataManager as default, lastDataKey };
