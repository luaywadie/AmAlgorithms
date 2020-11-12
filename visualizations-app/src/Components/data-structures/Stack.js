import React, { Component } from 'react';
import * as d3 from 'd3';

class Stack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [3, 2, 7, 4, 9, 10],
      top: 6,
      inputNum: '', 
      didPop: false,
      didPush: false
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
    let blockHeight = 50;

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
      .range([width, 0]);

    //var y = d3
      //.scaleBand()
      //.range([height, 0])
      //.domain(this.state.data);

      let y = height + blockHeight
    let yText = height + blockHeight

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
        y -= blockHeight
        return y;
      })
      .attr('width', width - 350)
      .attr('fill', '#39a4ff')
      .attr('height', 50) 
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
        yText -= blockHeight
        return yText + 30;
      })
      .attr('value', function (d, index) {
        return index;
      })
      .text(function (d) {
        return d;
      })
      .attr('id', (d, index) => (index));

    // svg
    //   .selectAll('rect')
    //   .attr('y', function (d) {
    //     return y(d);
    //   })
    //   .attr('height', 50);
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
          2<span style={{ marginLeft: indentation(2) }}>capacity: 5</span>
        </div>
        <div id={'Stack-class-3'}>
          3<span style={{ marginLeft: indentation(2) }}>size: 0</span>
        </div>
        <div id={'Stack-class-4'}>
          4<span style={{ marginLeft: indentation(2) }}>sArray = [Null, Null, Null, Null, Null]</span>
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
          2<span style={{ marginLeft: indentation(2) }}>if size != 0</span>
        </div>
        <div id={'Stack-pop-3'}>
          3<span style={{ marginLeft: indentation(3) }}>data = stack[rear]</span>
        </div>
        <div id={'Stack-pop-4'}>
          4<span style={{ marginLeft: indentation(3) }}>size -= 1</span>
        </div>
        <div id={'Stack-pop-4'}>
          5<span style={{ marginLeft: indentation(3) }}>return data</span>
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
          1<span style={{ marginLeft: indentation(1) }}>push(data)</span>
        </div>
        <div id={'Stack-push-2'}>
          2<span style={{ marginLeft: indentation(2) }}>size += 1</span>
        </div>
        <div id={'Stack-push-4'}>
          4<span style={{ marginLeft: indentation(2) }}>stack[front] = data</span>
        </div>
        <br></br>
      </div>
    );
  } 

  formatPushButtonText() {
    let linkText = '';
    if (this.state.data.includes(this.state.inputNum)) {
      linkText = 'No Duplicates';
    } else if (this.state.data.length === 6) {
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
                  this.state.data.length === 6}
                type="submit"
                onClick={async () => {
                  this.setState({
                    didPush: true,
                    didPop: false
                  });
                  this.push(this.state.inputNum)}
                }
              >
                {this.formatPushButtonText()}
              </button>
              <button
                className="graph-button"
                disabled={this.state.data.length === 0}
                type="submit"
                onClick={() => {
                  this.setState({
                    didPush: false,
                    didPop: true
                  });
                  this.pop();
                }}
              >
                {this.formatPopButtonText()}
              </button>
              <button
                className="graph-button"
                type="submit"
                onClick={() => {
                  this.setState({
                    didPush: false,
                    didPop: false
                  });
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
            {this.renderStackClassPseudocode()} 
            </div> 
            <div className={'row'}>
              {this.state.didPop ? this.renderPopPseudocode() : ''}
              {this.state.didPush ? this.renderPushPseudocode() : ''}
            </div>
          </div>
        </div>
    )
  }

}

export default Stack;