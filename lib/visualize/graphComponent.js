import DataManager, { lastDataKey } from "../data/dataManager.js";
import { eventBus } from "../eventbus.js";

class graphComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = null;
    this.drawGraph = this.drawGraph.bind(this);
    eventBus.subscribe('DataReady', this.drawGraph);

  }

  async connectedCallback() {
    const rootNode = this.parentNode;
    if (lastDataKey) {
      var data = await DataManager.getData(lastDataKey);
      console.log("from last data variable");
      console.log(data);
    }

    rootNode.addEventListener('DataFetch', (event, graph = this) => {
      console.log("Event fired! graph component");
      const data = event.detail.data;
      graph.drawGraph(data);
    });
  }


  drawGraph(xData, yData) {
    const canvas = document.createElement('canvas'); // Create a new canvas element
    canvas.className = 'dynamic-graph';
    console.log("from eventbus");


    new Chart(canvas, {
      type: 'line', // Set the chart type to 'line' for a line chart
      data: {
        labels: xData,
        datasets: [{
          label: 'Y-Axis Data',
          data: yData,
          fill: false, // Set to false for a line chart without fill
          borderColor: 'rgba(75, 192, 192, 1)', // Customize the line color
          borderWidth: 2, // Customize the line width
        }],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'X-Axis Data',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Y-Axis Data',
            },
          },
        },
      },
    });

    this.shadowRoot.appendChild(canvas);
  }
}
customElements.define("graph-component", graphComponent);