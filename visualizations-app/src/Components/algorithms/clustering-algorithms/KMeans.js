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
    
    //remove the centroids from the set of points (set difference: P = P \ C)
    this.props.setPoints(
      this.props.points.filter((p) => !centroids.includes(p))
    );
    
    //Set the classes of the centroid elements
    centroids.forEach((point, index) => {
      let cent = document.getElementById(
        `x:${parseFloat(point.x).toFixed(1)}-y:${parseFloat(point.y).toFixed(1)}`
      );
      cent.classList.replace('cluster-unassigned', `cluster${index}`);
      cent.classList.add('centroid');
    });

    await new Promise((r) => setTimeout(r, 2000 / this.props.speed));
    await this.checkPauseStatus();
    if (this.props.stop) return;
    if (this.unMounting) return;

    let hasConverged = false;
    let i = 0;
    do {
      console.log('Iteration ', i);
      this.assignToClusters(this.props.points, centroids);

      await new Promise((r) => setTimeout(r, 2000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;

      let centroidDifferences = [...centroids];
      this.updateCentroids(this.props.points, k, centroids);

      await new Promise((r) => setTimeout(r, 2000 / this.props.speed));
      await this.checkPauseStatus();
      if (this.props.stop) return;
      if (this.unMounting) return;
      
      console.log('Centroids have been updated:');
      console.log(JSON.stringify(centroids, null, 2));

      //calculate the sum of differences between the current and last step's centroids:  sum(|x - c_i| + |y - c_i|)
      let totalDifference = centroidDifferences.reduce(
        (sum, currentCentroid, i) =>
          Math.abs(currentCentroid.x - centroids[i].x) +
          Math.abs(currentCentroid.y - centroids[i].y),
        0
      );

      console.log('centroid totalDifference: ', totalDifference);
      hasConverged = (totalDifference < 0.1);
      
      i++;
    } while (!hasConverged && i < 100);
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
    if (pointElement) {
      if (pointElement.classList.contains('cluster-unassigned')) {
        pointElement.classList.remove('cluster-unassigned');
      }
      pointElement.classList.add(`cluster${point.closestCentroid}`);
    }
  }

  moveIthCentroid(i, centroid) {
    const scatterEl = document.getElementById('scatter-no-margin');
    const centroidEl = scatterEl.getElementsByClassName(`cluster${i} centroid`)[0];
    //defining scale functions to translate the centroid's coordinates into (cx, cy)
    const scaleX = d3.scaleLinear()
      .domain([4, 8])
      .range([0, scatterEl.parentElement.getAttribute('width') - 90]);
    const scaleY = d3.scaleLinear()
      .domain([0, 7])
      .range([scatterEl.parentElement.getAttribute('height') - 40, 0]);
    if(centroidEl) {
      centroidEl.setAttribute('cx', scaleX(centroid.x));
      centroidEl.setAttribute('cy', scaleY(centroid.y));
      //centroidEl.setAttribute('transform', scatterEl.getAttribute('transform'));
    }
  }

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
