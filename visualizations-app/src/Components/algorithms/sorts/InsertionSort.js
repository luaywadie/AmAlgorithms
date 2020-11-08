// Core Imports
import React, { Component } from 'react';
import * as d3 from 'd3';
// Styling
import 'styles/Sorts.scss';
// Libraries
import {Container, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaStepBackward, FaStepForward, FaPause, FaPlay,
        FaPlus, FaMinus, FaSyncAlt} from 'react-icons/fa';


class InsertionSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation_queue: [],
      stepper_queue: [],
      data: [],
      speed: 1000,
      speedFactor: 1,
      speedChanged: false,
      paused: true,
      swapping: false,
      interval: null
    };
  }
  componentDidMount() {
    // Event Listener to check if window lost focus
    // If so pause the algorithm
    window.onblur = () => {
      this.setState({paused: true})
    }
    // Start the Algorithm
    this.restartRandom();
  }
  
  componentWillUnmount() {
    this.endInterval();
  }

  startAlgorithm = () => {
    console.log(this.state.data)
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 0, bottom: 0, left: 20 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svg = d3
    .select('#sort-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
    // X axis
    var x = d3
    .scaleBand()
    .range([0, width])
    .domain(this.state.data)
    .padding(0.2);
    
    // Add Y axis
    var y = d3.scaleLinear().domain([0, 10]).range([height, 0]);
    
    // Bars
    svg
    .selectAll('mybar')
    .data(this.state.data)
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return x(d);
    })
    .attr('y', function (d) {
      return y(0);
    })
    .attr('width', x.bandwidth())
    .attr('fill', '#39a4ff')
    .attr('height', function (d) {
      return height - y(0);
    }) // always equal to 0
    .attr('value', function (d, index) {
      return index;
    });
    
    svg
    .selectAll('mybar')
    .data(this.state.data)
    .enter()
    .append('text')
    .attr('x', function (d) {
      return x(d) + 35;
    })
    .attr('y', function (d) {
      return y(d) - 10;
    })
    .attr('value', function (d, index) {
      return index;
    })
    .text(function (d) {
      return d;
    });
    
    // Animation
    svg
    .selectAll('rect')
    .transition()
    .duration(800)
    .attr('y', function (d) {
      return y(d);
    })
    .attr('height', function (d) {
      return height - y(d);
    });
    
    // Calculate Speed
    this.startInterval()
  }

  insertionSort = (arr) => {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      let el = arr[i];
      let j;
      
      for (j = i - 1; j >= 0 && arr[j] > el; j--) {
        arr[j + 1] = arr[j];
        this.state.animation_queue.push([j, j + 1]);
      }
      arr[j + 1] = el;
    }
    return arr;
  };

  startInterval = () => {
    // Sort
    this.insertionSort(this.state.data)
    this.setState({speed: (1000 - ((this.state.speedFactor * 1000) - 1000))})
    this.setState({interval: this.intervalEngine()})
  }

  restartInterval = () => {
    clearInterval(this.state.interval);
    this.startInterval();
    this.setState({speedChanged: false})
  }

  endInterval = () => {
    clearInterval(this.state.interval);
    this.setState({paused: true})
  }

  intervalEngine = () => {
    // Calculate Speed Factor
    let interval = setInterval(() => {
      if (this.state.speedChanged) this.restartInterval();
      if (this.state.animation_queue.length > 0
          && !this.state.paused) {
        this.swapBars(
          this.state.animation_queue[0][0],
          this.state.animation_queue[0][1],
          this.state.speed
        );
        this.state.stepper_queue.push(this.state.animation_queue[0]);
        this.state.animation_queue.shift();
      } else if (this.state.animation_queue.length == 0) {
        clearInterval(interval);
      } else if (this.state.paused) {
        console.log("Paused")
      }
    }, this.state.speed);
    
    return interval;
  }

  swapBars(barFromIndex, barToIndex) {
    this.setState({swapping: true})
    let speed = this.state.speed;
    let fromObj = d3.selectAll("rect[value='" + barFromIndex + "']");
    let toObj = d3.selectAll("rect[value='" + barToIndex + "']");
    let fromObjTxt = d3.selectAll("text[value='" + barFromIndex + "']");
    let toObjTxt = d3.selectAll("text[value='" + barToIndex + "']");

    fromObjTxt
      .transition()
      .duration(speed)
      .attr('x', toObjTxt.attr('x'));

    toObjTxt
      .transition()
      .duration(speed)
      .attr('x', fromObjTxt.attr('x'));

    fromObj
      .transition()
      .duration(speed)
      .attr('fill', '#9537ff')
      .attr('x', toObj.attr('x'));

    toObj
      .transition()
      .duration(speed)
      .attr('fill', '#ffa500')
      .attr('x', fromObj.attr('x'));

    // Reset Colors
    fromObj.transition().duration(speed).delay(speed).attr('fill', '#39a4ff');
    toObj.transition().duration(speed).delay(speed).attr('fill', '#39a4ff');
    
    // Swap
    let temp = fromObj.attr('value');
    fromObj.attr('value', toObj.attr('value'));
    toObj.attr('value', temp);
    temp = fromObjTxt.attr('value');
    fromObjTxt.attr('value', toObjTxt.attr('value'));
    toObjTxt.attr('value', temp);

    // Allow next swapping
    setTimeout(() => {
      this.setState({swapping: false})
    }, speed)
  }
  
  // Stepper
  stepBack = () => {
    if (this.state.stepper_queue.length > 0) {
      let toElement = this.state.stepper_queue[this.state.stepper_queue.length - 1][0]
      let fromElement = this.state.stepper_queue[this.state.stepper_queue.length - 1][1]
      this.swapBars(toElement, fromElement)
      this.state.stepper_queue.pop()
      this.state.animation_queue.unshift([fromElement, toElement])
    } else {
      // Handle Button Animations
    }
  }

  stepForward = () => {
    if (this.state.animation_queue.length > 0) {
      let toElement = this.state.animation_queue[0][0]
      let fromElement = this.state.animation_queue[0][1]
      this.swapBars(toElement, fromElement)
      this.state.animation_queue.shift()
      this.state.stepper_queue.unshift([fromElement, toElement])
    } else {
      // Handle Button Animations
    }
  }

  restartRandom = () => {
    let MIN = 1;
    let MAX = 10;
    let randomArray = [];

    while (randomArray.length < 9) {
      let randomNumber = Math.floor(Math.random() * MAX) + MIN;
      if (randomArray.indexOf(randomNumber) < 0) randomArray.push(randomNumber);
    }
    
    this.endInterval()
    this.clearSVG()
    this.setState({data: randomArray},
      () => {
        this.startAlgorithm()
      });
  }

  clearSVG = () => {
    // Clear the document container
    document.getElementById("sort-container").innerHTML = "";
    // Clear the animation and stepper queues
    this.state.animation_queue = [];
    this.state.stepper_queue = [];
  }


  render() {
    return (
      <Container fluid>
        <Row>
          <button
            className="graph-button"
            onClick={() => {
              if (this.state.speedFactor >= 0.1) {
                this.setState({speedChanged: true});
                this.setState({ speedFactor: parseFloat((this.state.speedFactor - .1).toFixed(1))});
              }
            }}
          >
            <FaMinus></FaMinus>
          </button>
          <button className="btn-label">
            Speed: {this.state.speedFactor}x
          </button>
          <button
            className="graph-button"
            onClick={() => {
              if (this.state.speedFactor <= 1.4) {
                this.setState({speedChanged: true});
                this.setState({ speedFactor: parseFloat((this.state.speedFactor + .1).toFixed(1))});
              }
            }}
          >
            <FaPlus></FaPlus>
          </button>
          <OverlayTrigger
            key="top"
            placement="top"
            overlay={
              <Tooltip id="tooltip-top">
                Pause / Un-Pause Algorithm
              </Tooltip>
            }
          >
            <button
              className="graph-button"
              ref="top"
              onClick={() => {
                this.setState({ paused: !this.state.paused });
              }}
            >
              {this.state.paused ? <FaPlay /> : <FaPause />}
            </button>
          </OverlayTrigger>
        </Row>
        <Row>
          <button
            className="graph-button step-back"
            onClick={() => {
              if (!this.state.swapping) this.stepBack()
            }}
          >
            <FaStepBackward></FaStepBackward>
          </button>
          <button
            className="graph-button btn-label"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            Stepper
          </button>
          <button
            className="graph-button"
            onClick={() => {
              if (!this.state.swapping) this.stepForward()
            }}
          >
            <FaStepForward></FaStepForward>
          </button>
          <OverlayTrigger
            key="bottom"
            placement="bottom"
            overlay={
              <Tooltip id="tooltip-top">
                Restart & Randomize<br></br> Array List
              </Tooltip>
            }
          >
            <button
              className="graph-button"
              ref="bottom"
              onClick={() => {
                this.restartRandom()
              }}
            >
              <FaSyncAlt></FaSyncAlt>
            </button>
          </OverlayTrigger>
        </Row>
        <Row>
          <div id="sort-container"></div>
        </Row>
      </Container>
    );
  }
}

export default InsertionSort;
