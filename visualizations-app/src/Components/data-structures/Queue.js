import React, { Component } from 'react';
import * as d3 from 'd3';

class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [6, 5, 4, 3, 2, 1],
      inputNum: '',
      didEnqueue: false,
      didDequeue: false,
      capacity: 6,
      tail: 0,
      head: 5,
      dequeuedVal: null,
    };
  }

  enqueue(element) {
    if (element !== null) {
      this.state.data.unshift(element);
      this.setState({ data: this.state.data, head: this.state.head + 1 });
      this.createQueue();
    }
  }

  dequeue() {
    if (this.isEmpty() === false) {
      let val = this.state.data.pop();
      this.setState({
        data: this.state.data,
        head: this.state.head - 1,
        dequeuedVal: val,
      });
      d3.selectAll("rect[id='" + 0 + "']").remove();
      d3.selectAll("text[id='" + 0 + "']").remove();
      this.createQueue();
    }
  }

  clear() {
    d3.selectAll('#svg-container').remove();
    this.setState({ data: [], head: -1, tail: 0 });
  }

  isEmpty() {
    return this.state.data.length === 0;
  }

  componentDidMount() {
    this.createQueue();
  }

  createQueue = () => {
    let clearQueue = () => {
      d3.selectAll('#svg-container').remove();
    };
    clearQueue();
    let blockHeight = 50;
    let capacity = this.state.capacity;
    var margin = { top: 100, right: 0, bottom: 0, left: 30 },
      width = 500,
      height = 300;

    var svg = d3
      .select('#queue-container')
      .append('svg')
      .attr('id', 'svg-container')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scaleLinear().domain([0, 0]).range([width, 0]);

    let y = height + blockHeight;
    let yText = height + blockHeight;
    svg
      .selectAll('mybar')
      .data(this.state.data)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d);
      })
      .attr('stroke-width', 3)
      .attr('stroke', 'black')
      .attr('y', function (d) {
        y -= blockHeight;
        return y;
      })
      .attr('width', width - 350)
      .attr('fill', '#39a4ff')
      .attr('height', 50)
      .attr('value', function (index) {
        return index;
      })
      .attr('id', (d, index) => index);

    svg
      .selectAll('mybar')
      .data(this.state.data)
      .enter()
      .append('text')
      .attr('x', function (d) {
        return x(d) + 65;
      })
      .attr('y', function (d) {
        yText -= blockHeight;
        return yText + 30;
      })
      .attr('value', function (d, index) {
        return index;
      })
      .text(function (d, index) {
        return d;
      })
      .attr('id', (d, index) => index);
    svg
      .selectAll('mybar')
      .data(this.state.data)
      .enter()
      .append('g')
      .append('text')
      .attr('x', function (d) {
        return x(d) - 85;
      })
      .attr('y', function (d, index) {
        let htmlCollection = svg._groups[0][0].children; // need to do this b/c cant access state in here for some reason??
        let size = 0;
        for (let item of htmlCollection) {
          if (item.localName === 'rect') {
            size += 1;
          }
        }

        if (index === size - 1) {
          // head position
          return 30 + (capacity - size + 1) * 50;
        }
        if (index === 0) {
          // tail position
          return 300 + 30;
        }
      })
      .attr('value', function (d, index) {
        return index;
      })
      .text(function (d, index) {
        let el = svg._groups[0][0].children;
        let size = 0;
        for (let item of el) {
          if (item.localName === 'rect') {
            size += 1;
          }
        }
        if (size === 1) {
          return 'Head/Tail';
        }
        if (index === 0) {
          return 'Tail';
        }
        if (index === size - 1) {
          return 'Head';
        }
      })
      .attr('id', (d, index) => index);
  };

  renderQueueClassPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'Queue-class-1'}>
          1<span style={{ marginLeft: indentation(1) }}>Class Queue</span>
        </div>
        <div id={'Queue-class-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            capacity: {this.state.capacity}
          </span>
        </div>
        <div id={'Queue-class-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            size: {this.state.data.length}
          </span>
        </div>
        <div id={'Queue-class-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>
            head: {this.state.head}
          </span>
        </div>
        <div id={'Queue-class-5'}>
          5
          <span style={{ marginLeft: indentation(2) }}>
            tail: {this.state.tail}
          </span>
        </div>
        <div id={'Queue-class-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>
            qArray = [
            {this.state.data.map((e, i) => {
              if (i === this.state.data.length - 1) {
                return e;
              } else {
                return e + ', ';
              }
            })}
            ]
          </span>
        </div>
        <br></br>
      </div>
    );
  }

  renderDequeuePseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'Queue-dequeue-1'}>
          1<span style={{ marginLeft: indentation(1) }}>dequeue()</span>
        </div>
        <div id={'Queue-dequeue-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>if qArray is empty</span>
        </div>
        <div id={'Queue-dequeue-3'}>
          3
          <span style={{ marginLeft: indentation(3) }}>
            throw empty queue error
          </span>
        </div>
        <div id={'Queue-dequeue-4'}>
          4<span style={{ marginLeft: indentation(2) }}>size -= 1</span>
        </div>
        <div id={'Queue-dequeue-5'}>
          5
          <span style={{ marginLeft: indentation(2) }}>
            data = qArray[head]
          </span>
        </div>
        <div id={'Queue-dequeue-6'}>
          6<span style={{ marginLeft: indentation(2) }}>head = head - 1</span>
        </div>
        <div id={'Queue-dequeue-7'}>
          7<span style={{ marginLeft: indentation(2) }}>return data</span>
        </div>
        <br></br>
        <h1>return value = {this.state.dequeuedVal}</h1>
      </div>
    );
  }

  renderEnqueuePseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'Queue-enqueue-1'}>
          1<span style={{ marginLeft: indentation(1) }}>enqueue(data)</span>
        </div>
        <div id={'Queue-enqueue-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            if size is equal to capacity
          </span>
        </div>
        <div id={'Queue-enqueue-3'}>
          3
          <span style={{ marginLeft: indentation(3) }}>
            throw full queue error
          </span>
        </div>
        <div id={'Queue-enqueue-4'}>
          4<span style={{ marginLeft: indentation(2) }}>size += 1</span>
        </div>
        <div id={'Queue-enqueue-5'}>
          5<span style={{ marginLeft: indentation(2) }}>head = head+1</span>
        </div>
        <div id={'Queue-enqueue-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>queue[tail] = data</span>
        </div>
        <br></br>
      </div>
    );
  }

  formatEnqueueButtonText() {
    let linkText = '';
    if (this.state.data.includes(this.state.inputNum)) {
      linkText = 'No Duplicates';
    } else if (this.state.data.length === 6) {
      linkText = 'Full Queue';
    } else {
      linkText = 'Enqueue';
    }
    return linkText;
  }

  formatDequeueButtonText() {
    let linkText = '';
    if (this.state.data.length === 0) {
      linkText = 'Empty Queue';
    } else {
      linkText = 'Dequeue';
    }
    return linkText;
  }

  render() {
    this.size = this.state.data.length;
    return (
      <div className={'row'}>
        <div className={'col-6'} id={'graph-container'}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label>Add a number:</label>
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
              className="graph-button"
              disabled={
                this.state.data.includes(Number(this.state.inputNum)) ||
                this.state.data.length === 6
              }
              type="submit"
              onClick={async () => {
                this.setState({
                  didEnqueue: true,
                  didDequeue: false,
                });
                this.enqueue(this.state.inputNum);
              }}
            >
              {this.formatEnqueueButtonText()}
            </button>
            <button
              className="graph-button"
              disabled={this.state.data.length === 0}
              type="submit"
              onClick={() => {
                this.setState({
                  didEnqueue: false,
                  didDequeue: true,
                });
                this.dequeue();
              }}
            >
              {this.formatDequeueButtonText()}
            </button>
            <button
              className="graph-button"
              type="submit"
              onClick={() => {
                this.setState({
                  didEnqueue: false,
                  didDequeue: false,
                });
                this.clear();
              }}
            >
              Clear
            </button>
            <div id="queue-container"></div>
          </form>
        </div>
        <div className={'col-6'} id={'graph-container'}>
          <div className={'row'}>{this.renderQueueClassPseudocode()}</div>
          <div className={'row'}>
            {this.state.didEnqueue ? this.renderEnqueuePseudocode() : ''}
            {this.state.didDequeue ? this.renderDequeuePseudocode() : ''}
          </div>
        </div>
      </div>
    );
  }
}

export default Queue;
