import React, { Component } from 'react';
import createDynamicTree from '../../graph-builders/dynamic-tree-builder';
// const { Heap } = require('../../data-structures/Heap.js');

class HeapComponent extends Component {
  constructor(props) {
    super(props);
    this.dataStructure = document.getElementById('graph-container');
    this.state = {
      inputList: [34, 57, 77, 81, 83, 84, 33, 93],
      inputNum: null,
    };
    this.adjList = {};
  }

  componentDidMount = () => {
    this.buildHeap();
    createDynamicTree(this.adjList);
  };

  buildHeap = () => {
    if (this.heap) {
      this.heap.h = [0];
      this.heap.size = 0;
    } else {
      this.heap = new Heap();
    }
    for (let e of this.state.inputList) {
      this.heap.insert(e);
    }
    this.convertHeapArrayToAdjList(this.heap.h);
  };

  componentDidUpdate() {
    let svg = document.getElementById('tree-svg');
    if (this.dataStructure.hasChildNodes()) this.dataStructure.removeChild(svg);
    this.buildHeap();

    createDynamicTree(this.adjList);
  }

  convertHeapArrayToAdjList = (a) => {
    let adjList = {};
    for (let i = 1; i <= a[0]; i++) {
      let leftChild = a[i * 2];
      let rightChild = a[i * 2 + 1];
      if (leftChild && rightChild) {
        adjList[a[i]] = [leftChild, rightChild];
      } else if (leftChild && !rightChild) {
        adjList[a[i]] = [leftChild];
      } else if (!leftChild && rightChild) {
        adjList[a[i]] = [rightChild];
      } else {
        adjList[a[i]] = [];
      }
    }
    this.adjList = adjList;
  };

  render() {
    return (
      <div>
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
              onChange={(event) => {
                this.setState({
                  inputList: [
                    ...this.state.inputList,
                    Number(event.target.value),
                  ],
                });
              }}
            />
          </label>
        </form>
      </div>
    );
  }
}

export default HeapComponent;

class Heap {
  constructor() {
    this.h = [0];
    this.size = 0;
  }
  insert(e) {
    this.h[0] = ++this.size;
    this.h[this.size] = e;
    this.fixUp();
  }
  fixUp() {
    let pos = this.size;
    while (pos > 1) {
      let parent = Math.floor(pos / 2);
      if (this.h[parent] > this.h[pos]) {
        let temp = this.h[parent];
        this.h[parent] = this.h[pos];
        this.h[pos] = temp;
        pos = parent;
      } else {
        break;
      }
    }
  }

  removeRoot() {
    let smallest = this.h;
    this.h[1] = this.h.pop();
    this.h[0] = --this.size;
    this.fixDown();
    return smallest;
  }
  fixDown() {
    let pos = 1;
    while (pos * 2 < this.size) {
      let child = pos * 2;
      if (this.h[child] > this.h[child + 1]) {
        child += 1;
      }
      if (this.h[pos] > this.h[child]) {
        let temp = this.h[child];
        this.h[child] = this.h[pos];
        this.h[pos] = temp;
        pos = child;
      } else {
        break;
      }
    }
  }

  getArray() {
    let a = [];
    for (let i = 1; i <= this.size; i++) {
      a.push(this.h[i] + ': ' + this.h[i]);
    }
    return a;
  }

  heapSort() {
    let a = [];
    let its = this.h;
    for (let i = 0; i < its; i++) {
      a.push(this.removeRoot());
    }
    console.log(a);
    return a;
  }
}
// module.exports = { Heap };

// let a = {
//   34: [57, 77],
//   57: [81, 83],
//   77: [84, 90],
//   81: [93],
//   83: [],
//   84: [],
//   90: [],
// }
