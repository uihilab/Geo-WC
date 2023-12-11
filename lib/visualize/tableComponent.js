import { createLoadingAnimation } from "../common/functions.js";
import DataManager, { lastDataKey } from "../data/dataManager.js";
import { eventBus } from "../eventbus.js";
import HydroLangProxy from '../hydroLangProxy.js'

class tableComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // this.shadowRoot.appendChild(document.getElementById('table-component-template').content.cloneNode(true));
        this.data = null;

        // Bind the drawTable function to the class instance
        this.eventDataChangeHandler = this.dataReadAndPrint.bind(this);
        this.eventDataLoadingHandler = this.dataLoading.bind(this, "Data loading...");

        eventBus.subscribe('DataReady' + this.parentElement?.id, this.eventDataChangeHandler);
        eventBus.subscribe('DataLoading' + this.parentElement?.id, this.eventDataLoadingHandler);

        this.hydroInstance = new HydroLangProxy();
    }

    async connectedCallback() {
        this.dataLoading("Table component loaded.");
        if (lastDataKey) {
            var lastRawData = await DataManager.getData(lastDataKey);
            await this.dataReadAndPrint(lastRawData);
            console.log("from last data variable");
            console.log(lastRawData);
        }
    }

    async dataReadAndPrint(rawData) {
        var htmlTable = this.generateHtmlTable(rawData);
        //debugger;
        var container= document.createElement("table-container");
        container.innerHTML = htmlTable;
        //this.shadowRoot.appendChild(container);
        this.parentElement.shadowRoot.appendChild(container);
        //console.log(JSON.stringify(rawData));
        // this.hydroInstance.visualize.draw({
        //     params: { type: 'table', name: 'geoweb-table' }, args: {}
        //     , data: rawData
        // });

    }

    generateHtmlTable(jsonData) {
        const transposedData = jsonData[0].map((_, colIndex) => jsonData.map(row => row[colIndex]));

        const tableHeader = `<thead><tr>${transposedData[0].map(header => `<th>${header}</th>`).join('')}</tr></thead>`;

        const tableBody = `<tbody>${transposedData.slice(1).map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;

        const htmlTable = `<table>${tableHeader}${tableBody}</table>`;

        return htmlTable;
    }


    dataLoading(message) {
        var loading = createLoadingAnimation(message);
        this.shadowRoot.appendChild(loading);
    }
}

//customElements.define("geoweb-table", tableComponent);
export default tableComponent;