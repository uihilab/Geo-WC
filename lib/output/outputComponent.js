import { subGenericComponent } from '../genericComponent/subGenericComponent.js'
class outputComponent extends subGenericComponent {

    constructor() {
        super();
        this.subscribeEvent("DataReady", this.dataReadAndPrint);
        this.subscribeEvent("DataLoading", this.dataLoading, "Output Component Loading...");
    }

    async connectedCallback() {
    }

    async dataReadAndPrint(rawData) {
        var type = this.getAttribute('type');
        var data = null;
        var mimeType = "";
        if (type === "json") {
            data = this.parentElement.prepareDataForJson(rawData);
            mimeType = 'application/json';
        }
        else if (type === "csv") {
            data = this.parentElement.prepareDataForCsv(rawData);
            mimeType = 'application/csv';
        }
        const blob = new Blob([data], { type: mimeType });
        this.createLink(blob, "data." + type, type);
    }

    createLink(blob, filename, type) {
        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        // Set the download attribute with the desired file name
        link.download = filename;
        link.appendChild(document.createTextNode(`Download ${type}`));
        // Append the link to the document
        this.shadowContainer.appendChild(link);
    }

    dataLoading(message) {

    }
}

//customElements.define("geoweb-output", outputComponent);
export default outputComponent;