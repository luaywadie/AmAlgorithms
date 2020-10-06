import React, { Component } from 'react';
import createScatterplot from '../graph-builders/scatterplot-builder';
import * as d3 from 'd3';
import kMeans from '../algorithms/clustering-algorithms/k-means';

class ScatterPlotAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.scatter = document.getElementById('graph-container');
    
    }
  
    async componentDidMount(){
      //Load in the clustering csv data
      const points = await d3.csv("https://raw.githubusercontent.com/luaywadie/AmAlgorithms/clustering/visualizations-app/src/data/cluster_data.csv");
      createScatterplot(points);
      kMeans(points, 3);
    }

  componentWillUnmount() {
    let svg = document.getElementById('scatter-svg');
    if (this.scatter.hasChildNodes()) this.scatter.removeChild(svg);
  }

  render() {
    return (
      <div>
          
      </div>
    );
  }
}

export default ScatterPlotAlgorithms;
