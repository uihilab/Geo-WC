import tableComponent from './visualize/tableComponent.js'
import outputComponent from './output/outputComponent.js'
import graphComponent from './visualize/graphComponent.js'

async function loadSubComponents(mainComponent) {

    if (!customElements.get("geoweb-table")) { customElements.define("geoweb-table", tableComponent); }
    if (!customElements.get("geoweb-output")) { customElements.define("geoweb-output", outputComponent); }
    if (!customElements.get("geoweb-graph")) {
        customElements.define("geoweb-graph", graphComponent);
    }


    // const tableComp = new tableComponent();
    // mainComponent.shadowRoot.appendChild(tableComp);


    // const outputComp = new outputComponent();
    // mainComponent.shadowRoot.appendChild(outputComp);


    // const graphComp = new graphComponent();
    // mainComponent.shadowRoot.appendChild(graphComp);
}

export { loadSubComponents }