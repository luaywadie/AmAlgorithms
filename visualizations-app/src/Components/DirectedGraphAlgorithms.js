import React, { Component } from 'react';
import topSort from '../algorithms/graph-algorithms/topsort';
import createDirectedGraph from '../graph-builder/directed-graph-builder';

class DirectedGraphAlgorithms extends Component {
  adjList;
  outputEl;
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      ordering: [],
    };
    this.adjList = {
      a: ['b', 'f'],
      b: ['h'],
      c: [],
      d: ['a', 'e', 'i'],
      e: ['i'],
      f: [],
      g: ['a', 'b', 'c'],
      h: [],
      i: ['f'],
      j: ['e'],
    };
    this.graph = document.getElementById('tree-img');
    this.outputEl = document.getElementById('output');
    this.outputEl.style.fontSize = '20px';
    this.outputEl.style.textAlign = 'center';
  }
  componentDidMount() {
    createDirectedGraph();
    createOrderTable(this.adjList, this.outputEl);
  }

  componentWillUnmount() {
    let svg = document.getElementById('dir-graph-svg');
    if (this.graph.hasChildNodes()) this.graph.removeChild(svg);
    document.getElementById('output').innerHTML = '';
    this.reset();
  }
  getOrdering = async (stack) => {
    await this.setState({ ordering: stack });
    if (this.outputEl.innerHTML !== '') {
      updateOrderTable(this.state.ordering, Object.keys(this.adjList).length);
    }
  };

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let el = document.getElementById(e);
      if (el) el.classList = '';
    });
    if (this.outputEl.innerHTML !== '') {
      clearOrderTable(Object.keys(this.adjList).length);
    }
  };

  render() {
    return (
      <div>
        <button
          className="graph-button"
          onClick={() => {
            this.setState({ pause: false, stop: false });
            this.reset();
            topSort(
              this.adjList,
              this.getPauseStatus,
              this.getStopStatus,
              this.getSpeedRequest,
              this.getOrdering
            );
          }}
        >
          Topological Sort
        </button>

        <button
          className="graph-button"
          onClick={() => {
            this.setState({ pause: false, stop: true });
            this.reset();
          }}
        >
          Reset
        </button>
        <button
          className="graph-button"
          onClick={() => {
            this.setState({ pause: !this.state.pause });
          }}
        >
          {this.state.pause ? 'UnPause' : 'Pause'}
        </button>

        <form onSubmit={(event) => event.preventDefault()}>
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
    );
  }
}

export default DirectedGraphAlgorithms;

function createOrderTable(adjList, outputEl) {
  let table = document.createElement('table');
  table.setAttribute('id', 'order-table');
  table.setAttribute('class', 'order-table');
  outputEl.appendChild(table);

  let tBody = document.createElement('tBody');
  let orderTh = document.createElement('th');
  orderTh.appendChild(document.createTextNode('Potential Ordering'));
  let tr = document.createElement('tr');
  tr.appendChild(orderTh);
  tBody.appendChild(tr);

  for (let i = 0; i < Object.keys(adjList).length; i++) {
    tr = document.createElement('tr');
    tr.setAttribute('id', 'row' + i);
    let nodeTd = document.createElement('td');
    nodeTd.appendChild(document.createTextNode('?'));
    tr.appendChild(nodeTd);
    tBody.appendChild(tr);
  }
  table.appendChild(tBody);
}

function updateOrderTable(stack, size) {
  for (let i = size - 1; i >= size - stack.length; i--) {
    let row = document.getElementById('row' + i);
    let td = row.getElementsByTagName('td');
    if (td[0].innerText === '?') {
      td[0].innerHTML = stack[0];
      td[0].className = 'updated-value';
    }
  }
}

function clearOrderTable(size) {
  for (let i = 0; i < size; i++) {
    let row = document.getElementById('row' + i);
    let td = row.getElementsByTagName('td');
    td[0].innerHTML = '?';
  }
}
