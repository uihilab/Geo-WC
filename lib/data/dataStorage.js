const DataStorage = {
  // Store data in local storage with a given key
  storeData(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      const sizeInMB = (new TextEncoder().encode(serializedData).length) / (1024 * 1024);
      if (sizeInMB > 10) {
        return false;
      }
      else {
        localStorage.setItem(key, serializedData);
      }
      return true;
    } catch (error) {
      console.error(`Error storing data for key "${key}": ${error}`);
      return false;
    }
  },

  // Retrieve data from local storage with a given key
  retrieveData(key) {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData)
        return JSON.parse(serializedData);
      else
        return null;
    } catch (error) {
      console.error(`Error retrieving data for key "${key}": ${error}`);
      return null;
    }
  },

  // Remove data from local storage with a given key
  removeData(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing data for key "${key}": ${error}`);
      return false;
    }
  },
};



export default DataStorage;
