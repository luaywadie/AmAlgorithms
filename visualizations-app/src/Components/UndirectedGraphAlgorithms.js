import React, { Component } from 'react';
import createGraph from '../graph-builders/undirected-graph-builder';
import Dijkstra from './algorithms/graph-algorithms/Dijkstra';
import Prim from './algorithms/graph-algorithms/Prim';
import Sidebar from './sidebar/Sidebar';
import RenderListComponent from './sidebar/RenderListComponent';
import RenderObjectComponent from './sidebar/RenderObjectComponent';
import { FaStepBackward, FaStepForward, FaPause, FaPlay } from 'react-icons/fa';

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
      pq: null,
      mstSet: {},
      clicked: [false, false, false, false, false, false],
      currentNode: null,
      neighborNode: null,
      neighborNodeWeight: null,
      minNode: null,
      potentialScore: null,
      stepIndex: 0,
      stepMode: false,
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

  freshStart = async () => {
    await this.setState({
      stop: false,
      pause: false,
      runningAlg: null,
      stepMode: false,
    });
  };

  updateAnimationQueue = async (aq) => {
    await this.setState({
      animationQueue: aq,
    });
    await this.renderAnimationQueue();
  };

  renderAnimationQueue = async () => {
    let initialRunningAlg = this.state.runningAlg;
    this.setState({ stepIndex: 0 });
    let shouldWait = true;
    while (this.state.stepIndex < this.state.animationQueue.length) {
      let currentState = this.state.animationQueue[this.state.stepIndex];

      this.highlightLine(currentState.highlightedLine);

      let waitTime =
        currentState.waitTime !== undefined ? currentState.waitTime : 1000;

      if (!shouldWait) {
        waitTime = 0;
      }

      await new Promise((r) => setTimeout(r, waitTime / this.state.speed));
      await this.checkPauseStatus();

      if (initialRunningAlg !== this.state.runningAlg) {
        return;
      }
      this.removeHighlightedLine(currentState.highlightedLine);

      this.setState({ ...currentState });

      this.activateCurrentNode(currentState.activatedNode);
      if (currentState.nodeComplete) {
        this.updateCurrentNodeToBeVisited(currentState.nodeComplete);
      }
      this.activateLink(currentState.linkOfInterest);
      if (currentState.fadeOutLinks) {
        this.fadeOutLinks(currentState.fadeOutLinks);
      }
      if (currentState.removeActiveLinks) {
        this.removeActiveLinks(currentState.removeActiveLinks);
      }

      if (currentState.shortestPath) {
        this.highlightShortestPath(currentState.shortestPath);
      }

      if (currentState.deActivateOldLink) {
        this.deActivateOldLink(
          currentState.deActivateOldLink[0],
          currentState.deActivateOldLink[1]
        );
      }

      if (!this.state.stepMode) {
        this.setState({ stepIndex: this.state.stepIndex + 1 });
        shouldWait = true;
      } else {
        // need to reset everything up to the previous state starting from beggining since we only update what is neccessary at each element of the animation queue
        this.reset();
        this.setState({
          runningAlg: initialRunningAlg,
          pause: true,
          stepMode: false,
        });
        for (let i = 0; i < this.state.stepIndex; i++) {
          let prevState = this.state.animationQueue[i];
          this.setState({ ...prevState });
          this.activateCurrentNode(prevState.activatedNode);
          if (prevState.nodeComplete) {
            this.updateCurrentNodeToBeVisited(prevState.nodeComplete);
          }
          this.activateLink(prevState.linkOfInterest);

          if (prevState.fadeOutLinks) {
            this.fadeOutLinks(prevState.fadeOutLinks);
          }
          if (prevState.removeActiveLinks) {
            this.removeActiveLinks(prevState.removeActiveLinks);
          }

          if (prevState.shortestPath) {
            this.highlightShortestPath(prevState.shortestPath);
          }
          if (prevState.deActivateOldLink) {
            this.deActivateOldLink(
              prevState.deActivateOldLink[0],
              prevState.deActivateOldLink[1]
            );
          }
        }

        shouldWait = false;
      }
    }
  };

  setRunningAlg = async (alg) => {
    this.reset();
    await this.setState({ runningAlg: alg });
  };

  toggleClicked = (i) => {
    let a = this.state.clicked.slice();
    a[i] = !a[i];
    this.setState({
      clicked: a,
    });
  };

  activateCurrentNode(currentNode) {
    let currentNodeElement = document.getElementById(currentNode);
    if (currentNodeElement) {
      currentNodeElement.classList.add('current-node-of-interest');
    }
  }

  removeActiveLinks(activeLinks) {
    activeLinks.forEach((e) => {
      if (e) {
        e.classList.remove('fade-out-link', 'link-traversed');
      }
    });
    return [];
  }

  highlightLine(lineNum) {
    let el = document.getElementById(this.state.runningAlg + '-' + lineNum);
    if (el) el.classList.add('active-code-line');
  }
  removeHighlightedLine(lineNum) {
    let el = document.getElementById(this.state.runningAlg + '-' + lineNum);
    if (el) el.classList.remove('active-code-line');
  }

  generateLinkString(currentNode, neighborNode) {
    return currentNode < neighborNode
      ? currentNode + '-' + neighborNode
      : neighborNode + '-' + currentNode;
  }

  activateLink(linkString) {
    let linkOfInterestElement = document.getElementById(linkString);
    if (linkOfInterestElement)
      linkOfInterestElement.classList.add('link-traversed');
    return linkOfInterestElement;
  }

  updateCurrentNodeToBeVisited(currentNode) {
    let currentNodeElement = document.getElementById(currentNode);
    if (currentNodeElement) {
      currentNodeElement.classList.remove('current-node-of-interest');
      currentNodeElement.classList.add('node-complete-tree');
    }
  }

  fadeOutLinks(activeLinks) {
    activeLinks.forEach((e) => {
      if (e) {
        e.classList.add('fade-out-link');
      }
    });
  }

  async checkPauseStatus() {
    while (this.state.pause && !this.state.stepMode) {
      await new Promise((r) => setTimeout(r, 100));
      continue;
    }
  }

  highlightShortestPath(shortestPath) {
    for (let i = 1; i < shortestPath.length; i++) {
      let prev = shortestPath[i - 1];
      let current = shortestPath[i];
      let linkString = this.generateLinkString(prev, current);
      this.activateLink(linkString);
    }
  }
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
      minNode: null,
      neighborNode: null,
      neighborNodeWeight: null,
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
            {this.state.pq[index]}
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
  async deActivateOldLink(node, oldChild) {
    let linkString =
      node < oldChild ? node + '-' + oldChild : oldChild + '-' + node;
    let el = document.getElementById(linkString);
    if (el) {
      el.classList.add('fade-out-link');
      // await new Promise((r) => setTimeout(r, 1000 / this.state.speed));
      el.classList.remove('link-traversed', 'fade-out-link');
      return el;
    }
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
            getRunningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            updateAnimationQueue={this.updateAnimationQueue}
            freshStart={this.freshStart}
          />
          <div className={'divider'}></div>
          <Prim
            g={this.adjList}
            getRunningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            updateAnimationQueue={this.updateAnimationQueue}
            freshStart={this.freshStart}
          />
          <div className={'divider'}></div>
          <button
            className="graph-button"
            onClick={() => {
              this.setState({
                pause: false,
                stop: true,
                animationQueue: [],
                runningAlg: '',
              });
              this.reset();
            }}
          >
            Reset
          </button>
          <div className={'divider'}></div>
          <button
            className="graph-button"
            onClick={() => {
              this.setState({ pause: !this.state.pause, stepMode: false });
            }}
          >
            {this.state.pause ? <FaPlay /> : <FaPause />}
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
            <label>
              Step:{' '}
              <button
                onClick={() => {
                  let newStepIndex = this.state.stepIndex - 1;
                  while (
                    !this.state.animationQueue[newStepIndex].highlightedLine
                  ) {
                    newStepIndex -= 1;
                  }
                  this.setState({
                    stepIndex: newStepIndex,
                    pause: true,
                    stepMode: true,
                  });
                }}
              >
                <FaStepBackward />
              </button>
              <button
                onClick={() => {
                  let newStepIndex = this.state.stepIndex + 1;
                  while (
                    !this.state.animationQueue[newStepIndex].highlightedLine
                  ) {
                    newStepIndex += 1;
                  }
                  this.setState({
                    stepIndex: newStepIndex,
                    pause: true,
                    stepMode: true,
                  });
                }}
              >
                <FaStepForward />
              </button>
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
              {this.state.runningAlg === 'prim' ? (
                this.renderPrimHeading()
              ) : this.state.runningAlg === 'dijkstra' ? (
                this.renderDijkstraHeading()
              ) : (
                <tr></tr>
              )}
              {this.state.runningAlg === 'prim' ? (
                this.renderPrimTableData()
              ) : this.state.runningAlg === 'dijkstra' ? (
                this.renderDijkstraTableData()
              ) : (
                <tr></tr>
              )}
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
                {this.state.neighborNode ? (
                  <li> neighbor = {this.state.neighborNode} </li>
                ) : (
                  ''
                )}

                {this.state.neighborNodeWeight ? (
                  <li> neighborCost = {this.state.neighborNodeWeight} </li>
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
                {this.state.currentNode ? (
                  <li> current = {this.state.currentNode} </li>
                ) : (
                  ''
                )}
                {this.state.neighborNode ? (
                  <li> neighbor = {this.state.neighborNode} </li>
                ) : (
                  ''
                )}

                {this.state.neighborNodeWeight ? (
                  <li> neighborCost = {this.state.neighborNodeWeight} </li>
                ) : (
                  ''
                )}

                {this.state.potentialScore ? (
                  <li> potentialScore = {this.state.potentialScore} </li>
                ) : (
                  ''
                )}
                <li onClick={() => this.toggleClicked(0)}>
                  {this.state.pq ? (
                    <RenderListComponent
                      list={this.state.pq}
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
