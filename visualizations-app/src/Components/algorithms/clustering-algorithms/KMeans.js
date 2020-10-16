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

  componentDidUpdate(prevProps) {}

  //Perform K-Means clustering on points, plot, and animate
  kmeans = async () => {
    const k = this.props.k;
    //Randomly initialize cluster centroids
    const randomPoints = this.getRandomElements(this.props.points, k);
    //create a shallow copy of centroids (to make sure the assigned points don't change)
    let centroids = [...randomPoints];
    
    //Set the classes of the initialized centroid elements
    
    let centGroup = d3.select("#scatter-no-margin")
        .append("g")
        .attr("id", "centroid-group")
        .classed("centroid", true);
  
    // centroids.forEach((centroid, index) => {
    d3.select("#centroid-group")
      .selectAll("circle")  
      .data(centroids)
      .enter()
      .append("circle")
      .attr("cx", (centroid) => this.scaleX(centroid.x))
      .attr("cy", (centroid) => this.scaleY(centroid.y))
      .attr("r", 10)
      .attr("id", (centroid,i) => `centroid${i}`)
      .attr("class", (centroid,i) => `cluster${i} centroid`);
    

    await new Promise((r) => setTimeout(r, 2000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) return;
    if (this.unMounting) return;


    // Main K-Means loop
    let hasConverged = false;
    let iter = 0;
    do {
      console.log('Iteration ', iter);

      this.assignToClusters(this.props.points, centroids);

      await new Promise((r) => setTimeout(r, 2000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;

      console.log('Clusters have been assigned.');

      let prevCentroids = [...centroids];
      this.updateCentroids(this.props.points, k, centroids);

      await new Promise((r) => setTimeout(r, 2000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;
      
      console.log('Centroids have been updated:');
      console.log(JSON.stringify(centroids, null, 2));
      
      hasConverged = prevCentroids.reduce(
        (bool, currentCentroid, i) => (currentCentroid.x === centroids[i].x) && (currentCentroid.y === centroids[i].y),
        true
      );
      
      iter++;
    } while (!hasConverged && iter < 100);
    console.log("Converged.");

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

      //Color the point on the D3.js scatterplot
      this.colorPoint(point);
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

      this.moveIthCentroid(i, centroids[i]);
    }
  }

  // ------------------
  // Helper functions
  // -------------------
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
  

  async checkPauseStatus() {
    while (this.props.pause) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
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
} //End of KMeans Component

export default KMeans;
