import React, { Component } from 'react';
import createGraph from '../graph-builder/graph-builder';
import dijkstra from '../algorithms/graph-algorithms/dijkstra';
import prim from '../algorithms/graph-algorithms/prims_mst';

class GraphAlgorithms extends Component {
  adjList;
  outputEl;
  shortestPath = [];
  cumulativeCostMap = {};
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      distances: {},
      parents: {},
    };
    this.adjList = {
      a: [
        [3, 'g'],
        [5, 'i'],
        [7, 'c'],
        [6, 'f'],
        [10, 'b'],
        [8, 'd'],
      ],
      b: [
        [10, 'a'],
        [8, 'f'],
        [11, 'e'],
        [4, 's'],
        [8, 'j'],
        [8, 'l'],
        [9, 'd'],
      ],
      c: [
        [5, 'k'],
        [2, 'h'],
        [9, 'e'],
        [7, 'f'],
        [7, 'a'],
      ],
      d: [
        [5, 'q'],
        [10, 'i'],
        [8, 'a'],
        [9, 'b'],
        [9, 'l'],
        [6, 't'],
        [4, 'target'],
      ],
      e: [
        [6, 'm'],
        [10, 'j'],
        [9, 's'],
        [11, 'b'],
        [6, 'f'],
        [9, 'c'],
        [10, 'k'],
      ],
      f: [
        [6, 'a'],
        [7, 'c'],
        [6, 'e'],
        [8, 'b'],
      ],
      g: [
        [3, 'h'],
        [10, 'k'],
        [4, 'i'],
        [3, 'a'],
      ],
      h: [
        [2, 'c'],
        [3, 'g'],
      ],
      i: [
        [8, 'q'],
        [10, 'd'],
        [5, 'a'],
        [4, 'g'],
        [14, 'k'],
        [7, 'n'],
      ],
      j: [
        [6, 'o'],
        [10, 'l'],
        [8, 'b'],
        [5, 's'],
        [10, 'e'],
        [11, 'm'],
        [15, 'source'],
      ],
      k: [
        [6, 'n'],
        [14, 'i'],
        [10, 'g'],
        [5, 'c'],
        [10, 'e'],
        [8, 'm'],
        [6, 'p'],
      ],
      l: [
        [4, 't'],
        [9, 'd'],
        [8, 'b'],
        [10, 'j'],
        [5, 'o'],
      ],
      m: [
        [8, 'k'],
        [6, 'e'],
        [11, 'j'],
        [6, 'source'],
        [7, 'p'],
      ],
      n: [
        [6, 'k'],
        [7, 'i'],
      ],
      o: [
        [5, 'l'],
        [6, 'j'],
      ],
      p: [
        [6, 'k'],
        [7, 'm'],
        [9, 'source'],
      ],
      q: [
        [3, 'target'],
        [8, 'i'],
        [5, 'd'],
      ],
      s: [
        [9, 'e'],
        [4, 'b'],
        [5, 'j'],
      ],
      t: [
        [6, 'd'],
        [4, 'l'],
      ],
      target: [
        [3, 'q'],
        [4, 'd'],
      ],
      source: [
        [9, 'p'],
        [6, 'm'],
        [15, 'j'],
      ],
    };
    this.graph = document.getElementById('tree-img');
    this.outputEl = document.getElementById('output');
    this.outputEl.style.fontSize = '20px';
    this.outputEl.style.marginTop = '-50px';
  }
  componentDidMount() {
    createGraph();
  }

  componentWillUnmount() {
    let svg = document.getElementById('graph-svg');
    if (this.graph.hasChildNodes()) this.graph.removeChild(svg);
    document.getElementById('output').innerHTML = '';
    document.getElementById('shortest-path').innerHTML = '';
    this.reset();
  }

  updateDistancesAndParents = async (distances, parents) => {
    await this.setState({ distances, parents });
    if (!document.getElementById('distance-table')) {
      createDistanceTable(this.state.distances, this.outputEl);
    } else {
      updateDistanceTable(this.state.distances, this.state.parents);
    }
  };

  clearLastUpdatedCells = () => {
    updatePrimTable(
      this.state.distances,
      this.state.parents,
      this.cumulativeCostMap
    );
  };

  updatePrimDistancesAndParents = async (distance, parent) => {
    await this.setState({ distances: distance, parents: parent });
    if (!document.getElementById('prim-table')) {
      createPrimTable(this.state.distances, this.state.parents, this.outputEl);
    } else {
      updatePrimTable(
        this.state.distances,
        this.state.parents,
        this.cumulativeCostMap
      );
    }
  };

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

  getShortestPath = (path, dist) => {
    this.shortestPath = path;
    let pathStr = '  Shortest Path: ';
    path.forEach((node) => {
      pathStr += node + ' -> ';
    });
    pathStr = pathStr.slice(0, -3);
    document
      .getElementById('shortest-path')
      .appendChild(document.createTextNode(pathStr + '; Cost: ' + dist));
  };

  calculateCumulativeDistance = (costMap, parents, aLinks) => {
    this.activeLinks = aLinks;
    let cumCostMap = {};
    for (let node of Object.keys(costMap)) {
      if (parents[node] == null) {
        continue;
      }
      let currentNode = parents[node];
      let cost = costMap[node];
      while (currentNode !== -1) {
        cost += costMap[currentNode];
        currentNode = parents[currentNode];
      }
      cumCostMap[node] = cost;
    }
    this.cumulativeCostMap = cumCostMap;
  };

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let el = document.getElementById(e);
      if (el) {
        el.classList.remove('node-visited');
      }
    });
    document.getElementById('output').innerHTML = '';
    document.getElementById('shortest-path').innerHTML = '';
    if (this.activeLinks) {
      this.activeLinks.forEach((e) => {
        if (e) {
          e.classList.remove('link-of-interest');
        }
      });
    }
    if (this.shortestPath.length > 0) {
      for (let i = 1; i < this.shortestPath.length; i++) {
        let prev = this.shortestPath[i - 1];
        let current = this.shortestPath[i];
        let linkString =
          current < prev ? current + '-' + prev : prev + '-' + current;

        let linkOfInterestElement = document.getElementById(linkString);
        if (linkOfInterestElement)
          linkOfInterestElement.classList.remove('link-of-interest');
      }
    }
  };

  render() {
    return (
      <div>
        <button
          className="graph-button"
          onClick={() => {
            this.setState({ pause: false, stop: false });
            this.reset();
            dijkstra(
              this.adjList,
              'source',
              'target',
              this.getPauseStatus,
              this.getStopStatus,
              this.getSpeedRequest,
              this.updateDistancesAndParents,
              this.getShortestPath
            );
          }}
        >
          Dijkstra
        </button>

        <button
          className="graph-button"
          onClick={() => {
            this.setState({ pause: false, stop: false });
            this.reset();
            prim(
              this.adjList,
              'source',
              this.getPauseStatus,
              this.getStopStatus,
              this.getSpeedRequest,
              this.updatePrimDistancesAndParents,
              this.calculateCumulativeDistance,
              this.clearLastUpdatedCells
            );
          }}
        >
          Prim MST
        </button>
        <button
          className="graph-button"
          onClick={() => {
            this.setState({ pause: false, stop: true });
            this.reset();
          }}
        >
          Reset
        </button>
        <button
          className="graph-button"
          onClick={() => {
            this.setState({ pause: !this.state.pause });
          }}
        >
          {this.state.pause ? 'UnPause' : 'Pause'}
        </button>
        <span id="shortest-path"></span>

        <form onSubmit={(event) => event.preventDefault()}>
          <label>
            Speed:
            <input
              style={{ width: '50px' }}
              type="number"
              value={this.state.speed}
              onChange={(event) => {
                event.preventDefault();
                this.setState({
                  speed: event.target.value,
                });
              }}
            />
          </label>
        </form>
      </div>
    );
  }
}

