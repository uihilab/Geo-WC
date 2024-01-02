import { createLoadingAnimation } from "../common/functions.js";
import HydroLangProxy from '../hydroLangProxy.js'
import { subGenericComponent } from '../genericComponent/subGenericComponent.js'

class graphComponent extends subGenericComponent {

    constructor() {
        super();

        this.subscribeEvent("DataReadyRaw", this.dataReadAndPrint);
        this.subscribeEvent("DataLoading", this.dataLoading, "Graph Component Loading...");

        this.hydroInstance = new HydroLangProxy();
    }

    async connectedCallback() {
        this.dataLoading("Graph component loaded.");
    }

    async dataReadAndPrint(eventData) {
        var graphData = null;
        if (eventData.datatype === "json") {
            graphData = this.funcDataConvert(eventData.data);
        }
        else { return; }
        var chartId = "geoweb-chart-1";
        var container = this.createContainer(chartId);
        let hydroDiv = this.hydroInstance.visualize.draw({
            params: { type: 'chart', name: chartId }, args: {}
            , data: graphData
        });
    }

    dataLoading(message) {
        var loading = createLoadingAnimation(message);
        this.shadowContainer.appendChild(loading);
    }
}

export default graphComponent;