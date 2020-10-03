import React, { Component } from 'react';

class Prim extends Component {
  constructor(props) {
    super(props);
    this.unMounting = false;
  }
  componentWillUnmount() {
    this.unMounting = true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.runningAlg === 'prim' && this.props.runningAlg !== 'prim') {
      this.unMounting = true;
    }
  }

  prim = async () => {
    let root = this.props.root;
    let costMap = {};
    let parents = {};
    let mstSet = {};
    Object.keys(this.props.g).forEach((k) => {
      costMap[k] = Infinity;
      parents[k] = null;
      mstSet[k] = false;
    });
    parents[root] = -1;
    costMap[root] = 0;

    let activeLinks = [];
    let cumulativeCostMap = {};
    for (let i = 0; i < Object.keys(this.props.g).length; i++) {
      if (this.unMounting) return;
      cumulativeCostMap = this.calculateCumulativeDistance(costMap, parents);
      this.props.updatePrimData(costMap, parents, cumulativeCostMap);
      let minNode = this.findMin(costMap, mstSet);
      mstSet[minNode] = true;

      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
        return;
      }
      if (this.unMounting) return;

      let minNodeEl = this.activateCurrentNode(minNode);

      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
        return;
      }
      if (this.unMounting) return;

      for (let node of Object.keys(costMap)) {
        for (let [cost, neighbor] of this.props.g[minNode]) {
          if (neighbor === node) {
            if (mstSet[node] === false) {
              if (costMap[node] > cost) {
                let el = this.deActivateOldLink(
                  node,
                  parents[node],
                  this.props.speed
                );
                if (el) activeLinks.filter((e) => e !== el);

                this.activateLink(minNode, node, activeLinks);

                await new Promise((r) =>
                  setTimeout(r, 1000 / this.props.speed)
                );
                await this.checkPauseStatus();
                if (this.props.stop) {
                  this.cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
                  return;
                }
                if (this.unMounting) return;

                costMap[node] = cost;
                parents[node] = minNode;
              }
            }
          }
        }
      }
      this.updateCurrentNodeToBeVisited(minNodeEl);
    }
    this.calculateCumulativeDistance(costMap, parents);
  };

  findMin(key, mstSet) {
    let min = Infinity;
    let minNode = null;
    for (let node of Object.keys(key)) {
      if (key[node] < min && mstSet[node] === false) {
        min = key[node];
        minNode = node;
      }
    }
    return minNode;
  }

  activateCurrentNode(currentNode) {
    let currentNodeElement = document.getElementById(currentNode);
    currentNodeElement.classList.add('current-node-of-interest');
    return currentNodeElement;
  }

  activateLink(currentNode, neighborNode, activeLinks) {
    let linkString =
      currentNode < neighborNode
        ? currentNode + '-' + neighborNode
        : neighborNode + '-' + currentNode;

    let linkOfInterestElement = document.getElementById(linkString);
    if (linkOfInterestElement) {
      linkOfInterestElement.classList.add('link-traversed');
      activeLinks.push(linkOfInterestElement);
    }
    return linkOfInterestElement;
  }

  updateCurrentNodeToBeVisited(currentNodeElement) {
    currentNodeElement.classList.remove('current-node-of-interest');
    currentNodeElement.classList.add('node-complete-tree');
  }

  async deActivateOldLink(node, oldChild, getSpeedRequest, activeLinks) {
    let linkString =
      node < oldChild ? node + '-' + oldChild : oldChild + '-' + node;
    let el = document.getElementById(linkString);
    if (el) {
      el.classList.add('fade-out-link');
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      el.classList.remove('link-traversed', 'fade-out-link');
      return el;
    }
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

  removeActiveLinks(activeLinks) {
    activeLinks.forEach((e) => {
      if (e) {
        e.classList.remove('fade-out-link', 'link-traversed');
      }
    });
    return [];
  }

  calculateCumulativeDistance(costMap, parents) {
    let cumCostMap = {};
    for (let node of Object.keys(costMap)) {
      if (parents[node] == null) {
        cumCostMap[node] = '';
        continue;
      }
      let currentNode = parents[node];
      let cost = costMap[node];
      while (currentNode !== -1) {
        cost += costMap[currentNode];
        currentNode = parents[currentNode];
      }
      cumCostMap[node] = cost;
    }
    return cumCostMap;
  }

  render() {
    return (
      <button
        className="graph-button"
        onClick={() => {
          if (this.unMounting) {
            this.unMounting = false;
          }
          this.props.setRunningAlg('prim');
          this.prim();
        }}
      >
        Prim
      </button>
    );
  }
}

export default Prim;
