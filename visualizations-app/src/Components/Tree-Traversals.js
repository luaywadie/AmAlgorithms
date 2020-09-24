import React, { Component } from 'react';
import bfs from '../algorithms/breadth-first-search';
import dfs from '../algorithms/depth-first-search';
import CreateTree from './graph-builder/tree-builder';

class TreeTraversals extends Component {
  outputEl;
  adjList;

  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      nodePath: [],
    };
    this.adjList = {
      a: ['b', 'c', 'd'],
      b: ['e', 'h', 'i'],
      c: ['j', 'r'],
      d: ['s', 't', 'u', 'v'],
      e: ['f', 'g'],
      f: [],
      g: ['o'],
      h: [],
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
      s: [],
      t: [],
      u: [],
      v: ['w'],
      w: ['x'],
      x: ['y', 'z'],
      y: [],
      z: [],
    };
  }

  componentDidMount() {
    this.outputEl = document.getElementById('output');
    let heading = document.createTextNode('Traversal Ordering');
    this.outputEl.appendChild(heading);
    resetTraversalList(this.outputEl);
  }

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  
  buildNodePath = (node) => {
    this.setState({ nodePath: (oldA) => [...oldA, node] });
    createListItem(node);
  };
  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let nodeEl = document.getElementById(e);
      nodeEl.classList.remove('visited-node-bfs');
      nodeEl.classList.remove('visited-node-dfs');
      let linkEl = document.getElementById(e + 'link');
      if (linkEl) {
        linkEl.classList.remove('link-traversed');
      }
    });
    this.outputEl.removeChild(document.getElementById('nodeHistory'));
    resetTraversalList(this.outputEl);
  };

  render() {
    return (
      <div>
        <div>
          <CreateTree adjList={this.adjList} />
          <button
            onClick={() => {
              this.setState({ pause: false, stop: false });
              dfs(
                this.adjList,
                this.getPauseStatus,
                this.getStopStatus,
                this.buildNodePath
              );
            }}
          >
            DFS traverse
          </button>
          <button
            onClick={() => {
              this.setState({ pause: false, stop: false });
              bfs(
                this.adjList,
                this.getPauseStatus,
                this.getStopStatus,
                this.buildNodePath
              );
            }}
          >
            BFS traverse
          </button>
          <button
            onClick={() => {
              this.setState({ pause: false, stop: true });
              this.reset();
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              this.setState({ pause: !this.state.pause });
            }}
          >
            {this.state.pause ? 'UnPause' : 'Pause'}
          </button>
        </div>
      </div>
    );
  }
}

function resetTraversalList(outputEl) {
  outputEl.style.fontSize = '30px';
  outputEl
    .appendChild(document.createElement('UL'))
    .setAttribute('id', 'nodeHistory');
  let ul = document.getElementById('nodeHistory');
  ul.style.listStyleType = 'none';
  ul.style.fontSize = '20px';
}

function createListItem(node) {
  let li = document.createElement('LI');
  li.style.textAlign = 'center';
  li.appendChild(document.createTextNode(node));
  document.getElementById('nodeHistory').appendChild(li);
}
export default TreeTraversals;
