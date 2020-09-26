import React, { Component } from 'react';
import topSort from '../algorithms/graph-algorithms/topsort';
import createDirectedGraph from '../graph-builder/directed-graph-builder';

class DirectedGraphAlgorithms extends Component {
  adjList;
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      // distances: {},
      // parents: {},
    };
    this.adjList = {
      a: ['b', 'f'],
      b: ['h'],
      c: [],
      d: ['a', 'e', 'i'],
      e: ['i'],
      f: [],
      g: ['a', 'b', 'c'],
      h: [],
      i: ['f'],
      j: ['e'],
    };
    this.graph = document.getElementById('tree-img');
  }
  componentDidMount() {
    createDirectedGraph();
  }

  componentWillUnmount() {
    let svg = document.getElementById('dir-graph-svg');
    if (this.graph.hasChildNodes()) this.graph.removeChild(svg);
    // document.getElementById('output').innerHTML = '';
    // document.getElementById('shortest-path').innerHTML = '';
    // this.reset();
  }

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let el = document.getElementById(e);
      if (el) {
        el.classList.remove('node-visited');
      }
    });
    document.getElementById('output').innerHTML = '';
  };

  render() {
    return (
      <div>
        <button
          className="graph-button"
          onClick={() => {
            this.setState({ pause: false, stop: false });
            this.reset();
            topSort(
              this.adjList,
              this.getPauseStatus,
              this.getStopStatus,
              this.getSpeedRequest
            );
          }}
        >
          Topological Sort
        </button>
      </div>
    );
  }
}

export default DirectedGraphAlgorithms;

// import React, { Component } from 'react';
// import createGraph from '../graph-builder/graph-builder';
// import dijkstra from '../algorithms/graph-algorithms/dijkstra';
// import prim from '../algorithms/graph-algorithms/prims_mst';

// class GraphAlgorithms extends Component {

//   render() {
//     return (
//       <div>
//         <button
//           className="graph-button"
//           onClick={() => {
//             this.setState({ pause: false, stop: false });
//             this.reset();
//             dijkstra(
//               this.adjList,
//               'source',
//               'target',
//               this.getPauseStatus,
//               this.getStopStatus,
//               this.updateDistancesAndParents,
//               this.getShortestPath,
//               this.getSpeedRequest
//             );
//           }}
//         >
//           Dijkstra
//         </button>

//         <button
//           className="graph-button"
//           onClick={() => {
//             this.setState({ pause: false, stop: false });
//             this.reset();
//             prim(
//               this.adjList,
//               'source',
//               this.getSpeedRequest,
//               this.updatePrimDistancesAndParents,
//               this.calculateCumulativeDistance,
//               this.getPauseStatus,
//               this.getStopStatus,
//               this.clearLastUpdatedCells
//             );
//           }}
//         >
//           Prim MST
//         </button>
//         <button
//           className="graph-button"
//           onClick={() => {
//             this.setState({ pause: false, stop: true });
//             this.reset();
//           }}
//         >
//           Reset
//         </button>
//         <button
//           className="graph-button"
//           onClick={() => {
//             this.setState({ pause: !this.state.pause });
//           }}
//         >
//           {this.state.pause ? 'UnPause' : 'Pause'}
//         </button>
//         <span id="shortest-path"></span>

//         <form onSubmit={(event) => event.preventDefault()}>
//           <label>
//             Speed:
//             <input
//               style={{ width: '50px' }}
//               type="number"
//               value={this.state.speed}
//               onChange={(event) => {
//                 event.preventDefault();
//                 this.setState({
//                   speed: event.target.value,
//                 });
//               }}
//             />
//           </label>
//         </form>
//       </div>
//     );
//   }
// }

// export default GraphAlgorithms;

// function createDistanceTable(distances, parents, outputEl) {
//   let table = document.createElement('table');
//   table.setAttribute('id', 'distance-table');
//   table.setAttribute('class', 'distance-table');
//   outputEl.appendChild(table);

//   let tBody = document.createElement('tBody');
//   let nodeTh = document.createElement('th');
//   let parentTh = document.createElement('th');
//   let DistanceTh = document.createElement('th');
//   nodeTh.appendChild(document.createTextNode('Node'));
//   DistanceTh.appendChild(document.createTextNode('Distance'));
//   parentTh.appendChild(document.createTextNode('Parent'));
//   let tr = document.createElement('tr');
//   tr.appendChild(nodeTh);
//   tr.appendChild(DistanceTh);
//   tr.appendChild(parentTh);

