import React, { Component } from 'react';
import createScatterplot from '../graph-builders/scatterplot-builder';
import * as d3 from 'd3';
import KMeans from './algorithms/clustering-algorithms/KMeans';
import fs from 'fs';

class ScatterPlotAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 2,
      k: 5,
      points: [],
    };
  }

  async componentDidMount() {
    //Load in the csv data points (2D) as an object
    let x = await d3.csv('https://raw.githubusercontent.com/luaywadie/AmAlgorithms/master/visualizations-app/src/data/cluster_data.csv');
    this.setState({points: x});
      //imported from scatterplot-builder
    createScatterplot(this.state.points);

    this.scatter = document.getElementById('graph-container');
  }

  componentWillUnmount() {
    let svg = document.getElementById('scatter-svg');
    if (this.scatter.hasChildNodes()) this.scatter.removeChild(svg);
  }

  setPoints = (ps) => this.setState({points: ps});

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

  reset = () => {

    //Remove all centroids from the DOM
    const centroidGroup = document.getElementById("centroid-group");
    centroidGroup.parentNode.removeChild(centroidGroup);

    //Clear the class list of each circle on scatterplot (reset) and restore to 'unassigned' state
    let circleElements = document.getElementsByTagName('circle');
    for (let i = 0; i < circleElements.length; i++) {
        //Remove the classes and reset the point to 'unassigned'
        circleElements[i].setAttribute('class', '');
        circleElements[i].classList.add('cluster-unassigned');
      }
    //Set state
    if(this.state.stop) {
      this.setState({ stop: false, pause: false });
    }
  };

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
              k={this.state.k}
              setPoints={this.setPoints}
            />
            <div className={'divider'}></div>
            <button
              className="graph-button"
              onClick={ async () => {
                // this.setState( (state, props) =>
                //   ({...this.state, pause: false, stop: true }) );
                await this.setState({pause: false, stop:true});
                this.reset();
              }
              }
            >
            Reset
            </button>
            <div className={'divider'}></div>
            <button
            onClick={() => {
              this.setState({ pause: !this.state.pause });
            }}
          >
            {this.state.pause ? 'UnPause' : 'Pause'}
          </button>
            <form onSubmit={(event) => event.preventDefault()}>
            <label>
              Number of Clusters (K):
              <input
                style={{ width: '50px' }}
                type="number"
                value={this.state.k}
                onChange={(event) =>
                  this.setState({
                    k: event.target.value,
                  })
                }
              />
            </label>
          </form>
          <form onSubmit={(event) => event.preventDefault()}>
          <label>
            Speed:
            <input
              style={{ width: '50px' }}
              type="number"
              value={this.state.speed}
              onChange={(event) =>
                this.setState({
                  speed: event.target.value,
                })
              }
            />
          </label>
        </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ScatterPlotAlgorithms;
