import React, { Component } from 'react';
import Topsort from './algorithms/graph-algorithms/Topsort';
import createDirectedGraph from '../graph-builders/directed-graph-builder';
import Sidebar from './sidebar/Sidebar';
import RenderListComponent from './sidebar/RenderListComponent';
import RenderObjectComponent from './sidebar/RenderObjectComponent';
class DirectedGraphAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      ordering: null,
      runningAlg: '',
      neighbor: null,
      node: null,
      visited: null,
      stack: null,
      clicked: [false, false, false, false, false],
      callStack: [],
    };
    this.adjList = {
      a: ['g', 'c', 'b'],
      b: ['f'],
      c: [],
      d: ['g', 'e', 'b'],
      e: ['b'],
      f: [],
      g: ['i', 'f'],
      h: [],
      i: ['h'],
      j: ['e'],
    };
  }
  componentDidMount() {
    createDirectedGraph();
    this.graph = document.getElementById('graph-container');
  }

  componentWillUnmount() {
    let svg = document.getElementById('dir-graph-svg');
    if (this.graph.hasChildNodes()) this.graph.removeChild(svg);
    this.reset();
  }
  getOrdering = (ord) => {
    this.setState({ ordering: ord });
  };
  setRunningAlg = (alg) => {
    this.reset();
    this.setState({ runningAlg: alg });
  };
  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;
  toggleClicked = (i) => {
    let a = this.state.clicked.slice();
    a[i] = !a[i];
    this.setState({
      clicked: a,
    });
  };
  updateVisited = (V) => {
    this.setState({ visited: V });
  };
  updateNeighbor = (neighbor) => {
    this.setState({ neighbor });
  };

  updateNode = (node) => {
    this.setState({ node });
  };

  updateStack = (stack) => {
    this.setState({ stack });
  };

  updateCallStack = (callStack) => {
    this.setState({ callStack });
  };

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let el = document.getElementById(e);
      if (el) el.classList = '';

      for (let i = 1; i < 9; i++) {
        let pseduoTopsortElements = document.getElementById('topsort-' + i);
        if (pseduoTopsortElements) pseduoTopsortElements.classList = '';
      }
      for (let i = 1; i < 13; i++) {
        let pseduoTopsortElements = document.getElementById(
          'topsort-visit-' + i
        );
        if (pseduoTopsortElements) pseduoTopsortElements.classList = '';
      }
    });

    this.setState({
      ordering: null,
      node: null,
      neighbor: null,
      stack: null,
      visited: null,
      callStack: [],
    });
    if (this.state.stop) {
      this.setState({ stop: false, pause: false });
    }
  };

  renderTopsortPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'topsort-1'}>
          1<span style={{ marginLeft: indentation(1) }}>ToplogicalSort(G)</span>
        </div>
        <div id={'topsort-2'}>
          2<span style={{ marginLeft: indentation(2) }}>let S be a stack</span>
        </div>
        <div id={'topsort-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            let V be a map with all nodes as keys and values of null
          </span>
        </div>
        <div id={'topsort-4'}>
          4<span style={{ marginLeft: indentation(2) }}>For node of G</span>
        </div>
        <div id={'topsort-5'}>
          5
          <span style={{ marginLeft: indentation(3) }}>if V[node] is null</span>
        </div>
        <div id={'topsort-6'}>
          6
          <span style={{ marginLeft: indentation(4) }}>
            if visit(node, G, S, V) is false
          </span>
        </div>
        <div id={'topsort-7'}>
          7<span style={{ marginLeft: indentation(5) }}>return null</span>
        </div>
        <div id={'topsort-8'}>
          8
          <span style={{ marginLeft: indentation(2) }}>return S.reverse()</span>
        </div>
        <br></br>
        <div id={'topsort-visit-1'}>
          1
          <span style={{ marginLeft: indentation(1) }}>
            visit(node, G, S, V)
          </span>
        </div>
        <div id={'topsort-visit-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            if V[node] == 'Complete'
          </span>
        </div>
        <div id={'topsort-visit-3'}>
          3<span style={{ marginLeft: indentation(3) }}>return true</span>
        </div>
        <div id={'topsort-visit-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>
            if V[node] == 'In Progress'
          </span>
        </div>
        <div id={'topsort-visit-5'}>
          5<span style={{ marginLeft: indentation(3) }}>return false</span>
        </div>
        <div id={'topsort-visit-6'}>
          6
          <span style={{ marginLeft: indentation(2) }}>
            V[node] = 'In Progress'
          </span>
        </div>
        <div id={'topsort-visit-7'}>
          7
          <span style={{ marginLeft: indentation(2) }}>
            for neighbor of node
          </span>
        </div>
        <div id={'topsort-visit-8'}>
          8
          <span style={{ marginLeft: indentation(3) }}>
            if visit(node, G, S, V) is false
          </span>
        </div>
        <div id={'topsort-visit-9'}>
          9<span style={{ marginLeft: indentation(4) }}>return false</span>
        </div>
        <div id={'topsort-visit-10'}>
          10
          <span style={{ marginLeft: indentation(2) }}>S.push(node)</span>
        </div>
        <div id={'topsort-visit-11'}>
          11
          <span style={{ marginLeft: indentation(2) }}>
            V[node] = 'Complete'
          </span>
        </div>
        <div id={'topsort-visit-12'}>
          12
          <span style={{ marginLeft: indentation(2) }}>return true</span>
        </div>
      </div>
    );
  }

  renderTopsortTableData() {
    return this.state.ordering.map((node) => {
      return (
        <tr key={node}>
          <td>{node}</td>
        </tr>
      );
    });
  }

  renderTopsortHeading() {
    return (
      <tr>
        <th>Potential Ordering</th>
      </tr>
    );
  }

  render() {
    return (
      <div className={'row'}>
        <div className={'col-4'} id={'graph-container'}>
          <Topsort
            g={this.adjList}
            pause={this.state.pause}
            stop={this.state.stop}
            speed={this.state.speed}
            runningAlg={this.state.runningAlg}
            setRunningAlg={this.setRunningAlg}
            getOrdering={this.getOrdering}
            updateVisited={this.updateVisited}
            updateNeighbor={this.updateNeighbor}
            updateNode={this.updateNode}
            updateStack={this.updateStack}
            updateCallStack={this.updateCallStack}
          />
          <div className={'divider'}></div>
          <button
            className="graph-button"
            onClick={() => {
              this.setState({ pause: false, stop: true });
              this.reset();
            }}
          >
            Reset
          </button>
          <div className={'divider'}></div>
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
        {/* <div className={'col-6'} id={'output-tables'}> */}
        <div className={'col-4'}>{this.renderTopsortPseudocode()}</div>
        <div className={'col-4'}>
          <Sidebar showButton={true}>
            <li onClick={() => this.toggleClicked(0)}>
              {this.state.ordering ? (
                <RenderListComponent
                  list={this.state.ordering}
                  listName={'Return Value'}
                  clicked={this.state.clicked[0]}
                />
              ) : (
                ''
              )}
            </li>
            {this.state.node ? <li> node = {this.state.node} </li> : ''}
            {this.state.neighbor ? (
              <li> neighbor = {this.state.neighbor} </li>
            ) : (
              ''
            )}

            <li onClick={() => this.toggleClicked(1)}>
              {this.state.stack ? (
                <RenderListComponent
                  list={this.state.stack}
                  listName={'S'}
                  clicked={this.state.clicked[1]}
                />
              ) : (
                ''
              )}
            </li>
            <li onClick={() => this.toggleClicked(2)}>
              {this.state.visited ? (
                <RenderObjectComponent
                  obj={this.state.visited}
                  objName={'V'}
                  clicked={this.state.clicked[2]}
                />
              ) : (
                ''
              )}
            </li>
            <li onClick={() => this.toggleClicked(3)}>
              {this.adjList ? (
                <RenderObjectComponent
                  obj={this.adjList}
                  objName={'G'}
                  clicked={this.state.clicked[3]}
                />
              ) : (
                ''
              )}
            </li>

            <li onClick={() => this.toggleClicked(4)}>
              {this.state.callStack.length > 0 ? (
                <RenderListComponent
                  list={this.state.callStack}
                  listName={'Call Stack'}
                  clicked={this.state.clicked[4]}
                />
              ) : (
                ''
              )}
            </li>

            {/* {this.state.currentIndex ? (
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
            )} */}

            {/* <li onClick={() => this.toggleClicked(1)}>
              <RenderListComponent
                list={this.state.inputList}
                listName={'inputList'}
                clicked={this.state.clicked[1]}
              />
            </li> */}
          </Sidebar>
        </div>
      </div>
    );
  }
}

export default DirectedGraphAlgorithms;

//  <table id={'topsort-table'} className={'float-right'}>
//           <tbody>
//             {this.renderTopsortHeading()}
//             {this.renderTopsortTableData()}
//           </tbody>
//         </table>
