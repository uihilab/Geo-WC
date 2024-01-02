import { createLoadingAnimation, scanObjectToString } from "../common/functions.js";
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

    async drawMapWithRawData(eventData) {
        var mapData = null;
        var mapDiv = document.createElement("div");
        mapDiv.id = "map";
        mapDiv.style = "height: 300px;"
        this.shadowContainer.appendChild(mapDiv);

        var map = L.map(mapDiv).setView([38, -102.0], 5);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        if (eventData.datatype === "json") {
            mapData = await this.funcDataConvert(eventData.data);
        }
        else if (eventData.datatype === "kml") {
            console.log(eventData);
            //await import('https://www.unpkg.com/@mapbox/leaflet-omnivore@0.3.4/leaflet-omnivore.min.js');
            await import('../../external/L.KML.js');
            //omnivore.kml.parse(eventData.data).addTo(map);
            const parser = new DOMParser();
            const kml = parser.parseFromString(eventData.data, 'text/xml');
            const track = new L.KML(kml);
            map.addLayer(track);

            // Adjust map to show the kml
            const bounds = track.getBounds();
            map.fitBounds(bounds);
            return;
        }
        else { return; }

        if (mapData.datatype === "geojson") {
            L.geoJSON(mapData.data, {
                onEachFeature: function (feature, layer) {
                    layer.addEventListener("click", () => {
                        var popupString = scanObjectToString(feature.properties);
                        layer.bindPopup(popupString);
                    });
                }
            }).addTo(map);
        }
        else {
            map.setView([mapData.lat, mapData.long], 13);
            var marker = L.marker([mapData.lat, mapData.long]).addTo(map);
            marker.bindPopup(`Sum: ${mapData.value}`).openPopup();
        }
    }

    dataLoading(message) {
        var loading = createLoadingAnimation(message);
        this.shadowContainer.appendChild(loading);
    }
}



export default mapComponent;