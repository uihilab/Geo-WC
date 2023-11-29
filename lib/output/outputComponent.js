import DataManager, { lastDataKey } from "../data/dataManager.js";
import { eventBus } from "../eventbus.js";

class outputComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.getElementById('dynamic-component-template').content.cloneNode(true));
        this.data = null;

        // Bind the drawTable function to the class instance
        this.eventDataChangeHandler = this.dataReadAndPrint.bind(this);
        this.eventDataLoadingHandler = this.dataLoading.bind(this);

        eventBus.subscribe('RawDataReady', this.eventDataChangeHandler);
        eventBus.subscribe('RawDataLoading', this.eventDataLoadingHandler);
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
        var data = null;
        var mimeType = "";
        if (type === "json") {
            data = this.parentElement.prepareDataForJson(rawData);
            mimeType = 'application/json';
        }
        else if (type === "csv") {
            data = this.parentElement.prepareDataForCsv(rawData);
            mimeType = 'application/csv';
        }
        const blob = new Blob([data], { type: mimeType });
        this.createLink(blob, "data." + type, type);
    }

    createLink(blob, filename, type) {
        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        // Set the download attribute with the desired file name
        link.download = filename;
        link.appendChild(document.createTextNode(`Download ${type}`));
        // Append the link to the document
        document.body.appendChild(link);
    }

    dataLoading() {

    }
}

customElements.define("geoweb-output", outputComponent);
export default outputComponent;