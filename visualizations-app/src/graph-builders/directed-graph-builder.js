import * as d3 from 'd3';
import '../styles/directed-graph-builder.css';

function createDirectedGraph() {
  let nodes = [
    { id: 'g', level: 2 },
    { id: 'f', level: 2 },

    { id: 'd', level: 2 },
    { id: 'i', level: 2 },
    { id: 'e', level: 2 },
    { id: 'a', level: 2 },
    { id: 'h', level: 2 },
    { id: 'j', level: 2 },

    { id: 'c', level: 2 },
    { id: 'b', level: 2 },
  ];

  let strength = 0.001;
  let links = [
    { source: 'g', target: 'i', strength: 100 * strength },
    { source: 'g', target: 'f', strength: 20 * strength },
    { source: 'i', target: 'h', strength: 40 * strength },
    { source: 'd', target: 'g', strength: 10 * strength },
    { source: 'd', target: 'e', strength: 10 * strength },
    { source: 'd', target: 'b', strength: 20 * strength },
    { source: 'a', target: 'g', strength: 10 * strength },
    { source: 'a', target: 'b', strength: 10 * strength },
    { source: 'a', target: 'c', strength: 20 * strength },
    { source: 'j', target: 'e', strength: 50 * strength },
    { source: 'e', target: 'b', strength: 20 * strength },
    { source: 'b', target: 'f', strength: 20 * strength },
  ];
  const margin = { top: 20, right: 50, bottom: 50, left: -10 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  function getNodeColor(node) {
    return node.level === 1 ? 'red' : 'gray';
  }

  var svg = d3
    .select('#graph-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('id', 'dir-graph-svg')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'directed-graph');

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
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(width / 2, height / 2));

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', [-0, -5, 10, 10])
    .attr('refX', 19)
    .attr('refY', 0)
    .attr('markerWidth', 11)
    .attr('markerHeight', 11)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', 'rgba(50, 50, 50, 0.5)')
    .attr('stroke', 'rgba(50, 50, 50, 0.2)');

  var linkElements = svg
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke-width', 1)
    .attr('stroke', 'rgba(50, 50, 50, 0.2)')
    .attr('marker-end', 'url(#arrow)')
    .attr('id', (d) => d.source + '-' + d.target);

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
    .attr('class', 'nodes')
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

export default createDirectedGraph;
