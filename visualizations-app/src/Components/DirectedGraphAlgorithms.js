import React, { Component } from 'react';
import Topsort from './algorithms/graph-algorithms/Topsort';
import createDirectedGraph from '../graph-builders/directed-graph-builder';
import Sidebar from './sidebar/Sidebar';
import RenderListComponent from './sidebar/RenderListComponent';
import RenderObjectComponent from './sidebar/RenderObjectComponent';
import { FaStepBackward, FaStepForward, FaPause, FaPlay } from 'react-icons/fa';

class DirectedGraphAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      ordering: null,
      runningAlg: null,
      neighbor: null,
      currentNode: null,
      visited: null,
      stack: null,
      clicked: [false, false, false, false, false],
      callStack: [],
      activeLinks: null,
      activatedLink: null,
      stepIndex: 0,
      stepMode: false,
    };
    this.adjList = {
      a: ['g', 'c', 'b'],
      b: ['f'],
      c: [],
      d: ['g', 'e', 'b'],
      e: ['b'],
      f: [],
      g: ['i', 'f'],
      h: [],
      i: ['h'],
      j: ['e'],
    };
  }
  componentDidMount() {
    createDirectedGraph();
    this.graph = document.getElementById('graph-container');
  }

  componentWillUnmount() {
    let svg = document.getElementById('dir-graph-svg');
    if (this.graph.hasChildNodes()) this.graph.removeChild(svg);
    this.reset();
  }
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
      if (!currentState.keepLineHighlighted) {
        this.removeHighlightedLine(currentState.highlightedLine);
      }
      if (currentState.removeHighlightedLine) {
        this.removeHighlightedLine(currentState.removeHighlightedLine);
      }

      this.setState({ ...currentState });

      this.activateCurrentNode(currentState.activatedNode);
      this.activateNeighbor(currentState.neighbor);
      this.markNodeComplete(currentState.nodeComplete);
      this.activateLink(currentState.activatedLink);
      if (currentState.outgoingLinks) {
        this.removeOutgoingLinks(
          currentState.outgoingLinks.activeLinks,
          currentState.outgoingLinks.node
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
          this.activateNeighbor(prevState.neighbor);
          this.markNodeComplete(prevState.nodeComplete);
          this.activateLink(prevState.activatedLink);
          if (prevState.keepLineHighlighted) {
            this.highlightLine(prevState.highlightedLine);
          }
          if (prevState.removeHighlightedLine) {
            this.removeHighlightedLine(currentState.removeHighlightedLine);
          }
          if (prevState.outgoingLinks) {
            this.removeOutgoingLinks(
              prevState.outgoingLinks.activeLinks,
              prevState.outgoingLinks.node
            );
          }
        }
        shouldWait = false;
      }
    }
  };

  highlightLine(classId) {
    let el = document.getElementById(classId);
    if (el) el.classList.add('active-code-line');
  }
  removeHighlightedLine(classId) {
    let el = document.getElementById(classId);
    if (el) el.classList.remove('active-code-line');
  }

  activateCurrentNode(node) {
    let currentElement = document.getElementById(node);
    if (
      currentElement &&
      currentElement.classList.contains('current-neighbor-of-interest')
    ) {
      document
        .getElementById(node)
        .classList.remove('current-neighbor-of-interest');
      document.getElementById(node).classList.add('child-to-current');
    } else {
      if (document.getElementById(node)) {
        document.getElementById(node).classList.add('current-node-of-interest');
      }
    }
  }

  activateNeighbor(neighbor) {
    let neighborEl = document.getElementById(neighbor);
    if (neighborEl) neighborEl.classList.add('current-neighbor-of-interest');
  }

  activateLink(id) {
    let lineElement = document.getElementById(id);
    if (lineElement) lineElement.classList.add('link-of-interest-ts');
    return lineElement;
  }

  removeOutgoingLinks(activeLinks, node) {
    if (activeLinks[node] && activeLinks[node].length > 0) {
      activeLinks[node].forEach((e) => {
        e.classList.remove('link-of-interest-ts');
      });
    }
  }

  markNodeComplete(node) {
    let nodeEl = document.getElementById(node);
    if (nodeEl) {
      nodeEl.classList.remove('current-neighbor-of-interest');
      nodeEl.classList.remove('current-node-of-interest');
      nodeEl.classList.add('node-complete-directed');
    }
  }

  async checkPauseStatus() {
    while (this.state.pause && !this.state.stepMode) {
      await new Promise((r) => setTimeout(r, 100));
      continue;
    }
  }

  setRunningAlg = (alg) => {
    this.reset();
    this.setState({ runningAlg: alg });
  };

  toggleClicked = (i) => {
    let a = this.state.clicked.slice();
    a[i] = !a[i];
    this.setState({
      clicked: a,
    });
  };

  freshStart = () => {
    this.setState({
      stop: false,
      pause: false,
      runningAlg: null,
      stepMode: false,
    });
  };

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      // remove node coloring
      let el = document.getElementById(e);
      if (el) el.classList = '';

      // remove highlighted pseudocode
      for (let i = 1; i < 9; i++) {
        let pseduoTopsortElements = document.getElementById('topsort-' + i);
        if (pseduoTopsortElements) pseduoTopsortElements.classList = '';
      }
      for (let i = 1; i < 13; i++) {
        let pseduoTopsortElements = document.getElementById(
          'topsort-visit-' + i
        );
        if (pseduoTopsortElements) pseduoTopsortElements.classList = '';
      }
      // Remove Active Links
      for (let neighbor of this.adjList[e]) {
        let nodeNeighborLinkElement = document.getElementById(
          e + '-' + neighbor
        );
        if (nodeNeighborLinkElement) {
          nodeNeighborLinkElement.classList = '';
        }
      }
    });

    this.setState({
      ordering: null,
      node: null,
      neighbor: null,
      stack: null,
      visited: null,
      callStack: [],
      activatedNode: null,
      activatedLink: null,
    });
    if (this.state.stop) {
      this.setState({ stop: false, pause: false });
    }
  };

  renderTopsortPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'topsort-1'}>
          1<span style={{ marginLeft: indentation(1) }}>ToplogicalSort(G)</span>
        </div>
        <div id={'topsort-2'}>
          2<span style={{ marginLeft: indentation(2) }}>let S be a stack</span>
        </div>
        <div id={'topsort-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            let V be a map with all nodes as keys and values of null
          </span>
        </div>
        <div id={'topsort-4'}>
          4<span style={{ marginLeft: indentation(2) }}>For node of G</span>
        </div>
        <div id={'topsort-5'}>
          5
          <span style={{ marginLeft: indentation(3) }}>if V[node] is null</span>
        </div>
        <div id={'topsort-6'}>
          6
          <span style={{ marginLeft: indentation(4) }}>
            if visit(node, G, S, V) is false
          </span>
        </div>
        <div id={'topsort-7'}>
          7<span style={{ marginLeft: indentation(5) }}>return null</span>
        </div>
        <div id={'topsort-8'}>
          8
          <span style={{ marginLeft: indentation(2) }}>return S.reverse()</span>
        </div>
        <br></br>
        <div id={'topsort-visit-1'}>
          1
          <span style={{ marginLeft: indentation(1) }}>
            visit(node, G, S, V)
          </span>
        </div>
        <div id={'topsort-visit-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            if V[node] == 'Complete'
          </span>
        </div>
        <div id={'topsort-visit-3'}>
          3<span style={{ marginLeft: indentation(3) }}>return true</span>
        </div>
        <div id={'topsort-visit-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>
            if V[node] == 'In Progress'
          </span>
        </div>
        <div id={'topsort-visit-5'}>
          5<span style={{ marginLeft: indentation(3) }}>return false</span>
        </div>
        <div id={'topsort-visit-6'}>
          6
          <span style={{ marginLeft: indentation(2) }}>
            V[node] = 'In Progress'
          </span>
        </div>
        <div id={'topsort-visit-7'}>
          7
          <span style={{ marginLeft: indentation(2) }}>
            for neighbor of node
          </span>
        </div>
        <div id={'topsort-visit-8'}>
          8
          <span style={{ marginLeft: indentation(3) }}>
            if visit(node, G, S, V) is false
          </span>
        </div>
        <div id={'topsort-visit-9'}>
          9<span style={{ marginLeft: indentation(4) }}>return false</span>
        </div>
        <div id={'topsort-visit-10'}>
          10
          <span style={{ marginLeft: indentation(2) }}>S.push(node)</span>
        </div>
        <div id={'topsort-visit-11'}>
          11
          <span style={{ marginLeft: indentation(2) }}>
            V[node] = 'Complete'
          </span>
        </div>
        <div id={'topsort-visit-12'}>
          12
          <span style={{ marginLeft: indentation(2) }}>return true</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={'row'}>
        <div className={'col-4'} id={'graph-container'}>
          <Topsort
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
                runningAlg: null,
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
        {/* <div className={'col-6'} id={'output-tables'}> */}
        <div className={'col-4'}>{this.renderTopsortPseudocode()}</div>
        <div className={'col-4'}>
          <Sidebar showButton={true}>
            <li onClick={() => this.toggleClicked(0)}>
              {this.state.ordering ? (
                <RenderListComponent
                  list={this.state.ordering}
                  listName={'Return Value'}
                  clicked={this.state.clicked[0]}
                />
              ) : (
                ''
              )}
            </li>
            {this.state.currentNode ? (
              <li> node = {this.state.currentNode} </li>
            ) : (
              ''
            )}
            {this.state.neighbor ? (
              <li> neighbor = {this.state.neighbor} </li>
            ) : (
              ''
            )}

            <li onClick={() => this.toggleClicked(1)}>
              {this.state.stack ? (
                <RenderListComponent
                  list={this.state.stack}
                  listName={'S'}
                  clicked={this.state.clicked[1]}
                />
              ) : (
                ''
              )}
            </li>
            <li onClick={() => this.toggleClicked(2)}>
              {this.state.visited ? (
                <RenderObjectComponent
                  obj={this.state.visited}
                  objName={'V'}
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

            <li onClick={() => this.toggleClicked(4)}>
              {this.state.callStack.length > 0 ? (
                <RenderListComponent
                  list={this.state.callStack}
                  listName={'Call Stack'}
                  clicked={this.state.clicked[4]}
                />
              ) : (
                ''
              )}
            </li>
          </Sidebar>
        </div>
      </div>
    );
  }
}

export default DirectedGraphAlgorithms;
