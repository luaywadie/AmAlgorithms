import React, { Component } from 'react';

class Topsort extends Component {
  constructor(props) {
    super(props);
    this.animationQueue = [];
    this.previousNodes = [];
    this.callStack = [];
  }

  topSort = async () => {
    let stack = [];
    let visited = {};
    let activeLinks = {};
    Object.keys(this.props.g).map((key) => (visited[key] = null));

    this.animationQueue.push({ highlightedLine: 'topsort-1' });
    this.animationQueue.push({ highlightedLine: 'topsort-2', stack: [] });
    this.animationQueue.push({
      highlightedLine: 'topsort-3',
      visited: { ...visited },
    });

    for (let node of Object.keys(this.props.g)) {
      this.animationQueue.push({
        removeHighlightedLine: 'topsort-6',
        waitTime: 0,
      });
      this.animationQueue.push({
        highlightedLine: 'topsort-4',
        currentNode: node,
      });

      if (visited[node]) {
        this.animationQueue.push({ highlightedLine: 'topsort-5' });
      }

      if (visited[node] === null) {
        this.callStack.unshift(`visit(${node}, G, S, V)`);

        this.animationQueue.push({ highlightedLine: 'topsort-5' });

        this.animationQueue.push({
          highlightedLine: 'topsort-6',
          keepLineHighlighted: true,
          callStack: [...this.callStack],
        });

        if ((await this.visit(node, stack, visited, activeLinks)) === false) {
          return null;
        }

        this.callStack.shift();
        this.animationQueue.push({ callStack: [...this.callStack] });
      }
    }
    this.animationQueue.push({
      removeHighlightedLine: 'topsort-6',
      waitTime: 0,
    });
    this.animationQueue.push({
      highlightedLine: 'topsort-8',
      ordering: stack.slice().reverse(),
    });
    this.props.updateAnimationQueue([...this.animationQueue]);
    this.animationQueue = [];
    return stack.reverse();
  };
  visit = async (node, stack, visited, activeLinks) => {
    this.animationQueue.push({ highlightedLine: 'topsort-visit-1' });
    this.animationQueue.push({ highlightedLine: 'topsort-visit-2' });

    if (visited[node] === 'Complete') {
      this.callStack.shift();
      this.animationQueue.push({
        highlightedLine: 'topsort-visit-3',
        currentNode: this.previousNodes.pop(),
        callStack: [...this.callStack],
      });
      return true;
    }
    this.animationQueue.push({ highlightedLine: 'topsort-visit-4' });

    if (visited[node] === 'In Progress') {
      this.animationQueue.push({ highlightedLine: 'topsort-visit-5' });
      return false;
    }

    visited[node] = 'In Progress';

    this.animationQueue.push({
      highlightedLine: 'topsort-visit-6',
      activatedNode: node,
      visited: { ...visited },
    });

    if (this.props.g[node].length < 1) {
      this.animationQueue.push({ highlightedLine: 'topsort-visit-7' });
    }

    for (let neighbor of this.props.g[node]) {
      this.animationQueue.push({
        highlightedLine: 'topsort-visit-7',
        activatedLink: node + '-' + neighbor,
        neighbor: neighbor,
      });

      activeLinks = this.updateActiveLinks(neighbor, activeLinks, node);

      this.previousNodes.push(node);
      this.callStack.unshift(`visit(${neighbor}, G, S, V)`);
      this.animationQueue.push({
        highlightedLine: 'topsort-visit-8',
        neighbor: null,
        currentNode: neighbor,
        callStack: [...this.callStack],
      });

      if ((await this.visit(neighbor, stack, visited, activeLinks)) === false) {
        return false;
      }
    }
    stack.push(node);
    this.animationQueue.push({
      highlightedLine: 'topsort-visit-10',
      stack: [...stack],
    });

    visited[node] = 'Complete';
    this.animationQueue.push({
      highlightedLine: 'topsort-visit-11',
      visited: { ...visited },
      nodeComplete: node,
      outgoingLinks: { activeLinks, node },
    });

    this.callStack.shift();

    this.animationQueue.push({
      highlightedLine: 'topsort-visit-12',
      currentNode: this.previousNodes.pop(),
      callStack: [...this.callStack],
    });

    return true;
  };

  updateActiveLinks(neighbor, activeLinks, node) {
    let activeLink = document.getElementById(node + '-' + neighbor);
    if (activeLink) {
      if (!activeLinks[node]) {
        activeLinks[node] = [activeLink];
      } else {
        activeLinks[node].push(activeLink);
      }
    }
    return activeLinks;
  }

  render() {
    return (
      <button
        className="graph-button"
        onClick={() => {
          this.props.freshStart();

          this.props.setRunningAlg('topsort');
          this.topSort();
        }}
        disabled={this.props.getRunningAlg === 'topsort'}
      >
        Topological Sort
      </button>
    );
  }
}

export default Topsort;
