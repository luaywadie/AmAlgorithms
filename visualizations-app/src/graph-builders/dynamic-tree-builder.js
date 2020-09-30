import * as d3 from 'd3';
const { bfs } = require('../helpers/data-structures/bfs_helper.js');

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
      if (!treeData[node]) {
        treeData[node] = {
          name: node,
          value: 10,
          type: 'black',
          level: '',
          children: [],
        };
      }
      treeData[node].children.push(treeData[child]);
    }
  }
  let min = Infinity;
  Object.keys(adjList).forEach((key) => {
    if (Number(key) < min) {
      min = Number(key);
    }
  });
  return treeData[min];
}

function createDynamicTree(adjList) {
  let treeData = buildTreeDataFromAdjList(adjList);
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
  let z = nodes.descendants();
  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = d3
      .select('#graph-container')
      .append('svg')
      .attr('id', 'heap-tree-svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'graph'),
    g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // adds the links between the nodes
  g.selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter()
    .append('path')
    .attr(
      'class',
      (d) => 'heap-link ' + d.data.name + 'link ' + ' heap-link-' + d.data.name
    )
    .attr('id', (d) => d.data.name + 'link') // d.parent.data.name + '-' + d.data.name
    .style('stroke', 0)
    .style('stroke-width', 2)
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
  // let totalDelay2 = 0;
  // Object.keys(adjList).forEach((key, i) => {
  //   // d3.select('.heap-link-' + key)
  //   //   .transition()
  //   //   .duration(100)
  //   //   .delay(() => {
  //   //     totalDelay2 += 1000;
  //   //     return totalDelay2;
  //   //   })
  //   //   .attr('stroke', '#ccc');
  // });
  // adds each node as a group
  const node = g
    .selectAll('.node')
    .data(nodes.descendants())
    .enter()
    .append('g')
    .attr(
      'class',
      (d) =>
        'node ' +
        (d.children ? ' node--internal ' : ' node--leaf ') +
        ' g-node-' +
        d.data.name
    )
    .attr(
      'transform',
      (d) => 'translate(' + d.x / myScale + ',' + d.y / myScale + ')'
    );
  node
    .append('circle')
    .attr('r', (d) => 0)
    .attr('class', (d) => 'node-' + d.data.name)
    .attr('id', (d) => d.data.name);

  let min = Infinity;
  Object.keys(adjList).forEach((key) => {
    if (Number(key) < min) {
      min = Number(key);
    }
  });

  let bfsA = bfs(adjList, min);
  let totalDelay = 0;
  bfsA.forEach((key, i) => {
    let prevDelay = totalDelay;
    d3.select('.heap-link-' + key)
      .transition()
      .duration(100)
      .delay(() => {
        totalDelay += 1000;
        return totalDelay;
      })
      .attr('stroke', '#ccc');
    d3.select('.node-' + key)
      .transition()
      .duration(100)
      .delay(() => prevDelay + 1000)
      .attr('r', () => 10);

    d3.select('.g-node-' + key)
      .append('text')
      .transition()
      .duration(100)
      .delay(() => prevDelay + 1000)
      .attr('dy', '.35em')
      .attr('x', (d) =>
        d.children ? (d.data.value + 5) * -1 : d.data.value + 5
      )
      .attr('y', (d) =>
        d.children && d.depth !== 0 ? -(d.data.value + 5) : d.data.value
      )
      .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .text((d) => d.data.name);
  });

  // adds the text to the node
  // node
  //   .append('text')
  //   .attr('dy', '.35em')
  //   .attr('x', (d) => (d.children ? (d.data.value + 5) * -1 : d.data.value + 5))
  //   .attr('y', (d) =>
  //     d.children && d.depth !== 0 ? -(d.data.value + 5) : d.data.value
  //   )
  //   .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
  //   .text((d) => d.data.name);
}

export default createDynamicTree;
