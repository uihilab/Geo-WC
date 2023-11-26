import { genericComponent } from "../genericComponent/genericComponent.js";
import DataManager from "../data/dataManager.js";
//https://waterservices.usgs.gov/docs/dv-service/daily-values-service-details/
class usgsComponent extends genericComponent {

    static observedAttributes = ["startdate", "enddate"];
    static apiendpoints = {
        "instant-values": {
            endpoint: "http://waterservices.usgs.gov/nwis/iv/" //https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=ia&siteStatus=all
        },
        "daily-values": {
            endpoint: "http://waterservices.usgs.gov/nwis/dv/"
        }
    };

    constructor() {
        super();
        //TODO: move to genericComponent
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.getElementById('generic-component-template').content.cloneNode(true));
        this.loadingState = "loading";
    }

    async connectedCallback() {
        //Select endpoint
        var endpoint = this.getEndpointAddress();
        await this.RunData(endpoint);
        this.loadingState = "loaded";
    }

    getEndpointAddress() {
        const serviceAttribute = this.getAttribute('service');
        const endpointInfo = usgsComponent.apiendpoints[serviceAttribute];
        if (endpointInfo) {
            const endpoint = endpointInfo.endpoint;
            return endpoint;
        } else {
            console.error(`Endpoint not found for service: ${serviceAttribute}`);
        }
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (this.loadingState != "loaded") {
            return;
        }
        this.rawDataLoading();
        console.log(`Attribute ${name} has changed.`);
        await this.getRawData(true);
    }

    buildParams() {
        var result = "";
        result += this.filterDate();
        return result;
    }

    filterDate() {
        const startDate = this.getAttribute('startDate') || '';
        const endDate = this.getAttribute('endDate') || '';

        let queryString = '';

        if (startDate) {
            // Check if the time is included in the "startDate" attribute
            const isStartTimeIncluded = startDate.includes('T');

            // Format the "startDate" attribute based on the determined format
            const formattedStartDate = this.formatDate(startDate, isStartTimeIncluded);

            queryString += `&startDT=${formattedStartDate}`;
        }

        if (endDate) {
            // Check if the time is included in the "endDate" attribute
            const isEndTimeIncluded = endDate.includes('T');

            // Format the "endDate" attribute based on the determined format
            const formattedEndDate = this.formatDate(endDate, isEndTimeIncluded);

            queryString += `&endDT=${formattedEndDate}`;
        }

        return queryString;
    }

    formatDate(dateString, isTimeIncluded) {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        if (isTimeIncluded) {
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } else {
            return `${year}-${month}-${day}`;
        }
    }

    async getRawData(skipCache) {
        //TODO: parameters (dates), sensor ids, interval (daily or monthly)
        //TODO: read params from attributes
        var url = usgsComponent.url;
        var params = this.buildParams();
        var fullPath = url + params;
        console.log(fullPath);
        var rawData = await DataManager.getData("test", fullPath, skipCache);

        this.rawDataReady(rawData);
    }

    prepareDataForGraph(rawData) {
        return { data: "data" };
    }

    prepareDataForJson(rawData) {

        return { data: "data" };
    }

    prepareDataForCsv(rawData) {
        return { data: "data" };
    }

    prepareDataForDataTable(rawData) {
        // Add headers for each column
        const headers = ["Name", "Site Name", "Location", "Site Type Cd", "HUC Cd", "State Cd", "County Cd"];

        // Initialize an array to store the values
        var yData = [];
        var xData = [];

        // get data in X axes
        rawData.value.timeSeries.forEach(element => {
            try {
                const value = element.values[0].value[0].value;
                yData.push(parseFloat(value)); // Convert the value to a floating-point number
            } catch (error) {

            }
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
