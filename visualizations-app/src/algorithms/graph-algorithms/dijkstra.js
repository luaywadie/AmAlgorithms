// import Heap from '';
import '../../styles/dijkstra.css';
const { Heap: PriorityQueue } = require('../../data-structures/Heap.js');
// [cost, node]

async function djikstra(
  g,
  root,
  target,
  getPauseStatus,
  getStopStatus,
  updateDistancesAndParents,
  getShortestPathPath,
  getSpeedRequest
) {
  let pq = new PriorityQueue();

  let parents = {};
  let distances = {};
  Object.keys(g).map((node) => {
    distances[node] = Infinity;
    parents[node] = null;
  });
  distances[root] = 0;

  pq.insert([0, root]);
  let activeLinks = [];

  while (pq.size > 0) {
    updateDistancesAndParents(distances, parents);
    let currentNode = pq.removeRoot()[1];

    let currentNodeElement = activateCurrentNode(currentNode);
    await new Promise((r) => setTimeout(r, 2000 / getSpeedRequest()));
    await checkPauseStatus(getPauseStatus);
    if (getStopStatus()) {
      cleanUpActiveLinksAndCurrentNode(activeLinks, currentNode);
      return;
    }
    activeLinks = removeActiveLinks(activeLinks);
    await new Promise((r) => setTimeout(r, 100 / getSpeedRequest()));
    await checkPauseStatus(getPauseStatus);
    if (getStopStatus()) {
      cleanUpActiveLinksAndCurrentNode(activeLinks, currentNode);
      return;
    }

    for (let [neighborNodeWeight, neighborNode] of g[currentNode]) {
      let linkOfInterestElement = activateLink(currentNode, neighborNode);
      activeLinks.push(linkOfInterestElement);
      await new Promise((r) => setTimeout(r, 2000 / getSpeedRequest()));

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

  let end = target;
  let stack = [end];
  while (end != null) {
    stack.push(parents[end]);
    end = parents[end];
  }
  let shortestPath = stack.reverse().slice(1);
  for (let i = 1; i < shortestPath.length; i++) {
    let prev = shortestPath[i - 1];
    let current = shortestPath[i];
    activateLink(prev, current);
  }
  getShortestPathPath(shortestPath, distances['target']);
}

export default djikstra;

function activateCurrentNode(currentNode) {
  let currentNodeElement = document.getElementById(currentNode);
  currentNodeElement.classList.add('current-node-of-interest');
  return currentNodeElement;
}

function removeActiveLinks(activeLinks) {
  activeLinks.forEach((e) => {
    if (e) {
      e.classList.remove('fade-out-link', 'link-of-interest');
    }
  });
  return [];
}

function activateLink(currentNode, neighborNode) {
  let linkString =
    currentNode < neighborNode
      ? currentNode + '-' + neighborNode
      : neighborNode + '-' + currentNode;

  let linkOfInterestElement = document.getElementById(linkString);
  if (linkOfInterestElement)
    linkOfInterestElement.classList.add('link-of-interest');
  return linkOfInterestElement;
}

function updateCurrentNodeToBeVisited(currentNodeElement) {
  currentNodeElement.classList.remove('current-node-of-interest');
  currentNodeElement.classList.add('node-visited');
}

function fadeOutLinks(activeLinks) {
  activeLinks.forEach((e) => {
    if (e) {
      e.classList.add('fade-out-link');
    }
  });
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
