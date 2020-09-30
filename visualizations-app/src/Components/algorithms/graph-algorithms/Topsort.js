import React, { Component } from 'react';

class Topsort extends Component {
  constructor(props) {
    super(props);
    this.unMounting = false;
  }
  componentWillUnmount() {
    this.unMounting = true;
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.runningAlg === 'topsort' &&
      this.props.runningAlg !== 'topsort'
    ) {
      this.unMounting = true;
    }
  }

  topSort = async () => {
    let stack = [];
    let visited = {};
    Object.keys(this.props.g).map((key) => (visited[key] = 0));
    let activeLinks = {};

    for (let node of Object.keys(this.props.g)) {
      if (visited[node] === 0) {
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks);
          return;
        }
        if (this.unMounting) return;
        if ((await this.visit(node, stack, visited, activeLinks)) === false) {
          return null;
        }
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks, this.props.g);
          return;
        }
        if (this.unMounting) return;

        document
          .getElementById(node)
          .classList.remove('current-node-of-interest');
      }
    }
    return stack.reverse();
  };
  // 2 = permenant mark, 1 = temp mark (if we encounter 1 again, we have cycle)
  visit = async (node, stack, visited, activeLinks) => {
    await new Promise((r) => setTimeout(r, 500 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks, this.props.g);
      return;
    }
    if (this.unMounting) return;

    if (visited[node] === 2) {
      return true;
    } else if (visited[node] === 1) {
      return false;
    }
    this.activateCurrentNode(node);
    visited[node] = 1;
    for (let neighbor of this.props.g[node]) {
      await new Promise((r) => setTimeout(r, 500 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks, this.props.g);
        return;
      }
      if (this.unMounting) return;

      let activeLink = this.activateLink(node, neighbor);
      activeLinks = this.updateActiveLinks(activeLink, activeLinks, node);

      await new Promise((r) => setTimeout(r, 500 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks, this.props.g);
        return;
      }
      if (this.unMounting) return;

      this.activateNeighbor(neighbor);

      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks, this.props.g);
        return;
      }
      if (this.unMounting) return;

      if ((await this.visit(neighbor, stack, visited, activeLinks)) === false) {
        return false;
      }
    }

    stack.push(node);
    visited[node] = 2;

    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks, this.props.g);
      return;
    }
    if (this.unMounting) return;

    this.markNodeComplete(node);
    this.removeOutgoingLinks(activeLinks, node);

    await new Promise((r) => setTimeout(r, 500 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks, this.props.g);
      return;
    }
    if (this.unMounting) return;

    this.props.getOrdering(stack.slice().reverse());

    return true;
  };

  activateCurrentNode(node) {
    let currentElement = document.getElementById(node);
    if (currentElement.classList.contains('current-neighbor-of-interest')) {
      document
        .getElementById(node)
        .classList.remove('current-neighbor-of-interest');
      document.getElementById(node).classList.add('child-to-current');
    } else {
      document.getElementById(node).classList.add('current-node-of-interest');
    }
  }

  activateNeighbor(neighbor) {
    document
      .getElementById(neighbor)
      .classList.add('current-neighbor-of-interest');
  }

  activateLink(node, neighbor) {
    let lineElement = document.getElementById(node + '-' + neighbor);
    if (lineElement) lineElement.classList.add('link-of-interest-ts');
    return lineElement;
  }

  updateActiveLinks(activeLink, activeLinks, node) {
    if (activeLink) {
      if (!activeLinks[node]) {
        activeLinks[node] = [activeLink];
      } else {
        activeLinks[node].push(activeLink);
      }
    }
    return activeLinks;
  }

  removeOutgoingLinks(activeLinks, node) {
    if (activeLinks[node] && activeLinks[node].length > 0) {
      activeLinks[node].forEach((e) => {
        e.classList.remove('link-of-interest-ts');
      });
    }
  }

  markNodeComplete(node) {
    document
      .getElementById(node)
      .classList.remove('current-neighbor-of-interest');

    document.getElementById(node).classList.remove('current-node-of-interest');
    document.getElementById(node).classList.add('node-complete-directed');
  }

  cleanUpActiveLinksAndCurrentNode(activeLinks) {
    for (let val of Object.values(activeLinks)) {
      val.forEach((link) => link.classList.remove('link-of-interest-ts'));
    }

    Object.keys(this.props.g).forEach((node) => {
      let nodeElement = document.getElementById(node);
      if (nodeElement) nodeElement.classList = '';
    });
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
        className="graph-button"
        onClick={() => {
          if (this.unMounting) {
            this.unMounting = false;
          }
          this.props.setRunningAlg('topsort');
          this.topSort();
        }}
      >
        Topological Sort
      </button>
    );
  }
}

export default Topsort;
