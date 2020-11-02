import React, { Component } from 'react';

class KMeans extends Component {
  
  //runs k-means algo, adding to the animation queue at each step, lastly starting the animation
  kmeans = async () => {
    let animationQueue = [];
    animationQueue.push({ lineNum: 0, centroids: null, closestCentroids: null, shouldInitCentroids: false});

    const k = this.props.k;
    //Randomly initialize cluster centroids
    const randomPoints = this.getRandomElements(this.props.points, k);
    //create a shallow copy of centroids (to make sure the assigned points don't change)
    let centroids = [...randomPoints];
    animationQueue.push({ lineNum: 1, centroids: [...centroids], closestCentroids: null, shouldInitCentroids: true });

    //keep track of convergence
    let hasConverged = false; 
    animationQueue.push({ lineNum: 2, shouldInitCentroids: false, hasConverged});

    //closestCentroids[8] === point 8's closest cluster centroid
    let closestCentroids = [];

    //highlights the "do" line, snapshots initial centroids
    animationQueue.push({ lineNum: 3, centroids: [...centroids], closestCentroids: [] });

    // Main K-Means loop
    do {
      //assign points to clusters
      closestCentroids = this.getClusterAssignments(this.props.points, centroids);
      animationQueue.push({ lineNum: 4, closestCentroids: [...closestCentroids] });

      let prevCentroids = [...centroids];
      animationQueue.push({ lineNum: 5, centroids: [...centroids] });

      this.updateCentroids(this.props.points, k, centroids, closestCentroids);
      animationQueue.push({ lineNum: 6, centroids: [...centroids], hasConverged});

      //Check convergence
      hasConverged = prevCentroids.reduce(
        (bool, currentCentroid, i) => (currentCentroid.x === centroids[i].x) && (currentCentroid.y === centroids[i].y),
        true
      );
      animationQueue.push({ lineNum: 7, hasConverged});
      animationQueue.push({ lineNum: 8, hasConverged});

    } while (!hasConverged);
    animationQueue.push({ lineNum: 9});

    //kick off the main animation loop
    this.props.renderAnimationQueue(animationQueue);
  };

  
  getClusterAssignments(points, centroids) {
    let closestCentroids = [];
    points.forEach((point, i) => {
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
      //Set the closest centroid of the ith point to the minimum of all distances
      closestCentroids[i] = distances.indexOf(Math.min(...distances));
    });
    return closestCentroids;
  }

  //Calculate new cluster centroids, which will be the mean of all points in that cluster
  updateCentroids(points, k, centroids, closestCentroids) {
    for (let cIndex = 0; cIndex < k; cIndex++) {
      //clusterArray = [{x: "1.2", y: "2", closestCentroid: "cIndex"}, ...]
      const clusterArray = points.filter(
        (point, pointIndex) => closestCentroids[pointIndex] === cIndex
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

      //update the centroid at cIndex
      centroids[cIndex] = { x: mean.x, y: mean.y };

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
        onClick={async () => {
          await this.props.setRunningAlg('kmeans');
          await this.props.toggleStop();
          this.kmeans();
        }}
        disabled={this.props.getRunningAlg === 'kmeans'}
      >
        K-Means Clustering
      </button>
    );
  }
}

export default KMeans;
