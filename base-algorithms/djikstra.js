// import { Heap as PriorityQueue } from './heap.js';
const { Heap: PriorityQueue } = require('./heap.js');
// [cost, node]
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
    [15, 'target'],
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
    [6, 'target'],
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
    [9, 'target'],
  ],
  q: [
    [3, 'source'],
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
djikstra(adjList, 'source', 'target');

function djikstra(g, root, target) {
  let pq = new PriorityQueue();

  let parents = [];
  let distances = [];
  for (let key of Object.keys(g)) {
    if (key == root) {
      distances[key] = 0;
    } else {
      distances[key] = Infinity;
    }
    parents[key] = null;
  }

  pq.insert([0, root]);

  while (pq.size > 0) {
    let c = pq.removeRoot();

    for (let neighbor of g[c[1]]) {
      let potentialScore = distances[c[1]] + neighbor[0];
      if (potentialScore < distances[neighbor[1]]) {
        //updates
        distances[neighbor[1]] = potentialScore;
        parents[neighbor[1]] = c[1];
        pq.insert(neighbor);
      }
    }
  }
  console.log(distances);
  console.log(parents);

  let end = target;
  let stack = [end];
  while (end != null) {
    stack.push(parents[end]);
    end = parents[end];
  }
  let its = stack.length;
  for (let i = 0; i < its; i++) {
    console.log(stack.pop());
  }
}
