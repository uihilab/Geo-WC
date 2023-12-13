import { createLoadingAnimation } from "../common/functions.js";
import { subGenericComponent } from '../genericComponent/subGenericComponent.js'
import HydroLangProxy from '../hydroLangProxy.js'
//import 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

class mapComponent extends subGenericComponent {

    constructor() {
        super();
        this.subscribeEvent("DataReadyRaw", this.drawMapWithRawData);
        this.subscribeEvent("DataLoading", this.dataLoading, "Map Component Loading...");
        this.appendStyleToElement();
        
        //this.hydroInstance = new HydroLangProxy();
    }

    async connectedCallback() {
        const { foo } = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
        this.dataLoading("Map component loaded.");
    }

    appendStyleToElement() {
        var t = document.createElement('template');
        t.innerHTML = `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""/>`;
        this.shadowContainer.appendChild(t.content);
    }

    async drawMapWithRawData(rawData) {
        var mapData = this.funcDataConvert(rawData);
        var mapDiv = document.createElement("div");
        mapDiv.id = "map";
        mapDiv.style = "height: 300px;"
        this.shadowContainer.appendChild(mapDiv);

        var map = L.map(mapDiv).setView([mapData.lat, mapData.long], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        var marker = L.marker([mapData.lat, mapData.long]).addTo(map);
        marker.bindPopup(`Sum: ${mapData.value}`).openPopup();
        // await this.hydroInstance.map.renderMap({
        //     params: { maptype: 'leaflet', lat: 48.99 , lon: -104.05}, // İlk koordinatları 
        //     args: { type: 'tile', name: 'OpenStreetMap' } // Katman türü
        // });

        // // Toplam değerini harita üzerinde göstermek için bir pop-up oluşturma
        // //const popupContent = `Toplam: ${sum}`;

        // await this.hydroInstance.map.Layers({
        //     params: { maptype: 'leaflet' }, // Harita türü
        //     args: { type: 'geojson', output: 'marker'}, // Katman türü
        //     data: {
        //         "type": "FeatureCollection",
        //         "features": [
        //           {
        //             "type": "Feature",
        //             "properties": {
        //               "dfdfg": 55656
        //             },
        //             "geometry": {
        //               "coordinates": [
        //                 -104.05,48.99

        //               ],
        //               "type": "Point"
        //             },
        //             "id": 0
        //           }
        //         ]
        //       }
        // });
    }

    dataLoading(message) {
        var loading = createLoadingAnimation(message);
        this.shadowContainer.appendChild(loading);
    }
}
export default mapComponent;