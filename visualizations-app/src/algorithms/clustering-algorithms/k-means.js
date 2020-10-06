import { cloneElement } from "react";

//Helper functions
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


//Perform K-Means clustering on points, plot, and animate
function kMeans(points, k) {
    let centroids = getRandom(points, k);
    //create a deep copy of centroids
    for (let i = 0; i < k; i++) {
        centroids[i] = Object.assign({}, centroids[i]);
    }
    
    console.log("Initializing Centroids...");
    console.log(centroids);

    assignToClusters(points, k, centroids);
    updateCentroids(points, k, centroids);

    console.log("Centroids have been updated.");
    console.log("centroids: ", centroids);
}


//Compute distance of each point from each centroid,
// and assign points to closest centroid
function assignToClusters(points, k, centroids) {
    points.forEach(point => {
        let distances = [];
        centroids.forEach(centroid => {
            distances.push(
                //calculate the Euclidean distance from each point to each centroid
                Math.sqrt(Math.pow((point.x - centroid.x), 2) + Math.pow((point.y - centroid.y), 2))
            );
        });
        //Assign the point to its closest centroid using the minimum of all distances
        point.closestCentroid = distances.indexOf(Math.min(...distances));
    });
}

//Calculate new cluster centroids, which will be the mean of all points in that cluster
function updateCentroids(points, k, centroids){
    for (let i = 0; i < k; i++) {
        //clusterArray = [{x: "1.2", y: "", closestCentroid: "i"}, ...]
        const clusterArray = points.filter(point => point.closestCentroid == i);

        //calculate the mean in x and y directions
        let mean = clusterArray.reduce(
            (sum, currentPoint) => 
                {
                    sum.x = Number(sum.x) + Number(currentPoint.x);
                    sum.y = Number(sum.y) + Number(currentPoint.y);
                    // console.log('current sum:', sum)
                    return sum;
                }, {x: Number(0), y: Number(0)});   
        mean.x =  mean.x / clusterArray.length;
        mean.y =  mean.y / clusterArray.length;
        
        console.log("mean: ", mean);

        //update the centroid at index i
        centroids[i] = {x: mean.x, y: mean.y};
    }
}


export default kMeans;