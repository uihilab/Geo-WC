import { eventBus } from "../eventbus.js";
import { clearIndexedDB } from '../data/indexedDB.js';
//import * as hydrolang from 'https://cdn.jsdelivr.net/npm/hydrolang@1.1.7/+esm'
import * as subComp from '../subComponents.js'
import HydroLangProxy from '../hydroLangProxy.js'
import { addCache, generateCacheKey, getCache , getIndexedDBSize} from '../data/cacheManager.js'
import { idMaker } from "../common/functions.js";
class genericComponent extends HTMLElement {

  constructor(name) {
    super();
    this.attachShadow({ mode: 'open' });
    this.uid = "geoweb-id-" + idMaker();
    this.name = name;
    this.hydro = new HydroLangProxy();
    console.log(this.name + " loading.");
  }

  async RunData(dataRetrievalParams) {
    //eventBus.publish('DataLoading' + this.uid);
    console.log("RunData start");
    const proxy = this.getAttribute('proxy');
    // Assuming you have a reference to the XML element
    var usgsMlElement = document.querySelector('usgs-ml');  //TODO this. tagelementname gibi bişiyle al.

    // Get the value of the 'cache' attribute
    var cacheAttributeValue = usgsMlElement.getAttribute('cache');
  
    var isCacheOn = cacheAttributeValue && (cacheAttributeValue.toLowerCase() === 'true' || cacheAttributeValue === '1');

    if (isCacheOn) {
      console.log("IndexedDB cleared");
      clearIndexedDB('GeoWebComponent');
    }

    if (proxy) {
      dataRetrievalParams.proxyurl = proxy;
      //proxyurl: prox,
    }
    else {
      //TODO add default proxy if needed
    }

    var indexedDB= await getIndexedDBSize();

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

    //var mapData = this.prepareMapData(rawData);
    //console.log(mapData);
    //Cache data
    eventBus.publish('DataReadyRaw' + this.uid, rawData);
    //eventBus.publish('DataReady' + this.uid, cleanData);
  }

  getKeepParameters()
  {
    //Transform props args prep
    return this.querySelector('fields')?.getAttribute('keep');
  }

  async loadSubComponents(transformFunctions) {
    await subComp.loadSubComponents(this, transformFunctions);
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

  // prepareDataForDataTable() {
  //   throw new Error("Subclasses must implement method.");
  // }

  // prepareDataForGraph() {
  //   throw new Error("Subclasses must implement method.");
  // }

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