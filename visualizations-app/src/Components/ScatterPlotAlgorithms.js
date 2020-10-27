import React, { Component } from 'react';
import createScatterplot from '../graph-builders/scatterplot-builder';
import * as d3 from 'd3';
import KMeans from './algorithms/clustering-algorithms/KMeans';

class ScatterPlotAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      runningAlg: null,
      k: 5,
      points: [],
      animationQueue: []
    };
  }

  setPoints = (ps) => this.setState({points: ps});
  setAnimationQueue = (q) => this.setState({animationQueue: q});

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

  setRunningAlg = (alg) => {
    this.reset();
    this.setState({ runningAlg: alg });
  };

  setAnimationQueue = async (aq) => {
    this.setState({ animationQueue: aq });
  }

  getPauseStatus = () => this.state.pause;
  getStopStatus = () => this.state.stop;
  getSpeedRequest = () => Number(this.state.speed) + 0.1;

  renderAnimationQueue = async () => {

  }
  
  // -----------------------------------------
  // Helper functions for renderAnimationQueue
  toggleLineHighlight(lineNum) {
    if (!lineNum) return;
    let el = document.getElementById(this.state.runningAlg + '-' + lineNum);
    el.classList.toggle('active-code-line');
  }

  colorPoint(point) {
    let pointElement = document.getElementById(
      `x:${parseFloat(point.x).toFixed(1)}-y:${parseFloat(point.y).toFixed(1)}`
    );
    let pointClasses = pointElement.classList;
    if (pointElement) {
      //if it's the first iteration, remove 'unassigned' style
      if (pointClasses.contains('cluster-unassigned')) {
        pointClasses.remove('cluster-unassigned');
      }
      //otherwise, remove the current cluster styles
      else {
        pointClasses.remove(pointClasses[0]);
      }
      //finally, add the color associated with the closest centroid
      pointClasses.add(`cluster${point.closestCentroid}`);
    }
  }

  moveIthCentroid(i, centroid) {
    d3.select(`#centroid${i}`)
      .attr('cx', this.scaleX(centroid.x))
      .attr('cy', this.scaleY(centroid.y));
  }

  //Scale point coordinates to fit on the scatter plot
  scaleX = d3.scaleLinear()
    .domain([4, 8])
    .range([0, 510]);

  scaleY = d3.scaleLinear()
    .domain([0, 7])
    .range([460, 0]);
  // -----------------------------------------


  renderKMeansPseudocode() {
    const indentation = (num) => {
      return num * 20;
    };
    return (
      <div>
        <div id={'kmeans-1'}>
          1
          <span style={{ marginLeft: indentation(1) }}>
            kMeans(<i>points</i>, <i>k</i>):
          </span>
        </div>
        <div id={'kmeans-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            <i>centroids</i> ← choose <i>k</i> random points from <i>points</i>
          </span>
        </div>
        <div id={'kmeans-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            <i>hasConverged</i> ← <b>false</b>
          </span>
        </div>
        <div id={'kmeans-4'}>
          4
          <span style={{ marginLeft: indentation(2) }}>
            <b>do</b>
          </span>
        </div>
        <div id={'kmeans-5'}>
          5
          <span style={{ marginLeft: indentation(3) }}>
            assignPointsToClosestClusterCentroids()
          </span>
        </div>
        <div id={'kmeans-6'}>
          6
          <span style={{ marginLeft: indentation(3) }}>
            <i>previousCentroids</i> ← <i>centroids</i>
          </span>
        </div>
        <div id={'kmeans-7'}>
          7
          <span style={{ marginLeft: indentation(3) }}>
            <i>centroids</i> ← calculateMeansOfClusters()
          </span>
        </div>
        <div id={'kmeans-8'}>
          8
          <span style={{ marginLeft: indentation(3) }}>
            <i>hasConverged</i> ← <i>centroids</i> = <i>previousCentroids</i>
          </span>
        </div>
        <div id={'kmeans-9'}>
          9
          <span style={{ marginLeft: indentation(2) }}>
            <b>while not</b> <i>hasConverged</i>
          </span>
        </div>
        <div id={'kmeans-10'}>
          10
          <span style={{ marginLeft: indentation(1) }}>
            DONE
          </span>
        </div>
      </div>
    );
  }

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
              getRunningAlg={this.state.runningAlg}
              setRunningAlg={this.setRunningAlg}
              k={this.state.k}
              setPoints={this.setPoints}
              setAnimationQueue={this.setAnimationQueue}
            />
            <div className={'divider'}></div>
            <button
              className="graph-button"
              onClick={ async () => {
                this.setState({pause: false, stop: true});
                this.reset();
              }}
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


          <div className={'col-6'}>
          <div className={'row'}>
            {this.renderKMeansPseudocode()}
          </div>
        </div>

        </div>
      </div>
    );
  }
}

export default ScatterPlotAlgorithms;
