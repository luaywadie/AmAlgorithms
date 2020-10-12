import React, { Component } from 'react';
import DepthFirstSearch from './algorithms/tree-algorithms/DepthFirstSearch';
import BreathFirstSearch from './algorithms/tree-algorithms/BreadthFirstSearch';
import createTree from '../graph-builders/tree-builder';
import Sidebar from './Sidebar';
import RenderListComponent from './RenderListComponent';
import RenderObjectComponent from './RenderObjectComponent'

class TreeTraversals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      nodePath: [],
      runningAlg: '',
      queue: [],
      stack: [],
      currentNode: null,
      visitedMap: {},
      child : null,
      clicked : [false,false, false]
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
  buildNodePath = (nodePath) => {
    this.setState({ nodePath });
  };

  updateQueue = (q) => {
    this.setState({ queue: q });
  };

  updateStack = (s) => {
    this.setState({stack: s})
  }

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

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
    this.setState({ nodePath: [], visitedMap:{}, queue: [] });
    if (this.state.stop) {
      this.setState({ stop: false, pause: false, runningAlg: '' });
    }

  };

  setRunningAlg = (alg) => {
    this.reset();
    this.setState({ runningAlg: alg });
  };

  updateStopState = async (val) => {
    await this.setState({ stop: val });
  };

  updateCurrentNode = async (node) => {
    await this.setState({ currentNode: node });
  };

  updateVisitedMap = async (map) => {
    await this.setState({ visitedMap : map });
  }
  updateChild = async (child) => {
    await this.setState({ child });
  }

  toggleClicked = (i) => {
    let a = this.state.clicked.slice() 
    a[i] = !a[i]
    this.setState({
      clicked : a
    })
  }



  renderBfsPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'bfs-1'}>
          1
          <span style={{ marginLeft: indentation(1) }}>
            BFS(G, root)
          </span>
        </div>
        <div id={'bfs-2'}>
          2<span style={{ marginLeft: indentation(2) }}>let Q be a queue</span>
        </div>
        <div id={'bfs-3'}>
          3<span style={{ marginLeft: indentation(2) }}>let V be a map with all nodes as keys and values of false</span>
        </div>
        <div id={'bfs-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>
            set V[root] = true
          </span>
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
          7<span style={{ marginLeft: indentation(3) }}>current := Q.dequeue()</span>
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
          11<span style={{ marginLeft: indentation(5) }}>Q.enqueue(child)</span>
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
            1
            <span style={{ marginLeft: indentation(1) }}>
              DFS(G, root)
            </span>
          </div>
          <div id={'dfs-2'}>
            2<span style={{ marginLeft: indentation(2) }}>let S be a stack</span>
          </div>
          <div id={'dfs-3'}>
            3<span style={{ marginLeft: indentation(2) }}>let V be a map with all nodes as keys and values of false</span>
          </div>
          <div id={'dfs-4'}>
            4
            <span style={{ marginLeft: indentation(2) }}>
            set V[root] = true
            </span>
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
            7<span style={{ marginLeft: indentation(3) }}>current := S.pop()</span>
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
            11<span style={{ marginLeft: indentation(5) }}>S.push(child)</span>
          </div>
        <div>
      </div>
      </div>
    );
  }

  render() {
    return (
      <div className={'row'}>
        <div className={'col-4'} id={'graph-container'}>
          <DepthFirstSearch
            g={this.adjList}
            pause={this.state.pause}
            stop={this.state.stop}
            speed={this.state.speed}
            runningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            buildNodePath={this.buildNodePath}
            updateStack={this.updateStack}
            updateCurrentNode={this.updateCurrentNode}
            updateVisitedMap={this.updateVisitedMap}
            updateChild={this.updateChild}
          />
          <div className={'divider'}></div>
          <BreathFirstSearch
            g={this.adjList}
            pause={this.state.pause}
            stop={this.state.stop}
            speed={this.state.speed}
            runningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            buildNodePath={this.buildNodePath}
            updateQueue={this.updateQueue}
            updateCurrentNode={this.updateCurrentNode}
            updateVisitedMap={this.updateVisitedMap}
            updateChild={this.updateChild}
          />
          <div className={'divider'}></div>
          <button
            id={'reset-button'}
            onClick={async () => {
              await this.setState({ pause: false, stop: true });
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
            {this.state.pause ? 'UnPause' : 'Pause'}
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
          </form>
        </div>

        <div className={'col-4'}>
          <div className={'row'}>
            {this.state.runningAlg === ''
              ? ''
              : this.state.runningAlg === 'bfs'
              ? this.renderBfsPseudocode()
              : this.renderDfsPseudocode()}
          </div>
        </div>

        <div className={'col-4'}>
        <Sidebar >
              {this.state.currentNode ? <li> current = {this.state.currentNode} </li> : ''} 
              {this.state.child ? <li> child = {this.state.child} </li> : ''} 

            <li onClick={() => this.toggleClicked(0)}>
            <RenderListComponent list={this.state.nodePath} listName={'Node Path'} clicked={this.state.clicked[0]}  />
            </li>
            <li onClick={() => this.toggleClicked(1)}>
              {this.state.runningAlg === 'bfs' 
                ?
                <RenderListComponent list={this.state.queue} listName={'Q'} clicked={this.state.clicked[1]}  />
                : 
                this.state.runningAlg === 'dfs' 
                  ? 
                  <RenderListComponent list={this.state.stack} listName={'S'} clicked={this.state.clicked[1]}  />
                  :
                  <></>
              }
            </li>
            <li onClick={() => this.toggleClicked(2)}>
              {Object.keys(this.state.visitedMap).length > 0 ?<RenderObjectComponent obj={this.state.visitedMap} objName={'V'} clicked={this.state.clicked[2]}  /> : '' }
            </li>
            </Sidebar>

        </div>
      </div>
    );
  }
}

export default TreeTraversals;
