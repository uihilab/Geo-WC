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
        var data = this.prepareData(rawData);
        eventBus.publish('DataReady', data);
        //await super.dataFromApi(usgsComponent.url);
        //this.data = await getData();

        //this.dispatchEvent(new CustomEvent('data-loaded', { data: this.data }));
    }

    prepareData(rawData) {
        return rawData;
    }

}
customElements.define("usgs-component", usgsComponent);
