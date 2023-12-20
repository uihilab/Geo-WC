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

export function  clearIndexedDB(databaseName) {
  var request = indexedDB.open(databaseName);

  request.onsuccess = function (event) {
      var db = event.target.result;
      var objectStoreNames = db.objectStoreNames;

      for (var i = 0; i < objectStoreNames.length; i++) {
          var objectStore = db.transaction([objectStoreNames[i]], 'readwrite').objectStore(objectStoreNames[i]);
          var clearRequest = objectStore.clear();

          clearRequest.onsuccess = function () {
              console.log('IndexedDB cleared successfully.');
          };

          clearRequest.onerror = function (error) {
              console.error('Error clearing IndexedDB:', error);
          };
      }
  };

  request.onerror = function (error) {
      console.error('Error opening IndexedDB:', error);
  };
}

// const countDB = async (db, table) => {
//   return new Promise((resolve, reject) => {
//       const tx = db.transaction([table], 'readonly');
//       const store = tx.objectStore(table);
//       const cursorReq = store.openCursor();
//       let count = 0;
//       let size = 0;
//       cursorReq.onsuccess = function(e) {
//           const cursor = cursorReq.result;
//           if (cursor) {
//               count++;
//               size = size + cursor.value.blob.size;
//               cursor.continue();
//           }
//       };
//       cursorReq.onerror = function(e) {
//           reject(e);
//       };
//       tx.oncomplete = function(e) {
//           resolve({
//               count: count,
//               size: size
//           });
//       };
//       tx.onabort = function(e) {
//           reject(e);
//       };
//       tx.onerror = function(e) {
//           reject(e);
//       };
//   });
// };

// export const getTableSize = function(db, dbName){
//   return new Promise((resolve,reject) => {
//     if (db == null) {
//       return reject();
//     }

//     // db nesnesinin hazır olduğunu kontrol et
//     // if (db.readyState !== "done") {
//     //   return reject("Database is not ready");
//     // }

//     var size = 0;
//     var transaction = db.transaction(dbName)
//       .objectStore(dbName)
//       .openCursor();

//     transaction.onsuccess = function(event){
//         var cursor = event.target.result;
//         if(cursor){
//             var storedObject = cursor.value;
//             var json = JSON.stringify(storedObject);
//             size += json.length;

//             var key;
//             for (key in storedObject) {
//               if (storedObject.hasOwnProperty(key) && storedObject[key] instanceof Blob) {
//                 size += storedObject[key].size;
//               }
//             }

//             cursor.continue();
//         }
//         else{
//           resolve(size);
//         }
//     }.bind(this);
//     transaction.onerror = function(err){
//         reject("error in " + dbName + ": " + err);
//     }
//   });
// };

// export const getDatabaseSize = function (DB_NAME) {
//   return new Promise ((resolve, reject) => 
//   {
//   var request = indexedDB.open(DB_NAME);
//   var db;
//   var dbSize = 0;
//   request.onsuccess = function(event) {
//     db = event.target.result;
//     debugger;
//     var tableNames = [db.objectStoreNames];
//     (function(tableNames, db) {
//       var tableSizeGetters = tableNames
//         .reduce( (acc, tableName) => {
//           acc.push( 
//             countDB(db, tableName)
//             );
            
//             //getTableSize(db, tableName) );
//           return acc;
//         }, []);

//       Promise.all(tableSizeGetters)
//         .then(sizes => {
//           console.log('--------- ' + db.name + ' -------------');
//           tableNames.forEach( (tableName,i) => {
//             console.log(" - " + tableName + "\t: " + humanReadableSize(sizes[i]));
//           });
//           var total = sizes.reduce(function(acc, val) {
//             return acc + val;
//           }, 0);

//           console.log("TOTAL: " + humanReadableSize(total))
//           resolve();
//         });

//       })(tableNames, db);
//   };
//   })};

// export const humanReadableSize = function (bytes) {
//   var thresh = 1024;
//   if(Math.abs(bytes) < thresh) {
//     return bytes + ' B';
//   }
//   var units = ['KB','MB','GB','TB','PB','EB','ZB','YB'];
//   var u = -1;
//   do {
//     bytes /= thresh;
//     ++u;
//   } while(Math.abs(bytes) >= thresh && u < units.length - 1);
//   return bytes.toFixed(1)+' '+units[u];
// }

function humanReadableSize(bytes) {
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = ['KB','MB','GB','TB','PB','EB','ZB','YB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while(Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
}

function getIndexedDBSize(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onerror = function(event) {
      reject("Failed to open the database");
    };

    request.onsuccess = function(event) {
      const db = event.target.result;
      const objectStoreNames = Array.from(db.objectStoreNames);
      const sizePromises = objectStoreNames.map(storeName => getObjectStoreSize(db, storeName));

      Promise.all(sizePromises)
        .then(sizes => {
          const totalSize = sizes.reduce((acc, val) => acc + val, 0);
          resolve(totalSize);
          console.log(totalSize);
        })
        .catch(error => reject(error));
    };
  });
}

function getObjectStoreSize(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName]);
    const objectStore = transaction.objectStore(storeName);
    let size = 0;

    transaction.oncomplete = function(event) {
      resolve(size);
    };

    transaction.onerror = function(event) {
      reject(`Error in ${storeName}: ${event.target.error}`);
    };

    const cursorRequest = objectStore.openCursor();
    cursorRequest.onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        const storedObject = cursor.value;
        const json = JSON.stringify(storedObject);
        size += json.length;

        for (const key in storedObject) {
          if (storedObject.hasOwnProperty(key) && storedObject[key] instanceof Blob) {
            size += storedObject[key].size;
          }
        }

        cursor.continue();
      }
    };
  });
}


getIndexedDBSize(DB_NAME)
  .then(size => {
    console.log(`IndexedDB ${DB_NAME} Size: ${humanReadableSize(size)}`);
  })
  .catch(error => {
    console.error("Error:", error);
  });



export const printIndexDBSizes = function() {
  getIndexedDBSize(DB_NAME);
}

