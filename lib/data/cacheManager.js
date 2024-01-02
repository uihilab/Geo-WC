import { addObjectIndexedDB, getObjectByKeyIndexedDB, printIndexDBSizes } from "./indexedDB.js";

function generateCacheKey(obj) {

    return JSON.stringify(obj);

    const keyParts = [];

    function processObject(obj, prefix = '') {
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                const newKey = prefix ? `${prefix}_${key}` : key;

                if (typeof value === 'object' && value !== null) {
                    processObject(value, newKey);
                } else {
                    keyParts.push(`${newKey}_${value}`);
                }
            }
        }
    }

    processObject(obj);
    const key = keyParts.join('_');
    return key;
}

async function getCache(table, key) {
    return await getObjectByKeyIndexedDB(table, key);
}

async function addCache(table, key, data) {
    var objToStore = { key: key, data: data };
    await addObjectIndexedDB(table, objToStore);
}

async function getIndexedDBSize() {
    //var dbNames = await indexedDB.databases();
    await printIndexDBSizes();
}

export { generateCacheKey, getCache, addCache, getIndexedDBSize }