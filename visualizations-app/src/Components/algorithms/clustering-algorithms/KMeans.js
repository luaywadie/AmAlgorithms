//import { cloneElement } from 'react';
import React, { Component } from 'react';
import * as d3 from 'd3';

class KMeans extends Component {
  constructor(props) {
    super(props);
    this.unMounting = false;
  }

  componentWillUnmount() {
    this.unMounting = true;
  }

  componentDidUpdate(prevProps) { }

  async checkPauseStatus() {
    while (this.props.pause) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
  }

  //Perform K-Means clustering on points, plot, and animate
  kmeans = async () => {
    let animationQueue = [];
    animationQueue.push({ line: 1 });

    const k = this.props.k;
    //Randomly initialize cluster centroids
    const randomPoints = this.getRandomElements(this.props.points, k);
    //create a shallow copy of centroids (to make sure the assigned points don't change)
    let centroids = [...randomPoints];
    animationQueue.push({ line: 2,  centroids: [...centroids] });

    // Create centroid container group
    d3.select("#scatter-no-margin")
      .append("g")
      .attr("id", "centroid-group")
      .classed("centroid", true);

    // Add initial centroids to the plot
    //Set the classes of the initialized centroid elements
    d3.select("#centroid-group")
      .selectAll("circle")
      .data(centroids)
      .enter()
      .append("circle")
      .attr("cx", (centroid) => this.scaleX(centroid.x))
      .attr("cy", (centroid) => this.scaleY(centroid.y))
      .attr("r", 10)
      .attr("id", (centroid, i) => `centroid${i}`)
      .attr("class", (centroid, i) => `cluster${i} centroid`);


    //keep track of convergence
    let hasConverged = false; 
    animationQueue.push({ line: 3, hasConverged});


    // Main K-Means loop
    do {

      this.highlightLine(5);

      this.assignToClusters(this.props.points, centroids);
      this.removeHighlightedLine(5);

      let prevCentroids = [...centroids];
      this.updateCentroids(this.props.points, k, centroids);

      this.highlightLine(4);

      //Check convergence
      hasConverged = prevCentroids.reduce(
        (bool, currentCentroid, i) => (currentCentroid.x === centroids[i].x) && (currentCentroid.y === centroids[i].y),
        true
      );
      animationQueue.push({ line: 3, hasConverged});

      this.removeHighlightedLine(4);

    } while (!hasConverged);


    this.highlightLine(7);
    this.removeHighlightedLine(7);

  };

  //Compute distance of each point from each centroid,
  // and assign points to closest centroid
  assignToClusters(points, centroids) {
    points.forEach((point) => {
      let distances = [];
      centroids.forEach((centroid) => {
        distances.push(
          //calculate the Euclidean distance from each point to each centroid
          Math.sqrt(
            Math.pow(point.x - centroid.x, 2) +
            Math.pow(point.y - centroid.y, 2)
          )
        );
      });
      //Assign the point to its closest centroid using the minimum of all distances
      point.closestCentroid = distances.indexOf(Math.min(...distances));

    });
  }

  //Calculate new cluster centroids, which will be the mean of all points in that cluster
  updateCentroids(points, k, centroids) {
    for (let i = 0; i < k; i++) {
      //clusterArray = [{x: "1.2", y: "2", closestCentroid: "i"}, ...]
      const clusterArray = points.filter(
        (point) => point.closestCentroid === i
      );

      //calculate the mean in x and y directions
      let mean = clusterArray.reduce(
        (sum, currentPoint) => {
          sum.x = Number(sum.x) + Number(currentPoint.x);
          sum.y = Number(sum.y) + Number(currentPoint.y);
          // console.log('current sum:', sum)
          return sum;
        },
        { x: Number(0), y: Number(0) }
      );
      mean.x = mean.x / clusterArray.length;
      mean.y = mean.y / clusterArray.length;

      //update the centroid at index i
      centroids[i] = { x: mean.x, y: mean.y };

    }
  }

  getRandomElements(arr, n) {
    let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  

  render() {
    return (
      <button
        onClick={() => {
          if (this.unMounting) {
            this.unMounting = false;
          }
          this.kmeans();
        }}
      >
        K-Means Clustering
      </button>
    );
  }
}

export default KMeans;
