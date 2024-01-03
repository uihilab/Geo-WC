import { genericComponent } from "../genericComponent/genericComponent.js";
import DataManager from "../data/dataManager.js";
import { calculateEndDate } from "../common/dateTimeFuncs.js";
import { mergeObjects, updateKeys } from "../common/functions.js";

class nwsComponent extends genericComponent {

    static observedAttributes = ["startdate", "enddate"];
    static name = "NWS Web Component";
    static defaultKeepValues = '["gridpoints", placeHolder: true, "stations"]';
    constructor() {
        super(nwsComponent.name);
        this.loadingState = "loading";
    }

    async connectedCallback() {
        debugger;
        var div = document.createElement("div");
        div.id = "sub-component-container";
        div.innerHTML = "Sub Component Container";
        this.shadowRoot.appendChild(div);
        debugger;
        await this.loadSubComponents({
            funcTransformMap: (rawData) => this.prepareMapData(rawData),
            funcTransformTable: (rawData) => this.prepareTableData(rawData),
            funcTransformOutput: (rawData) => this.prepareOutputData(rawData)
        });
        var datatype = this.getAttribute('service');
        var placeHolder =this.getAttribute("placeHolder");
        var apiArgs = await this.buildApiArguments();
        apiArgs = updateKeys(apiArgs, "gridx", "gridX");
        apiArgs = updateKeys(apiArgs, "gridy", "gridY");
        apiArgs = updateKeys(apiArgs, "stationid", "stationId");
        var dataRetrievalParams = {
            params: { source: "nws", datatype: datatype, placeHolder: placeHolder},
            args: apiArgs
        };
        this.keepParams = this.getKeepParameters();
        if (!this.keepParams) {
            this.keepParams = nwsComponent.defaultKeepValues;
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
        debugger;
        var geoJsonData = {
            "type": "FeatureCollection",
            "features": []
        };
        var res = await fetch("../../external/fips_map_minify.json");
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
        debugger;
        var url = femaComponent.url;
        var params = this.buildParams();
        debugger;
        var fullPath = url + params;
        console.log(fullPath);
        var rawData = await DataManager.getData("test", fullPath, skipCache);

        this.rawDataReady(rawData);
    }
}

customElements.define("nws-ml", nwsComponent);
