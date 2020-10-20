import React, { Component } from 'react';
import DepthFirstSearch from './algorithms/tree-algorithms/DepthFirstSearch';
import BreathFirstSearch from './algorithms/tree-algorithms/BreadthFirstSearch';
import createTree from '../graph-builders/tree-builder';
import Sidebar from './sidebar/Sidebar';
import RenderListComponent from './sidebar/RenderListComponent';
import RenderObjectComponent from './sidebar/RenderObjectComponent';
import { FaStepBackward, FaStepForward, FaPause, FaPlay } from 'react-icons/fa';

class TreeTraversals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      nodePath: [],
      runningAlg: null,
      queue: null,
      stack: null,
      currentNode: null,
      visitedMap: {},
      child: null,
      clicked: [false, false, false, false],
      animationQueue: [],
      activatedNode: null,
      activatedLink: null,
      stepIndex: 0,
      stepMode: false,
    };
    this.adjList = {
      a: ['b', 'c', 'd'],
      b: ['e', 'h', 'i'],
      c: ['j', 'r'],
      d: ['s', 'u'],
      e: ['f'],
      f: ['g'],
      g: [],
      h: ['o'],
      i: [],
      j: ['k'],
      k: ['l', 'q'],
      l: ['m', 'n', 'p'],
      m: [],
      n: [],
      o: [],
      p: [],
      q: [],
      r: [],
      s: ['t'],
      t: [],
      u: ['v'],
      v: ['w'],
      w: ['x'],
      x: ['y', 'z'],
      y: [],
      z: [],
    };
  }

  componentDidMount() {
    createTree(this.adjList);
    this.tree = document.getElementById('graph-container');
  }

  componentWillUnmount() {
    let svg = document.getElementById('tree-svg');
    if (this.tree.hasChildNodes()) this.tree.removeChild(svg);
    this.reset();
  }

  componentDidUpdate() {
    if (this.state.stop) {
      this.setState({ animationQueue: [], stop: false });
    }
  }

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let nodeElement = document.getElementById(e);
      if (nodeElement) {
        nodeElement.classList.remove('node-complete-tree');
      }
      let linkElement = document.getElementById(e + 'link');
      if (linkElement) {
        linkElement.classList.remove('link-traversed');
      }
    });
    for (let i = 1; i < 12; i++) {
      let dfsPseduoElement = document.getElementById('dfs-' + i);
      if (dfsPseduoElement) dfsPseduoElement.classList = '';
      let bfsPseduoElement = document.getElementById('bfs-' + i);
      if (bfsPseduoElement) bfsPseduoElement.classList = '';
    }
    this.setState({
      nodePath: [],
      visitedMap: {},
      queue: null,
      stack: null,
      currentNode: null,
      child: null,
      runningAlg: null,
      pause: false,
    });
  };

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

  highlightLine(lineNum) {
    if (!lineNum) return;
    let el = document.getElementById(this.state.runningAlg + '-' + lineNum);
    if (el) el.classList.add('active-code-line');
  }
  removeHighlightedLine(lineNum) {
    if (!lineNum) return;
    let el = document.getElementById(this.state.runningAlg + '-' + lineNum);
    if (el) el.classList.remove('active-code-line');
  }
  activateVisitedNode(currentNode) {
    let nodeElement = document.getElementById(currentNode);
    if (nodeElement) nodeElement.classList.add('node-complete-tree');
  }

  activateLink(currentNode) {
    let linkElement = document.getElementById(currentNode + 'link');
    if (linkElement) {
      linkElement.classList.add('link-traversed');
    }
  }
  updateAnimationQueue = async (aq) => {
    await this.setState({
      animationQueue: aq,
    });
    await this.renderAnimationQueue();
  };

  async checkPauseStatus() {
    while (this.state.pause && !this.state.stepMode) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
  }

  renderAnimationQueue = async () => {
    let initialRunningAlg = this.state.runningAlg;
    this.setState({ stepIndex: 0 });
    while (this.state.stepIndex < this.state.animationQueue.length) {
      let currentState = this.state.animationQueue[this.state.stepIndex];
      this.highlightLine(currentState.highlightedLine);

      let waitTime =
        currentState.waitTime !== undefined ? currentState.waitTime : 1000;

      await new Promise((r) => setTimeout(r, waitTime / this.state.speed));

      await this.checkPauseStatus();

      if (initialRunningAlg !== this.state.runningAlg) {
        return;
      }

      this.removeHighlightedLine(currentState.highlightedLine);
      this.setState({ ...currentState });

      this.activateVisitedNode(currentState.activatedNode);
      this.activateLink(currentState.activatedLink);

      if (!this.state.stepMode) {
        this.setState({ stepIndex: this.state.stepIndex + 1 });
      } else {
        // need to reset everything up to the previous state starting from beggining since we only update what is neccessary at each element of the animation queue
        this.reset();
        this.setState({
          stepMode: false,
          runningAlg: initialRunningAlg,
          pause: true,
        });
        for (let i = 0; i < this.state.stepIndex; i++) {
          let prevState = this.state.animationQueue[i];
          this.setState({ ...prevState });
          this.activateVisitedNode(prevState.activatedNode);
          this.activateLink(prevState.activatedLink);
        }
      }
    }
  };

  updateStop = () => {
    this.setState({
      stop: false,
      pause: false,
      runningAlg: '',
    });
  };

  renderBfsPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'bfs-1'}>
          1<span style={{ marginLeft: indentation(1) }}>BFS(G, root)</span>
        </div>
        <div id={'bfs-2'}>
          2<span style={{ marginLeft: indentation(2) }}>let Q be a queue</span>
        </div>
        <div id={'bfs-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            let V be a map with all nodes as keys and values of false
          </span>
        </div>
        <div id={'bfs-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>set V[root] = true</span>
        </div>
        <div id={'bfs-5'}>
          5<span style={{ marginLeft: indentation(2) }}>Q.enqueue(root)</span>
        </div>
        <div id={'bfs-6'}>
          6
          <span style={{ marginLeft: indentation(2) }}>
            while Q is not empty
          </span>
        </div>
        <div id={'bfs-7'}>
          7
          <span style={{ marginLeft: indentation(3) }}>
            current := Q.dequeue()
          </span>
        </div>
        <div id={'bfs-8'}>
          8
          <span style={{ marginLeft: indentation(3) }}>
            for child of current
          </span>
        </div>
        <div id={'bfs-9'}>
          9
          <span style={{ marginLeft: indentation(4) }}>
            if child is not labeled as discovered then
          </span>
        </div>
        <div id={'bfs-10'}>
          10
          <span style={{ marginLeft: indentation(5) }}>
            set V[child] = true
          </span>
        </div>
        <div id={'bfs-11'}>
          11
          <span style={{ marginLeft: indentation(5) }}> Q.enqueue(child)</span>
        </div>
      </div>
    );
  }

  renderDfsPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'dfs-1'}>
          1<span style={{ marginLeft: indentation(1) }}>DFS(G, root)</span>
        </div>
        <div id={'dfs-2'}>
          2<span style={{ marginLeft: indentation(2) }}>let S be a stack</span>
        </div>
        <div id={'dfs-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            let V be a map with all nodes as keys and values of false
          </span>
        </div>
        <div id={'dfs-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>set V[root] = true</span>
        </div>
        <div id={'dfs-5'}>
          5<span style={{ marginLeft: indentation(2) }}>S.push(root)</span>
        </div>
        <div id={'dfs-6'}>
          6
          <span style={{ marginLeft: indentation(2) }}>
            while S is not empty
          </span>
        </div>
        <div id={'dfs-7'}>
          7
          <span style={{ marginLeft: indentation(3) }}>current := S.pop()</span>
        </div>
        <div id={'dfs-8'}>
          8
          <span style={{ marginLeft: indentation(3) }}>
            for child of current
          </span>
        </div>
        <div id={'dfs-9'}>
          9
          <span style={{ marginLeft: indentation(4) }}>
            if child is not labeled as discovered then
          </span>
        </div>
        <div id={'dfs-10'}>
          10
          <span style={{ marginLeft: indentation(5) }}>
            set V[child] = true
          </span>
        </div>
        <div id={'dfs-11'}>
          11<span style={{ marginLeft: indentation(5) }}> S.push(child)</span>
        </div>
        <div></div>
      </div>
    );
  }

  render() {
    return (
      <div className={'row'}>
        <div className={'col-4'} id={'graph-container'}>
          <DepthFirstSearch
            g={this.adjList}
            getRunningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            updateAnimationQueue={this.updateAnimationQueue}
            updateStop={this.updateStop}
          />
          <div className={'divider'}></div>
          <BreathFirstSearch
            g={this.adjList}
            getRunningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            updateAnimationQueue={this.updateAnimationQueue}
            updateStop={this.updateStop}
          />
          <div className={'divider'}></div>
          <button
            id={'reset-button'}
            onClick={async () => {
              await this.setState({
                pause: false,
                stop: true,
                animationQueue: [],
              });
              this.reset();
            }}
          >
            Reset
          </button>
          <div className={'divider'}></div>
          <button
            onClick={() => {
              this.setState({ pause: !this.state.pause });
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
                onChange={(event) =>
                  this.setState({
                    speed: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Step:{' '}
              <button
                onClick={() => {
                  this.setState({
                    stepIndex: this.state.stepIndex - 1,
                    pause: true,
                    stepMode: true,
                  });
                }}
              >
                <FaStepBackward />
              </button>
              <button
                onClick={() => {
                  this.setState({
                    stepIndex: this.state.stepIndex + 1,
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

        <div className={'col-4'}>
          <div className={'row'}>
            {!this.state.runningAlg
              ? ''
              : this.state.runningAlg === 'bfs'
              ? this.renderBfsPseudocode()
              : this.renderDfsPseudocode()}
          </div>
        </div>

        <div className={'col-4'}>
          <Sidebar showButton={this.state.runningAlg !== ''}>
            {this.state.currentNode ? (
              <li> current = {this.state.currentNode} </li>
            ) : (
              ''
            )}
            {this.state.child ? <li> child = {this.state.child} </li> : ''}

            <li onClick={() => this.toggleClicked(0)}>
              {this.state.nodePath.length > 0 ? (
                <RenderListComponent
                  list={this.state.nodePath}
                  listName={'Node Path'}
                  clicked={this.state.clicked[0]}
                />
              ) : (
                ''
              )}
            </li>
            <li onClick={() => this.toggleClicked(1)}>
              {this.state.queue ? (
                <RenderListComponent
                  list={this.state.queue}
                  listName={'Q'}
                  clicked={this.state.clicked[1]}
                />
              ) : this.state.stack ? (
                <RenderListComponent
                  list={this.state.stack}
                  listName={'S'}
                  clicked={this.state.clicked[1]}
                />
              ) : (
                <></>
              )}
            </li>
            <li onClick={() => this.toggleClicked(2)}>
              {Object.keys(this.state.visitedMap).length > 0 ? (
                <RenderObjectComponent
                  obj={this.state.visitedMap}
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
                  objName={'tree'}
                  clicked={this.state.clicked[3]}
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

export default TreeTraversals;
