import * as d3 from 'd3';

function buildNetwork() {
  var width = 960,
    height = 600,
    nodeSize = 60;

  let nodes = [
    { label: 'i0', layer: 1, bias: 1 },
    { label: 'i1', layer: 1, bias: 0 },
    { label: 'h0', layer: 2, bias: 1 },
    // { label: 'b0', layer: 1 },
    { label: 'h1', layer: 2, bias: -6 },
    // { label: 'b1', layer: 2 },
    // { label: 'h3', layer: 2 },
    { label: 'o0', layer: 3, bias: -3.93 },
    // { label: 'o1', layer: 3 }
  ];

  var color = d3.scaleOrdinal(d3.schemeCategory10);
  let linkNames = ['i0-h0', 'i0-h1', 'i1-h0', 'i1-h1', 'h0-o0', 'h1-o0'];
  var svg = d3
    .select('#graph-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('z-index', -1)
    .attr('transform', 'translate(' + 0 + ',' + -50 + ')');

  // get network size
  var netsize = {};
  nodes.forEach(function (d) {
    if (d.layer in netsize) {
      netsize[d.layer] += 1;
    } else {
      netsize[d.layer] = 1;
    }
    d['lidx'] = netsize[d.layer];
  });

  // calc distances between nodes
  var largestLayerSize = Math.max.apply(
    null,
    Object.keys(netsize).map(function (i) {
      return netsize[i];
    })
  );

  var xdist = width / Object.keys(netsize).length,
    ydist = height / largestLayerSize;

  // create node locations
  nodes.map(function (d) {
    d['x'] = (d.layer - 0.5) * xdist;
    d['y'] = (d.lidx - 0.5) * ydist;
  });

  // autogenerate links
  var links = [];
  nodes
    .map(function (d, i) {
      for (var n in nodes) {
        if (d.layer + 1 == nodes[n].layer) {
          links.push({
            source: parseInt(i),
            target: parseInt(n),
            value: 1,
          });
        }
      }
    })
    .filter(function (d) {
      return typeof d !== 'undefined';
    });

  // draw links
  var link = svg
    .selectAll('.link-nn')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link-nn')
    .attr('id', (d, i) => linkNames[i])
    .attr('x1', function (d) {
      return nodes[d.source].x;
    })
    .attr('y1', function (d) {
      return nodes[d.source].y;
    })
    .attr('x2', function (d) {
      return nodes[d.target].x;
    })
    .attr('y2', function (d) {
      return nodes[d.target].y;
    });

  // draw nodes
  var node = svg
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

  var circle = node
    .append('circle')
    .attr('class', 'node-nn')
    .attr('id', (d) => `${d.label}-node`)
    .attr('r', nodeSize)
    .style('fill', function (d) {
      return color(d.layer);
    });

  node
    .append('text')
    .attr('dx', '-.35em')
    .attr('dy', '-4.15em')
    .attr('id', (d) => `${d.label}-label`)
    .text(function (d) {
      return `${d.label}`;
    });

  node
    .append('text')
    .attr('dx', '-1.7em')
    .attr('dy', '-1.55em')
    .attr('id', (d) => `${d.label}-bias`)
    .text(function (d, i) {
      if (i <= 1) {
        return 'X = ' + d.bias;
      }
      return 'b = ' + d.bias;
    });

  node
    .append('text')
    .attr('dx', '-1.7em')
    .attr('dy', '0em')
    .attr('id', (d) => `${d.label}-net`)
    .text(function (d, i) {
      if (i <= 1) {
        return;
      }
      return 'net = ?';
    });
  node
    .append('text')
    .attr('dx', '-1.7em')
    .attr('dy', '1.50em')
    .attr('id', (d) => `${d.label}-out`)
    .text(function (d, i) {
      if (i <= 1) {
        return;
      }
      return 'out = ?';
    });

  node
    .append('text')
    .attr('dx', '4.5em')
    .attr('dy', '1em')
    .attr('id', (d) => `${d.label}-error`)
    .text(function (d, i) {
      if (i == 4) {
        return 'error = ?';
      }
    });
  node
    .append('text')
    .attr('dx', '4.5em')
    .attr('dy', '-2em')
    .attr('id', (d) => `${d.label}-target`)
    .text(function (d, i) {
      if (i == 4) {
        return 'target = 1';
      }
    });
  node
    .append('text')
    .attr('dx', '4.5em')
    .attr('dy', '-.5em')
    .attr('id', (d) => `${d.label}-output`)
    .text(function (d, i) {
      if (i == 4) {
        return 'output = ?';
      }
    });
}

// https://react-bootstrap.github.io/components/overlays/

export default buildNetwork;
