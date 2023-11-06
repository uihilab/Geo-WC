import { genericComponent } from "../genericComponent/genericComponent.js";
import USGS from '../config/datasources/usgs.js';
import { eventBus } from "../eventbus.js";
import DataManager from "../data/dataManager.js";

class usgsComponent extends genericComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.getElementById('usgs-component-template').content.cloneNode(true));
    }


    static url = "https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=ia&siteStatus=all";

    async connectedCallback() {
        var rawData = await DataManager.getData("test", usgsComponent.url);
        //var veri = await super.dataFromApi(usgsComponent.url);

        //var data = this.prepareData(rawData);
        super.dataReady(rawData);


        //this.data = await getData();

        //this.dispatchEvent(new CustomEvent('data-loaded', { data: this.data }));
    }

    prepareDataForGraph(rawData) {
        return { data : "data"};
    }

    prepareDataForDataTable(rawData) {
        // Add headers for each column
        const headers = ["Name", "Site Name", "Location", "Site Type Cd", "HUC Cd", "State Cd", "County Cd"];

        // Initialize an array to store the values
        var yData = [];
        var xData = [];

        // get data in X axes
        rawData.value.timeSeries.forEach(element => {
            const value = element.values[0].value[0].value;
            yData.push(parseFloat(value)); // Convert the value to a floating-point number
        });

        xData = Array.from({ length: yData.length }, (_, i) => i + 1); // Generate labels

        // Initialize an empty 2D array to store the data
        const dataArray = [];

        // Iterate through the timeSeries data
        rawData.value.timeSeries.forEach(element => {
            const rowData = [];

            // Push values for each header into the rowData array
            headers.forEach(header => {
                switch (header) {
                    case "Name":
                        rowData.push(element.name);
                        break;
                    case "Site Name":
                        rowData.push(element.sourceInfo.siteName);
                        break;
                    case "Location":
                        rowData.push(element.sourceInfo.geoLocation.geogLocation.latitude + ' ' + element.sourceInfo.geoLocation.geogLocation.longitude);
                        break;
                    case "Site Type Cd":
                        rowData.push(element.sourceInfo.siteProperty[0].value);
                        break;
                    case "HUC Cd":
                        rowData.push(element.sourceInfo.siteProperty[1].value);
                        break;
                    case "State Cd":
                        rowData.push(element.sourceInfo.siteProperty[2].value);
                        break;
                    case "County Cd":
                        rowData.push(element.sourceInfo.siteProperty[3].value);
                        break;
                }
            });

            // Push the rowData into the dataArray
            dataArray.push(rowData);
        });
        return { headers: headers, dataArray: dataArray };
    }
};

customElements.define("usgs-component", usgsComponent);