//   tBody.appendChild(tr);
//   Object.keys(distances).forEach((key) => {
//     tr = document.createElement('tr');
//     tr.setAttribute('id', key + '-row');
//     let nodeTd = document.createElement('td');
//     nodeTd.appendChild(document.createTextNode(key));
//     tr.appendChild(nodeTd);
//     let distanceTd = document.createElement('td');
//     distanceTd.appendChild(document.createTextNode(distances[key]));
//     let parentTd = document.createElement('td');
//     parentTd.appendChild(document.createTextNode(''));
//     tr.appendChild(distanceTd);
//     tr.appendChild(parentTd);
//     tBody.appendChild(tr);
//     table.appendChild(tBody);
//   });
// }
// function updateDistanceTable(distances, parents) {
//   Object.keys(distances).forEach((key) => {
//     let row = document.getElementById(key + '-row');
//     let td = row.getElementsByTagName('td');
//     if (td[1].outerText !== String(distances[key])) {
//       td[1].innerHTML = distances[key];
//       td[1].style.backgroundColor = 'yellow';
//     } else {
//       td[1].style.backgroundColor = '';

//       td[1].innerHTML = distances[key];
//     }
//     if (parents[key] !== null && td[2].outerText !== String(parents[key])) {
//       td[2].innerHTML = parents[key];
//       td[2].style.backgroundColor = 'orange';
//     } else {
//       td[2].style.backgroundColor = '';
//       td[2].innerHTML = parents[key];
//     }
//   });
// }

// function createPrimTable(distances, parents, outputEl) {
//   let table = document.createElement('table');
//   table.setAttribute('id', 'prim-table');
//   table.setAttribute('class', 'distance-table');
//   outputEl.appendChild(table);

//   let tBody = document.createElement('tBody');
//   let nodeTh = document.createElement('th');
//   let parentTh = document.createElement('th');
//   let DistanceTh = document.createElement('th');
//   let totalDistanceTh = document.createElement('th');
//   nodeTh.appendChild(document.createTextNode('Node'));
//   parentTh.appendChild(document.createTextNode('Parent'));
//   DistanceTh.appendChild(document.createTextNode('Distance'));
//   totalDistanceTh.appendChild(document.createTextNode('Cumulative Distance'));
//   let tr = document.createElement('tr');
//   tr.appendChild(nodeTh);
//   tr.appendChild(parentTh);
//   tr.appendChild(DistanceTh);
//   tr.appendChild(totalDistanceTh);

//   tBody.appendChild(tr);
//   Object.keys(distances).forEach((key) => {
//     tr = document.createElement('tr');
//     tr.setAttribute('id', key + '-row');
//     let nodeTd = document.createElement('td');
//     nodeTd.appendChild(document.createTextNode(key));
//     let totalDistanceTd = document.createElement('td');
//     totalDistanceTd.appendChild(document.createTextNode(''));
//     let distanceTd = document.createElement('td');
//     distanceTd.appendChild(document.createTextNode(distances[key]));
//     let parentTd = document.createElement('td');
//     parentTd.appendChild(document.createTextNode(''));
//     tr.appendChild(nodeTd);
//     tr.appendChild(parentTd);
//     tr.appendChild(distanceTd);
//     tr.appendChild(totalDistanceTd);
//     tBody.appendChild(tr);
//     table.appendChild(tBody);
//   });
// }
// function updatePrimTable(distances, parents, cumulativeCostMap) {
//   Object.keys(distances).forEach((key) => {
//     let row = document.getElementById(key + '-row');
//     let td = row.getElementsByTagName('td');
//     if (td[2].outerText !== String(distances[key])) {
//       td[2].innerHTML = distances[key];
//       td[2].style.backgroundColor = 'yellow';
//     } else {
//       td[2].style.backgroundColor = '';

//       td[2].innerHTML = distances[key];
//     }
//     if (parents[key] !== null && td[1].outerText !== String(parents[key])) {
//       td[1].innerHTML = parents[key];
//       td[1].style.backgroundColor = 'orange';
//     } else {
//       td[1].style.backgroundColor = '';
//       td[1].innerHTML = parents[key];
//     }
//   });
//   addCumulativeDistanceToPrimTable(cumulativeCostMap);
// }

// function addCumulativeDistanceToPrimTable(cumulativeCostMap) {
//   Object.keys(cumulativeCostMap).forEach((key) => {
//     let row = document.getElementById(key + '-row');
//     let td = row.getElementsByTagName('td');
//     if (cumulativeCostMap[key] == 'Infinity') {
//       td[3].innerHTML = '';
//       return;
//     }
//     if (String(cumulativeCostMap[key]) !== td[3].outerText) {
//       td[3].innerHTML = cumulativeCostMap[key];
//       td[3].style.backgroundColor = 'burlywood';
//     } else {
//       td[3].style.backgroundColor = '';
//     }
//   });
// }
