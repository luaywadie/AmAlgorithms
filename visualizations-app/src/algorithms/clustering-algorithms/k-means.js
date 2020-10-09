import { cloneElement } from "react";


// ------------------
// Helper functions 
// -------------------
function getRandom(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function colorPoint(point){
    // let centroid = document.getElementById(currentNode + 'link');
    let pointElement = document.getElementById(`x:${parseFloat(point.x).toFixed(1)}-y:${parseFloat(point.y).toFixed(1)}`);
    if (pointElement){
        pointElement.classList.replace("cluster-unassigned", `cluster${point.closestCentroid}`);
    }
    
}

function moveCentroid(centroid) {
    
}


//Perform K-Means clustering on points, plot, and animate
async function kMeans(points, k) {
    //Randomly initialize cluster centroids
    const randomPoints = getRandom(points, k);
    console.log("randomPoints: ", JSON.stringify(randomPoints, null, 2));
    //create a shallow copy of centroids (to make sure the assigned points don't change)
    let centroids = [...randomPoints];
    
    
    console.log("Initializing Centroids...");
    console.log(JSON.stringify(centroids, null, 2));

    


    let hasConverged = false;
    let i = 0;
    do {
        console.log("Iteration ", i);
        assignToClusters(points, k, centroids);

        console.log("Clusters have been assigned.");
        console.log(JSON.stringify(points[20]));

        let centroidDifferences = [...centroids];
        updateCentroids(points, k, centroids);
        
        console.log("Centroids have been updated.");
        console.log(JSON.stringify(centroids, null, 2));
        
        //pause for a moment
        await new Promise((r) => setTimeout(r, 3000));
    
        //calculate the sum of differences between the current and last step's centroids:  sum(|x - c_i| + |y - c_i|)
        let totalDifference = centroidDifferences.reduce((sum, currentCentroid, i) => 
            (Math.abs(currentCentroid.x - centroids[i].x) + Math.abs(currentCentroid.y - centroids[i].y)), 0);
        
        console.log("centroid totalDifference: ", totalDifference);    
        hasConverged = totalDifference < 0.1;

        i++;

    } while(!hasConverged && i < 200);

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

        //Color the point on the D3.js scatterplot
        colorPoint(point);
    });
}

//Calculate new cluster centroids, which will be the mean of all points in that cluster
function updateCentroids(points, k, centroids){
    for (let i = 0; i < k; i++) {
        //clusterArray = [{x: "1.2", y: "", closestCentroid: "i"}, ...]
        const clusterArray = points.filter(point => point.closestCentroid === i);

        //calculate the mean in x and y directions
        let mean = clusterArray.reduce(
            (sum, currentPoint) => 
                {
                    sum.x = Number(sum.x) + Number(currentPoint.x);
                    sum.y = Number(sum.y) + Number(currentPoint.y);
                    // console.log('current sum:', sum)
                    return sum;
                }, {x: Number(0), y: Number(0)});   
        mean.x = mean.x / clusterArray.length;
        mean.y = mean.y / clusterArray.length;
        
        console.log("mean of centroid", i, ": ", mean);

        //update the centroid at index i
        centroids[i] = {x: mean.x, y: mean.y};
    }
}



export default kMeans;