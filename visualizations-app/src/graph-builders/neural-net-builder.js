import * as d3 from 'd3';

export function buildNetwork(x) {
  var width = 960,
    height = 600,
    nodeSize = 60;

  let nodes = [
    { label: 'i0', layer: 1, bias: x[0], color: '#73a0f3' },
    { label: 'i1', layer: 1, bias: x[1], color: '#73a0f3' },
    { label: 'h0', layer: 2, bias: 1, color: 'turquoise' },
    { label: 'h1', layer: 2, bias: -6, color: 'turquoise' },
    { label: 'o0', layer: 3, bias: -3.93, color: '#2dea2d' },
  ];

  // var color = d3.scaleOrdinal(d3.schemeCategory10);
  let linkNames = ['i0-h0', 'i0-h1', 'i1-h0', 'i1-h1', 'h0-o0', 'h1-o0'];
  var svg = d3
    .select('#graph-container')
    .append('svg')
    .attr('id', 'nn-svg')
    .attr('width', width)
    .attr('height', height)
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
  nodes.map(function (d, i) {
    if (i === 4) {
      d['x'] = (d.layer - 0.5) * xdist * 0.9;
      d['y'] = (d.lidx - 0.5) * ydist * 2;
    } else {
      d['x'] = (d.layer - 0.5) * xdist;
      d['y'] = (d.lidx - 0.5) * ydist;
    }
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

  node
    .append('text')
    .attr('dx', '-2.7em')
    .attr('dy', '-4.5em')
    .attr('id', (d) => `${d.label}-error`)
    .attr('font-size', '36px')
    .text(function (d, i) {
      if (i === 4) {
        return 'Error = ?';
      }
    });
  node
    .append('text')
    .attr('dx', '-2.7em')
    .attr('dy', '-7.5em')
    .attr('id', (d) => `${d.label}-target`)
    .attr('font-size', '36px')
    .text(function (d, i) {
      if (i === 4) {
        return 'Target = 1';
      }
    });
  node
    .append('text')
    .attr('dx', '-2.7em')
    .attr('dy', '-6em')
    .attr('id', (d) => `${d.label}-output`)
    .attr('font-size', '36px')
    .text(function (d, i) {
      if (i === 4) {
        return 'Output = ?';
      }
    });
}
export function plotLoss(data) {
  var outerWidth = 700,
    outerHeight = 500; // includes margins

  var margin = { top: 100, right: 20, bottom: 80, left: 80 }; // clockwise as in CSS

  var width = outerWidth - margin.left - margin.right, // width of plot inside margins
    height = outerHeight - margin.top - margin.bottom; // height   "     "

  document.body.style.margin = '0px'; // Eliminate default margin from <body> element

  // var data = [
  //   { x: 0, y: 0 },
  //   { x: 1, y: 30 },
  //   { x: 2, y: 40 },
  //   { x: 3, y: 20 },
  //   { x: 4, y: 90 },
  //   { x: 5, y: 70 },
  // ];

  function xValue(d) {
    return d.x;
  } // accessors
  function yValue(d) {
    return d.y;
  }

  var x = d3
    .scaleLinear() // interpolator for X axis -- inner plot region
    .domain(d3.extent(data, xValue))
    .range([0, width]);

  var y = d3
    .scaleLinear() // interpolator for Y axis -- inner plot region
    .domain(d3.extent(data, yValue))
    .range([height, 0]); // remember, (0,0) is upper left -- this reverses "y"

  var line = d3
    .line() // SVG line generator
    .x(function (d) {
      return x(d.x);
    })
    .y(function (d) {
      return y(d.y);
    });

  var xAxis = d3.axisBottom(x).ticks(5); // request 5 ticks on the x axis

  var yAxis = d3
    .axisLeft(y) // y Axis
    .ticks(4);

  var svg = d3
    .select('#loss-plot')
    .append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight); // Note: ok to leave this without units, implied "px"

  var g = svg
    .append('g') // <g> element is the inner plot area (i.e., inside the margins)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  g.append('g') // render the Y axis in the inner plot area
    .attr('class', 'y axis')
    .call(yAxis);

  g.append('g') // render the X axis in the inner plot area
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')') // axis runs along lower part of graph
    .call(xAxis);

  g.append('text') // outer x-axis label
    .attr('class', 'x label')
    .attr('text-anchor', 'end')
    .attr('x', width / 2)
    .attr('y', height + (2 * margin.bottom) / 3 + 6)
    .text('Iterations');

  g.append('text') // plot title
    .attr('class', 'x label')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', -margin.top / 2)
    .attr('dy', '+.75em')
    .text('Loss vs Iterations');

  g.append('text') // outer y-axis label
    .attr('class', 'x label')
    .attr('text-anchor', 'middle')
    .attr('x', -height / 2)
    .attr('y', -6 - margin.left / 3)
    .attr('dy', '-.75em')
    .attr('transform', 'rotate(-90)')
    .text('Loss');

  g.append('path') // plot the data as a line
    .datum(data)
    .attr('class', 'line')
    .attr('d', line)
    .style('fill', 'none')
    .style('stroke', '#fff')
    .transition()
    .delay(500)
    .duration(1000)
    .style('stroke', '#000');

  g.selectAll('.dot') // plot a circle at each data location
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', function (d) {
      return x(d.x);
    })
    .attr('cy', function (d) {
      return y(d.y);
    })
    .attr('r', 3);
}
// https://react-bootstrap.github.io/components/overlays/

export default buildNetwork;
