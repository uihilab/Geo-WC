import { subGenericComponent } from '../genericComponent/subGenericComponent.js'
class outputComponent extends subGenericComponent {

    constructor() {
        super();
        this.subscribeEvent("DataReadyRaw", this.dataReadAndPrint);
        this.subscribeEvent("DataLoading", this.dataLoading, "Output Component Loading...");
    }

    async connectedCallback() {
    }

    async dataReadAndPrint(eventData) {
        debugger;
        var outputData = null;
        if (eventData.datatype === "json") {
            outputData = this.funcDataConvert(eventData.data);
        }
        else { return; }
        var type = this.getAttribute('type');
        var data = null;
        var mimeType = "";
        if (type === "json") {
            data = this.prepareDataForJson(outputData);
            mimeType = 'application/json';
        }
        else if (type === "csv") {
            data = this.prepareDataForCsv(outputData);
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

    prepareDataForCsv(outputData)
    {
    debugger;
    const csvContent = outputData.map(row => row.join(',')).join('\n');
    console.log(csvContent);
    return csvContent;
    }



    prepareDataForJson(outputData)
    {
    const jsonData = JSON.stringify(outputData, null, 2); // null ve 2, formatlama için kullanılır (2: iki boşluklu girinti)
    console.log(jsonData);
    return jsonData;
    }

    dataLoading(message) {

    }
}

//customElements.define("geoweb-output", outputComponent);
export default outputComponent;