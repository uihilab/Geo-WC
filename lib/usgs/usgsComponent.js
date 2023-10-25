
import { getData } from "./retrieveData.js";


class usgsComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.getElementById('usgs-component-template').content.cloneNode(true));
    }

    async connectedCallback() {
        this.dataFromApi();
    }

    async dataFromApi() {
        // Simulate fetching data from an API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.data = await getData();
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
customElements.define("usgs-component", usgsComponent);