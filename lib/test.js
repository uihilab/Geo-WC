import { getData  } from "./retrievedata.js";

class testComponent extends HTMLElement {
    constructor() {
        super();
        // element created
      }
      connectedCallback() {
        console.log("Çalıştı");
        getData();
      }
    }
    customElements.define("test-component", testComponent);