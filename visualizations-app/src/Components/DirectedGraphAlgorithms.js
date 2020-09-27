import React, { Component } from 'react';
import topSort from '../algorithms/graph-algorithms/topsort';
import createDirectedGraph from '../graph-builder/directed-graph-builder';

class DirectedGraphAlgorithms extends Component {
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
    this.graph = document.getElementById('graph-container');
  }
  componentDidMount() {
    createDirectedGraph();
  }

  componentWillUnmount() {
    let svg = document.getElementById('dir-graph-svg');
    if (this.graph.hasChildNodes()) this.graph.removeChild(svg);
    this.reset();
  }
  getOrdering = async (stack) => {
    await this.setState({ ordering: stack });
  };

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

  reset = () => {
    Object.keys(this.adjList).forEach((e) => {
      let el = document.getElementById(e);
      if (el) el.classList = '';
    });
    this.setState({ ordering: [] });
  };

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
        <div className={'col-6'}>
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
        {/* <div className={'col-6'} id={'output-tables'}> */}
        <div className={'col-6'}>
          <table id={'topsort-table'} className={'float-right'}>
            <tbody>
              {this.renderTopsortHeading()}
              {this.renderTopsortTableData()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default DirectedGraphAlgorithms;
