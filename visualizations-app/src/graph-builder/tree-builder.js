import * as d3 from 'd3';

function buildTreeDataFromAdjList(adjList) {
  let treeData = {};
  let root = true;
  for (let [node, children] of Object.entries(adjList)) {
    if (root === true) {
      treeData[node] = {
        name: node,
        value: 15,
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
          value: 15,
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
      .select('#tree-img')
      .append('svg')
      .attr('id', 'tree-svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom),
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
        d.x +
        ',' +
        d.y +
        'C' +
        (d.x + d.parent.x) / 2 +
        ',' +
        d.y +
        ' ' +
        (d.x + d.parent.x) / 2 +
        ',' +
        d.parent.y +
        ' ' +
        d.parent.x +
        ',' +
        d.parent.y
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
    .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

  // adds the circle to the node
  node
    .append('circle')
    .attr('r', (d) => d.data.value)
    .attr('id', (d) => d.data.name)
    .style('stroke', (d) => d.data.type)
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
