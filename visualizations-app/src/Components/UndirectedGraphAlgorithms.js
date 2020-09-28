import React, { Component } from 'react';
import createGraph from '../graph-builders/undirected-graph-builder';
import dijkstra from '../algorithms/graph-algorithms/dijkstra';
import prim from '../algorithms/graph-algorithms/prims_mst';

class UndirectedGraphAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      distances: {},
      parents: {},
      algorithmSelected: '',
      cumulativeCostMap: {},
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
    this.graph = document.getElementById('graph-container');
  }
  componentDidMount() {
    createGraph();
  }

  componentWillUnmount() {
    let svg = document.getElementById('graph-svg');
    if (this.graph.hasChildNodes()) this.graph.removeChild(svg);
    this.reset();
  }

  updateDistancesAndParents = async (distances, parents) => {
    await this.setState({ distances, parents });
  };

  updatePrimDistancesAndParents = async (
    distances,
    parents,
    cumulativeCostMap
  ) => {
    await this.setState({
      distances,
      parents,
      cumulativeCostMap,
    });
  };

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let el = document.getElementById(e);
      if (el) {
        el.classList.remove('node-complete-tree');
      }
    });
    let lines = document.getElementsByTagName('line');
    for (let line of lines) {
      line.classList = '';
    }
    this.setState({ distances: {}, parents: {} });
  };

  renderDijkstraTableData() {
    return Object.keys(this.state.distances).map((key, index) => {
      return (
        <tr key={index}>
          <td>{key}</td>
          <td>{this.state.parents[key]}</td>
          <td>{this.state.distances[key]}</td>
        </tr>
      );
    });
  }

  renderDijkstraHeading() {
    return (
      <tr>
        <th>Node</th>
        <th>Parent</th>
        <th>Distance</th>
      </tr>
    );
  }

  renderPrimTableData() {
    return Object.keys(this.state.distances).map((key, index) => {
      return (
        <tr key={index}>
          <td>{key}</td>
          <td>{this.state.parents[key]}</td>
          <td>{this.state.distances[key]}</td>
          <td>{this.state.cumulativeCostMap[key]}</td>
        </tr>
      );
    });
  }

  renderPrimHeading() {
    return (
      <tr>
        <th>Node</th>
        <th>Parent</th>
        <th>Distance</th>
        <th>Total Distance</th>
      </tr>
    );
  }

  render() {
    return (
      <div className={'row'}>
        <div className={'col-6'}>
          <button
            className="graph-button"
            onClick={() => {
              this.setState({
                pause: false,
                stop: false,
                algorithmSelected: 'dijkstra',
              });
              this.reset();
              dijkstra(
                this.adjList,
                'source',
                'target',
                this.getPauseStatus,
                this.getStopStatus,
                this.getSpeedRequest,
                this.updateDistancesAndParents
              );
            }}
          >
            Dijkstra
          </button>

          <button
            className="graph-button"
            onClick={() => {
              this.setState({
                pause: false,
                stop: false,
                algorithmSelected: 'prim',
              });
              this.reset();
              prim(
                this.adjList,
                'source',
                this.getPauseStatus,
                this.getStopStatus,
                this.getSpeedRequest,
                this.updatePrimDistancesAndParents
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
        <div className={'col-6'} id={'output-tables'}>
          {this.state.algorithmSelected === 'dijkstra' ? (
            <table
              id={'dijkstra-table'}
              className={('dijkstra-table', 'float-right')}
            >
              <tbody>
                {this.renderDijkstraHeading()}
                {this.renderDijkstraTableData()}
              </tbody>
            </table>
          ) : (
            <table id={'prim-table'} className={('prim-table', 'float-right')}>
              <tbody>
                {this.renderPrimHeading()}
                {this.renderPrimTableData()}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

export default UndirectedGraphAlgorithms;
