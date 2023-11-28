import { eventBus } from "../eventbus.js";
//import * as hydrolang from 'https://cdn.jsdelivr.net/npm/hydrolang@1.1.7/+esm'
import * as hydrolang from '../../hydrolang/hydro.js'


class genericComponent extends HTMLElement {

  constructor() {
    super();
    this.hydro = new Hydrolang();
  }

  async RunData(dataRetrievalParams) {
    console.log("RunData start");
    const proxy = this.getAttribute('proxy');
    if (proxy) {
      dataRetrievalParams.proxyurl = proxy;
      //proxyurl: prox,
    }
    else {
      //TODO add default proxy if needed
    }
    dataRetrievalParams.params.transform = false;
    var rawData = await this.hydro.data.retrieve(dataRetrievalParams);
    console.log(rawData);

    //Transform props args prep
    var keep = this.querySelector('fields')?.getAttribute('keep');
    debugger;
    if (!keep) {
      keep = '["dateTime", "value"]';
    }
    var parameters = { save: "value" };
    var args = { type: "ARR", keep: keep };

    var cleanData = this.hydro.data.transform({ params: parameters, args: args, data: rawData });
    console.log(cleanData);
    debugger;

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
    const transformedObject = propsAndValues.reduce((result, { prop, value }) => {
      result[prop] = value;
      return result;
    }, {});
    return transformedObject;
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