import React, { Component } from 'react';
import DepthFirstSearch from './algorithms/tree-algorithms/DepthFirstSearch';
import BreathFirstSearch from './algorithms/tree-algorithms/BreadthFirstSearch';
import createTree from '../graph-builders/tree-builder';

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
      currentNode: null,
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
    this.setState({ nodePath: [] });
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

  renderTreeTraversalHeading() {
    return (
      <tr>
        <th>Traversal Ordering</th>
      </tr>
    );
  }

  renderTreeTraversalData() {
    return this.state.nodePath.map((node) => {
      return (
        <tr key={node}>
          <td>{node}</td>
        </tr>
      );
    });
  }
  renderQueueHeading() {
    return (
      <tr>
        <th>Queue</th>
      </tr>
    );
  }
  // renderQueue() {
  //   return this.state.queue.map((node) => {
  //     return (
  //       <tr key={node}>
  //         <td>{node}</td>
  //       </tr>
  //     );
  //   });
  // }

  renderQueue() {
    return this.state.queue.map((node) => {
      return <td key={node}>{node}</td>;
    });
  }

  renderBfsPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div style={{ overflow: 'hidden' }}>
        <div id={'bfs-1'}>
          1
          <span style={{ marginLeft: indentation(1) }}>
            procedure BFS(G, root) is
          </span>
        </div>
        <div id={'bfs-2'}>
          2<span style={{ marginLeft: indentation(2) }}>let Q be a queue</span>
        </div>
        <div id={'bfs-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            label root as discovered
          </span>
        </div>
        <div id={'bfs-4'}>
          4<span style={{ marginLeft: indentation(2) }}>Q.enqueue(root)</span>
        </div>
        <div id={'bfs-5'}>
          5
          <span style={{ marginLeft: indentation(2) }}>
            while Q is not empty do
          </span>
        </div>
        <div id={'bfs-6'}>
          6<span style={{ marginLeft: indentation(3) }}>v := Q.dequeue()</span>
        </div>
        <div id={'bfs-7'}>
          7
          <span style={{ marginLeft: indentation(3) }}>
            for child in G.children(v) do
          </span>
        </div>
        <div id={'bfs-8'}>
          8
          <span style={{ marginLeft: indentation(4) }}>
            if child is not labeled as discovered then
          </span>
        </div>
        <div id={'bfs-9'}>
          9
          <span style={{ marginLeft: indentation(5) }}>
            label child as discovered
          </span>
        </div>
        <div id={'bfs-10'}>
          10<span style={{ marginLeft: indentation(5) }}>Q.enqueue(child)</span>
        </div>
      </div>
      //   <pre style={{ overflow: 'visible' }}>
      //     {`
      // 1  procedure BFS(G, root) is
      // 2      let Q be a queue
      // 3      label root as discovered
      // 4      Q.enqueue(root)
      // 5      while Q is not empty do
      // 6          v := Q.dequeue()
      // 7          if v is the goal then
      // 8              return v
      // 9          for all edges from v to w in G.adjacentEdges(v) do
      // 10             if w is not labeled as discovered then
      // 11                 label w as discovered
      // 13                 Q.enqueue(w)
      // `}
      //   </pre>
    );
  }

  renderDfsPseudocode() {
    return (
      <div>
        <h4>Pseudo-code</h4>
        <pre style={{ overflow: 'visible' }}>
          {`
        1  procedure DFS_iterative(G, v) is
        2    let S be a stack
        3    S.push(v)
        4    while S is not empty do
        5      v = S.pop()
        6      if v is not labeled as discovered then
        7        label v as discovered
        8        for all edges from v to w in G.adjacentEdges(v) do 
        9          S.push(w)
    `}
        </pre>
      </div>
    );
  }

  render() {
    return (
      <div className={'row'}>
        <div className={'col-6'} id={'graph-container'}>
          <DepthFirstSearch
            g={this.adjList}
            pause={this.state.pause}
            stop={this.state.stop}
            speed={this.state.speed}
            runningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            buildNodePath={this.buildNodePath}
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

        <div className={'col-3'}>
          <div className={'row'} style={{ marginBottom: '20px' }}>
            Current Node: {this.state.currentNode}
          </div>
          <div className={'row'}>
            {this.state.runningAlg === ''
              ? ''
              : this.state.runningAlg === 'bfs'
              ? this.renderBfsPseudocode()
              : this.renderDfsPseudocode()}
          </div>
          <div className={'row'} style={{ marginTop: '20px' }}>
            Queue
          </div>
          <div className={'row'}>
            <table id={'tree-traversal-table'}>
              <tbody>
                <tr>{this.renderQueue()}</tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={'col-3'}>
          <table id={'tree-traversal-table'} className={'float-right'}>
            <tbody>
              {this.renderTreeTraversalHeading()}
              {this.renderTreeTraversalData()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TreeTraversals;
