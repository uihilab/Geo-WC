import { createLoadingAnimation } from "../common/functions.js";
import { subGenericComponent } from '../genericComponent/subGenericComponent.js'
import "https://code.jquery.com/jquery-3.6.4.min.js";
import "https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js";

class tableComponent extends subGenericComponent {

    constructor() {
        super();
        this.subscribeEvent("DataReady", this.dataReadAndPrint);
        this.subscribeEvent("DataLoading", this.dataLoading, "Table Component Loading...");
    }

    async connectedCallback() {
        this.dataLoading("Table component loaded.");
        // DataTables'i tabloya uygula
        //$(this.shadowRoot.querySelector("table-container")).DataTable();

    }

    async dataReadAndPrint(rawData) {
        var htmlTable = this.generateHtmlTable(rawData);
        var tableContainer = document.createElement("div");
        tableContainer.innerHTML = htmlTable;
        var table = tableContainer.firstChild;

        this.shadowContainer.appendChild(tableContainer);
        // DataTables'i tabloya uygula
        $(table).DataTable();
        //CSS
        this.appendStyleToElement(this.shadowContainer, "//cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css");
    }

    appendStyleToElement(element, cssUrl) {
        // Create a style element
        const styleElement = document.createElement('style');

        // Set the type attribute to 'text/css'
        styleElement.setAttribute('type', 'text/css');

        // Create a text node with the CSS import statement
        const cssImportStatement = document.createTextNode(`@import "${cssUrl}";`);

        // Append the text node to the style element
        styleElement.appendChild(cssImportStatement);

        // Append the style element to the specified DOM element
        element.appendChild(styleElement);
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