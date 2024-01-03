import { genericComponent } from "../genericComponent/genericComponent.js";
import DataManager from "../data/dataManager.js";
import { calculateEndDate } from "../common/dateTimeFuncs.js";
import { mergeObjects, updateKeys } from "../common/functions.js";

//https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries/
class epaComponent extends genericComponent {

    static observedAttributes = ["startdate", "enddate"];
    static name = "EPA Web Component";
    static defaultKeepValues = '["mimeType"]';
    constructor() {
        super(epaComponent.name);
        this.loadingState = "loading";
    }

    async connectedCallback() {
        var div = document.createElement("div");
        div.id = "sub-component-container";
        div.innerHTML = "Sub Component Container";
        this.shadowRoot.appendChild(div);
        await this.loadSubComponents({
            funcTransformMap: (rawData) => this.prepareMapData(rawData),
            funcTransformTable: (rawData) => this.prepareTableData(rawData),
            funcTransformOutput: (rawData) => this.prepareOutputData(rawData)
        });
        var datatype = this.getAttribute('service');
        var apiArgs = await this.buildApiArguments();

        var dataRetrievalParams = {
            params: { source: "wqp", datatype: datatype },
            args: apiArgs
        };
        this.keepParams = this.getKeepParameters();
        if (!this.keepParams) {
            this.keepParams = epaComponent.defaultKeepValues;
        }
        await this.RunData(dataRetrievalParams);
        this.loadingState = "loaded";
    }

    hydroTransform(rawData) {
        var parameters = { save: "features" };
        var args = { type: "ARR", keep: this.keepParams };

        var cleanData = this.hydro.data.transform({ params: parameters, args: args, data: rawData });
        return cleanData;
    }

    prepareOutputData(rawData) {
        return this.hydroTransform(rawData);
    }

    async prepareMapData(rawData) {
        var geoJsonData = {
            "type": "FeatureCollection",
            "features": []
        };
        var res = await fetch("../../external/fips_map_minify.json");
    }

    prepareTableData(rawData) {
        return this.hydroTransform(rawData);
    }

    async buildApiArguments() {

        var args = {};
        const apiArgsRaw = this.getElementPropsValues(this, 'api-args[raw="true"]', ['raw']);
        if (apiArgsRaw) {
            args = apiArgsRaw;
        }

        const apiargs = this.getElementPropsValues(this, 'api-args:not([raw="true"])');
        if (apiargs) {
            const convertedArgs = this.convertToRawArgs(apiargs);
            args = mergeObjects(args, convertedArgs);
        }

        // if (!hasMajorFilter(args)) {
        //     var location = await getUserLocation();
        //     args.stateCd = location;
        // }
        args.format = 'json';
        args.mimeType = "geojson";
        return args;
    }

    convertToRawArgs(userArgs) {
        var result = {};
        if (userArgs.startdate) { result.startDt = userArgs.startdate; }
        if (userArgs.enddate) { result.endDt = userArgs.enddate; }

        if (userArgs.startdate != undefined && userArgs.enddate != undefined) {
            return result;
        }
        //Period ISO 8601
        //Example: PT2H30M
        else if (userArgs.period != undefined) {
            result.period = userArgs.period;
        }
        //Start and interval
        else if (userArgs.startdate && userArgs.timeinterval) {
            const endDate = calculateEndDate(userArgs.startdate, userArgs.timeinterval);
            result.endDt = endDate;
        }

        return result;
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
        debugger;
        var url = epaComponent.url;
        var params = this.buildParams();
        var fullPath = url + params;
        console.log(fullPath);
        var rawData = await DataManager.getData("test", fullPath, skipCache);

        this.rawDataReady(rawData);
    }
}

customElements.define("epa-ml", epaComponent);
