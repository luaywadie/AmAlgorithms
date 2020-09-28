import * as d3 from 'd3';

function createGraph() {
  let nodes = [
    { id: 'a', level: 2 },
    { id: 'b', level: 2 },
    { id: 'c', level: 2 },
    { id: 'd', level: 2 },
    { id: 'e', level: 2 },
    { id: 'f', level: 2 },
    { id: 'g', level: 2 },
    { id: 'h', level: 2 },
    { id: 'i', level: 2 },
    { id: 'j', level: 2 },
    { id: 'k', level: 2 },
    { id: 'l', level: 2 },
    { id: 'm', level: 2 },
    { id: 'n', level: 2 },
    { id: 'o', level: 2 },
    { id: 'p', level: 2 },
    { id: 'q', level: 2 },
    { id: 's', level: 2 },
    { id: 'target', level: 1 },
    { id: 't', level: 2 },
    { id: 'source', level: 1 },
  ];

  let strength = 0.001;
  let links = [
    { target: 'a', source: 'b', strength: strength, cost: 10 },
    { target: 'a', source: 'c', strength: strength, cost: 7 },
    { target: 'a', source: 'd', strength: 20 * strength, cost: 8 },
    { target: 'b', source: 'd', strength: 20 * strength, cost: 9 },
    { target: 'b', source: 'e', strength: strength, cost: 11 },
    { target: 'e', source: 'c', strength: strength, cost: 9 },
    { target: 'f', source: 'c', strength: 0.05, cost: 7 },
    { target: 'f', source: 'b', strength: 0.05, cost: 8 },
    { target: 'f', source: 'a', strength: 0.05, cost: 6 },
    { target: 'f', source: 'e', strength: 0.05, cost: 6 },
    { target: 'a', source: 'g', strength: 0.26, cost: 3 },
    { target: 'h', source: 'g', strength: 0.26, cost: 3 },
    { target: 'c', source: 'h', strength: 0.6, cost: 2 },
    { target: 'i', source: 'g', strength: 0.026, cost: 4 },
    { target: 'a', source: 'i', strength: strength, cost: 5 },
    { target: 'd', source: 'i', strength: 20 * strength, cost: 10 },
    { target: 'j', source: 'b', strength: strength, cost: 8 },
    { target: 'j', source: 'e', strength: strength, cost: 10 },
    { target: 'i', source: 'k', strength: 15 * strength, cost: 14 },
    { target: 'c', source: 'k', strength: 15 * strength, cost: 5 },
    { target: 'e', source: 'k', strength: 15 * strength, cost: 10 },
    { target: 'g', source: 'k', strength: 15 * strength, cost: 10 },
    { target: 'l', source: 'j', strength: 20 * strength, cost: 10 },
    { target: 'l', source: 'd', strength: 20 * strength, cost: 9 },
    { target: 'l', source: 'b', strength: 20 * strength, cost: 8 },
    { target: 'm', source: 'e', strength: 20 * strength, cost: 6 },
    { target: 'm', source: 'k', strength: 20 * strength, cost: 8 },
    { target: 'm', source: 'j', strength: 20 * strength, cost: 11 },
    { target: 'n', source: 'i', strength: 40 * strength, cost: 7 },
    { target: 'n', source: 'k', strength: 50 * strength, cost: 6 },
    { target: 'o', source: 'l', strength: 40 * strength, cost: 5 },
    { target: 'o', source: 'j', strength: 40 * strength, cost: 6 },
    { target: 'p', source: 'm', strength: 40 * strength, cost: 7 },
    { target: 'p', source: 'k', strength: 40 * strength, cost: 6 },
    { target: 'q', source: 'd', strength: 80 * strength, cost: 5 },
    { target: 'q', source: 'i', strength: 40 * strength, cost: 8 },
    { target: 's', source: 'b', strength: 100 * strength, cost: 4 },
    { target: 's', source: 'e', strength: 40 * strength, cost: 9 },
    { target: 's', source: 'j', strength: 40 * strength, cost: 5 },
    { target: 'target', source: 'q', strength: 100 * strength, cost: 3 },
    { target: 'target', source: 'd', strength: 100 * strength, cost: 4 },
    { target: 'source', source: 'm', strength: strength, cost: 6 },
    { target: 'source', source: 'j', strength: 20 * strength, cost: 15 },
    { target: 'source', source: 'p', strength: 20 * strength, cost: 9 },
    { target: 't', source: 'd', strength: 100 * strength, cost: 6 },
    { target: 't', source: 'l', strength: 100 * strength, cost: 4 },
  ];
  const margin = { top: 20, right: 50, bottom: 50, left: -10 },
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  function getNodeColor(node) {
    return node.level === 1 ? 'red' : 'gray';
  }

  var svg = d3
    .select('#graph-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('id', 'graph-svg')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'graph');
  // simulation setup with all forces
  var linkForce = d3
    .forceLink()
    .id(function (link) {
      return link.id;
    })
    .strength(function (link) {
      return link.strength / 0.9;
    });

  var simulation = d3
    .forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-170))
    .force('center', d3.forceCenter(width / 2, height / 2));

  var linkElements = svg
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke-width', 1)
    .attr('stroke', 'rgba(50, 50, 50, 0.2)')
    .attr('id', (d) => {
      if (d.source < d.target) {
        return d.source + '-' + d.target;
      }
      return d.target + '-' + d.source;
    });

  var linkTextElements = svg
    .append('g')
    .attr('class', 'link_texts')
    .selectAll('text')
    .data(links)
    .enter()
    .append('text')
    .text(function (link) {
      return link.cost;
    })
    .attr('font-size', 15)
    .attr('dx', 0)
    .attr('dy', 0);

  var nodeElements = svg
    .append('g')
    .attr('class', 'node')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', 10)
    .attr('fill', getNodeColor)
    .attr('id', (d) => d.id);

  var nodeTextElements = svg
    .append('g')
    .attr('class', 'texts')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .text(function (node) {
      return node.id;
    })
    .attr('font-size', 15)
    .attr('dx', 15)
    .attr('dy', 4);

  simulation.nodes(nodes).on('tick', () => {
    nodeElements
      .attr('cx', function (node) {
        return node.x;
      })
      .attr('cy', function (node) {
        return node.y;
      });
    nodeTextElements
      .attr('x', function (node) {
        return node.x;
      })
      .attr('y', function (node) {
        return node.y;
      });

    linkElements
      .attr('x1', function (link) {
        return link.source.x;
      })
      .attr('y1', function (link) {
        return link.source.y;
      })
      .attr('x2', function (link) {
        return link.target.x;
      })
      .attr('y2', function (link) {
        return link.target.y;
      });

    linkTextElements
      .attr('x', function (link) {
        return (link.source.x + link.target.x) / 2;
      })
      .attr('y', function (link) {
        return (link.source.y + link.target.y) / 2;
      });
  });

  simulation.force('link').links(links);
}

export default createGraph;
