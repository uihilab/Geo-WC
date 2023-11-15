import DataManager, { lastDataKey } from "../data/dataManager.js";
import { eventBus } from "../eventbus.js";

class dataTableComponent extends HTMLElement {

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
    var data = this.parentElement.prepareDataForDataTable(rawData);
    this.drawTable(data);
  }

  // Define the datatableComponent
  drawTable(data) {
    const existingTable = document.querySelector('table');
    if (existingTable) {
      existingTable.remove();
    }
    // console.log(data);
    var headers = data.headers;
    var dataArray = data.dataArray;
    // Create a table element
    const table = document.createElement('table');

    // Create a header row
    const headerRow = table.insertRow(0);

    // Create table headers based on the provided headers array
    headers.forEach(headerText => {
      const headerCell = document.createElement('th');
      headerCell.textContent = headerText;
      headerRow.appendChild(headerCell);
    });

    // Create table rows and populate with data from the dataArray
    dataArray.forEach(dataRow => {
      const row = table.insertRow();

      dataRow.forEach(cellData => {
        const cell = row.insertCell();
        cell.textContent = cellData;
      });
    });

    // Append the table to a container (e.g., the body)
    document.body.appendChild(table);
  }

  dataLoading() {
    // Remove the existing table from the document
    const existingTable = document.querySelector('table');
    if (existingTable) {
      existingTable.remove();
    }
  
    // Create a new table with a "no data" message
    const table = document.createElement('table');
  
    const noDataRow = table.insertRow();
    const noDataCell = noDataRow.insertCell();
    noDataCell.colSpan = 3; // Adjust the colspan based on the number of columns in your table
    noDataCell.textContent = 'Loading...';
  
    // Append the new table to a container (e.g., the body)
    document.body.appendChild(table);
  }
}

customElements.define("data-table-component", dataTableComponent);