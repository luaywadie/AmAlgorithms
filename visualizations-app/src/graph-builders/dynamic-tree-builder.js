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

  return treeData;
}
function getMin(adjList) {
  let min = Infinity;
  Object.keys(adjList).forEach((key) => {
    if (Number(key) < min) {
      min = Number(key);
    }
  });
  return min;
}
let nextInsertLocation;
function createDynamicTree(adjList) {
  let min = getMin(adjList);
  let treeData = buildTreeDataFromAdjList(adjList)[min];
  let myScale = 1.5;
  const margin = { top: 20, right: 90, bottom: 30, left: -50 },
    width = 900 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

  let treemap = d3.tree().size([height, width]);

  let nodes = d3.hierarchy(treeData, (d) => d.children);

  nodes = treemap(nodes);

  const svg = d3
      .select('#graph-container')
      .append('svg')
      .attr('id', 'heap-tree-svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'graph'),
    g = svg
      .append('g')
      .attr('class', 'circle-target-g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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
    .attr('r', (d) => 10)
    .attr('class', (d) => 'node-' + d.data.name)
    .attr('id', (d) => d.data.name);

  // adds the text to the node
  node
    .append('text')
    .attr('class', (d) => 'node-' + d.data.name + '-text')
    .attr('dy', '.35em')
    .attr('x', (d) => (d.children ? (d.data.value + 5) * -1 : d.data.value + 5))
    .attr('y', (d) =>
      d.children && d.depth !== 0 ? -(d.data.value + 5) : d.data.value
    )
    .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
    .text((d) => d.data.name);
}

function insertIntoDynamicTree(parent, adjList) {
  this.dataStructure = document.getElementById('graph-container');
  let svg_l = document.getElementById('heap-tree-svg');
  if (this.dataStructure.hasChildNodes()) this.dataStructure.removeChild(svg_l);

  let treeData = buildTreeDataFromAdjList(adjList)[parent];
  let myScale = 1.5;
  const margin = { top: 20, right: 90, bottom: 30, left: -50 },
    width = 900 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

  // declares a tree layout and assigns the size
  let treemap = d3.tree().size([height, width]);
  let nodes = d3.hierarchy(treeData, (d) => d.children);
  nodes = treemap(nodes);

  const svg = d3
      .select('#graph-container')
      .append('svg')
      .attr('id', 'heap-tree-svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'graph'),
    g = svg
      .append('g')
      .attr('class', 'circle-target-g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  g.selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter()
    .append('path')
    .attr(
      'class',
      (d) => 'heap-link ' + d.data.name + 'link ' + ' heap-link-' + d.data.name
    )
    .attr('id', (d) => d.data.name + 'link') // d.parent.data.name + '-' + d.data.name
    .style('stroke', '#ccc')
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
    .attr('r', (d) => 10)
    .attr('class', (d) => 'node-' + d.data.name)
    .attr('id', (d) => d.data.name);
  node
    .append('text')
    .attr('class', (d) => 'node-' + d.data.name + '-text')
    .attr('dy', '.35em')
    .attr('x', (d) => (d.children ? (d.data.value + 5) * -1 : d.data.value + 5))
    .attr('y', (d) =>
      d.children && d.depth !== 0 ? -(d.data.value + 5) : d.data.value
    )
    .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
    .text((d) => d.data.name);
}

function swap(p, c) {
  let parentText = d3.select('.node-' + p + '-text');
  let childText = d3.select('.node-' + c + '-text');
  parentText.attr('class', 'node-' + c + '-text');
  childText.attr('class', 'node-' + p + '-text');
  parentText.text(c);
  childText.text(p);

  let parentCircle = d3.select('.node-' + p);
  let childCircle = d3.select('.node-' + c);
  parentCircle.attr('class', 'node-' + c);
  childCircle.attr('class', 'node-' + p);
  parentCircle.attr('id', c);
  childCircle.attr('id', p);

  let parentG = d3.select('.g-node-' + p);
  let childG = d3.select('.g-node-' + c);
  parentG.attr('class', 'node  node--internal  g-node-' + c);
  childG.attr('class', 'node  node--internal  g-node-' + p);

  let childLink = d3.select('.heap-link-' + c);
  childLink.attr('class', 'heap-link ' + p + 'link ' + 'heap-link-' + p);
  childLink.attr('id', p + 'link');
}

export default { createDynamicTree, insertIntoDynamicTree, swap };

// Animations

// let bfsA = bfs(adjList, min);
// let totalDelay = 0;
// bfsA.forEach((key, i) => {
//   let prevDelay = totalDelay;
//   d3.select('.heap-link-' + key)
//     .transition()
//     .duration(100)
//     .delay(() => {
//       totalDelay += 1000;
//       return totalDelay;
//     })
//     .attr('stroke', '#ccc');
//   d3.select('.node-' + key)
//     .transition()
//     .duration(100)
//     .delay(() => prevDelay + 1000)
//     .attr('r', () => 10);

//   d3.select('.g-node-' + key)
//     .append('text')
//     .transition()
//     .duration(100)
//     .delay(() => prevDelay + 1000)
//     .attr('dy', '.35em')
//     .attr('x', (d) =>
//       d.children ? (d.data.value + 5) * -1 : d.data.value + 5
//     )
//     .attr('y', (d) =>
//       d.children && d.depth !== 0 ? -(d.data.value + 5) : d.data.value
//     )
//     .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
//     .text((d) => d.data.name);
// });
