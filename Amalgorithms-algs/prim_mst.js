const { Heap: PriorityQueue } = require('./heap.js');

let adjList = {
  a: [
    [3, 'g'],
    [5, 'i'],
    [7, 'c'],
    [6, 'f'],
    [10, 'b'],
    [8, 'd'],
  ],
  b: [
    [10, 'a'],
    [8, 'f'],
    [11, 'e'],
    [4, 's'],
    [8, 'j'],
    [8, 'l'],
    [9, 'd'],
  ],
  c: [
    [5, 'k'],
    [2, 'h'],
    [9, 'e'],
    [7, 'f'],
    [7, 'a'],
  ],
  d: [
    [5, 'q'],
    [10, 'i'],
    [8, 'a'],
    [9, 'b'],
    [9, 'l'],
    [6, 't'],
    [4, 'target'],
  ],
  e: [
    [6, 'm'],
    [10, 'j'],
    [9, 's'],
    [11, 'b'],
    [6, 'f'],
    [9, 'c'],
    [10, 'k'],
  ],
  f: [
    [6, 'a'],
    [7, 'c'],
    [6, 'e'],
    [8, 'b'],
  ],
  g: [
    [3, 'h'],
    [10, 'k'],
    [4, 'i'],
    [3, 'a'],
  ],
  h: [
    [2, 'c'],
    [3, 'g'],
  ],
  i: [
    [8, 'q'],
    [10, 'd'],
    [5, 'a'],
    [4, 'g'],
    [14, 'k'],
    [7, 'n'],
  ],
  j: [
    [6, 'o'],
    [10, 'l'],
    [8, 'b'],
    [3, 's'],
    [10, 'e'],
    [11, 'm'],
    [15, 'source'],
  ],
  k: [
    [6, 'n'],
    [14, 'i'],
    [10, 'g'],
    [5, 'c'],
    [10, 'e'],
    [8, 'm'],
    [6, 'p'],
  ],
  l: [
    [4, 't'],
    [9, 'd'],
    [8, 'b'],
    [10, 'j'],
    [5, 'o'],
  ],
  m: [
    [8, 'k'],
    [6, 'e'],
    [11, 'j'],
    [6, 'source'],
    [7, 'p'],
  ],
  n: [
    [6, 'k'],
    [7, 'i'],
  ],
  o: [
    [5, 'l'],
    [6, 'j'],
  ],
  p: [
    [6, 'k'],
    [7, 'm'],
    [9, 'source'],
  ],
  q: [
    [3, 'target'],
    [8, 'i'],
    [5, 'd'],
  ],
  s: [
    [9, 'e'],
    [4, 'b'],
    [3, 'j'],
  ],
  t: [
    [6, 'd'],
    [4, 'l'],
  ],
  target: [
    [3, 'q'],
    [4, 'd'],
  ],
  source: [
    [9, 'p'],
    [6, 'm'],
    [15, 'j'],
  ],
};

let res = prim(adjList, 'source');
// console.log(res[0]);
// console.log(res[1]);

function prim(g, root) {
  let costMap = {};
  let parents = {};
  let mstSet = {};
  Object.keys(g).map((k) => {
    costMap[k] = Infinity;
    parents[k] = null;
    mstSet[k] = false;
  });
  parents[root] = -1;
  costMap[root] = 0;

  for (let i = 0; i < Object.keys(g).length; i++) {
    let minNode = findMin(costMap, mstSet);

    mstSet[minNode] = true;

    for (let node of Object.keys(costMap)) {
      for (let [cost, neighbor] of g[minNode]) {
        if (neighbor == node) {
          if (mstSet[node] == false) {
            if (costMap[node] > cost) {
              costMap[node] = cost;
              parents[node] = minNode;
            }
          }
        }
      }
    }
  }
  calculateCumulativeDistance(costMap, parents);
  return [costMap, parents];
}

function findMin(key, mstSet) {
  let min = Infinity;
  let minNode = null;
  for (let node of Object.keys(key)) {
    if (key[node] < min && mstSet[node] == false) {
      min = key[node];
      minNode = node;
    }
  }
  return minNode;
}

function calculateCumulativeDistance(costMap, parents) {
  let cumCostMap = {};
  for (let node of Object.keys(costMap)) {
    let currentNode = parents[node];
    let cost = costMap[node];
    while (currentNode != -1) {
      cost += costMap[currentNode];
      currentNode = parents[currentNode];
    }
    cumCostMap[node] = cost;
  }
  console.log(cumCostMap);
}
