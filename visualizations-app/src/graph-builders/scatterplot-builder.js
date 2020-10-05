import * as d3 from 'd3';


async function createScatterplot(data) {
  
// set the dimensions and margins of the graph
let margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#graph-container")
.append("svg")
.attr("id", "scatter-svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


// Add X axis
let x = d3.scaleLinear()
.domain([4, 8])
.range([ 0, width ]);
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

// Add Y axis
let y = d3.scaleLinear()
.domain([0, 9])
.range([ height, 0]);
svg.append("g")
.call(d3.axisLeft(y));


// Add dots
svg.append('g')
.selectAll("dot")
.data(data)
.enter()
.append("circle")
  .attr("cx", d => x(d.x))
  .attr("cy", d => y(d.y))
  .attr("r", 5)
  .attr("id", d => `x:${parseFloat(d.x).toFixed(1)}-y:${parseFloat(d.y).toFixed(1)}`) //id: x:0.0-y:0.0
  //set initial color of points to black
  .style("fill", "black"); 
}



export default createScatterplot;
