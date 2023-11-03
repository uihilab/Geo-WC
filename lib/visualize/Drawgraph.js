class graphComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = null;
    this.drawGraph = this.drawGraph.bind(this);
  }

  connectedCallback() {
    const rootNode = this.parentNode;
    rootNode.addEventListener('DataFetch', (event, graph = this) => {
      console.log("Event fired! graph component");
      const data = event.detail.data;
      graph.drawGraph(data);
    });
  }

  drawGraph(data) {
    const canvas = document.createElement('canvas'); // Create a new canvas element
    canvas.className = 'dynamic-graph';

    // Initialize an array to store the values
    const valuesArray = [];

    // Access the "4.18" value and store it in the valuesArray
    data.value.timeSeries.forEach(element => {
      const value = element.values[0].value[0].value;
      valuesArray.push(parseFloat(value)); // Convert the value to a floating-point number
    });


    // Add the canvas element to your shadow DOM
    this.shadowRoot.appendChild(canvas);

    // Use Chart.js to draw the chart
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: Array.from({ length: valuesArray.length }, (_, i) => i + 1), // Generate labels
        datasets: [{
          label: 'Gage Height',
          data: valuesArray, // Use the valuesArray
          borderWidth: 1,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    this.shadowRoot.appendChild(canvas);
  }
}

customElements.define("graph-component", graphComponent);
