import { getData  } from "./usgs/retrieveDataUSGS.js";

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

// Example of shadowDOM 
const host = document.querySelector("test-component");
const shadow = host.attachShadow({ mode: "open" });
const span = document.createElement("span");
span.textContent = "I'm in the shadow DOM";
shadow.appendChild(span);