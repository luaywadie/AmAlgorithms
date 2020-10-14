import React, { Component } from 'react';
const {
  Heap: PriorityQueue,
} = require('../../../helpers/data-structures/heap_helper.js');
// [cost, node]

class Dijkstra extends Component {
  constructor(props) {
    super(props);
    this.unMounting = false;
  }
  componentWillUnmount() {
    this.unMounting = true;
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.runningAlg === 'dijkstra' &&
      this.props.runningAlg !== 'dijkstra'
    ) {
      this.unMounting = true;
    }
  }

  djikstra = async () => {
    let root = this.props.root;
    let target = this.props.target;

    this.highlightLine(1);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(1);

    let pq = new PriorityQueue();
    this.highlightLine(2);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(2);
    this.props.updatePq(pq.getArray());

    this.highlightLine(3);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(3);

    let parents = {};
    let distances = {};
    Object.keys(this.props.g).forEach((node) => {
      distances[node] = Infinity;
      parents[node] = null;
    });

    this.props.updateParents(parents);

    this.highlightLine(4);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(4);

    this.props.updateDistances(distances);

    this.highlightLine(5);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(5);
    distances[root] = 0;
    this.props.updateDistances(distances);

    this.highlightLine(6);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(6);
    pq.insert([0, root]);
    this.props.updatePq(pq.getArray());
    let activeLinks = [];

    while (pq.size > 0) {
      this.highlightLine(7);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine(7);

      let currentNode = pq.removeRoot()[1];
      let currentNodeElement = this.activateCurrentNode(currentNode);

      this.highlightLine(8);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks, null);
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine(8);

      this.props.updateNode(currentNode);
      this.props.updatePq(pq.getArray());

      activeLinks = this.removeActiveLinks(activeLinks);

      await new Promise((r) => setTimeout(r, 100 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks, currentNode);
        return;
      }
      if (this.unMounting) return;

      for (let [neighborNodeWeight, neighborNode] of this.props.g[
        currentNode
      ]) {
        let linkOfInterestElement = this.activateLink(
          currentNode,
          neighborNode
        );
        activeLinks.push(linkOfInterestElement);
        this.highlightLine(9);
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks, null);
          return;
        }
        if (this.unMounting) return;
        this.removeHighlightedLine(9);

        this.props.updateNeighbor(neighborNode, neighborNodeWeight);

        let potentialScore = distances[currentNode] + neighborNodeWeight;

        this.highlightLine(10);
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks, null);
          return;
        }
        if (this.unMounting) return;
        this.removeHighlightedLine(10);
        this.props.updatePotentialScore(potentialScore);

        this.highlightLine(11);
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks, null);
          return;
        }
        if (this.unMounting) return;
        this.removeHighlightedLine(11);

        if (potentialScore < distances[neighborNode]) {
          //updates

          distances[neighborNode] = potentialScore;
          this.highlightLine(12);
          await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
          await this.checkPauseStatus();
          if (this.props.stop) {
            this.cleanUpActiveLinksAndCurrentNode(activeLinks, null);
            return;
          }
          if (this.unMounting) return;
          this.removeHighlightedLine(12);
          this.props.updateDistances(distances);

          parents[neighborNode] = currentNode;
          this.highlightLine(13);
          await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
          await this.checkPauseStatus();
          if (this.props.stop) {
            this.cleanUpActiveLinksAndCurrentNode(activeLinks, null);
            return;
          }
          if (this.unMounting) return;
          this.removeHighlightedLine(13);
          this.props.updateParents(parents);

          pq.insert([neighborNodeWeight, neighborNode]);
          this.highlightLine(14);
          await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
          await this.checkPauseStatus();
          if (this.props.stop) {
            this.cleanUpActiveLinksAndCurrentNode(activeLinks, null);
            return;
          }
          if (this.unMounting) return;
          this.removeHighlightedLine(14);

          this.props.updatePq(pq.getArray());
        }
        this.props.updatePotentialScore(null);
        this.props.updateNeighbor(null, null);
      }
      this.props.updateNode(null);
      this.fadeOutLinks(activeLinks);
      this.updateCurrentNodeToBeVisited(currentNodeElement);
    }
    this.props.updateNode(null);

    let end = target;
    let stack = [end];
    while (end != null) {
      stack.push(parents[end]);
      end = parents[end];
    }
    let shortestPath = stack.reverse().slice(1);
    this.highlightShortestPath(shortestPath);
  };

  activateCurrentNode(currentNode) {
    let currentNodeElement = document.getElementById(currentNode);
    currentNodeElement.classList.add('current-node-of-interest');

    return currentNodeElement;
  }

  removeActiveLinks(activeLinks) {
    activeLinks.forEach((e) => {
      if (e) {
        e.classList.remove('fade-out-link', 'link-traversed');
      }
    });
    return [];
  }

  highlightLine(lineNum) {
    document
      .getElementById('dijkstra-' + lineNum)
      .classList.add('active-code-line');
  }
  removeHighlightedLine(lineNum) {
    document
      .getElementById('dijkstra-' + lineNum)
      .classList.remove('active-code-line');
  }

  activateLink(currentNode, neighborNode) {
    let linkString =
      currentNode < neighborNode
        ? currentNode + '-' + neighborNode
        : neighborNode + '-' + currentNode;
    let linkOfInterestElement = document.getElementById(linkString);
    if (linkOfInterestElement)
      linkOfInterestElement.classList.add('link-traversed');
    return linkOfInterestElement;
  }

  updateCurrentNodeToBeVisited(currentNodeElement) {
    currentNodeElement.classList.remove('current-node-of-interest');
    currentNodeElement.classList.add('node-complete-tree');
  }

  fadeOutLinks(activeLinks) {
    activeLinks.forEach((e) => {
      if (e) {
        e.classList.add('fade-out-link');
      }
    });
  }

  async checkPauseStatus() {
    while (this.props.pause) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
  }
  cleanUpActiveLinksAndCurrentNode(activeLinks, currentNode) {
    let currentNodeElement = document.getElementById(currentNode);
    if (currentNodeElement) {
      currentNodeElement.classList.remove('current-node-of-interest');
    }
    if (activeLinks.length > 0) {
      this.removeActiveLinks(activeLinks);
    }
  }

  highlightShortestPath(shortestPath) {
    for (let i = 1; i < shortestPath.length; i++) {
      let prev = shortestPath[i - 1];
      let current = shortestPath[i];
      this.activateLink(prev, current);
    }
  }

  render() {
    return (
      <button
        className="graph-button"
        onClick={async () => {
          if (this.unMounting) {
            this.unMounting = false;
          }
          await this.props.setRunningAlg('dijkstra');
          this.djikstra();
        }}
      >
        Dijkstra
      </button>
    );
  }
}

export default Dijkstra;
