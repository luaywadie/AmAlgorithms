import React, { Component } from 'react';
const { Heap: PriorityQueue } = require('../../../data-structures/Heap.js');
// [cost, node]

class Dijkstra extends Component {
  constructor(props) {
    super(props);
    this.unMounting = false;
  }
  componentWillUnmount() {
    this.unMounting = true;
  }

  djikstra = async () => {
    let pq = new PriorityQueue();
    let root = this.props.root;
    let target = this.props.target;
    let parents = {};
    let distances = {};
    Object.keys(this.props.g).map((node) => {
      distances[node] = Infinity;
      parents[node] = null;
    });
    distances[root] = 0;

    pq.insert([0, root]);
    let activeLinks = [];

    while (pq.size > 0) {
      if (this.unMounting) return;
      this.props.updateDistancesAndParents(distances, parents);
      let currentNode = pq.removeRoot()[1];
      let currentNodeElement = this.activateCurrentNode(currentNode);

      await new Promise((r) => setTimeout(r, 2000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks, currentNode);
        return;
      }
      if (this.unMounting) return;

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

        await new Promise((r) => setTimeout(r, 2000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks, currentNode);
          return;
        }
        if (this.unMounting) return;

        let potentialScore = distances[currentNode] + neighborNodeWeight;
        if (potentialScore < distances[neighborNode]) {
          //updates
          distances[neighborNode] = potentialScore;
          parents[neighborNode] = currentNode;
          pq.insert([neighborNodeWeight, neighborNode]);
        }
      }
      this.fadeOutLinks(activeLinks);
      this.updateCurrentNodeToBeVisited(currentNodeElement);
    }

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
        onClick={() => {
          this.props.reset();
          this.djikstra();
        }}
      >
        Dijkstra
      </button>
    );
  }
}

export default Dijkstra;
