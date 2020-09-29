import React, { Component } from 'react';

class DepthFirstSearch extends Component {
  constructor(props) {
    super(props);
    this.unMounting = false;
  }

  componentWillUnmount() {
    this.unMounting = true;
  }

  dfs = async () => {
    this.props.reset();
    let linkList = [];
    let root = 'a';
    let visited = {};
    Object.keys(this.props.g).map((node) => (visited[node] = false));
    visited[root] = true;
    let stack = [root];
    let nodePath = [];
    while (stack.length > 0) {
      if (this.unMounting) return;
      let currentNode = stack.pop();

      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus(this.props.pause);
      if (this.props.stop) return;
      if (this.unMounting) return;

      this.activateLink(currentNode, linkList);

      await new Promise((r) => setTimeout(r, 700 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;

      this.activateVisitedNode(currentNode);

      nodePath.push(currentNode);
      this.props.buildNodePath(nodePath);

      for (let child of this.props.g[currentNode]) {
        if (visited[child] === false) {
          visited[child] = true;
          stack.push(child);
        }
      }
    }
    linkList.forEach((el) => el.classList.remove('link-traversed'));
  };

  activateLink(currentNode, linkList) {
    let linkElement = document.getElementById(currentNode + 'link');
    if (linkElement) {
      linkElement.classList.add('link-traversed');
      linkList.push(linkElement);
    }
  }

  activateVisitedNode(currentNode) {
    let nodeElement = document.getElementById(currentNode);
    if (nodeElement) nodeElement.classList.add('node-complete-tree');
  }

  async checkPauseStatus() {
    while (this.props.pause) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
  }
  render() {
    return (
      <button
        onClick={() => {
          this.props.reset();
          this.dfs();
        }}
      >
        DFS traverse
      </button>
    );
  }
}

export default DepthFirstSearch;
