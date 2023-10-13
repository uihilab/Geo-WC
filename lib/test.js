class testComponent extends HTMLElement {
    constructor() {
        super();
        // element created
      }
    
      connectedCallback() {
        console.log("Çalıştı");
      }
    }
    customElements.define("test-component", testComponent);