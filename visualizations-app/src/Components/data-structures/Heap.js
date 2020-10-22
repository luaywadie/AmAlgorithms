import React, { Component } from 'react';
import {
  insertIntoDynamicTree,
  swap,
  createDynamicTree,
  removeRootOfDynamicTree,
  clearTree,
} from '../../graph-builders/dynamic-tree-builder';
import { FaStepBackward, FaStepForward, FaPause, FaPlay } from 'react-icons/fa';

import Sidebar from '../sidebar/Sidebar';

import RenderListComponent from '../sidebar/RenderListComponent';

class Heap extends Component {
  constructor(props) {
    super(props);
    this.sample = [9, 11, 24, 13, 35, 25, 61, 17, 48, 91];
    this.h = [0];
    this.state = {
      inputList: [],
      heapA: [0],
      inputNum: '',
      executing: false,
      pause: false,
      size: 0,
      parentIndex: null,
      currentIndex: null,
      clicked: [false, false, false],
      newElement: null,
      removedRoot: null,
      inserting: false,
      removingRoot: false,
      childIndex: null,
      leftChild: null,
      rightChild: null,
      animationQueue: [],
      stepIndex: 0,
      stepMode: false,
      speed: 1,
    };
    this.animationQueue = [];
    this.unMounting = false;
    this.adjList = {};
  }

  componentDidMount = () => {
    if (this.state.inputList.length === 0) {
      this.buildSampleHeap();
    }
    this.dataStructure = document.getElementById('graph-container');
  };

  componentWillUnmount() {
    this.unMounting = true;
    let svg = document.getElementById('heap-tree-svg');
    if (this.dataStructure.hasChildNodes() && svg)
      this.dataStructure.removeChild(svg);
  }

  async buildSampleHeap() {
    clearTree();
    this.h = this.sample;
    await this.setState({
      inputList: this.sample,
      heapA: this.h,
    });
    this.setState({ size: this.sample[0] });
    this.convertHeapArrayToAdjList(this.h);
    insertIntoDynamicTree(this.h[1], this.adjList);
  }

  async clearHeap() {
    await this.setState({ inputList: [], heapA: [0], animationQueue: [] });
    this.h = [0];
    this.setState({ size: 0 });
    this.adjList = {};
    this.clearPseudocode();
    clearTree();
  }



  handleInsertButton = async () => {
    let newNode = this.state.inputNum;
    await this.setState({
      inputList: [...this.state.inputList, Number(this.state.inputNum)],
      inputNum: '',
      executing: true,
    });
    await this.insert(newNode);
    if (this.state.inputList.length === 1) {
      this.convertHeapArrayToAdjList(this.h);
      createDynamicTree(this.adjList);
    }
    await this.setState({
      executing: false,
      animationQueue: this.animationQueue,
    });
    this.animationQueue = [];
  };

