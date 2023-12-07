// IndexedDB module (indexeddb.js)

const DB_NAME = 'GeoWebComponent';
const DB_VERSION = 1;

const openDatabase = (table) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.error}`);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      const objectStore = db.createObjectStore(table, { keyPath: 'key' });
    };
  });
};

export const addObjectIndexedDB = (table, object) => {
  return openDatabase(table).then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([table], 'readwrite');
      const objectStore = transaction.objectStore(table);
      const request = objectStore.add(object);

      request.onerror = (event) => {
        reject(`Error adding object: ${event.target.error}`);
      };

      request.onsuccess = (event) => {
        resolve('Object added successfully');
      };
    });
  });
};

export const getObjectByKeyIndexedDB = (table, key) => {
  return openDatabase(table).then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([table], 'readonly');
      const objectStore = transaction.objectStore(table);
      const request = objectStore.get(key);

      request.onerror = (event) => {
        reject(`Error getting object: ${event.target.error}`);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  });
};

export const deleteObjectByKeyIndexedDB = (table, key) => {
  return openDatabase(table).then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([table], 'readwrite');
      const objectStore = transaction.objectStore(table);
      const request = objectStore.delete(key);

      request.onerror = (event) => {
        reject(`Error deleting object: ${event.target.error}`);
      };

      request.onsuccess = (event) => {
        resolve('Object deleted successfully');
      };
    });
  });
};
