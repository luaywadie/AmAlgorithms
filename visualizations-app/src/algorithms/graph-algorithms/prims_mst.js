import '../../styles/prim.css';

async function prim(g, root, getSpeedRequest, updatePrimDistancesAndParents) {
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
    updatePrimDistancesAndParents(costMap, parents);
    let minNode = findMin(costMap, mstSet);
    mstSet[minNode] = true;

    await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));
    let minNodeEl = activateCurrentNode(minNode);
    await new Promise((r) => setTimeout(r, 500 / getSpeedRequest()));

    for (let node of Object.keys(costMap)) {
      for (let [cost, neighbor] of g[minNode]) {
        if (neighbor == node) {
          if (mstSet[node] == false) {
            if (costMap[node] > cost) {
              deActivateOldLink(node, parents[node], getSpeedRequest);
              activateLink(minNode, node);
              await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));
              costMap[node] = cost;
              parents[node] = minNode;
            }
          }
        }
      }
    }

    updateCurrentNodeToBeVisited(minNodeEl);
  }
  console.log([costMap, parents]);
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

export default prim;

function activateCurrentNode(currentNode) {
  let currentNodeElement = document.getElementById(currentNode);
  currentNodeElement.classList.add('current-node-of-interest');
  return currentNodeElement;
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

async function deActivateOldLink(node, oldChild, getSpeedRequest) {
  let linkString =
    node < oldChild ? node + '-' + oldChild : oldChild + '-' + node;
  let el = document.getElementById(linkString);
  if (el) {
    el.classList.add('fade-out-link');
    await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));
    el.classList.remove('link-of-interest');
  }
}
