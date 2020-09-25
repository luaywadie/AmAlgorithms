// import Heap from '';
import '../../styles/dijkstra.css';
const { Heap: PriorityQueue } = require('../../data-structures/Heap.js');
// [cost, node]

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
    await new Promise((r) => setTimeout(r, 500));
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
      await new Promise((r) => setTimeout(r, 900));

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
