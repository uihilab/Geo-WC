import { createLoadingAnimation } from "../common/functions.js";
import { subGenericComponent } from '../genericComponent/subGenericComponent.js'
import HydroLangProxy from '../hydroLangProxy.js'

class mapComponent extends subGenericComponent {

    constructor() {
        super();
        this.subscribeEvent("DataReady", this.drawMapWithRawData);
        this.subscribeEvent("DataLoading", this.dataLoading, "Map Component Loading...");
        this.hydroInstance = new HydroLangProxy();
    }

    async connectedCallback() {
        debugger;
        this.dataLoading("Map component loaded.");
        this.drawMapWithRawData();
    }

    async drawMapWithRawData() {

        // Sabit bir konum için bir marker 
        // Layers({
        //     params: { maptype: 'leaflet' }, // Harita türü
        //     args: { type: 'marker', name: 'customMarkerLayer' }, // Katman türü
        //     data: [40, -100] // Sabit marker konumu
        // });

        this.hydroInstance.map.renderMap({
            params: { maptype: 'leaflet', lat: 40, lon: -100 }, // İlk koordinatları 
            args: { type: 'tile', name: 'OpenStreetMap' } // Katman türü
        });

        this.hydroInstance.map.Layers({
            params: { maptype: 'leaflet' }, // Harita türü
            args: { type: 'marker', output: 'firstmarker' }, // Katman türü
            data: [40, -100]
        });

    }

    dataLoading(message) {
        var loading = createLoadingAnimation(message);
        this.shadowContainer.appendChild(loading);
    }
}
export default mapComponent;