import React, { Component } from 'react';
import * as d3 from 'd3';

class InsertionSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation_queue: [],
      data: [5, 3, 1],
    };
  }
  componentDidMount() {
    // set the dimensions and margins of the graph
    var margin = { top: 0, right: 30, bottom: 90, left: 200 },
      width = 1500 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

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
    let interval = setInterval(() => {
      if (this.state.animation_queue.length > 0) {
        this.swapBars(
          this.state.animation_queue[0][0],
          this.state.animation_queue[0][1],
          svg,
          this.state.data
        );
        this.state.animation_queue.shift();
      }
    }, 2000);
    if (this.state.animation_queue.length === 0) {
      clearInterval(interval);
    }
  }

  insertionSort = (arr) => {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      let el = arr[i];
      let j;

      for (j = i - 1; j >= 0 && arr[j] > el; j--) {
        arr[j + 1] = arr[j];
        this.state.animation_queue.push([i, j]);
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
      .duration(1000)
      .attr('fill', '#9537ff')
      .delay(500)
      .attr('x', toObjTxt.attr('x'));

    toObjTxt
      .transition()
      .duration(1000)
      .attr('fill', '#9537ff')
      .delay(500)
      .attr('x', fromObjTxt.attr('x'));

    fromObj
      .transition()
      .duration(1000)
      .attr('fill', '#9537ff')
      .delay(500)
      .attr('x', toObj.attr('x'));

    toObj
      .transition()
      .duration(1000)
      .attr('fill', '#ffa500')
      .delay(500)
      .attr('x', fromObj.attr('x'));

    // Reset Colors
    fromObj.transition().duration(500).delay(1500).attr('fill', '#39a4ff');
    toObj.transition().duration(500).delay(1500).attr('fill', '#39a4ff');

    let temp = fromObj.attr('value');
    fromObj.attr('value', toObj.attr('value'));
    toObj.attr('value', temp);
    temp = fromObjTxt.attr('value');
    fromObjTxt.attr('value', toObjTxt.attr('value'));
    toObjTxt.attr('value', temp);
  }

  componentWillUnmount() {}

  render() {
    return <div id="sort-container"></div>;
  }
}

export default InsertionSort;
