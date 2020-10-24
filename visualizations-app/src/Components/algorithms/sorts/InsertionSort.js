// Core Imports
import React, { Component } from 'react';
import * as d3 from 'd3';
// Libraries
import { FaStepBackward, FaStepForward, FaPause, FaPlay,
        FaPlus, FaMinus} from 'react-icons/fa';


class InsertionSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation_queue: [],
      data: [2, 5, 3, 1, 6, 9, 4],
      speed: 1000,
      paused: false
    };
  }
  componentDidMount() {
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
        return x(d) + 50;
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

    // Sort
    this.insertionSort(this.state.data);
    let speed = this.state.speed;
    let interval = setInterval(() => {
      if (this.state.speed != speed) {
        clearInterval(interval);
        setInterval(interval, this.state.speed);
      }
      if (this.state.animation_queue.length > 0
          && !this.state.paused) {
        this.swapBars(
          this.state.animation_queue[0][0],
          this.state.animation_queue[0][1],
          svg,
          this.state.data
        );
        this.state.animation_queue.shift();
      } else if (this.state.animation_queue.length == 0) {
        clearInterval(interval);
      } else if (this.state.paused) {
        console.log("Paused")
        svg
          .selectAll('mybar')
          .attr('fill', 'red')
      }
    }, this.state.speed);

    // if (this.state.animation_queue.length === 0) {
    //   clearInterval(interval);
    // }
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
      console.log(arr);
    }
    return arr;
  };

  swapBars(barFromIndex, barToIndex, svg) {
    let fromObj = d3.selectAll("rect[value='" + barFromIndex + "']");
    let toObj = d3.selectAll("rect[value='" + barToIndex + "']");
    let fromObjTxt = d3.selectAll("text[value='" + barFromIndex + "']");
    let toObjTxt = d3.selectAll("text[value='" + barToIndex + "']");

    fromObjTxt
      .transition()
      .duration(500)
      .attr('fill', '#9537ff')
      .delay(400)
      .attr('x', toObjTxt.attr('x'));

    toObjTxt
      .transition()
      .duration(500)
      .attr('fill', '#9537ff')
      .delay(400)
      .attr('x', fromObjTxt.attr('x'));

    fromObj
      .transition()
      .duration(500)
      .attr('fill', '#9537ff')
      .delay(400)
      .attr('x', toObj.attr('x'));

    toObj
      .transition()
      .duration(500)
      .attr('fill', '#ffa500')
      .delay(400)
      .attr('x', fromObj.attr('x'));

    // Reset Colors
    fromObj.transition().duration(400).delay(1500).attr('fill', '#39a4ff');
    toObj.transition().duration(400).delay(1500).attr('fill', '#39a4ff');

    let temp = fromObj.attr('value');
    fromObj.attr('value', toObj.attr('value'));
    toObj.attr('value', temp);
    temp = fromObjTxt.attr('value');
    fromObjTxt.attr('value', toObjTxt.attr('value'));
    toObjTxt.attr('value', temp);
  }

  componentWillUnmount() {}

  render() {
    return (
      <div>

        <button
          className="graph-button"
          onClick={() => {
            if (this.state.speed >= 1600) {
              this.setState({ speed: this.state.speed - 200 });
            }
          }}
        >
          <FaMinus></FaMinus>
        </button>
        <button>
          Speed: {this.state.speed / 1000}s
        </button>
        <button
          className="graph-button"
          onClick={() => {
            if (this.state.speed <= 3000) {
              this.setState({ speed: this.state.speed + 200 });
            }
          }}
        >
          <FaPlus></FaPlus>
        </button>

        <button
          className="graph-button"
          onClick={() => {
            this.setState({ paused: !this.state.paused });
          }}
        >
          {this.state.paused ? <FaPlay /> : <FaPause />}
        </button>
        <div id="sort-container"></div>
      </div>
    );
  }
}

export default InsertionSort;
