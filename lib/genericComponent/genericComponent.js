import { eventBus } from "../eventbus.js";
import { clearIndexedDB } from '../data/indexedDB.js';
//import * as hydrolang from 'https://cdn.jsdelivr.net/npm/hydrolang@1.1.7/+esm'
import * as subComp from '../subComponents.js'
import HydroLangProxy from '../hydroLangProxy.js'
import { addCache, generateCacheKey, getCache } from '../data/cacheManager.js'
class genericComponent extends HTMLElement {

  constructor(name) {
    super();
    this.name = name;
    this.hydro = new HydroLangProxy();
    console.log(this.name + " loading.");
  }

  async RunData(dataRetrievalParams) {
    eventBus.publish('DataLoading' + this.id, cleanData);
    console.log("RunData start");
    var elementsWithClearCache = document.querySelectorAll('[clear-cache="true"]');
    if (elementsWithClearCache) {
      console.log("Cache cleared");
      clearIndexedDB('GeoWebComponent');
    }
    const proxy = this.getAttribute('proxy');
    var cacheAttributeValue = this.getAttribute('cache');
    var isCacheOn = cacheAttributeValue && (cacheAttributeValue.toLowerCase() === 'true' || cacheAttributeValue === '1');

    if (proxy) {
      dataRetrievalParams.proxyurl = proxy;
      //proxyurl: prox,
    }
    else {
      //TODO add default proxy if needed
    }
    dataRetrievalParams.params.transform = false;
    var rawData = null;
    var cacheFound = false;
    var cacheData = null;
    if (isCacheOn) {
      //Cache
      var cacheKey = generateCacheKey(dataRetrievalParams);

      //Search for key in cache
      cacheData = await getCache(this.name, cacheKey);
      //If cache empty
      if (cacheData == null) {
        cacheFound = false;
      }
      else {
        cacheFound = true;
      }
    }

    var getRemoteData = false;
    if (isCacheOn) {
      if (!cacheFound) {
        getRemoteData = true;
      }
      else {
        getRemoteData = false;
        rawData = cacheData;
      }
    }
    else {
      getRemoteData = true;
    }


    if (getRemoteData) {
      rawData = await this.hydro.data.retrieve(dataRetrievalParams);
      if (isCacheOn) {
        //Update cache
        await addCache(this.name, cacheKey, rawData);
      }
    }

    console.log(rawData);

    //Transform props args prep
    var keep = this.querySelector('fields')?.getAttribute('keep');

    if (!keep) {
      keep = '["datetime", "value"]';
    }
    var parameters = { save: "value" };
    var args = { type: "ARR", keep: keep };

    var cleanData = this.hydro.data.transform({ params: parameters, args: args, data: rawData });
    console.log(cleanData);

    //Cache data
    eventBus.publish('DataReady' + this.id, cleanData);
  }

  async loadSubComponents() {
    await subComp.loadSubComponents(this);
  }

  getFieldsArgs() {


    // Use the retrieved props and values as needed
    console.log('API Arguments:');
    apiArgumentsPropsAndValues.forEach(({ prop, value }) => {
      console.log(`${prop}: ${value}`);
    });

    console.log('Fields:');
    fieldsPropsAndValues.forEach(({ prop, value }) => {
      console.log(`${prop}: ${value}`);
    });
  }

  getElementPropsValues(component, elementName, exclude = []) {
    const element = component.querySelector(elementName);
    const propsAndValues = [];

    if (element) {
      // Iterate over attributes of the specified element and push them to the array
      element.getAttributeNames().forEach((attrName) => {
        // Check if the attribute should be excluded
        if (!exclude || !exclude.includes(attrName)) {
          const attrValue = element.getAttribute(attrName);
          propsAndValues.push({ prop: attrName, value: attrValue });
        }
      });
    }

    const transformedObject = propsAndValues.reduce((result, { prop, value }) => {
      result[prop] = value;
      return result;
    }, {});

    return transformedObject;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }

  prepareDataForDataTable() {
    throw new Error("Subclasses must implement method.");
  }

  prepareDataForGraph() {
    throw new Error("Subclasses must implement method.");
  }

  async dataFromApi(url) {
    //USGS["instant-values"].endpoint
    this.data = await getData(url);
    this.dataLoadedEvent = new CustomEvent('DataFetch', {
      detail: { data: this.data },
      bubbles: true,
      composed: true,
      cancelable: false
    });
    this.shadowRoot.dispatchEvent(this.dataLoadedEvent);
    console.log("Data fetched.");
  }
}
export { genericComponent }