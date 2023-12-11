import { createLoadingAnimation } from "../common/functions.js";
import { subGenericComponent } from '../genericComponent/subGenericComponent.js'

class tableComponent extends subGenericComponent {

    constructor() {
        super();
        this.subscribeEvent("DataReady", this.dataReadAndPrint);
        this.subscribeEvent("DataLoading", this.dataLoading, "Table Component Loading...");
    }

    async connectedCallback() {
        this.dataLoading("Table component loaded.");
    }

    async dataReadAndPrint(rawData) {
        var htmlTable = this.generateHtmlTable(rawData);
        var tableElement = document.createElement("table-container");
        tableElement.innerHTML = htmlTable;
        this.shadowContainer.appendChild(tableElement);
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
        this.shadowContainer.appendChild(loading);
    }
}

export default tableComponent;