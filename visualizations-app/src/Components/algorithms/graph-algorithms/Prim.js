import React, { Component } from 'react';

class Prim extends Component {
  constructor(props) {
    super(props);
    this.animationQueue = [];
  }

  prim = async () => {
    let root = 'source';
    let costMap = {};
    let parents = {};
    let mstSet = {};
    Object.keys(this.props.g).forEach((k) => {
      costMap[k] = Infinity;
      parents[k] = null;
      mstSet[k] = false;
    });

    this.animationQueue.push({ highlightedLine: 1 });
    this.animationQueue.push({ highlightedLine: 2, distances: { ...costMap } });
    this.animationQueue.push({ highlightedLine: 3, parents: { ...parents } });
    this.animationQueue.push({
      highlightedLine: 4,
      mstSet: { ...mstSet },
    });

    parents[root] = -1;
    this.animationQueue.push({ highlightedLine: 5, parents: { ...parents } });

    costMap[root] = 0;
    this.animationQueue.push({ highlightedLine: 6, distances: { ...costMap } });

    let activeLinks = [];

    for (let i = 0; i < Object.keys(this.props.g).length; i++) {
      this.animationQueue.push({ highlightedLine: 7 });

      let minNode = this.findMin(costMap, mstSet);
      this.animationQueue.push({
        highlightedLine: 8,
        minNode: minNode,
        activatedNode: minNode,
      });

      mstSet[minNode] = true;
      this.animationQueue.push({ highlightedLine: 9, mstSet: { ...mstSet } });


      for (let [cost, neighbor] of this.props.g[minNode]) {
        this.animationQueue.push({
          highlightedLine: 10,
          neighborNodeWeight: cost,
          neighborNode: neighbor,
        });

        this.animationQueue.push({
          highlightedLine: 11,
        });

        if (mstSet[neighbor] === false) {
          this.animationQueue.push({
            highlightedLine: 12,
          });

          if (costMap[neighbor] > cost) {
            costMap[neighbor] = cost;
            this.animationQueue.push({
              highlightedLine: 13,
              distances: { ...costMap },
              deActivateOldLink: [neighbor, parents[neighbor]],
              linkOfInterest: this.generateLinkString(minNode, neighbor),
            });
            activeLinks.push(
              document.getElementById(
                this.generateLinkString(minNode, neighbor)
              )
            );

            let el = document.getElementById(
              this.generateLinkString(parents[neighbor], neighbor)
            );

            if (el) activeLinks.filter((e) => e !== el);

            parents[neighbor] = minNode;
            this.animationQueue.push({
              highlightedLine: 14,
              parents: { ...parents },
              activateLink: this.generateLinkString(minNode, neighbor),
            });
          }
        }
        this.animationQueue.push({
          waitTime: 0,
          neighborNode: null,
          neighborNodeWeight: null,
        });
      }
      this.animationQueue.push({
        waitTime: 0,
        minNode: null,
        nodeComplete: minNode,
      });
    }
    this.props.updateAnimationQueue([...this.animationQueue]);

    this.animationQueue = [];
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


  generateLinkString(currentNode, neighborNode) {
    return currentNode < neighborNode
      ? currentNode + '-' + neighborNode
      : neighborNode + '-' + currentNode;
  }








 


  render() {
    return (
      <button
        className="graph-button"
        onClick={async () => {
          if (this.props.stop) {
            this.props.updateStop();
          }
          await this.props.setRunningAlg('prim');
          this.prim();
        }}
        disabled={this.props.getRunningAlg === 'prim'}
      >
        Prim
      </button>
    );
  }
}

export default Prim;
