import React, { Component } from 'react';
import createGraph from '../graph-builder/graph-builder';
class GraphAlgorithms extends Component {
  constructor(props) {
    super(props);
    createGraph();
    let el = document.getElementById('linkId_cat-mammal');
  }
  render() {
    return <div>Dijkstra coming soon</div>;
  }
}

export default GraphAlgorithms;
