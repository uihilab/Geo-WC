class dataTableComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(document.getElementById('data-table-component-template').content.cloneNode(true));
    this.data = null;
  }

  connectedCallback() {
    var rootNode = this.parentNode;
    //if(rootNode=="usgs-component")
    {
      rootNode.addEventListener('taha', function(event) {
        console.log("event fired! data table");
        this.data = event.detail.data;
        var selectedDiv = this.shadowRoot.getElementById('jsonData');

        //;
      });
    }
   

  }
}
customElements.define("data-table-component", dataTableComponent);