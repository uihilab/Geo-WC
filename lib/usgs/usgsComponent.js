
import { getData } from "./retrieveDataUSGS.js";


class usgsComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.getElementById('usgs-component-template').content.cloneNode(true));
    }

    async connectedCallback() {
        this.dataFromApi();
        //this.data = await getData();

        //this.dispatchEvent(new CustomEvent('data-loaded', { data: this.data }));
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

// // Get the table header and body elements
// const tableHeaders = document.getElementById("table-headers");
// const tableBody = document.getElementById("table-body");


// // Create table headers dynamically based on JSON keys
// const keys = Object.keys(jsonData[0]); // Assuming the structure is consistent
// keys.forEach(key => {
//     const th = document.createElement("th");
//     th.textContent = key;
//     tableHeaders.appendChild(th);
// });

// // Populate the table with data
// jsonData.forEach(item => {
//     const row = document.createElement("tr");
//     keys.forEach(key => {
//         const cell = document.createElement("td");
//         cell.textContent = item[key];
//         row.appendChild(cell);
//     });
//     tableBody.appendChild(row);
// });