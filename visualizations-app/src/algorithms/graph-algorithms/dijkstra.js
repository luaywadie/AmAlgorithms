// import Heap from '';
import '../../styles/dijkstra.css';
const { Heap: PriorityQueue } = require('../../data-structures/Heap.js');
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
    [9, 'b'],
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
  source: [[3, 'q']],
  target: [
    [9, 'p'],
    [6, 'm'],
    [15, 'j'],
  ],
};

async function djikstra(g, root, target, getPauseStatus, getStopStatus) {
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
  let activeLinks = [];

  while (pq.size > 0) {
    let currentNode = pq.removeRoot()[1];
    console.log(currentNode);

    let currentNodeElement = activateCurrentNode(currentNode);
    await new Promise((r) => setTimeout(r, 1000));
    await checkPauseStatus(getPauseStatus);
    if (getStopStatus()) {
      cleanUpActiveLinksAndCurrentNode(activeLinks, currentNode);
      return;
    }
    activeLinks = removeActiveLinks(activeLinks);
    await new Promise((r) => setTimeout(r, 300));
    await checkPauseStatus(getPauseStatus);
    if (getStopStatus()) {
      cleanUpActiveLinksAndCurrentNode(activeLinks, currentNode);
      return;
    }

    for (let [neighborNodeWeight, neighborNode] of g[currentNode]) {
      let linkOfInterestElement = activateLink(currentNode, neighborNode);
      activeLinks.push(linkOfInterestElement);
      await new Promise((r) => setTimeout(r, 1000));

      await checkPauseStatus(getPauseStatus);
      if (getStopStatus()) {
        cleanUpActiveLinksAndCurrentNode(activeLinks, currentNode);
        return;
      }

      let potentialScore = distances[currentNode] + neighborNodeWeight;
      if (potentialScore < distances[neighborNode]) {
        //updates
        distances[neighborNode] = potentialScore;
        parents[neighborNode] = currentNode;
        pq.insert([neighborNodeWeight, neighborNode]);
      }
    }
    fadeOutLinks(activeLinks);
    updateCurrentNodeToBeVisited(currentNodeElement);
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

export default djikstra;

function activateCurrentNode(currentNode) {
  let currentNodeElement = document.getElementById(currentNode);
  currentNodeElement.classList.add('current-node-of-interest');
  return currentNodeElement;
}

function removeActiveLinks(activeLinks) {
  activeLinks.forEach((e) =>
    e.classList.remove('fade-out-link', 'link-of-interest')
  );
  return [];
}

function activateLink(currentNode, neighborNode) {
  let linkString =
    currentNode < neighborNode
      ? currentNode + '-' + neighborNode
      : neighborNode + '-' + currentNode;

  let linkOfInterestElement = document.getElementById(linkString);
  linkOfInterestElement.classList.add('link-of-interest');
  return linkOfInterestElement;
}

function updateCurrentNodeToBeVisited(currentNodeElement) {
  currentNodeElement.classList.remove('current-node-of-interest');
  currentNodeElement.classList.add('node-visited');
}

function fadeOutLinks(activeLinks) {
  activeLinks.forEach((e) => e.classList.add('fade-out-link'));
}

async function checkPauseStatus(getPauseStatus) {
  while (getPauseStatus()) {
    await new Promise((r) => setTimeout(r, 1000));
    continue;
  }
}
function cleanUpActiveLinksAndCurrentNode(activeLinks, currentNode) {
  let currentNodeElement = document.getElementById(currentNode);
  if (currentNodeElement) {
    currentNodeElement.classList.remove('current-node-of-interest');
  }
  if (activeLinks.length > 0) {
    removeActiveLinks(activeLinks);
  }
}