export default GraphAlgorithms;

function createDistanceTable(distances, outputEl) {
  let table = document.createElement('table');
  table.setAttribute('id', 'distance-table');
  table.setAttribute('class', 'distance-table');
  outputEl.appendChild(table);

  let tBody = document.createElement('tBody');
  let nodeTh = document.createElement('th');
  let parentTh = document.createElement('th');
  let DistanceTh = document.createElement('th');
  nodeTh.appendChild(document.createTextNode('Node'));
  DistanceTh.appendChild(document.createTextNode('Distance'));
  parentTh.appendChild(document.createTextNode('Parent'));
  let tr = document.createElement('tr');
  tr.appendChild(nodeTh);
  tr.appendChild(DistanceTh);
  tr.appendChild(parentTh);

  tBody.appendChild(tr);
  Object.keys(distances).forEach((key) => {
    tr = document.createElement('tr');
    tr.setAttribute('id', key + '-row');
    let nodeTd = document.createElement('td');
    nodeTd.appendChild(document.createTextNode(key));
    tr.appendChild(nodeTd);
    let distanceTd = document.createElement('td');
    distanceTd.appendChild(document.createTextNode(distances[key]));
    let parentTd = document.createElement('td');
    parentTd.appendChild(document.createTextNode(''));
    tr.appendChild(distanceTd);
    tr.appendChild(parentTd);
    tBody.appendChild(tr);
    table.appendChild(tBody);
  });
}
function updateDistanceTable(distances, parents) {
  Object.keys(distances).forEach((key) => {
    let row = document.getElementById(key + '-row');
    let td = row.getElementsByTagName('td');
    if (td[1].outerText !== String(distances[key])) {
      td[1].innerHTML = distances[key];
      td[1].style.backgroundColor = 'yellow';
    } else {
      td[1].style.backgroundColor = '';

      td[1].innerHTML = distances[key];
    }
    if (parents[key] !== null && td[2].outerText !== String(parents[key])) {
      td[2].innerHTML = parents[key];
      td[2].style.backgroundColor = 'orange';
    } else {
      td[2].style.backgroundColor = '';
      td[2].innerHTML = parents[key];
    }
  });
}

