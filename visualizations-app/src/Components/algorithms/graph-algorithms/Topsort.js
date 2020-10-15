import React, { Component } from 'react';

class Topsort extends Component {
  constructor(props) {
    super(props);
    this.unMounting = false;
    this.previousNodes = [];
    this.callStack = [];
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

  highlightLine(classId) {
    let el = document.getElementById(classId);
    if (el) el.classList.add('active-code-line');
  }
  removeHighlightedLine(classId) {
    let el = document.getElementById(classId);
    if (el) el.classList.remove('active-code-line');
  }

  topSort = async () => {
    this.highlightLine('topsort-1');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-1');

    this.highlightLine('topsort-2');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-2');

    let stack = [];
    this.props.updateStack(stack);

    this.highlightLine('topsort-3');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-3');

    let visited = {};
    Object.keys(this.props.g).map((key) => (visited[key] = null));
    this.props.updateVisited(visited);

    let activeLinks = {};

    for (let node of Object.keys(this.props.g)) {
      this.highlightLine('topsort-4');
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks);
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine('topsort-4');
      this.props.updateNode(node);

      if (visited[node]) {
        this.highlightLine('topsort-5');
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks);
          return;
        }
        if (this.unMounting) return;
        this.removeHighlightedLine('topsort-5');
      }

      if (visited[node] === null) {
        this.highlightLine('topsort-5');
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks);
          return;
        }
        if (this.unMounting) return;
        this.removeHighlightedLine('topsort-5');

        this.highlightLine('topsort-6');
        await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
        await this.checkPauseStatus();
        if (this.props.stop) {
          this.cleanUpActiveLinksAndCurrentNode(activeLinks);
          return;
        }
        if (this.unMounting) return;
        this.callStack.unshift(`visit(${node}, G, S, V)`);
        this.props.updateCallStack(this.callStack);
        if ((await this.visit(node, stack, visited, activeLinks)) === false) {
          return null;
        }
        this.callStack.shift();
        this.props.updateCallStack(this.callStack);

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

        this.removeHighlightedLine('topsort-6');
      }
    }
    this.highlightLine('topsort-8');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks);
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-8');
    this.props.getOrdering(stack.slice().reverse());

    return stack.reverse();
  };
  // 2 = permenant mark, 1 = temp mark (if we encounter 1 again, we have cycle)
  visit = async (node, stack, visited, activeLinks) => {
    console.log(this.previousNodes);
    this.highlightLine('topsort-visit-1');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks);
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-visit-1');

    this.highlightLine('topsort-visit-2');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks);
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-visit-2');

    if (visited[node] === 'Complete') {
      this.highlightLine('topsort-visit-3');
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks);
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine('topsort-visit-3');

      this.props.updateNode(this.previousNodes.pop());
      this.callStack.shift();
      this.props.updateCallStack(this.callStack);
      return true;
    }
    this.highlightLine('topsort-visit-4');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks);
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-visit-4');
    if (visited[node] === 'In Progress') {
      this.highlightLine('topsort-visit-5');
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks);
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine('topsort-visit-5');
      return false;
    }

    this.activateCurrentNode(node);
    visited[node] = 'In Progress';
    this.highlightLine('topsort-visit-6');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks);
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-visit-6');
    this.props.updateVisited(visited);

    if (this.props.g[node].length < 1) {
      this.highlightLine('topsort-visit-7');
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks);
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine('topsort-visit-7');
    }

    for (let neighbor of this.props.g[node]) {
      this.highlightLine('topsort-visit-7');

      let activeLink = this.activateLink(node, neighbor);
      activeLinks = this.updateActiveLinks(activeLink, activeLinks, node);
      this.activateNeighbor(neighbor);

      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks);
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine('topsort-visit-7');
      this.props.updateNeighbor(neighbor);

      this.highlightLine('topsort-visit-8');
      await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) {
        this.cleanUpActiveLinksAndCurrentNode(activeLinks);
        return;
      }
      if (this.unMounting) return;
      this.removeHighlightedLine('topsort-visit-8');
      this.props.updateNeighbor(null);
      this.props.updateNode(neighbor);
      this.previousNodes.push(node);
      this.callStack.unshift(`visit(${neighbor}, G, S, V)`);
      this.props.updateCallStack(this.callStack);
      if ((await this.visit(neighbor, stack, visited, activeLinks)) === false) {
        return false;
      }
    }
    this.highlightLine('topsort-visit-10');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks);
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-visit-10');
    stack.push(node);
    this.props.updateStack(stack);

    this.highlightLine('topsort-visit-11');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks);
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-visit-11');
    visited[node] = 'Complete';
    this.props.updateVisited(visited);

    this.markNodeComplete(node);
    this.removeOutgoingLinks(activeLinks, node);

    this.highlightLine('topsort-visit-12');
    await new Promise((r) => setTimeout(r, 1000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) {
      this.cleanUpActiveLinksAndCurrentNode(activeLinks);
      return;
    }
    if (this.unMounting) return;
    this.removeHighlightedLine('topsort-visit-12');

    this.props.updateNode(this.previousNodes.pop());
    this.callStack.shift();
    this.props.updateCallStack(this.callStack);
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
