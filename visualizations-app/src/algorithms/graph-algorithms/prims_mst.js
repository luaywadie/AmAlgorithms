import '../../styles/prim.css';

async function prim(
  g,
  root,
  getPauseStatus,
  getStopStatus,
  getSpeedRequest,
  updatePrimDistancesAndParents,
  
) {
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

  let activeLinks = [];
  let cumulativeCostMap = {};
  for (let i = 0; i < Object.keys(g).length; i++) {
    cumulativeCostMap = calculateCumulativeDistance(costMap, parents);
    updatePrimDistancesAndParents(costMap, parents, cumulativeCostMap);
    let minNode = findMin(costMap, mstSet);
    mstSet[minNode] = true;

    await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));
    await checkPauseStatus(getPauseStatus);
    if (getStopStatus()) {
      cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
      return;
    }

    let minNodeEl = activateCurrentNode(minNode);

    await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));
    await checkPauseStatus(getPauseStatus);
    if (getStopStatus()) {
      cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
      return;
    }

    for (let node of Object.keys(costMap)) {
      for (let [cost, neighbor] of g[minNode]) {
        if (neighbor === node) {
          if (mstSet[node] === false) {
            if (costMap[node] > cost) {
              let el = deActivateOldLink(node, parents[node], getSpeedRequest);
              if (el) activeLinks.filter((e) => e !== el);

              activateLink(minNode, node, activeLinks);

              await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));
              await checkPauseStatus(getPauseStatus);
              if (getStopStatus()) {
                cleanUpActiveLinksAndCurrentNode(activeLinks, minNode);
                return;
              }

              costMap[node] = cost;
              parents[node] = minNode;
            }
          }
        }
      }
    }
    updateCurrentNodeToBeVisited(minNodeEl);
  }
  calculateCumulativeDistance(costMap, parents);
}

function findMin(key, mstSet) {
  let min = Infinity;
  let minNode = null;
  for (let node of Object.keys(key)) {
    if (key[node] < min && mstSet[node] === false) {
      min = key[node];
      minNode = node;
    }
  }
  return minNode;
}

export default prim;

function activateCurrentNode(currentNode) {
  let currentNodeElement = document.getElementById(currentNode);
  currentNodeElement.classList.add('current-node-of-interest');
  return currentNodeElement;
}

function activateLink(currentNode, neighborNode, activeLinks) {
  let linkString =
    currentNode < neighborNode
      ? currentNode + '-' + neighborNode
      : neighborNode + '-' + currentNode;

  let linkOfInterestElement = document.getElementById(linkString);
  if (linkOfInterestElement) {
    linkOfInterestElement.classList.add('link-of-interest');
    activeLinks.push(linkOfInterestElement);
  }
  return linkOfInterestElement;
}

function updateCurrentNodeToBeVisited(currentNodeElement) {
  currentNodeElement.classList.remove('current-node-of-interest');
  currentNodeElement.classList.add('node-visited');
}

async function deActivateOldLink(node, oldChild, getSpeedRequest, activeLinks) {
  let linkString =
    node < oldChild ? node + '-' + oldChild : oldChild + '-' + node;
  let el = document.getElementById(linkString);
  if (el) {
    el.classList.add('fade-out-link');
    await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));
    el.classList.remove('link-of-interest', 'fade-out-link');
    return el;
  }
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

function removeActiveLinks(activeLinks) {
  activeLinks.forEach((e) => {
    if (e) {
      e.classList.remove('fade-out-link', 'link-of-interest');
    }
  });
  return [];
}

function calculateCumulativeDistance(costMap, parents) {
  let cumCostMap = {};
  for (let node of Object.keys(costMap)) {
    if (parents[node] == null) {
      cumCostMap[node] = '';
      continue;
    }
    let currentNode = parents[node];
    let cost = costMap[node];
    while (currentNode !== -1) {
      cost += costMap[currentNode];
      currentNode = parents[currentNode];
    }
    cumCostMap[node] = cost;
  }
  return cumCostMap;
}
