import * as d3 from 'd3';
import '../styles/tree-builder.css';
function buildTreeDataFromAdjList(adjList) {
  let treeData = {};
  let root = true;
  for (let [node, children] of Object.entries(adjList)) {
    if (root === true) {
      treeData[node] = {
        name: node,
        value: 10,
        type: 'black',
        level: '',
        children: [],
      };
      root = false;
    }
    for (let child of children) {
      if (!treeData[child]) {
        treeData[child] = {
          name: child,
          value: 10,
          type: 'black',
          level: '',
          children: [],
        };
      }
      treeData[node].children.push(treeData[child]);
    }
  }
  return treeData;
}

function createTree(adjList) {
  let treeData = buildTreeDataFromAdjList(adjList)['a'];
  let myScale = 1.5;
  // set the dimensions and margins of the diagram
  const margin = { top: 20, right: 90, bottom: 30, left: -50 },
    width = 900 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

  // declares a tree layout and assigns the size
  const treemap = d3.tree().size([height, width]);

  //  assigns the data to a hierarchy using parent-child relationships
  let nodes = d3.hierarchy(treeData, (d) => d.children);

  // maps the node data to the tree layout
  nodes = treemap(nodes);

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = d3
      .select('#graph-container')
      .append('svg')
      .attr('id', 'tree-svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'tree-graph'),
    g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  // adds the links between the nodes
  const link = g
    .selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter()
    .append('path')
    .attr('class', (d) => 'link' + d.data.name, 'link')
    .attr('class', 'link')
    .attr('id', (d) => d.data.name + 'link') // d.parent.data.name + '-' + d.data.name
    .style('stroke', (d) => d.data.level)
    .attr('d', (d) => {
      return (
        'M' +
        d.x / myScale +
        ',' +
        d.y / myScale +
        'C' +
        (d.x + d.parent.x) / myScale / 2 +
        ',' +
        d.y / myScale +
        ' ' +
        (d.x + d.parent.x) / myScale / 2 +
        ',' +
        d.parent.y / myScale +
        ' ' +
        d.parent.x / myScale +
        ',' +
        d.parent.y / myScale
      );
    });

  // adds each node as a group
  const node = g
    .selectAll('.node')
    .data(nodes.descendants())
    .enter()
    .append('g')
    .attr(
      'class',
      (d) => 'node' + (d.children ? ' node--internal' : ' node--leaf')
    )
    .attr(
      'transform',
      (d) => 'translate(' + d.x / myScale + ',' + d.y / myScale + ')'
    );

  // adds the circle to the node
  node
    .append('circle')
    .attr('r', (d) => d.data.value)
    .attr('id', (d) => d.data.name)
    .style('stroke', (d) => d.data.type)
    .style('stroke-width', '1px')
    .style('fill', (d) => d.data.level);

  // adds the text to the node
  node
    .append('text')
    .attr('dy', '.35em')
    .attr('x', (d) => (d.children ? (d.data.value + 5) * -1 : d.data.value + 5))
    .attr('y', (d) => (d.children && d.depth !== 0 ? -(d.data.value + 5) : d))
    .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
    .text((d) => d.data.name);
}

export default createTree;
// export default buildTreeDataFromAdjList;
