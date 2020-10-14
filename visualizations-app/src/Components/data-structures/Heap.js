import React, { Component } from 'react';
import {
  insertIntoDynamicTree,
  swap,
  createDynamicTree,
  removeRootOfDynamicTree,
  clearTree,
} from '../../graph-builders/dynamic-tree-builder';

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
    };
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
    if (this.dataStructure.hasChildNodes()) this.dataStructure.removeChild(svg);
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
    await this.setState({ inputList: [], heapA: [0] });
    this.h = [0];
    this.setState({ size: 0 });
    this.adjList = {};
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
    this.setState({ executing: false });
  };

  toggleClicked = (i) => {
    let a = this.state.clicked.slice();
    a[i] = !a[i];
    this.setState({
      clicked: a,
    });
  };

  async insert(e) {
    this.setState({ newElement: e });
    this.highlightLine('Heap-insert-1');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-insert-1');

    this.highlightLine('Heap-insert-2');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-insert-2');

    this.setState({ size: this.state.size + 1 });
    this.h[0] = this.state.size;

    this.highlightLine('Heap-insert-3');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-insert-3');
    this.h[this.state.size] = e;
    await this.setState({ heapA: this.h });

    this.convertHeapArrayToAdjList(this.h);
    if (this.state.size !== 1) {
      insertIntoDynamicTree(this.h[1], this.adjList);
    }

    this.highlightLine('Heap-insert-4');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    await this.fixUp();
    this.removeHighlightedLine('Heap-insert-4');
    this.setState({ newElement: null });
  }
  async fixUp() {
    this.highlightLine('Heap-fixup-1');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-fixup-1');

    this.highlightLine('Heap-fixup-2');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-fixup-2');
    let pos = this.state.size;
    this.setState({ currentIndex: pos });
    if (pos <= 1) {
      this.highlightLine('Heap-fixup-3');
      await new Promise((r) => setTimeout(r, 1000));
      if (this.unMounting) return;
      this.removeHighlightedLine('Heap-fixup-3');
    }
    while (pos > 1) {
      // Check when inserting into an empty boy
      this.highlightLine('Heap-fixup-3');
      await new Promise((r) => setTimeout(r, 1000));
      if (this.unMounting) return;
      this.removeHighlightedLine('Heap-fixup-3');

      let parent = Math.floor(pos / 2);
      this.highlightLine('Heap-fixup-4');
      await new Promise((r) => setTimeout(r, 1000));
      if (this.unMounting) return;
      this.removeHighlightedLine('Heap-fixup-4');
      this.setState({ parentIndex: parent });

      this.highlightLine('Heap-fixup-5');
      this.activateChildAndParent(this.h[pos], this.h[parent]);
      await new Promise((r) => setTimeout(r, 1000));
      if (this.unMounting) return;
      await new Promise((r) => setTimeout(r, 1000));
      if (this.unMounting) return;
      this.removeHighlightedLine('Heap-fixup-5');
      this.removeActiveChildParent(this.h[pos], this.h[parent]);

      if (this.h[parent] > this.h[pos]) {
        this.activateLink(this.h[pos]);

        this.highlightLine('Heap-fixup-6');
        await new Promise((r) => setTimeout(r, 1000));
        if (this.unMounting) return;
        this.removeHighlightedLine('Heap-fixup-6');

        swap(this.h[parent], this.h[pos]);
        let temp = this.h[parent];
        this.h[parent] = this.h[pos];
        this.h[pos] = temp;
        await this.setState({ heapA: this.h });

        this.highlightLine('Heap-fixup-7');
        await new Promise((r) => setTimeout(r, 1000));
        if (this.unMounting) return;
        this.removeHighlightedLine('Heap-fixup-7');

        this.deActivateLink(this.h[pos]);

        pos = parent;
        this.setState({ currentIndex: pos });
      } else {
        this.highlightLine('Heap-fixup-8');
        await new Promise((r) => setTimeout(r, 1000));
        if (this.unMounting) return;
        this.removeHighlightedLine('Heap-fixup-8');
        break;
      }
      this.setState({ parentIndex: null });
    }
    this.setState({ currentIndex: null, parentIndex: null });
  }

  async removeRoot() {
    await this.setState({ executing: true });

    this.highlightLine('Heap-removeRoot-1');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-removeRoot-1');

    this.highlightLine('Heap-removeRoot-2');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-removeRoot-2');
    let smallest = this.h[1];
    this.setState({ removedRoot: smallest });

    this.highlightLine('Heap-removeRoot-3');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-removeRoot-3');
    this.h[1] = this.h.pop();
    this.setState({ heapA: this.h });

    this.highlightLine('Heap-removeRoot-4');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-removeRoot-4');
    this.setState({ size: this.state.size - 1 });
    this.h[0] = this.state.size;

    let updatedList = this.state.inputList.filter((e) => e !== smallest);
    if (this.state.size === 0) {
      this.h = this.h.slice(0, 1);
    }
    await this.setState({ heapA: this.h, inputList: updatedList });

    document.getElementById('root-extracted').innerHTML =
      'Root Extracted: ' + smallest;

    this.highlightLine('Heap-removeRoot-5');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    if (this.state.size === 0) {
      clearTree();
    } else {
      this.convertHeapArrayToAdjList(this.h);
      removeRootOfDynamicTree(this.h[1], this.adjList);
      await this.fixDown();
    }

    this.removeHighlightedLine('Heap-removeRoot-5');
    if (this.unMounting) return;
    this.highlightLine('Heap-removeRoot-6');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-removeRoot-6');
    await this.setState({ executing: false, removedRoot: null });
    return smallest;
  }
  async fixDown() {
    this.highlightLine('Heap-fixdown-1');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-fixdown-1');

    this.highlightLine('Heap-fixdown-2');
    await new Promise((r) => setTimeout(r, 1000));
    if (this.unMounting) return;
    this.removeHighlightedLine('Heap-fixdown-2');

    let pos = 1;
    this.setState({ currentIndex: pos });

    if (pos * 2 > this.state.size) {
      this.highlightLine('Heap-fixdown-3');
      await new Promise((r) => setTimeout(r, 1000));
      if (this.unMounting) return;
      this.removeHighlightedLine('Heap-fixdown-3');
    }
    while (pos * 2 <= this.state.size) {
      this.highlightLine('Heap-fixdown-3');
      await new Promise((r) => setTimeout(r, 1000));
      if (this.unMounting) return;
      this.removeHighlightedLine('Heap-fixdown-3');

      this.highlightLine('Heap-fixdown-4');
      await new Promise((r) => setTimeout(r, 1000));
      if (this.unMounting) return;
      this.removeHighlightedLine('Heap-fixdown-4');

      let child = pos * 2;
      this.setState({ childIndex: child });

      this.activateParent(this.h[pos]);

      this.highlightLine('Heap-fixdown-5');
      this.highlightLine('Heap-fixdown-6');
      this.activateLeftAndRightChildren(this.h[child], this.h[child + 1]);
      await new Promise((r) => setTimeout(r, 2000));
      if (this.unMounting) return;
      this.removeHighlightedLine('Heap-fixdown-5');
      this.removeHighlightedLine('Heap-fixdown-6');

      this.setState({
        leftChild: this.h[child],
        rightChild: this.h[child + 1],
      });

      this.deActivateParent(this.h[pos]);
      this.deActivateLeftAndRightChildren(this.h[child], this.h[child + 1]);

      this.highlightLine('Heap-fixdown-7');
      await new Promise((r) => setTimeout(r, 1000));
      if (this.unMounting) return;
      this.removeHighlightedLine('Heap-fixdown-7');

      if (this.h[child] > this.h[child + 1]) {
        this.highlightLine('Heap-fixdown-8');
        await new Promise((r) => setTimeout(r, 1000));
        if (this.unMounting) return;
        this.removeHighlightedLine('Heap-fixdown-8');
        child += 1;
      }

      this.activateChildAndParent(this.h[child], this.h[pos]);

      this.highlightLine('Heap-fixdown-9');
      await new Promise((r) => setTimeout(r, 2000));
      if (this.unMounting) return;
      this.removeHighlightedLine('Heap-fixdown-9');

      this.removeActiveChildParent(this.h[child], this.h[pos]);

      if (this.h[pos] > this.h[child]) {
        this.activateLink(this.h[child]);
        this.highlightLine('Heap-fixdown-10');
        await new Promise((r) => setTimeout(r, 2000));
        if (this.unMounting) return;

        this.removeHighlightedLine('Heap-fixdown-10');

        this.deActivateLink(this.h[child]);

        swap(this.h[pos], this.h[child]);
        let temp = this.h[child];
        this.h[child] = this.h[pos];
        this.h[pos] = temp;
        await this.setState({ heapA: this.h });

        this.highlightLine('Heap-fixdown-11');
        await new Promise((r) => setTimeout(r, 1000));
        if (this.unMounting) return;
        this.removeHighlightedLine('Heap-fixdown-11');
        pos = child;
        this.setState({ currentIndex: pos });
      } else {
        this.highlightLine('Heap-fixdown-12');
        await new Promise((r) => setTimeout(r, 1000));
        if (this.unMounting) return;
        this.removeHighlightedLine('Heap-fixdown-12');
        break;
      }
      this.setState({ childIndex: null, leftChild: null, rightChild: null });
    }
    this.setState({ currentIndex: null });
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
    parentElement.classList.add('parent-node');
  }

  deActivateParent(parent) {
    let parentElement = document.getElementsByClassName('node-' + parent)[0];
    parentElement.classList.remove('parent-node');
  }

  activateChildAndParent(child, parent) {
    let childElement = document.getElementsByClassName('node-' + child)[0];
    childElement.classList.add('child-node');
    let parentElement = document.getElementsByClassName('node-' + parent)[0];
    parentElement.classList.add('parent-node');
  }

  removeActiveChildParent(child, parent) {
    let childElement = document.getElementsByClassName('node-' + child)[0];
    let parentElement = document.getElementsByClassName('node-' + parent)[0];
    let childLinkElement = document.getElementById(child + 'link');

    childElement.classList.remove('child-node');
    parentElement.classList.remove('parent-node');
    childLinkElement.classList.remove('fade-in-out-link');
  }

  activateLink(child) {
    let childLinkElement = document.getElementById(child + 'link');
    childLinkElement.classList.add('fade-in-out-link');
  }
  deActivateLink(child) {
    let childLinkElement = document.getElementById(child + 'link');
    childLinkElement.classList.remove('fade-in-out-link');
  }

  renderHeapTableData() {
    return this.state.heapA.map((node, i) => {
      return (
        <td key={i} style={{ backgroundColor: i === 1 ? 'yellow' : '' }}>
          {node}
        </td>
      );
    });
  }

  renderHeapHeading() {
    return (
      <tr>
        <th>size</th>
      </tr>
    );
  }

  renderInputListTableData() {
    return this.state.inputList.map((node) => {
      return <td key={node}>{node}</td>;
    });
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
        <div id={'Heap-fixdown-5'}>
          5
          <span style={{ marginLeft: indentation(3) }}>
            let leftChild be h[currentIndex]
          </span>
        </div>
        <div id={'Heap-fixdown-6'}>
          6
          <span style={{ marginLeft: indentation(3) }}>
            let rightChild be h[currentIndex+1]
          </span>
        </div>
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
    document.getElementById(classId).classList.add('active-code-line');
  }
  removeHighlightedLine(classId) {
    document.getElementById(classId).classList.remove('active-code-line');
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
              onClick={() => {
                this.setState({ removingRoot: false, inserting: true });
                this.handleInsertButton();
              }}
            >
              {this.formatInsertButtonText()}
            </button>
            <button
              disabled={this.state.heapA.length <= 1 || this.state.executing}
              onClick={() => {
                this.setState({ removingRoot: true, inserting: false });
                this.removeRoot();
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
              disabled={this.state.executing}
              onClick={() => {
                this.clearHeap();
              }}
            >
              {this.state.executing ? 'Executing...' : 'Clear'}
            </button>
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
          </div>

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
