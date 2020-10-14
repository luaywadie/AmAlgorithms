import * as d3 from 'd3';


async function createScatterplot(data) {
  //modified from http://www.d3-graph-gallery.com, by Yan Holtz
  // set the dimensions and margins of the graph
  let margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 600 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3.select("#graph-container")
    .append("svg")
    .attr("id", "scatter-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("id", "scatter-no-margin")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // Add X axis - animation start: 0 opacity
  let x = d3.scaleLinear()
    .domain([0, 0])
    .range([0, width]);
  
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("opacity", "0");

  // Add Y axis
  let y = d3.scaleLinear()
    .domain([0, 7])
    .range([height, 0]);
  
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add points
  svg.append('g')
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", 3)
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      //add an id to each point so we can grab it later and modify it
      .attr("id", d => `x:${parseFloat(d.x).toFixed(1)}-y:${parseFloat(d.y).toFixed(1)}`) //id: x:0.0-y:0.0
      //initialize all clusters to black
      .classed("cluster-unassigned",true); 

  // Add new X axis - animation end: full opacity, transitioning to correct domain
  x.domain([4, 8])
  svg.select(".x-axis")
    .transition()
    .duration(2000)
    .attr("opacity", "1")
    .call(d3.axisBottom(x));

  //Animate each of the data points to their correct position using different delay
  svg.selectAll("circle")
    .transition()
    .delay((d,id) => id*3)
    .duration(2000)
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))


}


export default createScatterplot;