function createPrimTable(distances, parents, outputEl) {
  let table = document.createElement('table');
  table.setAttribute('id', 'prim-table');
  table.setAttribute('class', 'distance-table');
  outputEl.appendChild(table);

  let tBody = document.createElement('tBody');
  let nodeTh = document.createElement('th');
  let parentTh = document.createElement('th');
  let DistanceTh = document.createElement('th');
  let totalDistanceTh = document.createElement('th');
  nodeTh.appendChild(document.createTextNode('Node'));
  parentTh.appendChild(document.createTextNode('Parent'));
  DistanceTh.appendChild(document.createTextNode('Distance'));
  totalDistanceTh.appendChild(document.createTextNode('Cumulative Distance'));
  let tr = document.createElement('tr');
  tr.appendChild(nodeTh);
  tr.appendChild(parentTh);
  tr.appendChild(DistanceTh);
  tr.appendChild(totalDistanceTh);

  tBody.appendChild(tr);
  Object.keys(distances).forEach((key) => {
    tr = document.createElement('tr');
    tr.setAttribute('id', key + '-row');
    let nodeTd = document.createElement('td');
    nodeTd.appendChild(document.createTextNode(key));
    let totalDistanceTd = document.createElement('td');
    totalDistanceTd.appendChild(document.createTextNode(''));
    let distanceTd = document.createElement('td');
    distanceTd.appendChild(document.createTextNode(distances[key]));
    let parentTd = document.createElement('td');
    parentTd.appendChild(document.createTextNode(''));
    tr.appendChild(nodeTd);
    tr.appendChild(parentTd);
    tr.appendChild(distanceTd);
    tr.appendChild(totalDistanceTd);
    tBody.appendChild(tr);
    table.appendChild(tBody);
  });
}
function updatePrimTable(distances, parents, cumulativeCostMap) {
  Object.keys(distances).forEach((key) => {
    let row = document.getElementById(key + '-row');
    let td = row.getElementsByTagName('td');
    if (td[2].outerText !== String(distances[key])) {
      td[2].innerHTML = distances[key];
      td[2].style.backgroundColor = 'yellow';
    } else {
      td[2].style.backgroundColor = '';

      td[2].innerHTML = distances[key];
    }
    if (parents[key] !== null && td[1].outerText !== String(parents[key])) {
      td[1].innerHTML = parents[key];
      td[1].style.backgroundColor = 'orange';
    } else {
      td[1].style.backgroundColor = '';
      td[1].innerHTML = parents[key];
    }
  });
  addCumulativeDistanceToPrimTable(cumulativeCostMap);
}

function addCumulativeDistanceToPrimTable(cumulativeCostMap) {
  Object.keys(cumulativeCostMap).forEach((key) => {
    let row = document.getElementById(key + '-row');
    let td = row.getElementsByTagName('td');
    if (cumulativeCostMap[key] === 'Infinity') {
      td[3].innerHTML = '';
      return;
    }
    if (String(cumulativeCostMap[key]) !== td[3].outerText) {
      td[3].innerHTML = cumulativeCostMap[key];
      td[3].style.backgroundColor = 'burlywood';
    } else {
      td[3].style.backgroundColor = '';
    }
  });
}
