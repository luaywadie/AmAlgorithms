import React, { Component } from 'react';
import createGraph from '../graph-builders/undirected-graph-builder';
import Dijkstra from './algorithms/graph-algorithms/Dijkstra';
import Prim from './algorithms/graph-algorithms/Prim';

class UndirectedGraphAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      primDistances: {},
      dijkstraDistances: {},
      parents: {},
      cumulativeCostMap: {},
      algRunning: '',
      priorityQueue: [],
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

  updateDijkstraData = async (distances, parents) => {
    await this.setState({
      dijkstraDistances: distances,
      parents,
    });
  };

  updatePrimData = async (distances, parents, cumulativeCostMap) => {
    await this.setState({
      primDistances: distances,
      parents,
      cumulativeCostMap,
    });
  };

  setRunningAlg = (alg) => {
    this.reset();
    this.setState({ runningAlg: alg });
  };

  updatePq = (a) => {
    this.setState({ priorityQueue: a });
  };

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let el = document.getElementById(e);
      if (el) {
        el.classList.remove('node-complete-tree');
        el.classList.remove('current-node-of-interest');
      }
    });
    let lines = document.getElementsByTagName('line');
    for (let line of lines) {
      line.classList = '';
    }
    this.setState({ primDistances: {}, dijkstraDistances: {}, parents: {} });
    if (this.state.stop) {
      this.setState({ stop: false, pause: false });
    }
  };

  renderDijkstraTableData() {
    return Object.keys(this.state.dijkstraDistances).map((key, index) => {
      return (
        <tr key={index}>
          <td>{key}</td>
          <td>{this.state.parents[key]}</td>
          <td>{this.state.dijkstraDistances[key]}</td>
          <td style={{ backgroundColor: index === 0 ? 'yellow' : '' }}>
            {this.state.priorityQueue[index]}
          </td>
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
        <th>Priority Queue</th>
      </tr>
    );
  }

  renderPrimTableData() {
    return Object.keys(this.state.primDistances).map((key, index) => {
      return (
        <tr key={index}>
          <td>{key}</td>
          <td>{this.state.parents[key]}</td>
          <td>{this.state.primDistances[key]}</td>
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
          <Dijkstra
            g={this.adjList}
            root={'source'}
            target={'target'}
            pause={this.state.pause}
            stop={this.state.stop}
            speed={this.state.speed}
            runningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            updateDijkstraData={this.updateDijkstraData}
            updatePq={this.updatePq}
          />
          <div class="divider"></div>
          <Prim
            g={this.adjList}
            root={'source'}
            pause={this.state.pause}
            stop={this.state.stop}
            speed={this.state.speed}
            runningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            updatePrimData={this.updatePrimData}
          />
          <div class="divider"></div>
          <button
            className="graph-button"
            onClick={() => {
              this.setState({ pause: false, stop: true });
              this.reset();
            }}
          >
            Reset
          </button>
          <div class="divider"></div>
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
          <table
            id={'undirected-graph-table'}
            className={('undirected-graph-table', 'float-right')}
          >
            <tbody>
              {!this.state.dijkstraDistances['target']
                ? this.renderPrimHeading()
                : this.renderDijkstraHeading()}
              {this.renderDijkstraTableData()}
              {this.renderPrimTableData()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default UndirectedGraphAlgorithms;
