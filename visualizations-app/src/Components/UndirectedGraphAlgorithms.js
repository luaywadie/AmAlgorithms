import React, { Component } from 'react';
import createGraph from '../graph-builders/undirected-graph-builder';
import Dijkstra from './algorithms/graph-algorithms/Dijkstra';
import Prim from './algorithms/graph-algorithms/Prim';
import Sidebar from './sidebar/Sidebar';
import RenderListComponent from './sidebar/RenderListComponent';
import RenderObjectComponent from './sidebar/RenderObjectComponent';
class UndirectedGraphAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      distances: {},
      parents: {},
      runningAlg: '',
      priorityQueue: null,
      mstSet: {},
      clicked: [false, false, false, false, false, false],
      node: null,
      neighbor: null,
      neighborCost: null,
      minNode: null,
      potentialScore: null,
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
  }
  componentDidMount() {
    createGraph();
    this.graph = document.getElementById('graph-container');
  }

  componentWillUnmount() {
    let svg = document.getElementById('graph-svg');
    if (this.graph.hasChildNodes()) this.graph.removeChild(svg);
    this.reset();
  }

  // updateDijkstraData = async (distances, parents) => {
  //   await this.setState({
  //     dijkstraDistances: distances,
  //     parents,
  //   });
  // };

  updateDistances = async (distances) => {
    await this.setState({
      distances,
    });
  };

  updateParents = async (parents) => {
    await this.setState({
      parents,
    });
  };

  updateNode = async (node) => {
    await this.setState({ node });
  };
  updatePrimMinNode = async (minNode) => {
    await this.setState({ minNode });
  };
  updateNeighbor = async (neighbor, cost) => {
    await this.setState({ neighbor, neighborCost: cost });
  };
  updatePrimMstSet = async (mstSet) => {
    await this.setState({ mstSet });
  };

  setRunningAlg = async (alg) => {
    this.reset();
    await this.setState({ runningAlg: alg });
  };

  updatePq = async (a) => {
    await this.setState({ priorityQueue: a });
  };

  updatePotentialScore = (s) => {
    this.setState({ potentialScore: s });
  };

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;
  toggleClicked = (i) => {
    let a = this.state.clicked.slice();
    a[i] = !a[i];
    this.setState({
      clicked: a,
    });
  };
  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let el = document.getElementById(e);
      if (el) {
        el.classList.remove('node-complete-tree');
        el.classList.remove('current-node-of-interest');
      }
    });

    for (let i = 1; i < 15; i++) {
      let dijkstraPseduoElement = document.getElementById('dijkstra-' + i);
      if (dijkstraPseduoElement) dijkstraPseduoElement.classList = '';
      let primPseduoElement = document.getElementById('prim-' + i);
      if (primPseduoElement) primPseduoElement.classList = '';
    }
    let lines = document.getElementsByTagName('line');
    for (let line of lines) {
      line.classList = '';
    }
    this.setState({
      distances: {},
      parents: {},
      runningAlg: '',
      minNode: null,
      neighbor: null,
      neighborCost: null,
      mstSet: {},
      clicked: [false, false, false, false, false],
    });
    if (this.state.stop) {
      this.setState({ stop: false, pause: false });
    }
  };

  renderDijkstraTableData() {
    return Object.keys(this.state.distances).map((key, index) => {
      return (
        <tr key={index}>
          <td>{key}</td>
          <td>{this.state.parents[key]}</td>
          <td>{this.state.distances[key]}</td>
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

  renderPrimHeading() {
    return (
      <tr>
        <th>Node</th>
        <th>Parent</th>
        <th>Cost</th>
      </tr>
    );
  }

  renderPrimPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'prim-1'}>
          1<span style={{ marginLeft: indentation(1) }}>Prim(G, root)</span>
        </div>
        <div id={'prim-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            let cost be a map with all nodes as keys and values of Infinity
          </span>
        </div>
        <div id={'prim-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            let parents be a map with all nodes as keys and values of null
          </span>
        </div>
        <div id={'prim-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>
            let mstSet be a map with all nodes as keys and values of false
          </span>
        </div>
        <div id={'prim-5'}>
          5
          <span style={{ marginLeft: indentation(2) }}>
            set parents[root] = -1
          </span>
        </div>
        <div id={'prim-6'}>
          6
          <span style={{ marginLeft: indentation(2) }}>
            set costMap[root] = 0
          </span>
        </div>
        <div id={'prim-7'}>
          7
          <span style={{ marginLeft: indentation(2) }}>
            do n times where n is number of nodes
          </span>
        </div>
        <div id={'prim-8'}>
          8
          <span style={{ marginLeft: indentation(3) }}>
            {' '}
            minNode = findMin(cost, mstSet)
          </span>
        </div>
        <div id={'prim-9'}>
          9
          <span style={{ marginLeft: indentation(3) }}>
            {' '}
            set mstSet[minNode] = true
          </span>
        </div>
        <div id={'prim-10'}>
          10
          <span style={{ marginLeft: indentation(3) }}>
            for every neighbor, neighborCost of minNode
          </span>
        </div>
        <div id={'prim-11'}>
          11
          <span style={{ marginLeft: indentation(4) }}>
            if mstSet[neighbor] is false
          </span>
        </div>
        <div id={'prim-12'}>
          12
          <span style={{ marginLeft: indentation(5) }}>
            if cost[neighbor] {'>'} cost
          </span>
        </div>
        <div id={'prim-13'}>
          13
          <span style={{ marginLeft: indentation(6) }}>
            set cost[neighbor] = cost{' '}
          </span>
        </div>
        <div id={'prim-14'}>
          14
          <span style={{ marginLeft: indentation(6) }}>
            set parents[neighbor] = minNode{' '}
          </span>
        </div>
      </div>
    );
  }
  renderDijkstraPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'dijkstra-1'}>
          1
          <span style={{ marginLeft: indentation(1) }}>
            Dijkstra(G, source, target)
          </span>
        </div>
        <div id={'dijkstra-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            let pq be a Priority Queue (min-heap)
          </span>
        </div>
        <div id={'dijkstra-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            let parents be a map with all nodes as keys and values of null
          </span>
        </div>
        <div id={'dijkstra-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>
            let distances be a map with all nodes as keys and values of Infinity
          </span>
        </div>
        <div id={'dijkstra-5'}>
          5
          <span style={{ marginLeft: indentation(2) }}>
            set distances[source] = 0
          </span>
        </div>
        <div id={'dijkstra-6'}>
          6
          <span style={{ marginLeft: indentation(2) }}>
            insert root at cost 0 into pq
          </span>
        </div>
        <div id={'dijkstra-7'}>
          7
          <span style={{ marginLeft: indentation(2) }}>
            while pq is not empty
          </span>
        </div>
        <div id={'dijkstra-8'}>
          8
          <span style={{ marginLeft: indentation(3) }}>
            current = pq.removeRoot()
          </span>
        </div>
        <div id={'dijkstra-9'}>
          9
          <span style={{ marginLeft: indentation(3) }}>
            for neighbor of G[current]
          </span>
        </div>
        <div id={'dijkstra-10'}>
          10
          <span style={{ marginLeft: indentation(4) }}>
            set potentialScore = distances[current] + neighborCost
          </span>
        </div>
        <div id={'dijkstra-11'}>
          11
          <span style={{ marginLeft: indentation(4) }}>
            {' '}
            if potentialScore {'<'} distances[neighbor]
          </span>
        </div>
        <div id={'dijkstra-12'}>
          12
          <span style={{ marginLeft: indentation(5) }}>
            set distances[neighbor] = potentialScore
          </span>
        </div>
        <div id={'dijkstra-13'}>
          13
          <span style={{ marginLeft: indentation(5) }}>
            set parents[neighbor] = current
          </span>
        </div>
        <div id={'dijkstra-14'}>
          14
          <span style={{ marginLeft: indentation(5) }}>
            insert neighbor at cost neighborCost into pq
          </span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={'row'}>
        <div className={'col-4'} id={'graph-container'}>
          <Dijkstra
            g={this.adjList}
            root={'source'}
            target={'target'}
            pause={this.state.pause}
            stop={this.state.stop}
            speed={this.state.speed}
            runningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            updateDistances={this.updateDistances}
            updateParents={this.updateParents}
            updatePq={this.updatePq}
            updatePotentialScore={this.updatePotentialScore}
            updateNeighbor={this.updateNeighbor}
            updateNode={this.updateNode}
          />
          <div className={'divider'}></div>
          <Prim
            g={this.adjList}
            root={'source'}
            pause={this.state.pause}
            stop={this.state.stop}
            speed={this.state.speed}
            runningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            updateDistances={this.updateDistances}
            updateParents={this.updateParents}
            updateNeighbor={this.updateNeighbor}
            updatePrimMinNode={this.updatePrimMinNode}
            updatePrimMstSet={this.updatePrimMstSet}
          />
          <div className={'divider'}></div>
          <button
            className="graph-button"
            onClick={() => {
              this.setState({ pause: false, stop: true });
              this.reset();
            }}
          >
            Reset
          </button>
          <div className={'divider'}></div>
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

        <div className={'col-4'} id={'output-tables'}>
          <table
            id={'undirected-graph-table'}
            className={('undirected-graph-table', 'float-right')}
            style={{ marginRight: '40px' }}
          >
            <tbody>
              {this.state.runningAlg === 'prim'
                ? this.renderPrimHeading()
                : this.state.runningAlg === 'dijkstra'
                ? this.renderDijkstraHeading()
                : ''}
              {this.state.runningAlg === 'prim'
                ? this.renderPrimTableData()
                : this.state.runningAlg === 'dijkstra'
                ? this.renderDijkstraTableData()
                : ''}
            </tbody>
          </table>
        </div>
        <div className={'col-4'}>
          <div className={'row'}>
            {this.state.runningAlg === ''
              ? ''
              : this.state.runningAlg === 'prim'
              ? this.renderPrimPseudocode()
              : this.renderDijkstraPseudocode()}
          </div>

          <div className={'row'}>
            {this.state.runningAlg === 'prim' ? (
              <Sidebar showButton={this.state.runningAlg !== ''}>
                {this.state.minNode ? (
                  <li> minNode = {this.state.minNode} </li>
                ) : (
                  ''
                )}

                {this.state.node ? <li> current = {this.state.node} </li> : ''}
                {this.state.neighbor ? (
                  <li> neighbor = {this.state.neighbor} </li>
                ) : (
                  ''
                )}

                {this.state.neighborCost ? (
                  <li> neighborCost = {this.state.neighborCost} </li>
                ) : (
                  ''
                )}

                <li onClick={() => this.toggleClicked(0)}>
                  {Object.keys(this.state.distances).length > 0 ? (
                    <RenderObjectComponent
                      obj={this.state.distances}
                      objName={'cost'}
                      clicked={this.state.clicked[0]}
                    />
                  ) : (
                    ''
                  )}
                </li>
                <li onClick={() => this.toggleClicked(1)}>
                  {Object.keys(this.state.parents).length > 0 ? (
                    <RenderObjectComponent
                      obj={this.state.parents}
                      objName={'parents'}
                      clicked={this.state.clicked[1]}
                    />
                  ) : (
                    ''
                  )}
                </li>
                <li onClick={() => this.toggleClicked(2)}>
                  {Object.keys(this.state.mstSet).length > 0 ? (
                    <RenderObjectComponent
                      obj={this.state.mstSet}
                      objName={'mstSet'}
                      clicked={this.state.clicked[2]}
                    />
                  ) : (
                    ''
                  )}
                </li>
                <li onClick={() => this.toggleClicked(3)}>
                  {this.adjList ? (
                    <RenderObjectComponent
                      obj={this.adjList}
                      objName={'G'}
                      clicked={this.state.clicked[3]}
                    />
                  ) : (
                    ''
                  )}
                </li>
              </Sidebar>
            ) : (
              ''
            )}
            {this.state.runningAlg === 'dijkstra' ? (
              <Sidebar showButton={this.state.runningAlg !== ''}>
                {this.state.node ? <li> current = {this.state.node} </li> : ''}
                {this.state.neighbor ? (
                  <li> neighbor = {this.state.neighbor} </li>
                ) : (
                  ''
                )}

                {this.state.neighborCost ? (
                  <li> neighborCost = {this.state.neighborCost} </li>
                ) : (
                  ''
                )}

                {this.state.potentialScore ? (
                  <li> potentialScore = {this.state.potentialScore} </li>
                ) : (
                  ''
                )}
                <li onClick={() => this.toggleClicked(0)}>
                  {this.state.priorityQueue ? (
                    <RenderListComponent
                      list={this.state.priorityQueue}
                      listName={'pq'}
                      clicked={this.state.clicked[0]}
                    />
                  ) : (
                    ''
                  )}
                </li>
                <li onClick={() => this.toggleClicked(1)}>
                  {Object.keys(this.state.distances).length > 0 ? (
                    <RenderObjectComponent
                      obj={this.state.distances}
                      objName={'distances'}
                      clicked={this.state.clicked[1]}
                    />
                  ) : (
                    ''
                  )}
                </li>
                <li onClick={() => this.toggleClicked(2)}>
                  {Object.keys(this.state.parents).length > 0 ? (
                    <RenderObjectComponent
                      obj={this.state.parents}
                      objName={'parents'}
                      clicked={this.state.clicked[2]}
                    />
                  ) : (
                    ''
                  )}
                </li>
                <li onClick={() => this.toggleClicked(3)}>
                  {this.adjList ? (
                    <RenderObjectComponent
                      obj={this.adjList}
                      objName={'G'}
                      clicked={this.state.clicked[3]}
                    />
                  ) : (
                    ''
                  )}
                </li>
              </Sidebar>
            ) : (
              <Sidebar>
                <li onClick={() => this.toggleClicked(4)}>
                  {this.adjList ? (
                    <RenderObjectComponent
                      obj={this.adjList}
                      objName={'G'}
                      clicked={this.state.clicked[4]}
                    />
                  ) : (
                    ''
                  )}
                </li>
              </Sidebar>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default UndirectedGraphAlgorithms;
