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
  highlightLine(lineNum) {
    document
      .getElementById('prim-' + lineNum)
      .classList.add('active-code-line');
  }
  removeHighlightedLine(lineNum) {
    document
      .getElementById('prim-' + lineNum)
      .classList.remove('active-code-line');
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
    this.highlightLine(1);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(1);

    this.highlightLine(2);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(2);
    this.props.updateDistances(costMap);

    this.highlightLine(3);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(3);
    this.props.updateParents(parents);

    this.highlightLine(4);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(4);
    this.props.updatePrimMstSet(mstSet);

    this.highlightLine(5);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(5);
    parents[root] = -1;

    this.highlightLine(6);
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine(6);
    costMap[root] = 0;

    let activeLinks = [];
    for (let i = 0; i < Object.keys(this.props.g).length; i++) {
      this.highlightLine(7);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine(7);

      this.highlightLine(8);
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine(8);
      let minNode = this.findMin(costMap, mstSet);
      this.props.updatePrimMinNode(minNode);

      this.highlightLine(9);
      mstSet[minNode] = true;
      let minNodeEl = this.activateCurrentNode(minNode);

      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine(9);
      this.props.updatePrimMstSet(mstSet);

      for (let [cost, neighbor] of this.props.g[minNode]) {
        this.highlightLine(10);
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
          return;
        }
        if (this.unMounting) return;
        this.removeHighlightedLine(10);

        this.props.updateNeighbor(neighbor, cost);

        this.highlightLine(11);
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
          return;
        }
        if (this.unMounting) return;
        this.removeHighlightedLine(11);

        if (mstSet[neighbor] === false) {
          this.highlightLine(12);
          await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
          await this.checkPauseStatus();
          if (this.props.stop) {
            this.cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
            return;
          }
          if (this.unMounting) return;
          this.removeHighlightedLine(12);

          if (costMap[neighbor] > cost) {
            this.highlightLine(13);
            let el = this.deActivateOldLink(
              neighbor,
              parents[neighbor],
              this.props.speed
            );
            if (el) activeLinks.filter((e) => e !== el);

            this.activateLink(minNode, neighbor, activeLinks);
            await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
            await this.checkPauseStatus();
            if (this.props.stop) {
              this.cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
              return;
            }
            if (this.unMounting) return;
            this.removeHighlightedLine(13);
            costMap[neighbor] = cost;
            this.props.updateDistances(costMap);

            this.highlightLine(14);
            await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
            await this.checkPauseStatus();
            if (this.props.stop) {
              this.cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
              return;
            }
            if (this.unMounting) return;
            this.removeHighlightedLine(14);
            parents[neighbor] = minNode;
            this.props.updateParents(parents);
          }
        }
        this.props.updateNeighbor(null, null);
      }
      this.props.updatePrimMinNode(null);
      this.updateCurrentNodeToBeVisited(minNodeEl);
    }
    // this.calculateCumulativeDistance(costMap, parents);
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

  // calculateCumulativeDistance(costMap, parents) {
  //   let cumCostMap = {};
  //   for (let node of Object.keys(costMap)) {
  //     if (parents[node] == null) {
  //       cumCostMap[node] = '';
  //       continue;
  //     }
  //     let currentNode = parents[node];
  //     let cost = costMap[node];
  //     while (currentNode !== -1) {
  //       cost += costMap[currentNode];
  //       currentNode = parents[currentNode];
  //     }
  //     cumCostMap[node] = cost;
  //   }
  //   return cumCostMap;
  // }

  render() {
    return (
      <button
        className="graph-button"
        onClick={async () => {
          if (this.unMounting) {
            this.unMounting = false;
          }
          await this.props.setRunningAlg('prim');
          this.prim();
        }}
      >
        Prim
      </button>
    );
  }
}

export default Prim;
