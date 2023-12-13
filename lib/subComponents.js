import tableComponent from './visualize/tableComponent.js'
import outputComponent from './output/outputComponent.js'
import graphComponent from './visualize/graphComponent.js'
import mapComponent from './visualize/mapComponent.js';
//{funcTransformMap: mapTF, funcTransformMap: graph}
async function loadSubComponents(mainComponent, transformFunctions) {
    if (!customElements.get("geoweb-table")) { customElements.define("geoweb-table", tableComponent); }
    if (!customElements.get("geoweb-output")) { customElements.define("geoweb-output", outputComponent); }
    if (!customElements.get("geoweb-graph")) { customElements.define("geoweb-graph", graphComponent); }
    if (!customElements.get("geoweb-map")) {
        customElements.define("geoweb-map", mapComponent); 
        var elems = mainComponent.getElementsByTagName("geoweb-map");
        elems[0].bindDataConvertFunc(transformFunctions.funcTransformMap);
        debugger;
    }
}

export { loadSubComponents }