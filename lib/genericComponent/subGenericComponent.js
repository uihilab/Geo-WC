import { eventBus } from "../eventbus.js";

class subGenericComponent extends HTMLElement {

    constructor() {
        super();
        this.subComponentContainer = this.parentNode.shadowRoot.getElementById("sub-component-container");

        var container = document.createElement("div");
        this.subComponentContainer.appendChild(container);

        this.shadowContainer = container.attachShadow({ mode: 'open' });
        this.data = null;
    }

    bindDataConvertFunc(func)
    {
        this.funcDataConvert = func;
    }

    createContainer(id)
    {
        var container = document.createElement("div");
        container.id = id;
        this.shadowContainer.appendChild(container);
        return container;
    }

    subscribeEvent(event, callback, parameters = null) {
        // Bind the drawTable function to the class instance
        var eventHandler = null;
        if (parameters == null) {
            eventHandler = callback.bind(this);
        }
        else {
            eventHandler = callback.bind(this, parameters);
        }
        eventBus.subscribe(event + this.parentElement?.uid, eventHandler);
    }
}
export { subGenericComponent };