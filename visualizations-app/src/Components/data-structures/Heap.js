import React, { Component } from 'react';
import insertIntoDynamicTree from '../../graph-builders/dynamic-tree-builder';
class Heap extends Component {
  constructor(props) {
    super(props);
    // a = [8, 3, 12, 5, 1, 6, 2, 9, 4, 7]
    this.h = [0];
    this.size = 0;
    this.state = {
      inputList: [],
      heapA: [0],
      inputNum: '',
    };
    this.adjList = {};
    this.dataStructure = document.getElementById('graph-container');
  }

  async insert(e) {
    this.h[0] = ++this.size;
    this.h[this.size] = e;
    await this.setState({ heapA: this.h });

    this.convertHeapArrayToAdjList(this.h);
    if (this.size !== 1) {
      insertIntoDynamicTree.insertIntoDynamicTree(this.h[1], this.adjList);
    }

    this.fixUp();
  }
  async fixUp() {
    let pos = this.size;
    while (pos > 1) {
      let parent = Math.floor(pos / 2);
      await new Promise((r) => setTimeout(r, 1000));
      this.activateChildParentAndLink(this.h[pos], this.h[parent]);
      await new Promise((r) => setTimeout(r, 2000));
      this.removeActiveChildParentAndLink(this.h[pos], this.h[parent]);

      if (this.h[parent] > this.h[pos]) {
        insertIntoDynamicTree.swap(this.h[parent], this.h[pos]);
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

  activateChildParentAndLink(child, parent) {
    let childElement = document.getElementsByClassName('node-' + child)[0];
    childElement.classList.add('child-node');
    let parentElement = document.getElementsByClassName('node-' + parent)[0];
    parentElement.classList.add('parent-node');
    let childLinkElement = document.getElementById(child + 'link');
    childLinkElement.classList.add('fade-in-out-link');
  }

  removeActiveChildParentAndLink(child, parent) {
    let childElement = document.getElementsByClassName('node-' + child)[0];
    let parentElement = document.getElementsByClassName('node-' + parent)[0];
    let childLinkElement = document.getElementById(child + 'link');

    childElement.classList.remove('child-node');
    parentElement.classList.remove('parent-node');
    childLinkElement.classList.remove('fade-in-out-link');
  }

  getArray() {
    let a = [];
    for (let i = 1; i <= this.size; i++) {
      a.push(this.h[i] + ': ' + this.h[i]);
    }
    return a;
  }

  componentDidMount = () => {
    if (this.state.inputList.length !== 0) {
      this.buildHeap();
      insertIntoDynamicTree.createDynamicTree(this.adjList);
    }
  };

  componentWillUnmount() {
    let svg = document.getElementById('heap-tree-svg');
    if (this.dataStructure.hasChildNodes()) this.dataStructure.removeChild(svg);
  }

  buildHeap = () => {
    for (let e of this.state.inputList) {
      this.insert(e);
    }
    this.convertHeapArrayToAdjList(this.h);
  };

  updateMyComponent = async () => {
    await this.setState({
      inputList: [...this.state.inputList, Number(this.state.inputNum)],
    });
    if (this.state.inputList.length === 1) {
      this.buildHeap();
      insertIntoDynamicTree.createDynamicTree(this.adjList);
    } else {
      this.insert(this.state.inputNum);
    }
    this.setState({ inputNum: '' });
  };

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

  render() {
    return (
      <div className={'row'}>
        <div className={'col-6'}>
          <form
            onSubmit={(event) => {
              this.updateMyComponent();
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
                  this.state.inputList.filter(
                    (x) => x === Number(this.state.inputNum)
                  ).length > 0
                }
              >
                {this.state.inputList.filter(
                  (x) => x === Number(this.state.inputNum)
                ).length > 0
                  ? 'no duplicates'
                  : 'add a node'}
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

// module.exports = { Heap_DS_Helper };

// class Heap_DS_Helper {
//   constructor() {
//     this.h = [0];
//     this.size = 0;
//   }
//   insert(e) {
//     this.h[0] = ++this.size;
//     this.h[this.size] = e;
//     this.fixUp();
//   }
//   fixUp() {
//     let pos = this.size;
//     while (pos > 1) {
//       let parent = Math.floor(pos / 2);
//       if (this.h[parent] > this.h[pos]) {

//         let temp = this.h[parent];
//         this.h[parent] = this.h[pos];
//         this.h[pos] = temp;
//         pos = parent;
//       } else {
//         break;
//       }
//     }
//   }

//   removeRoot() {
//     let smallest = this.h;
//     this.h[1] = this.h.pop();
//     this.h[0] = --this.size;
//     this.fixDown();
//     return smallest;
//   }
//   fixDown() {
//     let pos = 1;
//     while (pos * 2 < this.size) {
//       let child = pos * 2;
//       if (this.h[child] > this.h[child + 1]) {
//         child += 1;
//       }
//       if (this.h[pos] > this.h[child]) {
//         let temp = this.h[child];
//         this.h[child] = this.h[pos];
//         this.h[pos] = temp;
//         pos = child;
//       } else {
//         break;
//       }
//     }
//   }

//   getArray() {
//     let a = [];
//     for (let i = 1; i <= this.size; i++) {
//       a.push(this.h[i] + ': ' + this.h[i]);
//     }
//     return a;
//   }

//   heapSort() {
//     let a = [];
//     let its = this.h;
//     for (let i = 0; i < its; i++) {
//       a.push(this.removeRoot());
//     }
//     console.log(a);
//     return a;
//   }
// }