  async renderAnimationQueue() {
    await this.setState({ stepIndex: 0 });
    while (this.state.stepIndex < this.state.animationQueue.length) {
      let currentState = this.state.animationQueue[this.state.stepIndex];

      this.highlightLine(currentState.highlightedLine);

      let waitTime =
        currentState.waitTime !== undefined ? currentState.waitTime : 1000;

      if (this.state.stepMode) {
        waitTime = 0;
      }

      await new Promise((r) => setTimeout(r, waitTime / this.state.speed));
      await this.checkPauseStatus();

      if (!currentState.keepLineHighlighted) {
        this.removeHighlightedLine(currentState.highlightedLine);
      }
      if (currentState.removeHighlightedLine) {
        this.removeHighlightedLine(currentState.removeHighlightedLine);
      }

      await this.setState({ ...currentState });

      if (currentState.activateChildAndParent) {
        this.activateChildAndParent(
          currentState.activateChildAndParent[0],
          currentState.activateChildAndParent[1]
        );
      }

      this.activateParent(currentState.activateParent);
      this.deActivateParent(currentState.deActivateParent);

      if (currentState.activateLeftAndRightChildren) {
        this.activateLeftAndRightChildren(
          currentState.activateLeftAndRightChildren[0],
          currentState.activateLeftAndRightChildren[1]
        );
      }

      if (currentState.deActivateLeftAndRightChildren) {
        this.deActivateLeftAndRightChildren(
          currentState.deActivateLeftAndRightChildren[0],
          currentState.deActivateLeftAndRightChildren[1]
        );
      }

      if (currentState.swap && !this.state.stepMode) {
        swap(currentState.swap[0], currentState.swap[1]);
      }

      if (currentState.removeActiveChildParent) {
        this.removeActiveChildParent(
          currentState.removeActiveChildParent[0],
          currentState.removeActiveChildParent[1]
        );
      }
      this.activateLink(currentState.activatedLink);
      this.deActivateLink(currentState.deActivateLink);

      if (!this.state.stepMode) {
        this.setState({ stepIndex: this.state.stepIndex + 1 });
      } else {
        // need to reset everything up to the previous state starting from beggining since we only update what is neccessary at each element of the animation queue

        this.setState({
          stepMode: false,
          pause: true,
        });
        this.convertHeapArrayToAdjList(this.state.heapA);
        insertIntoDynamicTree(this.state.heapA[1], this.adjList);
        for (let i = 0; i < this.state.stepIndex; i++) {
          let prevState = this.state.animationQueue[i];
          this.setState({ ...prevState });

          if (prevState.activateChildAndParent) {
            this.activateChildAndParent(
              prevState.activateChildAndParent[0],
              prevState.activateChildAndParent[1]
            );
          }

          if (prevState.removeActiveChildParent) {
            this.removeActiveChildParent(
              prevState.removeActiveChildParent[0],
              prevState.removeActiveChildParent[1]
            );
          }

          this.activateLink(prevState.activatedLink);
          this.deActivateLink(prevState.deActivateLink);

          if (prevState.keepLineHighlighted) {
            this.highlightLine(prevState.highlightedLine);
          }
          if (prevState.removeHighlightedLine) {
            this.removeHighlightedLine(prevState.removeHighlightedLine);
          }
        }
      }
    }
    this.setState({ animationQueue: [] });
  }

  insert(e) {
    this.animationQueue.push({
      highlightedLine: 'Heap-insert-1',
      newElement: e,
    });
    this.h[0] = this.state.size + 1;
    this.animationQueue.push({
      highlightedLine: 'Heap-insert-2',
      size: this.h[0],
      heapA: [...this.h],
    });

    this.h[this.h[0]] = e;
    this.animationQueue.push({
      highlightedLine: 'Heap-insert-3',
      heapA: [...this.h],
    });

    this.convertHeapArrayToAdjList(this.h);
    if (this.h[0] !== 1) {
      insertIntoDynamicTree(this.h[1], this.adjList);
    }

    this.animationQueue.push({
      highlightedLine: 'Heap-insert-4',
      keepLineHighlighted: true,
    });

    this.fixUp();
    this.animationQueue.push({
      removeHighlightedLine: 'Heap-insert-4',
      newElement: null,
      animationQueue: this.animationQueue,
    });
  }
  fixUp() {
    this.animationQueue.push({ highlightedLine: 'Heap-fixup-1' });

    let currentIndex = this.h[0];
    this.animationQueue.push({
      highlightedLine: 'Heap-fixup-2',
      currentIndex: currentIndex,
    });

    if (currentIndex <= 1) {
      this.animationQueue.push({
        highlightedLine: 'Heap-fixup-3',
        currentIndex: null,
      });
    }
    while (currentIndex > 1) {
      this.animationQueue.push({ highlightedLine: 'Heap-fixup-3' });

      let parentIndex = Math.floor(currentIndex / 2);
      this.animationQueue.push({
        highlightedLine: 'Heap-fixup-4',
        parentIndex: parentIndex,
        activateChildAndParent: [this.h[currentIndex], this.h[parentIndex]],
      });

      this.animationQueue.push({
        highlightedLine: 'Heap-fixup-5',
        removeActiveChildParent: [this.h[currentIndex], this.h[parentIndex]],
        activatedLink: this.h[currentIndex],
      });

      if (this.h[parentIndex] > this.h[currentIndex]) {
        let temp = this.h[parentIndex];
        this.h[parentIndex] = this.h[currentIndex];
        this.h[currentIndex] = temp;

        this.animationQueue.push({
          highlightedLine: 'Heap-fixup-6',

          removeActiveChildParent: [this.h[parentIndex], this.h[currentIndex]],
          heapA: [...this.h],
          swap: [this.h[parentIndex], this.h[currentIndex]],
        });

        currentIndex = parentIndex;
        this.animationQueue.push({
          highlightedLine: 'Heap-fixup-7',
          deActivateLink: this.h[currentIndex],
          currentIndex: currentIndex,
        });
      } else {
        this.animationQueue.push({ highlightedLine: 'Heap-fixup-8' });
        break;
      }
      this.animationQueue.push({ waitTime: 0, parentIndex: null });
    }
    this.animationQueue.push({
      waitTime: 0,
      parentIndex: null,
      currentIndex: null,
    });
  }

