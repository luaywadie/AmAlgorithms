import React, { Component } from 'react';
import createScatterplot from '../graph-builders/scatterplot-builder';
import * as d3 from 'd3';
import KMeans from './algorithms/clustering-algorithms/KMeans';
import { FaStepBackward, FaStepForward, FaPause, FaPlay } from 'react-icons/fa';

class ClusteringAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: true,
      stop: true,
      isStepping: false,
      speed: 1,
      runningAlg: null,
      k: 5,
      points: [],
      animationQueue: [],
      stepIndex: 0
    };
  }

  setPoints = (ps) => this.setState({points: ps});

  async componentDidMount() {
    //Load in the csv data points (2D) as an object
    let x = await d3.csv(
      'https://raw.githubusercontent.com/luaywadie/AmAlgorithms/master/visualizations-app/src/data/cluster_data.csv');
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
    this.setState({ pause: false });
  };

  setRunningAlg = (alg) => {
    this.setState({ runningAlg: alg });
  };


  async wait() {
    while (!this.state.isStepping && this.state.pause) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  //main function for the animation
  renderAnimationQueue = async (aq) => {
    this.setState({ animationQueue: aq });

    let waitTime = 1000;
    this.setState({ stepIndex: 0 });
    while (!this.state.stop) {
      const currentStepIndex = this.state.stepIndex;
      const currentLineNum = this.state.animationQueue[currentStepIndex].lineNum;
      this.setState({ lineNum: currentLineNum });
      this.toggleLineHighlight(currentLineNum);
      //wait until a step button or the play button is pressed
      await this.wait();
      //should not wait between each step if in step mode
      waitTime = this.state.isStepping ? 0 : 1000;
      //wait for a moment while in play mode (dependent on the speed)
      await new Promise((r) => setTimeout(r, waitTime / this.state.speed));
      this.toggleLineHighlight(currentLineNum);
      //line execution
      //check if the user stepped backwards
      if (this.state.stepIndex === currentStepIndex - 1) {
        
        if (currentStepIndex === 1) {
          this.setState({ ...this.state.animationQueue[currentStepIndex - 1]});
        }
        //need to hide centroids from the plot if stepping back to line 1?
        else {
          //state needs to be reset to one line before the line we're stepping back to
          this.setState({ ...this.state.animationQueue[currentStepIndex - 2]});
        }
      }
      else {
        //execute the currently highlighted line as normal
        this.setState({ ...this.state.animationQueue[currentStepIndex]});
      }
      if(this.state.shouldInitCentroids) {
        this.addCentroids();
      }
      if (this.state.closestCentroids && this.state.closestCentroids.length) {
        this.colorPoints();
      }
      if (this.state.centroids && this.state.centroids.length) {
        this.moveCentroids();
      }
      //if just executed the line before the DONE line (or somehow after the DONE line)
      if (currentStepIndex >= this.state.animationQueue.length - 2) {
        this.setState({ pause: true })
      }
      this.setState(
        (this.state.isStepping) ?
        {isStepping: !this.state.isStepping} :
        {stepIndex: this.state.stepIndex + 1}
      );
    }
  }
  
  // -----------------------------------------
  // Helper functions for renderAnimationQueue
  toggleLineHighlight(lineNum) {
    let el = document.getElementById(this.state.runningAlg + '-' + lineNum);
    if (el) el.classList.toggle('active-code-line');
  }

  addCentroids() {
    // Create centroid container group
    d3.select("#scatter-no-margin")
      .append("g")
      .attr("id", "centroid-group")
      .classed("centroid", true);

    // Add initial centroids to the plot
    // Set the classes of the initialized centroid elements
    d3.select("#centroid-group")
      .selectAll("circle")
      .data(this.state.centroids)
      .enter()
      .append("circle")
      .attr("cx", (centroid) => this.scaleX(centroid.x))
      .attr("cy", (centroid) => this.scaleY(centroid.y))
      .attr("r", 10)
      .attr("id", (d, i) => `centroid${i}`)
      .attr("class", (d, i) => `cluster${i} centroid`);
  }

  colorPoints() {
    this.state.points.forEach((point, index) => {
      let pointElement = document.getElementById(
        `x:${parseFloat(point.x).toFixed(1)}-y:${parseFloat(point.y).toFixed(1)}`
      );
      let pointClasses = pointElement.classList;
      if (pointElement) {
        //if it's the first iteration, remove 'unassigned' style
        if (pointClasses.contains('cluster-unassigned')) {
          pointClasses.remove('cluster-unassigned');
        }
        //otherwise, remove the current cluster color
        else {
          pointClasses.remove(pointClasses[0]);
        }
        //finally, add the color associated with the closest centroid
        pointClasses.add(`cluster${this.state.closestCentroids[index]}`);
      }
    });
  }

  moveCentroids() {
    for (let i = 0; i < this.state.k; ++i) {
      this.moveIthCentroid(i, this.state.centroids[i]);
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
    function indentation(num) {
      return num * 20;
    }
    return (
      <div>
        <div id={'kmeans-0'}>
          0
          <span style={{ marginLeft: indentation(1) }}>
            kMeans(<i>points</i>, <i>k</i>):
          </span>
        </div>
        <div id={'kmeans-1'}>
          1
          <span style={{ marginLeft: indentation(2) }}>
            <i>centroids</i> ← choose <i>k</i> random points from <i>points</i>
          </span>
        </div>
        <div id={'kmeans-2'}>
          2
          <span style={{ marginLeft: indentation(2) }}>
            <i>hasConverged</i> ← <b>false</b>
          </span>
        </div>
        <div id={'kmeans-3'}>
          3
          <span style={{ marginLeft: indentation(2) }}>
            <b>do</b>
          </span>
        </div>
        <div id={'kmeans-4'}>
          4
          <span style={{ marginLeft: indentation(3) }}>
            assignPointsToClosestClusterCentroids()
          </span>
        </div>
        <div id={'kmeans-5'}>
          5
          <span style={{ marginLeft: indentation(3) }}>
            <i>previousCentroids</i> ← <i>centroids</i>
          </span>
        </div>
        <div id={'kmeans-6'}>
          6
          <span style={{ marginLeft: indentation(3) }}>
            <i>centroids</i> ← calculateMeansOfClusters()
          </span>
        </div>
        <div id={'kmeans-7'}>
          7
          <span style={{ marginLeft: indentation(3) }}>
            <i>hasConverged</i> ← <i>centroids</i> = <i>previousCentroids</i>
          </span>
        </div>
        <div id={'kmeans-8'}>
          8
          <span style={{ marginLeft: indentation(2) }}>
            <b>while not</b> <i>hasConverged</i>
          </span>
        </div>
        <div id={'kmeans-9'}>
          9
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
              toggleStop={() => this.setState({ stop: !this.state.stop})}
              speed={this.state.speed}
              getRunningAlg={this.state.runningAlg}
              setRunningAlg={this.setRunningAlg}
              k={this.state.k}
              setPoints={this.setPoints}
              renderAnimationQueue={this.renderAnimationQueue}
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
                if(this.state.stepIndex > 0) {
                  this.setState({ stepIndex: this.state.stepIndex - 1, pause: true, isStepping: true });
                }
              }}
            >
              <FaStepBackward/>
            </button>
            <button
              onClick={() => {
                this.setState({ pause: !this.state.pause, isStepping: false });
              }}
            >
            {this.state.pause ? <FaPlay /> : <FaPause />}
            </button>
            <button
              onClick={() => {
                if(this.state.stepIndex < this.state.animationQueue.length - 1) {
                  this.setState({ stepIndex: this.state.stepIndex + 1, pause: true, isStepping: true });
                }
              }}
            >
              <FaStepForward/>
            </button>
            <form style={{display: "inline-block"}} onSubmit={(event) => event.preventDefault()}>
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
                disabled={!this.state.stop}
              />
            </label>
          </form>
          <form style={{display: "inline-block"}} onSubmit={(event) => event.preventDefault()}>
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

export default ClusteringAlgorithms;
