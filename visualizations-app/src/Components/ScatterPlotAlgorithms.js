import React, { Component } from 'react';
import createScatterplot from '../graph-builders/scatterplot-builder';
import * as d3 from 'd3';
import KMeans from '../algorithms/clustering-algorithms/KMeans';

class ScatterPlotAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      points: [],
    };
  }

  async componentDidMount() {
    //Load in the csv data points (2D) as an object
    let x = await d3.csv('https://raw.githubusercontent.com/luaywadie/AmAlgorithms/clustering/visualizations-app/src/data/cluster_data.csv');
    this.setState({points: x});
      //imported from scatterplot-builder
    createScatterplot(this.state.points);
    
    this.scatter = document.getElementById('graph-container');
  }

  componentWillUnmount() {
    let svg = document.getElementById('scatter-svg');
    if (this.scatter.hasChildNodes()) this.scatter.removeChild(svg);
  }

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

  render() {
    return (
      <div>
        <div className={'row'}>
          <div className={'col-6'} id={'graph-container'}>
            <KMeans 
              points={this.state.points}
              pause={this.state.pause}
              stop={this.state.stop}
              speed={this.state.speed}

            />
          </div>
        </div>
      </div>
    );
  }
}

export default ScatterPlotAlgorithms;
