import React, { Component } from 'react';

class BreadthFirstSearch extends Component {
  constructor(props) {
    super(props);
    this.animationQueue = [];
  }

  bfs = async () => {
    let root = 'a';

    let visited = {};
    Object.keys(this.props.g).map((node) => (visited[node] = false));

    this.animationQueue.push({ highlightedLine: 1 });
    this.animationQueue.push({ highlightedLine: 2, queue: [] });
    this.animationQueue.push({
      highlightedLine: 3,
      visitedMap: { ...visited },
    });

    visited[root] = true;

    this.animationQueue.push({
      highlightedLine: 4,
      visitedMap: { ...visited },
    });

    let queue = [root];
    let nodePath = [];

    this.animationQueue.push({
      highlightedLine: 5,
      queue: [...queue],
    });

    while (queue.length > 0) {
      this.animationQueue.push({
        highlightedLine: 6,
        child: null,
        currentNode: null,
      });

      let currentNode = queue[0];
      queue.shift();

      nodePath.push(currentNode);

      this.animationQueue.push({
        highlightedLine: 7,
        queue: [...queue],
        current: currentNode,
        activatedNode: currentNode,
        activatedLink: currentNode,
        nodePath: [...nodePath],
      });

      for (let child of this.props.g[currentNode]) {
        this.animationQueue.push({ highlightedLine: 8, child: child });
        this.animationQueue.push({ highlightedLine: 9 });

        if (visited[child] === false) {
          visited[child] = true;
          this.animationQueue.push({
            highlightedLine: 10,
            visitedMap: { ...visited },
          });
          queue.push(child);

          this.animationQueue.push({
            highlightedLine: 11,
            queue: [...queue],
          });
        }
      }
      this.animationQueue.push({
        child: null,
        currentNode: null,
        waitTime: 0,
      });
    }
    this.props.updateAnimationQueue(this.animationQueue);
    this.animationQueue = [];
  };

  render() {
    return (
      <button
        onClick={async () => {
          this.props.freshStart();

          await this.props.setRunningAlg('bfs');
          this.bfs();
        }}
        disabled={this.props.getRunningAlg === 'bfs'}
      >
        BFS traverse
      </button>
    );
  }
}

export default BreadthFirstSearch;
