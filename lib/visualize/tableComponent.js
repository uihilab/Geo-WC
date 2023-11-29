import DataManager, { lastDataKey } from "../data/dataManager.js";
import { eventBus } from "../eventbus.js";
import HydroLangProxy from "../hydroLangProxy.js";

class tableComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.getElementById('dynamic-component-template').content.cloneNode(true));
        this.data = null;

        // Bind the drawTable function to the class instance
        this.eventDataChangeHandler = this.dataReadAndPrint.bind(this);
        this.eventDataLoadingHandler = this.dataLoading.bind(this);

        eventBus.subscribe('DataReady', this.eventDataChangeHandler);
        eventBus.subscribe('DataLoading', this.eventDataLoadingHandler);

        this.hydroInstance = HydroLangProxy;
    }

    async connectedCallback() {
        if (lastDataKey) {
            var lastRawData = await DataManager.getData(lastDataKey);
            await this.dataReadAndPrint(lastRawData);
            console.log("from last data variable");
            console.log(lastRawData);
        }
    }

    async dataReadAndPrint(rawData) {
        var type = this.getAttribute('type');
        this.hydroInstance.visualize.draw({
            params: { type: 'table', name: 'geoweb-table' }, args: {}
            , data: rawData
        });
    }

    dataLoading() {

    }
}

customElements.define("geoweb-table", tableComponent);
export default tableComponent;