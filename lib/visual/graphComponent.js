class graphComponent extends HTMLElement {
    constructor() {
      super();
      
    }

    connectedCallback()
    {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.getElementById('graph-component-template').content.cloneNode(true));
    }
  }
  customElements.define("graph-component", graphComponent);