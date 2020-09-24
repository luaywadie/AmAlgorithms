import React, { Component } from 'react';
import bfs from '../algorithms/tree-algorithms/breadth-first-search';
import dfs from '../algorithms/tree-algorithms/depth-first-search';
import createTree from '../graph-builder/tree-builder';

class TreeTraversals extends Component {
  outputEl;
  adjList;
  tree;

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
    this.tree = document.getElementById('tree-img');
    console.log(this.tree);
  }

  componentDidMount() {
    this.outputEl = document.getElementById('output');
    if (!this.outputEl.hasChildNodes()) {
      let heading = document.createTextNode('Traversal Ordering');
      this.outputEl.appendChild(heading);
      resetTraversalList(this.outputEl);
    }
    createTree(this.adjList);
  }
  componentWillUnmount() {
    let svg = document.getElementById('tree-svg');
    if (this.tree.hasChildNodes()) this.tree.removeChild(svg);
    let outputElement = document.getElementById('output');
    outputElement.innerHTML = '';
  }

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;

  buildNodePath = (node) => {
    this.setState({ nodePath: (oldA) => [...oldA, node] });
    createListItem(node);
  };

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let nodeElement = document.getElementById(e);
      nodeElement.classList.remove('visited-node-bfs', 'visited-node-dfs');
      let linkElement = document.getElementById(e + 'link');
      if (linkElement) {
        linkElement.classList.remove('link-traversed');
      }
    });
    this.outputEl.removeChild(document.getElementById('nodeHistory'));
    resetTraversalList(this.outputEl);
  };

  render() {
    return (
      <div>
        <div>
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
