import React, { Component } from 'react';
import * as d3 from 'd3';

class InsertionSort extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }
  componentDidMount() {
    let data = [1,2,3,4,5,6]

  // const div = d3.select("#sort-container").append("div")
  //   .style("font", "10px sans-serif")
  //   .style("text-align", "right")
  //   .style("color", "white");
  //
  // div.selectAll("div")
  //   .data(data)
  //   .join("div")
  //     .style("background", "steelblue")
  //     .style("padding", "3px")
  //     .style("margin", "1px")
  //     .style("width", d => `${d * 10}px`)
  //     .text(d => d);
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 90, left: 40},
      width = 460 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#sort-container")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data)
    .padding(0.2);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 10])
    .range([ height, 0]);

  // Bars
  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d); })
      .attr("width", x.bandwidth())
      .attr("fill", "#39a4ff")
      // no bar at the beginning thus:
      .attr("height", function(d) { return height - y(0); }) // always equal to 0
      .attr("y", function(d) { return y(0); })

  // Animation
  svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return y(d); })
    .attr("height", function(d) { return height - y(d); })

    svg.selectAll("rect").transition().duration(100)
      .attr("y", function(d) { return y(d); })
      .attr("height", function(d) { return height - y(d) - 10; })
      .delay(1000)
  }



  componentWillUnmount() {

  }

  render() {
    return (
      <div id="sort-container"></div>
    );
  }
}

export default InsertionSort;