  async removeRoot() {
    await this.setState({ executing: true });
    this.animationQueue.push({
      highlightedLine: 'Heap-removeRoot-1',
    });

    let smallest = this.h[1];
    this.animationQueue.push({
      highlightedLine: 'Heap-removeRoot-2',
      removedRoot: smallest,
    });

    let updatedList = this.state.inputList.filter((e) => e !== smallest);
    updatedList[0] -= 1;

    this.h[1] = this.h.pop();

    this.h[0] = this.state.size - 1;
    await this.setState({
      size: this.state.size - 1,
      heapA: [...this.h],
      inputList: updatedList,
    });

    this.animationQueue.push({
      highlightedLine: 'Heap-removeRoot-3',
      heapA: [...this.h],
    });

    if (this.state.size === 0) {
      this.h = this.h.slice(0, 1);
    }

    this.animationQueue.push({
      highlightedLine: 'Heap-removeRoot-4',
      heapA: [...this.h],
      inputList: updatedList,
    });

    this.animationQueue.push({
      highlightedLine: 'Heap-removeRoot-5',
      keepLineHighlighted: true,
    });

    if (this.state.size === 0) {
      clearTree();
    } else {
      this.convertHeapArrayToAdjList([...this.h]);
      removeRootOfDynamicTree(this.h[1], this.adjList);
      await this.fixDown();
    }

    this.animationQueue.push({
      removeHighlightedLine: 'Heap-removeRoot-5',
    });

    this.animationQueue.push({
      highlightedLine: 'Heap-removeRoot-6',
      removedRoot: null,
    });

    await this.setState({
      executing: false,
      animationQueue: this.animationQueue,
    });
    this.animationQueue = [];

    return smallest;
  }
  async fixDown() {
    this.animationQueue.push({ highlightedLine: 'Heap-fixdown-1' });

    let currentIndex = 1;
    this.animationQueue.push({
      highlightedLine: 'Heap-fixdown-2',
      currentIndex: currentIndex,
    });

    if (currentIndex * 2 > this.state.size) {
      this.animationQueue.push({ highlightedLine: 'Heap-fixdown-3' });
    }
    while (currentIndex * 2 <= this.state.size) {
      this.animationQueue.push({ highlightedLine: 'Heap-fixdown-3' });

      let childIndex = currentIndex * 2;
      this.animationQueue.push({
        highlightedLine: 'Heap-fixdown-4',
        childIndex: childIndex,
        activateParent: this.h[currentIndex],
      });


      this.animationQueue.push({
        highlightedLine: 'Heap-fixdown-4',
        childIndex: childIndex,
        activateParent: this.h[currentIndex],
      });

      this.animationQueue.push({
        highlightedLine: 'Heap-fixdown-56',
        activateLeftAndRightChildren: [
          this.h[childIndex],
          this.h[childIndex + 1],
        ],
        leftChild: this.h[childIndex],
        rightChild: this.h[childIndex + 1],
      });

      this.animationQueue.push({
        highlightedLine: 'Heap-fixdown-7',
        deActivateParent: this.h[currentIndex],
        deActivateLeftAndRightChildren: [
          this.h[childIndex],
          this.h[childIndex + 1],
        ],
      });

      if (this.h[childIndex] > this.h[childIndex + 1]) {
        childIndex += 1;
        this.animationQueue.push({
          highlightedLine: 'Heap-fixdown-8',
          childIndex: childIndex,
        });
      }

      this.animationQueue.push({
        waitTime: 0,
        activateChildAndParent: [this.h[childIndex], this.h[currentIndex]],
      });

      this.animationQueue.push({
        highlightedLine: 'Heap-fixdown-9',
        removeActiveChildParent: [this.h[childIndex], this.h[currentIndex]],
        activatedLink: this.h[childIndex],
      });

      if (this.h[currentIndex] > this.h[childIndex]) {
        let temp = this.h[childIndex];
        this.h[childIndex] = this.h[currentIndex];
        this.h[currentIndex] = temp;

        this.animationQueue.push({
          highlightedLine: 'Heap-fixdown-10',

          heapA: [...this.h],
          swap: [this.h[currentIndex], this.h[childIndex]],
        });

        this.animationQueue.push({
          waitTime: 1000,
          deActivateLink: this.h[currentIndex],
        });

        currentIndex = childIndex;

        this.animationQueue.push({
          highlightedLine: 'Heap-fixdown-11',
          currentIndex: currentIndex,
        });
      } else {
        this.animationQueue.push({
          highlightedLine: 'Heap-fixdown-12',
        });
        break;
      }
      this.animationQueue.push({
        childIndex: null,
        leftChild: null,
        rightChild: null,
        waitTime: 0,
      });
    }
    this.animationQueue.push({
      currentIndex: null,
      waitTime: 0,
    });
  }

