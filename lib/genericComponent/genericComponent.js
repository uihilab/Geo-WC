import { transform } from "../data/data.js";
import { fetchRemoteData } from "../data/remoteData.js";
import { eventBus } from "../eventbus.js";

function buildQueryString(params) {
  return params.map(param => `${encodeURIComponent(param.prop)}=${encodeURIComponent(param.value)}`).join('&');
}

class genericComponent extends HTMLElement {

  constructor() {
    super();
  }

  async RunData(endpoint) {
    const apiargs = this.getElementPropsValues(this, 'api-arguments');
    const queryString = buildQueryString(apiargs);
    const proxy = this.getAttribute('proxy');
    var fullUrl = `${endpoint}?${queryString}`;
    if (proxy) {
      fullUrl = proxy + (fullUrl);
    }
    var apiData = await fetchRemoteData(fullUrl);


    //TODO: Transform
    const keep = this.querySelector('fields').getAttribute('keep');
    var cleanData = null;
    var parameters = { save: "value" };
    var args = { type: "ARR", keep: keep };
    debugger;
    var cleanData = transform({params: parameters, args: args, data: apiData});

    //Cache data
    eventBus.publish('DataReady', cleanData);
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

  getElementPropsValues(component, elementName) {
    const element = component.querySelector(elementName);
    const propsAndValues = [];

    if (element) {
      // Iterate over attributes of the specified element and push them to the array
      element.getAttributeNames().forEach((attrName) => {
        const attrValue = element.getAttribute(attrName);
        propsAndValues.push({ prop: attrName, value: attrValue });
      });
    }
    return propsAndValues;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }

  rawDataLoading() {
    eventBus.publish('RawDataLoading');
  }

  rawDataReady(data) {
    eventBus.publish('RawDataReady', data);
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