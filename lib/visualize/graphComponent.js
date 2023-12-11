import { createLoadingAnimation } from "../common/functions.js";
import DataManager, { lastDataKey } from "../data/dataManager.js";
import { eventBus } from "../eventbus.js";
import HydroLangProxy from '../hydroLangProxy.js'

class graphComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.getElementById('dynamic-component-template').content.cloneNode(true));
        this.data = null;

        // Bind the drawTable function to the class instance
        this.eventDataChangeHandler = this.dataReadAndPrint.bind(this);
        this.eventDataLoadingHandler = this.dataLoading.bind(this, "Data loading...");

        eventBus.subscribe('DataReady' + this.parentElement.uid, this.eventDataChangeHandler);
        eventBus.subscribe('DataLoading' + this.parentElement.uid, this.eventDataLoadingHandler);

        this.hydroInstance = new HydroLangProxy();
    }

    async connectedCallback() {
        this.dataLoading("Graph component loaded.");
        if (lastDataKey) {
            var lastRawData = await DataManager.getData(lastDataKey);
            await this.dataReadAndPrint(lastRawData);
            console.log("from last data variable");
            console.log(lastRawData);
        }
    }

    async dataReadAndPrint(rawData) {
        this.hydroInstance.visualize.draw({
            params: { type: 'chart', name: 'geoweb-chart-' + this.parentElement.uid }, args: {}
            , data: rawData
        });
    }

    dataLoading(message) {
        var loading = createLoadingAnimation(message);
        this.shadowRoot.appendChild(loading);
    }
}

//customElements.define("geoweb-table", tableComponent);
export default graphComponent;