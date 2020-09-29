import React, { Component } from 'react';

class BreadthFirstSearch extends Component {
  constructor(props) {
    super(props);
    this.unMounting = false;
  }

  componentWillUnmount() {
    this.unMounting = true;
  }

   bfs = async () => {
    let linkList = [];
    let root = 'a';
    let visited = {};
    Object.keys(this.props.g).map((node) => (visited[node] = false));
    visited[root] = true;
    let queue = [root];
    let nodePath = [];
    while (queue.length > 0) {
      if (this.unMounting) return;
      let currentNode = queue[0];
      queue.shift();

      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;

      this.activateLink(currentNode, linkList);

      await new Promise((r) => setTimeout(r, 700 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;

      this.activateVisitedNode(currentNode);
      nodePath.push(currentNode);
      this.props.buildNodePath(nodePath);

      for (let child of this.props.g[currentNode]) {
        if (visited[child] === false) {
          visited[child] = true;
          queue.push(child);
        }
      }
    }
    linkList.forEach((el) => el.classList.remove('link-traversed'));
  }

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
          this.bfs();
        }}
      >
        BFS traverse
      </button>
    );
  }

}

export default BreadthFirstSearch;
