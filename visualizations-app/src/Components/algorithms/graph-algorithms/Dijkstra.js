import React, { Component } from 'react';
const {
  Heap: PriorityQueue,
} = require('../../../helpers/data-structures/heap_helper.js');
// [cost, node]

class Dijkstra extends Component {
  constructor(props) {
    super(props);
    this.animationQueue = [];
  }

  djikstra = async () => {
    let root = 'source';
    let target = 'target';
    let parents = {};
    let distances = {};
    Object.keys(this.props.g).forEach((node) => {
      distances[node] = Infinity;
      parents[node] = null;
    });
    let pq = new PriorityQueue();

    this.animationQueue.push({ highlightedLine: 1 });
    this.animationQueue.push({ highlightedLine: 2, pq: [...pq.getArray()] });
    this.animationQueue.push({ highlightedLine: 3, parents: { ...parents } });
    this.animationQueue.push({
      highlightedLine: 4,
      distances: { ...distances },
    });

    distances[root] = 0;

    this.animationQueue.push({
      highlightedLine: 5,
      distances: { ...distances },
    });

    pq.insert([0, root]);

    this.animationQueue.push({ highlightedLine: 6, pq: [...pq.getArray()] });

    let activeLinks = [];

    if (pq.size === 0) {
      this.animationQueue.push({ highlightedLine: 7 });
    }
    while (pq.size > 0) {
      this.animationQueue.push({ highlightedLine: 7 });

      let currentNode = pq.removeRoot()[1];
      this.animationQueue.push({
        highlightedLine: 8,
        currentNode: currentNode,
        activatedNode: currentNode,
        pq: [...pq.getArray()],
        removeActiveLinks: [...activeLinks],
      });
      activeLinks = [];

      for (let [neighborNodeWeight, neighborNode] of this.props.g[
        currentNode
      ]) {
        let linkOfInterestString = this.generateLinkString(
          currentNode,
          neighborNode
        );

        activeLinks.push(document.getElementById(linkOfInterestString));
        this.animationQueue.push({
          highlightedLine: 9,
          linkOfInterest: linkOfInterestString,
          neighborNode: neighborNode,
          neighborNodeWeight: neighborNodeWeight,
        });
        let potentialScore = distances[currentNode] + neighborNodeWeight;

        this.animationQueue.push({
          highlightedLine: 10,
          potentialScore: potentialScore,
        });

        this.animationQueue.push({
          highlightedLine: 11,
        });

        if (potentialScore < distances[neighborNode]) {
          //updates
          distances[neighborNode] = potentialScore;
          this.animationQueue.push({
            highlightedLine: 12,
            distances: { ...distances },
          });

          parents[neighborNode] = currentNode;
          this.animationQueue.push({
            highlightedLine: 13,
            parents: { ...parents },
          });

          pq.insert([neighborNodeWeight, neighborNode]);
          this.animationQueue.push({
            highlightedLine: 14,
            pq: [...pq.getArray()],
          });
        }
        this.animationQueue.push({
          waitTime: 0,
          potentialScore: null,
          neighborNode: null,
          neighborNodeWeight: null,
        });
      }
      this.animationQueue.push({
        waitTime: 0,
        currentNode: null,
        fadeOutLinks: [...activeLinks],
        nodeComplete: currentNode,
      });
    }
    this.animationQueue.push({
      currentNode: null,
    });

    let end = target;
    let stack = [end];
    while (end != null) {
      stack.push(parents[end]);
      end = parents[end];
    }
    let shortestPath = stack.reverse().slice(1);
    this.animationQueue.push({
      waitTime: 0,
      shortestPath: shortestPath,
    });
    this.props.updateAnimationQueue([...this.animationQueue]);

    this.animationQueue = [];
  };


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
          await this.props.freshStart();

          await this.props.setRunningAlg('dijkstra');
          this.djikstra();
        }}
        disabled={this.props.getRunningAlg === 'dijkstra'}
      >
        Dijkstra
      </button>
    );
  }
}

export default Dijkstra;
