import React, { Component } from 'react';

class DepthFirstSearch extends Component {
  constructor(props) {
    super(props);
    this.unMounting = false;
  }

  componentWillUnmount() {
    this.unMounting = true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.runningAlg === 'dfs' && this.props.runningAlg !== 'dfs') {
      this.unMounting = true;
    }
  }

  highlightLine(lineNum) {
    let el = document.getElementById('dfs-' + lineNum);
    if (el) el.classList.add('active-code-line');
  }
  removeHighlightedLine(lineNum) {
    let el = document.getElementById('dfs-' + lineNum);
    if (el) el.classList.remove('active-code-line');
  }

  dfs = async () => {
    let linkList = [];

    this.highlightLine(1);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) return;
    if (this.unMounting) return;
    this.removeHighlightedLine(1);

    this.highlightLine(2);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) return;
    if (this.unMounting) return;
    this.removeHighlightedLine(2);

    let root = 'a';
    let visited = {};
    Object.keys(this.props.g).map((node) => (visited[node] = false));

    this.highlightLine(3);
    this.props.updateVisitedMap(visited);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) return;
    if (this.unMounting) return;
    this.removeHighlightedLine(3);

    this.highlightLine(4);
    visited[root] = true;
    this.props.updateVisitedMap(visited);

    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) return;
    if (this.unMounting) return;
    this.removeHighlightedLine(4);

    this.highlightLine(5);
    let stack = [root];
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) return;
    if (this.unMounting) return;
    this.removeHighlightedLine(5);

    let nodePath = [];
    while (stack.length > 0) {
      this.highlightLine(6);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;
      this.removeHighlightedLine(6);

      let currentNode = stack.pop();
      this.props.updateStack(stack);

      this.highlightLine(7);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;

      this.activateLink(currentNode, linkList);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;

      this.activateVisitedNode(currentNode);
      this.props.updateCurrentNode(currentNode);

      nodePath.push(currentNode);
      this.props.buildNodePath(nodePath);

      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;
      this.removeHighlightedLine(7);

      this.highlightLine(8);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;
      this.removeHighlightedLine(8);

      for (let child of this.props.g[currentNode]) {
        this.props.updateChild(child);

        this.highlightLine(9);
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) return;
        if (this.unMounting) return;
        this.removeHighlightedLine(9);

        if (visited[child] === false) {
          this.highlightLine(10);
          await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
          await this.checkPauseStatus();
          if (this.props.stop) return;
          if (this.unMounting) return;
          this.removeHighlightedLine(10);
          visited[child] = true;
          this.props.updateVisitedMap(visited);

          this.highlightLine(11);
          await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
          await this.checkPauseStatus();
          if (this.props.stop) return;
          if (this.unMounting) return;
          this.removeHighlightedLine(11);
          stack.push(child);
          this.props.updateStack(stack);
        }
      }
      this.props.updateChild(null);
      this.props.updateCurrentNode(null);
    }
    this.props.updateChild(null);
    this.props.updateCurrentNode(null);
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
          await this.props.setRunningAlg('dfs');
          this.dfs();
        }}
        disabled={this.props.runningAlg === 'dfs'}
      >
        DFS traverse
      </button>
    );
  }
}

export default DepthFirstSearch;
