import tableComponent from './visualize/tableComponent.js'
import outputComponent from './output/outputComponent.js'
import graphComponent from './visualize/graphComponent.js'
import mapComponent from './visualize/mapComponent.js';

async function loadSubComponents(mainComponent, transformFunctions) {
    initComponent("geoweb-table", tableComponent, mainComponent, transformFunctions.funcTransformTable);
    initComponent("geoweb-map", mapComponent, mainComponent, transformFunctions.funcTransformMap);
    initComponent("geoweb-graph", graphComponent, mainComponent, transformFunctions.funcTransformGraph);
    initComponent("geoweb-output", outputComponent, mainComponent, transformFunctions.funcTransformOutput);
}

function initComponent(componentName, componentClass, mainComponent, transformFunction) {
    if (!customElements.get(componentName)) {
        customElements.define(componentName, componentClass);
        if (transformFunction) {
            var elems = mainComponent.getElementsByTagName(componentName);
            elems.forEach(element => {
                //ham veriyi işlemek için transform fonksiyonuna veriyi gönderir. 
                element.bindDataConvertFunc(transformFunction);
            });
        }
    }
}

export { loadSubComponents }