import * as d3 from 'd3';

function buildNetwork() {
  var width = 960,
    height = 600,
    nodeSize = 60;

  let nodes = [
    { label: 'i0', layer: 1, bias: 1, color: '#73a0f3' },
    { label: 'i1', layer: 1, bias: 0, color: '#73a0f3' },
    { label: 'h0', layer: 2, bias: 1, color: 'turquoise' },
    { label: 'h1', layer: 2, bias: -6, color: 'turquoise' },
    { label: 'o0', layer: 3, bias: -3.93, color: '#2dea2d' },
  ];

  // var color = d3.scaleOrdinal(d3.schemeCategory10);
  let linkNames = ['i0-h0', 'i0-h1', 'i1-h0', 'i1-h1', 'h0-o0', 'h1-o0'];
  var svg = d3
    .select('#graph-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('z-index', -1)
    .attr('transform', 'translate(' + -100 + ',' + -50 + ')');

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

  let wIndex = {
    '0-2': 'W\u208000',
    '0-3': 'W\u208001',
    '1-2': 'W\u208010',
    '1-3': 'W\u208011',
    '2-4': 'W\u20810',
    '3-4': 'W\u20811',
  };

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
            label: wIndex[i + '-' + n],
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

  var linkTextElements = svg
    .append('g')
    .attr('class', 'link_texts')
    .selectAll('text')
    .data(links)
    .enter()
    .append('text')
    .text(function (link) {
      return link.label;
    })
    .attr('font-size', 15)
    .attr('dx', 0)
    .attr('dy', (d, i) => {
      if (i === 1 || i === 2) {
        return 105;
      }
      return 20;
    })
    .attr('x', (d, i) => {
      if (i === 1 || i === 2) {
        return (0.5 * nodes[d.source].x + nodes[d.target].x) / 2;
      }
      return (nodes[d.source].x + nodes[d.target].x) / 2;
    })
    .attr('y', (d, i) => {
      if (i === 1 || i === 2) {
        return (0.35 * nodes[d.source].y + nodes[d.target].y) / 2;
      }
      return (nodes[d.source].y + nodes[d.target].y) / 2;
    });

  linkTextElements
    .data(nodes)
    .enter()
    .attr('x', function (link) {
      console.log(link);
      return (link.x1 + link.x2) / 2;
    })
    .attr('y', function (link) {
      return (link.source.y + link.target.y) / 2;
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
    .attr('stroke', 'black')
    .attr('stroke-width', '3px')
    .style('fill', function (d) {
      return d.color;
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
    //.attr('dy', '-1.55em')
    .attr('dy', function (d, i) {
      if (i <= 1) {
        return '0em';
      }
      return '-1.55em';
    })
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

  // node
  //   .append('text')
  //   .attr('dx', '-1.6em')
  //   .attr('dy', '8.5em')
  //   .attr('id', (d) => `${d.label}-error`)
  //   .attr('font-size', '24px')
  //   .text(function (d, i) {
  //     if (i == 4) {
  //       return 'error = ?';
  //     }
  //   });
  node
    .append('text')
    .attr('dx', '-1.7em')
    .attr('dy', '5em')
    .attr('id', (d) => `${d.label}-target`)
    .attr('font-size', '24px')
    .text(function (d, i) {
      if (i == 4) {
        return 'target = 1';
      }
    });
  node
    .append('text')
    .attr('dx', '-1.7em')
    .attr('dy', '6.6em')
    .attr('id', (d) => `${d.label}-output`)
    .attr('font-size', '24px')
    .text(function (d, i) {
      if (i == 4) {
        return 'output = ?';
      }
    });
}

// https://react-bootstrap.github.io/components/overlays/

export default buildNetwork;
