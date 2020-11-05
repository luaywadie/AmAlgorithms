import React, { Component } from 'react';
import * as d3 from 'd3';

class Stack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [3, 2, 7, 4, 9],
      top: 5,
      inputNum: ''
    };
  }

  push(element) {
    if(element !== null){
      this.state.data.push(element);
      this.setState({data: this.state.data});
      this.setState({top: this.state.top + 1});
      this.createStack();
    }
  }

  pop() {
    if( this.isEmpty() === false ) {
      this.state.data.pop(); 
      this.setState({data: this.state.data});
      this.setState({top: this.state.top - 1});
      d3.selectAll("rect[id='" + (this.state.data.length) + "']").remove();
      d3.selectAll("text[id='" + (this.state.data.length) + "']").remove();
      this.createStack();
    }
  }

  clear() {
    d3.selectAll('#svg-container').remove();
    this.setState({top: 0});
    this.setState({data: []})
  }

  isEmpty() {
    return this.state.top === 0;
  }

  componentDidMount() {
    this.createStack();
  }
  
  createStack() {
    // Clear Stack List
    let clearStack = () => {
      d3.selectAll('#svg-container').remove();
    }
    clearStack();

    var margin = { top: 100, right: 0, bottom: 0, left: 30 },
      width = 500,
      height = 300;
    
    var svg = d3
      .select('#stack-container')
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
      .range([width, 0])
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

  renderStackClassPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'Stack-class-1'}>
          1<span style={{ marginLeft: indentation(1) }}>Class Stack</span>
        </div>
        <div id={'Stack-class-2'}>
          2<span style={{ marginLeft: indentation(2) }}>let s be an array</span>
        </div>
        <div id={'Stack-class-3'}>
          3<span style={{ marginLeft: indentation(2) }}>let top be equal to the length of s</span>
        </div>
        <br></br>
      </div>
    );
  }

  renderPopPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'Stack-pop-1'}>
          1<span style={{ marginLeft: indentation(1) }}>pop()</span>
        </div>
        <div id={'Stack-pop-2'}>
          2<span style={{ marginLeft: indentation(2) }}>if top is not equal to 0</span>
        </div>
        <div id={'Stack-pop-3'}>
          3<span style={{ marginLeft: indentation(3) }}>removes last element of s</span>
        </div>
        <div id={'Stack-pop-4'}>
          4<span style={{ marginLeft: indentation(3) }}>top = top - 1</span>
        </div>
        <br></br>
      </div>
    );
  }

  renderPushPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'Stack-push-1'}>
          1<span style={{ marginLeft: indentation(1) }}>push()</span>
        </div>
        <div id={'Stack-push-2'}>
          2<span style={{ marginLeft: indentation(2) }}>adds element to the end of s</span>
        </div>
        <div id={'Stack-push-3'}>
          3<span style={{ marginLeft: indentation(2) }}>top = top + 1</span>
        </div>
        <br></br>
      </div>
    );
  } 

  formatPushButtonText() {
    let linkText = '';
    if (this.state.data.includes(this.state.inputNum)) {
      linkText = 'No Duplicates';
    } else if (this.state.data.length === 7) {
      linkText = 'Full Stack'
    } else {
      linkText = 'Push';
    }
    return linkText;
  }

  formatPopButtonText() {
    let linkText = '';
    if (this.state.data.length === 0) {
      linkText = 'Empty Stack';
    } else {
      linkText = 'Pop';
    }
    return linkText;
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
                disabled={this.state.data.includes(Number(this.state.inputNum)) ||
                  this.state.data.length === 7}
                type="submit"
                onClick={async () => 
                  {this.push(this.state.inputNum)}
                }
              >
                {this.formatPushButtonText()}
              </button>
              <button
                className="graph-button"
                disabled={this.state.data.length === 0}
                type="submit"
                onClick={() => {
                  this.pop();
                }}
              >
                {this.formatPopButtonText()}
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
              <div id="stack-container"></div>
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

export default Stack;