  convertHeapArrayToAdjList = (a) => {
    let adjList = {};

    for (let i = 1; i <= a[0]; i++) {
      let parent = a[i];
      if (adjList[parent]) {
        continue;
      }
      let leftChild = a[i * 2];
      let rightChild = a[i * 2 + 1];
      let children = [];
      if (leftChild) {
        children.push(leftChild);
      }
      if (rightChild) {
        children.push(rightChild);
      }
      adjList[parent] = children;
    }
    this.adjList = adjList;
    return this.adjList;
  };
  toggleClicked = (i) => {
    let a = this.state.clicked.slice();
    a[i] = !a[i];
    this.setState({
      clicked: a,
    });
  };
  activateLeftAndRightChildren(leftChild, rightChild) {
    let leftChildElement = document.getElementsByClassName(
      'node-' + leftChild
    )[0];
    if (leftChildElement) {
      leftChildElement.classList.add('left-right-child-node');
    }

    let rightChildElement = document.getElementsByClassName(
      'node-' + rightChild
    )[0];
    if (rightChildElement) {
      rightChildElement.classList.add('left-right-child-node');
    }
  }

  deActivateLeftAndRightChildren(leftChild, rightChild) {
    let leftChildElement = document.getElementsByClassName(
      'node-' + leftChild
    )[0];
    if (leftChildElement) {
      leftChildElement.classList.remove('left-right-child-node');
    }

    let rightChildElement = document.getElementsByClassName(
      'node-' + rightChild
    )[0];
    if (rightChildElement) {
      rightChildElement.classList.remove('left-right-child-node');
    }
  }

  activateParent(parent) {
    let parentElement = document.getElementsByClassName('node-' + parent)[0];
    if (parentElement) parentElement.classList.add('parent-node');
  }

  deActivateParent(parent) {
    let parentElement = document.getElementsByClassName('node-' + parent)[0];
    if (parentElement) parentElement.classList.remove('parent-node');
  }

  activateChildAndParent(child, parent) {
    let childElement = document.getElementsByClassName('node-' + child)[0];
    if (childElement) childElement.classList.add('child-node');
    let parentElement = document.getElementsByClassName('node-' + parent)[0];
    if (parentElement) parentElement.classList.add('parent-node');
  }

  removeActiveChildParent(child, parent) {
    let childElement = document.getElementsByClassName('node-' + child)[0];
    let parentElement = document.getElementsByClassName('node-' + parent)[0];
    let childLinkElement = document.getElementById(child + 'link');
    if (childElement) childElement.classList.remove('child-node');
    if (parentElement) parentElement.classList.remove('parent-node');
    if (childLinkElement) childLinkElement.classList.remove('fade-in-out-link');
  }

