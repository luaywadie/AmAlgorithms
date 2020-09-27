import React, { Component } from 'react';
import bfs from '../algorithms/tree-algorithms/breadth-first-search';
import dfs from '../algorithms/tree-algorithms/depth-first-search';
import createTree from '../graph-builders/tree-builder';

class TreeTraversals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      nodePath: [],
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
    this.tree = document.getElementById('graph-container');
  }

  componentDidMount() {
    createTree(this.adjList);
  }
  
  componentWillUnmount() {
    let svg = document.getElementById('tree-svg');
    if (this.tree.hasChildNodes()) this.tree.removeChild(svg);
  }
  buildNodePath = async (nodePath) => {
    await this.setState({ nodePath });
  };

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let nodeElement = document.getElementById(e);
      nodeElement.classList.remove('visited-node-bfs', 'visited-node-dfs');
      let linkElement = document.getElementById(e + 'link');
      if (linkElement) {
        linkElement.classList.remove('link-traversed');
      }
    });
    this.setState({ nodePath: [] });
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

  render() {
    return (
      <div className={'row'}>
        <div className={'col-6'}>
          <button
            onClick={() => {
              this.setState({ pause: false, stop: false });
              dfs(
                this.adjList,
                this.getPauseStatus,
                this.getStopStatus,
                this.getSpeedRequest,
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
                this.getSpeedRequest,
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
        <div className={'col-6'}>
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
