import React, { Component } from 'react';
import * as d3 from 'd3';

class Queue extends Component {
  constructor(props) {
  super(props);
    this.state = {
      data: [3, 2, 7, 4, 9],
      inputNum: '',
      performingDequeue: false,
      performingEnqueue: false
    };
  }

  enqueue(element) {
    if(element !== null){
      this.state.data.push(element);
      this.createQueue();
    }
  }

  dequeue() {
    if( this.isEmpty() === false ) {
      this.state.data.shift(); 
      d3.selectAll("rect[id='" + 0 + "']").remove();
      d3.selectAll("text[id='" + 0 + "']").remove();
      this.createQueue();
    }
  }

  clear() {
    d3.selectAll('#svg-container').remove();
    this.setState({data: []})
  }

  isEmpty() {
    return this.state.data.length === 0;
  }

  componentDidMount() {
    this.createQueue();
  }
  
  createQueue() {

    let clearQueue = () => {
      d3.selectAll('#svg-container').remove();
    }
    clearQueue();

    var margin = { top: 100, right: 0, bottom: 0, left: 30 },
      width = 500,
      height = 300;
    
    var svg = d3
      .select('#queue-container')
      .append('svg')
      .attr('id', 'svg-container')
      .attr('width', width)
      .attr('height',height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3
      .scaleLinear()
      .domain([0, 0])
      .range([height, 0]);

    var y = d3
      .scaleBand()
      .range([0, width])
      .domain(this.state.data);

    svg
      .selectAll('mybar')
      .data(this.state.data)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d);
      })
      .attr('y', function (d) {
        return y(d);
      })
      .attr('width', width - 350)
      .attr('fill', '#39a4ff')
      .attr('height', function (d) {
        return d;
      }) 
      .attr('value', function (index) {
        return index;
      })
      .attr('id', (d, index) => (index));

    svg
      .selectAll('mybar')
      .data(this.state.data)
      .enter()
      .append('text')
      .attr('x', function (d) {
        return x(d) + 65;
      })
      .attr('y', function (d) {
        return y(d) + 30;
      })
      .attr('value', function (d, index) {
        return index;
      })
      .text(function (d) {
        return d;
      })
      .attr('id', (d, index) => (index));

    svg
      .selectAll('rect')
      .attr('y', function (d) {
        return y(d);
      })
      .attr('height', 50);
    }

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
          2<span style={{ marginLeft: indentation(2) }}>let q be an array</span>
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
          2<span style={{ marginLeft: indentation(2) }}>if q.length is not equal to 0</span>
        </div>
        <div id={'Queue-dequeue-3'}>
          3<span style={{ marginLeft: indentation(3) }}>removes first element of s</span>
        </div>
        <br></br>
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
          1<span style={{ marginLeft: indentation(1) }}>push()</span>
        </div>
        <div id={'Queue-enqueue-2'}>
          2<span style={{ marginLeft: indentation(2) }}>adds element to the end of s</span>
        </div>
        <br></br>
      </div>
    );
  } 

  render() {
    return(
      <div className={'row'}>
        <div className={'col-4'} id={'graph-container'}>
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
                type="submit"
                onClick={async () => 
                  {this.enqueue(this.state.inputNum)}
                }
              >
                Enqueue
              </button>
              <button
                className="graph-button"
                type="submit"
                onClick={() => {
                  this.dequeue();
                }}
              >
                Dequeue
              </button>
              <button
                className="graph-button"
                type="submit"
                onClick={() => {
                  this.clear();
                }}
              >
                Clear
              </button>
              <div id="queue-container"></div>
          </form>
        </div>
        <div className={'col-4'} id={'graph-container'}>
          <div className={'row'}>
            
          </div>
        </div>
      </div>
    )
  }

}

export default Queue;