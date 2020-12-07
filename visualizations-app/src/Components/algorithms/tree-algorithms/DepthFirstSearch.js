import React, { Component } from 'react';

class DepthFirstSearch extends Component {
  constructor(props) {
    super(props);
    this.animationQueue = [];
  }

  dfs = async () => {
    let root = 'a';
    let visited = {};
    //initializes the visited object, all values set to false
    Object.keys(this.props.g).map((node) => (visited[node] = false));

    this.animationQueue.push({ highlightedLine: 0 });
    this.animationQueue.push({ highlightedLine: 1, stack: [] });
    this.animationQueue.push({
      highlightedLine: 2,
      visitedMap: { ...visited },
    });

    visited[root] = true;

    this.animationQueue.push({
      highlightedLine: 3,
      visitedMap: { ...visited },
    });

    let stack = [root];
    let nodePath = [];

    this.animationQueue.push({
      highlightedLine: 4,
      stack: [...stack],
    });

    while (stack.length > 0) {
      this.animationQueue.push({
        highlightedLine: 5,
      });

      let currentNode = stack.pop();
      nodePath.push(currentNode);

      this.animationQueue.push({
        highlightedLine: 6,
        stack: [...stack],
        currentNode: currentNode,
        activatedNode: currentNode,
        activatedLink: currentNode,
        nodePath: [...nodePath],
      });

      for (let child of this.props.g[currentNode]) {
        this.animationQueue.push({ highlightedLine: 7, child: child });
        this.animationQueue.push({ highlightedLine: 8 });

        if (visited[child] === false) {
          visited[child] = true;
          this.animationQueue.push({
            highlightedLine: 9,
            visitedMap: { ...visited },
          });

          stack.push(child);
          this.animationQueue.push({
            highlightedLine: 10,
            stack: [...stack],
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

          await this.props.setRunningAlg('dfs');
          this.dfs();
        }}
        disabled={this.props.getRunningAlg === 'dfs'}
      >
        DFS traverse
      </button>
    );
  }
}

export default DepthFirstSearch;
