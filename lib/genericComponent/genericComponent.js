import { eventBus } from "../eventbus.js";
//import * as hydrolang from 'https://cdn.jsdelivr.net/npm/hydrolang@1.1.7/+esm'
import  * as hydrolang from '../../hydrolang/hydro.js'
function buildQueryString(params) {
  return params.map(param => `${encodeURIComponent(param.prop)}=${encodeURIComponent(param.value)}`).join('&');
}

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

    // const apiargs = this.getElementPropsValues(this, 'api-arguments');
    // const queryString = buildQueryString(apiargs);

    // var fullUrl = `${endpoint}?${queryString}`;
    // if () {
    //   fullUrl = proxy + (fullUrl);
    // }

    // //Test

    // let data = await this.hydro.data.retrieve({
    //   params: { source: "waterOneFlow", datatype: "GetSitesByBoxObject" },
    //   args: {
    //     sourceType: "USGS Daily Values",
    //     east: -111.5592,
    //     west: -112.037,
    //     north: 41.07,
    //     south: 40.5252,
    //   },
    // });
    console.log("rawData start");
    debugger;
    var rawData = await this.hydro.data.retrieve({
      params: { source: "usgs", datatype: "instant-values" , transform:true}, proxyurl: "https://hydroinformatics.uiowa.edu/lab/cors/",
      args: {
        site: "USGS:02056000",
        format: "json",
        startDt: "2020-08-30",
        endDt: "2020-09-02",
        parameterCd: "00060"
      }
    });
    console.log(rawData);
    
    //Transform props args prep
    const keep = this.querySelector('fields').getAttribute('keep');
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