class dataTableComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(document.getElementById('data-table-component-template').content.cloneNode(true));
    this.data = null;

    // Bind the drawTable function to the class instance
    this.drawTable = this.drawTable.bind(this);
  }

  connectedCallback() {
    var rootNode = this.parentNode;
    //if(rootNode=="usgs-component")
    //{
    rootNode.addEventListener('DataFetch',  (event, dataTableComp= this) => {
      console.log("event fired! data table");
      var data = event.detail.data;
      console.log(data);
      dataTableComp.drawTable(data);
      //var selectedDiv = this.shadowRoot.getElementById('jsonData');
      //;
    });
    //}
  }

  drawTable(data) {
    const table = document.createElement('table');
    table.className = 'dynamic-table';
  
    if (data.length === 0) {
      // Handle empty data, display a message or take appropriate action
      const messageRow = table.insertRow();
      const messageCell = messageRow.insertCell();
      messageCell.colSpan = Object.keys(data[0]).length;
      messageCell.textContent = 'No data available';
    } else {
        // Create a header row
      const headerRow = table.insertRow();

        // Add headers for each column
        const headers = ["Name", "Site Name", "Location", "Site Type Cd", "HUC Cd", "State Cd", "County Cd"];

        headers.forEach(headerText => {
          const headerCell = document.createElement("th");
          headerCell.textContent = headerText;
          headerRow.appendChild(headerCell);
        });

      // Create the table header from the first object's keys
      data.value.timeSeries.forEach(element => {
        
        const row = table.insertRow();
        row.insertCell().textContent = element.name;
        row.insertCell().textContent = element.sourceInfo.siteName;
        row.insertCell().textContent = element.sourceInfo.geoLocation.geogLocation.latitude + '' + element.sourceInfo.geoLocation.geogLocation.longitude;
        row.insertCell().textContent = element.sourceInfo.siteProperty[0].value;
        row.insertCell().textContent = element.sourceInfo.siteProperty[1].value;
        row.insertCell().textContent = element.sourceInfo.siteProperty[2].value;
        row.insertCell().textContent = element.sourceInfo.siteProperty[3].value;
        //const headerCell = headerRow.insertCell();
        //headerCell.textContent = element
      });
    }

    this.shadowRoot.appendChild(table);
  }
  
}
customElements.define("data-table-component", dataTableComponent);

