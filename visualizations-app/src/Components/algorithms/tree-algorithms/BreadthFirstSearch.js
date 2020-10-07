import React, { Component } from 'react';

class BreadthFirstSearch extends Component {
  constructor(props) {
    super(props);
    this.unMounting = false;
  }

  componentWillUnmount() {
    this.unMounting = true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.runningAlg === 'bfs' && this.props.runningAlg !== 'bfs') {
      this.unMounting = true;
    }
  }

  highlightLine(lineNum) {
    document.getElementById('bfs-' + lineNum).classList.add('active-code-line');
  }
  removeHighlightedLine(lineNum) {
    document
      .getElementById('bfs-' + lineNum)
      .classList.remove('active-code-line');
  }

  bfs = async () => {
    let linkList = [];

    this.highlightLine(1);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    this.removeHighlightedLine(1);

    this.highlightLine(2);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    this.removeHighlightedLine(2);

    this.highlightLine(3);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    this.removeHighlightedLine(3);

    this.highlightLine(4);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    this.removeHighlightedLine(4);

    let root = 'a';
    let visited = {};
    Object.keys(this.props.g).map((node) => (visited[node] = false));
    visited[root] = true;
    let queue = [root];
    this.props.updateQueue(queue);
    let nodePath = [];
    while (queue.length > 0) {
      this.highlightLine(5);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      this.removeHighlightedLine(5);

      if (this.unMounting) return;
      let currentNode = queue[0];
      this.props.updateCurrentNode(currentNode);
      queue.shift();
      this.props.updateQueue(queue);

      this.highlightLine(6);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));

      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;
      this.removeHighlightedLine(6);
      this.highlightLine(7);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));

      this.activateLink(currentNode, linkList);

      await new Promise((r) => setTimeout(r, 700 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;

      this.activateVisitedNode(currentNode);
      this.removeHighlightedLine(7);
      nodePath.push(currentNode);
      this.props.buildNodePath(nodePath);

      for (let child of this.props.g[currentNode]) {
        this.highlightLine(8);
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        this.removeHighlightedLine(8);
        if (visited[child] === false) {
          this.highlightLine(9);
          await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
          this.removeHighlightedLine(9);
          visited[child] = true;
          this.highlightLine(10);
          await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
          this.removeHighlightedLine(10);
          queue.push(child);
          this.props.updateQueue(queue);
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
        onClick={async () => {
          if (this.unMounting) {
            this.unMounting = false;
          }
          await this.props.setRunningAlg('bfs');
          this.bfs();
        }}
      >
        BFS traverse
      </button>
    );
  }
}

export default BreadthFirstSearch;