  activateLink(child) {
    let childLinkElement = document.getElementById(child + 'link');
    if (childLinkElement) childLinkElement.classList.add('fade-in-out-link');
  }
  deActivateLink(child) {
    let childLinkElement = document.getElementById(child + 'link');
    if (childLinkElement) childLinkElement.classList.remove('fade-in-out-link');
  }
  async checkPauseStatus() {
    while (this.state.pause && !this.state.stepMode) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
  }
  clearPseudocode() {
    for (let i = 1; i < 13; i++) {
      let insertEl = document.getElementById('Heap-insert-' + i);
      if (insertEl) insertEl.classList = '';
      let fixupEl = document.getElementById('Heap-fixup-' + i);
      if (fixupEl) fixupEl.classList = '';
      let removeRootEl = document.getElementById('Heap-removeRoot-' + i);
      if (removeRootEl) removeRootEl.classList = '';
      let fixdownEl = document.getElementById('Heap-fixdown-' + i);
      if (fixdownEl) fixdownEl.classList = '';
    }
  }

  formatInsertButtonText() {
    let linkText = '';
    if (this.state.inputList.includes(this.state.inputNum)) {
      linkText = 'No Duplicates';
    } else if (this.state.executing) {
      linkText = 'Executing...';
    } else {
      linkText = 'Insert';
    }
    return linkText;
  }

  renderHeapClassPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'Heap-class-1'}>
          1<span style={{ marginLeft: indentation(1) }}>Class Heap</span>
        </div>
        <div id={'Heap-class-2'}>
          2<span style={{ marginLeft: indentation(2) }}>let h be an array</span>
        </div>
        <div id={'Heap-class-3'}>
          3<span style={{ marginLeft: indentation(2) }}>let size be 0</span>
        </div>
        <div id={'Heap-class-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>
            let the first element of h always be size
          </span>
        </div>
        <br></br>
      </div>
    );
  }

  renderInsertPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'Heap-insert-1'}>
          1<span style={{ marginLeft: indentation(1) }}>Insert(element)</span>
        </div>
        <div id={'Heap-insert-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            let h[0] be size + 1
          </span>
        </div>
        <div id={'Heap-insert-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            insert element at end of h
          </span>
        </div>
        <div id={'Heap-insert-4'}>
          4<span style={{ marginLeft: indentation(2) }}>call fixUp()</span>
        </div>
        <br></br>
        <div id={'Heap-fixup-1'}>
          1<span style={{ marginLeft: indentation(2) }}>fixUp()</span>
        </div>
        <div id={'Heap-fixup-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            let currentIndex be size
          </span>
        </div>
        <div id={'Heap-fixup-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            while currentIndex {'>'} 0
          </span>
        </div>
        <div id={'Heap-fixup-4'}>
          4
          <span style={{ marginLeft: indentation(3) }}>
            let parentIndex be (currentIndex // 2)
          </span>
        </div>
        <div id={'Heap-fixup-5'}>
          5
          <span style={{ marginLeft: indentation(3) }}>
            if h[parentIndex] {'>'} h[currentIndex]
          </span>
        </div>
        <div id={'Heap-fixup-6'}>
          6
          <span style={{ marginLeft: indentation(4) }}>
            swap h[parentIndex] with h[currentIndex]
          </span>
        </div>
        <div id={'Heap-fixup-7'}>
          7
          <span style={{ marginLeft: indentation(4) }}>
            let currentIndex be parentIndex
          </span>
        </div>
        <div id={'Heap-fixup-8'}>
          8
          <span style={{ marginLeft: indentation(3) }}>
            else break out of loop
          </span>
        </div>
      </div>
    );
  }

  renderRemoveRootPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'Heap-removeRoot-1'}>
          1<span style={{ marginLeft: indentation(1) }}>removeRoot()</span>
        </div>
        <div id={'Heap-removeRoot-2'}>
          2<span style={{ marginLeft: indentation(2) }}>let min be h[1]</span>
        </div>
        <div id={'Heap-removeRoot-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            h[1] = largest node (removed from end of h)
          </span>
        </div>
        <div id={'Heap-removeRoot-4'}>
          4<span style={{ marginLeft: indentation(2) }}>h[0] = size - 1</span>
        </div>
        <div id={'Heap-removeRoot-5'}>
          5<span style={{ marginLeft: indentation(2) }}>fixDown()</span>
        </div>
        <div id={'Heap-removeRoot-6'}>
          6<span style={{ marginLeft: indentation(2) }}>return min</span>
        </div>
        <br></br>
        <div id={'Heap-fixdown-1'}>
          1<span style={{ marginLeft: indentation(1) }}>fixDown()</span>
        </div>
        <div id={'Heap-fixdown-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            let currentIndex be 1
          </span>
        </div>
        <div id={'Heap-fixdown-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            while (currentIndex * 2) {'<'} size
          </span>
        </div>
        <div id={'Heap-fixdown-4'}>
          4
          <span style={{ marginLeft: indentation(3) }}>
            let childIndex be currentIndex * 2
          </span>
        </div>
        <div id={'Heap-fixdown-56'}>
          <div>
            5
            <span style={{ marginLeft: indentation(3) }}>
              let leftChild be h[currentIndex]
            </span>
          </div>
          <div>
            6
            <span style={{ marginLeft: indentation(3) }}>
              let rightChild be h[currentIndex+1]
            </span>
          </div>
        </div>
        {/* <div id={'Heap-fixdown-6'}></div> */}
        <div id={'Heap-fixdown-7'}>
          7
          <span style={{ marginLeft: indentation(3) }}>
            if leftChild {'>'} rightChild
          </span>
        </div>
        <div id={'Heap-fixdown-8'}>
          8
          <span style={{ marginLeft: indentation(4) }}>
            let childIndex = childIndex + 1
          </span>
        </div>
        <div id={'Heap-fixdown-9'}>
          9
          <span style={{ marginLeft: indentation(3) }}>
            if h[currentIndex] {'>'} h[childIndex]
          </span>
        </div>
        <div id={'Heap-fixdown-10'}>
          10
          <span style={{ marginLeft: indentation(4) }}>
            swap h[currentIndex] with h[childIndex]
          </span>
        </div>
        <div id={'Heap-fixdown-11'}>
          11
          <span style={{ marginLeft: indentation(4) }}>
            {' '}
            currentIndex = childIndex
          </span>
        </div>
        <div id={'Heap-fixdown-12'}>
          12
          <span style={{ marginLeft: indentation(3) }}>
            else break out of loop
          </span>
        </div>
      </div>
    );
  }
  highlightLine(classId) {
    let el = document.getElementById(classId);
    if (el) el.classList.add('active-code-line');
  }
  removeHighlightedLine(classId) {
    let el = document.getElementById(classId);
    if (el) el.classList.remove('active-code-line');
  }
  render() {
    return (
      <div className={'row'}>
        <div className={'col-4'} id={'graph-container'}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label>Add a node:</label>

            <input
              style={{ width: '50px' }}
              type="text"
              value={this.state.inputNum}
              onChange={async (event) => {
                await this.setState({
                  inputNum: Number(event.target.value),
                });
              }}
            />
            <button
              type="submit"
              disabled={
                this.state.inputList.includes(Number(this.state.inputNum)) ||
                this.state.executing
              }
              onClick={async () => {
                this.setState({
                  removingRoot: false,
                  inserting: true,
                  pause: false,
                });
                await this.handleInsertButton();
                await this.renderAnimationQueue();
              }}
            >
              {this.formatInsertButtonText()}
            </button>
            <button
              disabled={this.state.heapA.length <= 1 || this.state.executing}
              onClick={async () => {
                this.setState({
                  removingRoot: true,
                  inserting: false,
                  pause: false,
                });
                await this.removeRoot();
                await this.renderAnimationQueue();
              }}
            >
              {this.state.executing ? 'Executing...' : 'Remove Root'}
            </button>
            <button
              disabled={this.state.executing}
              onClick={() => {
                this.buildSampleHeap();
              }}
            >
              {this.state.executing ? 'Executing...' : 'Sample Heap'}
            </button>
            <button
              className="graph-button"
              onClick={() => {
                this.setState({ pause: !this.state.pause, stepMode: false });
              }}
            >
              {this.state.pause ? <FaPlay /> : <FaPause />}
            </button>
            <button
              disabled={this.state.executing}
              onClick={() => {
                this.clearHeap();
              }}
            >
              {this.state.executing ? 'Executing...' : 'Clear'}
            </button>

            <label>
              Step:{' '}
              <button
                onClick={async () => {
                  let newStepIndex = this.state.stepIndex - 1;
                  while (
                    newStepIndex >= 0 &&
                    !this.state.animationQueue[newStepIndex].highlightedLine
                  ) {
                    newStepIndex -= 1;
                  }
                  await this.setState({
                    stepIndex: newStepIndex,
                    pause: true,
                    stepMode: true,
                  });
                }}
              >
                <FaStepBackward />
              </button>
              <button
                onClick={async () => {
                  let newStepIndex = this.state.stepIndex + 1;
                  while (
                    newStepIndex < this.state.animationQueue.length &&
                    !this.state.animationQueue[newStepIndex].highlightedLine
                  ) {
                    newStepIndex += 1;
                  }
                  await this.setState({
                    stepIndex: newStepIndex,
                    pause: true,
                    stepMode: true,
                  });
                }}
              >
                <FaStepForward />
              </button>
            </label>
            <label>
              Speed:
              <input
                style={{ width: '50px' }}
                type="number"
                value={this.state.speed}
                onChange={(event) => {
                  event.preventDefault();
                  this.setState({
                    speed: event.target.value,
                  });
                }}
              />
            </label>
          </form>
        </div>
        <div className={'col-4'}>
          <div className={'row'}>
            {this.renderHeapClassPseudocode()}
            {this.state.inserting ? this.renderInsertPseudocode() : ''}
            {this.state.removingRoot ? this.renderRemoveRootPseudocode() : ''}
          </div>
        </div>
        <div className={'col-4'}>
          <div className={'row'}>
            <Sidebar showButton={true}>
              <li> size = {this.state.size} </li>
              {this.state.newElement ? (
                <li> element = {this.state.newElement} </li>
              ) : (
                ''
              )}
              {this.state.removedRoot ? (
                <li> min = {this.state.removedRoot} </li>
              ) : (
                ''
              )}

              {this.state.currentIndex ? (
                <li> currentIndex = {this.state.currentIndex} </li>
              ) : (
                ''
              )}

              {this.state.parentIndex ? (
                <li> parentIndex = {this.state.parentIndex} </li>
              ) : (
                ''
              )}
              {this.state.childIndex ? (
                <li> childIndex = {this.state.childIndex} </li>
              ) : (
                ''
              )}

              {this.state.leftChild ? (
                <li> leftChild = {this.state.leftChild} </li>
              ) : (
                ''
              )}
              {this.state.rightChild ? (
                <li> rightChild = {this.state.rightChild} </li>
              ) : (
                ''
              )}

              <li onClick={() => this.toggleClicked(0)}>
                <RenderListComponent
                  list={this.state.heapA}
                  listName={'h'}
                  clicked={this.state.clicked[0]}
                />
              </li>
              <li onClick={() => this.toggleClicked(1)}>
                <RenderListComponent
                  list={this.state.inputList}
                  listName={'inputList'}
                  clicked={this.state.clicked[1]}
                />
              </li>
            </Sidebar>
          </div>
        </div>
      </div>
    );
  }
}

export default Heap;

// renderHeapTableData() {
//   return this.state.heapA.map((node, i) => {
//     return (
//       <td key={i} style={{ backgroundColor: i === 1 ? 'yellow' : '' }}>
//         {node}
//       </td>
//     );
//   });
// }

// renderHeapHeading() {
//   return (
//     <tr>
//       <th>size</th>
//     </tr>
//   );
// }

// renderInputListTableData() {
//   return this.state.inputList.map((node) => {
//     return <td key={node}>{node}</td>;
//   });
// }

/* <div className={'row'}>
            <h4>Heap Array</h4>
          </div>
          <div className={'row'}>
            <table id={'heap-table'} className={'float-left'}>
              <tbody>
                {this.renderHeapHeading()}
                <tr>{this.renderHeapTableData()}</tr>
              </tbody>
            </table>
          </div>
          <div className={'row'}>
            <h5 id={'root-extracted'}> </h5>
          </div>
          <div className={'row'}>
            <h4>Input List</h4>
          </div>
          <div className={'row'}>
            <table id={'input-list-table'} className={'float-left'}>
              <tbody>
                <tr>{this.renderInputListTableData()}</tr>
              </tbody>
            </table>
          </div> */
