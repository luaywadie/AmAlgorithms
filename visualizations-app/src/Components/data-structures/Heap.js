import React, { Component } from 'react';
import {
  insertIntoDynamicTree,
  swap,
  createDynamicTree,
  removeRootOfDynamicTree,
  clearTree,
} from '../../graph-builders/dynamic-tree-builder';

class Heap extends Component {
  constructor(props) {
    super(props);
    this.sample = [9, 11, 24, 13, 35, 25, 61, 17, 48, 91];
    this.h = [0];
    this.size = 0;
    this.state = {
      inputList: [],
      heapA: [0],
      inputNum: '',
      executing: false,
    };
    this.adjList = {};
    this.dataStructure = document.getElementById('graph-container');
  }

  componentDidMount = () => {
    if (this.state.inputList.length === 0) {
      this.buildSampleHeap();
    }
  };

  componentWillUnmount() {
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
    this.size = this.sample[0];
    this.convertHeapArrayToAdjList(this.h);
    insertIntoDynamicTree(this.h[1], this.adjList);
  }

  async clearHeap() {
    await this.setState({ inputList: [], heapA: [0] });
    this.h = [0];
    this.size = 0;
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
    if (this.state.inputList.length === 1) {
      this.state.inputList.forEach((e) => this.insert(e));
      this.convertHeapArrayToAdjList(this.h);
      createDynamicTree(this.adjList);
    } else {
      await this.insert(newNode);
    }
    this.setState({ executing: false });
  };

  async insert(e) {
    this.h[0] = ++this.size;
    this.h[this.size] = e;
    await this.setState({ heapA: this.h });

    this.convertHeapArrayToAdjList(this.h);
    if (this.size !== 1) {
      insertIntoDynamicTree(this.h[1], this.adjList);
    }
    await this.fixUp();
  }
  async fixUp() {
    let pos = this.size;
    while (pos > 1) {
      let parent = Math.floor(pos / 2);
      await new Promise((r) => setTimeout(r, 2000));
      this.activateChildAndParent(this.h[pos], this.h[parent]);
      await new Promise((r) => setTimeout(r, 2000));
      this.removeActiveChildParent(this.h[pos], this.h[parent]);

      if (this.h[parent] > this.h[pos]) {
        this.activateLink(this.h[pos]);
        await new Promise((r) => setTimeout(r, 1000));
        this.deActivateLink(this.h[pos]);

        swap(this.h[parent], this.h[pos]);
        let temp = this.h[parent];
        this.h[parent] = this.h[pos];
        this.h[pos] = temp;
        pos = parent;
        await this.setState({ heapA: this.h });
      } else {
        break;
      }
    }
  }

  async removeRoot() {
    await this.setState({ executing: true });

    let smallest = this.h[1];

    this.h[1] = this.h.pop();
    this.h[0] = --this.size;

    let updatedList = this.state.inputList.filter((e) => e !== smallest);
    if (this.size === 0) {
      this.h = this.h.slice(0, 1);
    }
    await this.setState({ heapA: this.h, inputList: updatedList });

    document.getElementById('root-extracted').innerHTML =
      'Root Extracted: ' + smallest;

    if (this.size === 0) {
      clearTree();
    } else {
      this.convertHeapArrayToAdjList(this.h);
      removeRootOfDynamicTree(this.h[1], this.adjList);
      await this.fixDown();
    }

    await this.setState({ executing: false });
    return smallest;
  }
  async fixDown() {
    let pos = 1;
    while (pos * 2 <= this.size) {
      let child = pos * 2;
      this.activateParent(this.h[pos]);
      this.activateLeftAndRightChildren(this.h[child], this.h[child + 1]);
      await new Promise((r) => setTimeout(r, 2000));
      this.deActivateParent(this.h[pos]);
      this.deActivateLeftAndRightChildren(this.h[child], this.h[child + 1]);

      if (this.h[child] > this.h[child + 1]) {
        child += 1;
      }
      await new Promise((r) => setTimeout(r, 500));
      this.activateChildAndParent(this.h[child], this.h[pos]);
      await new Promise((r) => setTimeout(r, 2000));
      this.removeActiveChildParent(this.h[child], this.h[pos]);

      if (this.h[pos] > this.h[child]) {
        this.activateLink(this.h[child]);
        await new Promise((r) => setTimeout(r, 1000));
        this.deActivateLink(this.h[child]);

        swap(this.h[pos], this.h[child]);
        let temp = this.h[child];
        this.h[child] = this.h[pos];
        this.h[pos] = temp;
        pos = child;
        await this.setState({ heapA: this.h });
      } else {
        break;
      }
    }
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

  render() {
    return (
      <div className={'row'}>
        <div className={'col-6'}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label>
              Add a node:
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
                onClick={() => this.handleInsertButton()}
              >
                {this.formatInsertButtonText()}
              </button>
              <button
                disabled={this.state.heapA.length <= 1 || this.state.executing}
                onClick={() => {
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
            </label>
          </form>
        </div>
        <div className={'col-6'}>
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
            <h4 id={'root-extracted'}></h4>
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
        </div>
      </div>
    );
  }
}

export default Heap;
