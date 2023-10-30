//import { getData } from '../data/retrieveData.js';

class genericComponent extends HTMLElement {
  
    constructor() {
      super();
    }
    connectedCallback() {
        
    }

    async dataFromApi(url) {
      //USGS["instant-values"].endpoint
      this.data = await getData(url);
      this.dataLoadedEvent = new CustomEvent('DataFetch', {
          detail: {data:this.data},
          bubbles: true,
          composed: true,
          cancelable: false
      });
      this.shadowRoot.dispatchEvent(this.dataLoadedEvent);
      console.log("Data fetched.");
  }
}
export{genericComponent}