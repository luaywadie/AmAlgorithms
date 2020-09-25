import * as d3 from 'd3';

function createGraph() {
  let nodes = [
    { id: 'mammal', group: 0, level: 1 },
    { id: 'dog', group: 0, level: 2 },
    { id: 'cat', group: 0, level: 2 },
    { id: 'fox', group: 0, level: 2 },
    { id: 'elk', group: 0, level: 2 },
    { id: 'insect', group: 1, level: 1 },
    { id: 'ant', group: 1, level: 2 },
    { id: 'bee', group: 1, level: 2 },
    { id: 'fish', group: 2, level: 1 },
    { id: 'carp', group: 2, level: 2 },
    { id: 'pike', group: 2, level: 2 },
  ];

  let groupRef = {
    0: 'mammal',
    1: 'insect',
    2: 'fish',
  };

  let links = [
    { target: 'mammal', source: 'dog', strength: 0.7 },
    { target: 'mammal', source: 'cat', strength: 0.7 },
    { target: 'mammal', source: 'fox', strength: 0.7 },
    { target: 'mammal', source: 'elk', strength: 0.7 },
    { target: 'insect', source: 'ant', strength: 0.7 },
    { target: 'insect', source: 'bee', strength: 0.7 },
    { target: 'fish', source: 'carp', strength: 0.7 },
    { target: 'fish', source: 'pike', strength: 0.7 },
    { target: 'cat', source: 'elk', strength: 0.7 },
    { target: 'carp', source: 'ant', strength: 0.7 },
    { target: 'elk', source: 'bee', strength: 0.7 },
    { target: 'dog', source: 'cat', strength: 0.7 },
    { target: 'fox', source: 'ant', strength: 0.7 },
    { target: 'pike', source: 'dog', strength: 0.7 },
  ];
  const margin = { top: 20, right: 90, bottom: 30, left: -50 },
    width = 900 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

  function getNodeColor(node) {
    return node.level === 1 ? 'red' : 'gray';
  }

  // var width = window.innerWidth
  // var height = window.innerHeight

  var svg = d3.select('svg');

  svg.attr('width', width).attr('height', height);
  // .attr('id', String)
  // .attr('refX', 30)
  // .attr('refY', -4.5)
  // .attr('markerWidth', 6)
  // .attr('markerHeight', 6)
  // .attr('orient', 'auto');
  // .append('svg:line')
  // .attr('d', 'M0,-5L10,0L0,5');

  // simulation setup with all forces
  var linkForce = d3
    .forceLink()
    .id(function (link) {
      return link.id;
    })
    .strength(function (link) {
      return link.strength;
    });

  var simulation = d3
    .forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-120))
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
    .attr('class', function (d) {
      return 'link ' + d.type;
    })
    .attr('id', function (d, i) {
      return 'linkId_' + i;
    })
    .attr('marker-end', function (d) {
      return 'url(#' + d.source + '-' + d.target + ')';
    });

  var edgelabels = svg.append('g').selectAll('.edgelabel').data(links);
  edgelabels
    .enter()
    .append('text')
    .style('pointer-events', 'none')
    .attr({
      class: 'edgelabel',
      id: function (d, i) {
        return 'edgelabel' + i;
      },
      dx: 80,
      dy: 0,
      'font-size': 10,
      fill: '#aaa',
    });

  edgelabels
    .append('textPath')
    .attr('xlink:href', function (d, i) {
      return '#edgepath' + i;
    })
    .style('pointer-events', 'none')
    .text(function (d, i) {
      return 'label ' + i;
    });

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', '25')
    .attr('refY', '0')
    .attr('orient', 'auto')
    .attr('markerWidth', '10')
    .attr('markerHeight', '10')
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#ccc')
    .attr('stroke', '#ccc');

  // var linktext = svg.append('g').selectAll('g.linklabelholder').data(links);

  // linktext
  //   .enter()
  //   .append('g')
  //   .attr('class', 'linklabelholder')
  //   .append('text')
  //   .attr('class', 'linklabel')
  //   .style('font-size', '13px')
  //   .attr('x', '50')
  //   .attr('y', '-20')
  //   .attr('text-anchor', 'start')
  //   .style('fill', '#100')
  //   .append('textPath')
  //   .attr('xlink:href', function (d, i) {
  //     return '#link_ID' + i;
  //   })
  //   .text(function (d) {
  //     return d.strength;
  //   });

  // var linktext = svg.append('g').selectAll('g.linklabelholder').data(links);

  // linktext
  //   .enter()
  //   .append('g')
  //   .attr('class', 'linklabelholder')
  //   .append('text')
  //   .attr('class', 'linklabel')
  //   .style('font-size', '13px')
  //   .attr('x', '50')
  //   .attr('y', '-20')
  //   .attr('text-anchor', 'start')
  //   .style('fill', '#000')
  //   .attr('text-anchor', 'middle')
  //   .append('textPath')
  //   .attr('xlink:href', (d, i) => d.source + '-' + d.target)
  //   .text((d) => d.source + '-' + d.target);

  var nodeElements = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', 10)
    .attr('fill', getNodeColor);

  var textElements = svg
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
    textElements
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

    edgelabels.attr('transform', function (d, i) {
      if (d.target.x < d.source.x) {
        let bbox = this.getBBox();
        let rx = bbox.x + bbox.width / 2;
        let ry = bbox.y + bbox.height / 2;
        return 'rotate(180 ' + rx + ' ' + ry + ')';
      } else {
        return 'rotate(0)';
      }
    });
  });

  simulation.force('link').links(links);
}

export default createGraph;
