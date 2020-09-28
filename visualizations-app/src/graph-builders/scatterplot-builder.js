import * as d3 from 'd3';


async function createScatterplot() {
  
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

//Read the data
const data = await d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv");
console.log(data);

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

// Color scale: give me a specie name, I return a color
let color = d3.scaleOrdinal()
.domain(["setosa", "versicolor", "virginica" ])
.range([ "#440154ff", "#21908dff", "#fde725ff"])

// Add dots
svg.append('g')
.selectAll("dot")
.data(data)
.enter()
.append("circle")
  .attr("cx", function (d) { return x(d.Sepal_Length); } )
  .attr("cy", function (d) { return y(d.Petal_Length); } )
  .attr("r", 5)
  .style("fill", function (d) { return color(d.Species) } )




}

export default createScatterplot;
