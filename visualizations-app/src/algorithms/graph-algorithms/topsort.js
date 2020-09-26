import '../../styles/topsort.css';

async function topSort(g, getPauseStatus, getStopStatus, getSpeedRequest) {
  let stack = [];
  let visited = {};
  for (let key of Object.keys(g)) {
    visited[key] = 0;
  }
  let activeLinks = {};

  for (let node of Object.keys(g)) {
    if (visited[node] == 0) {
      await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));
      if (
        (await visit(g, node, stack, visited, getSpeedRequest, activeLinks)) ==
        false
      ) {
        return null;
      }
      await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));
      document
        .getElementById(node)
        .classList.remove('current-node-of-interest');
    }
  }
  console.log(stack.reverse());
  return stack.reverse();
}
// 2 = permenant mark, 1 = temp mark (if we encounter 1 again, we have cycle)
async function visit(g, node, stack, visited, getSpeedRequest, activeLinks) {
  await new Promise((r) => setTimeout(r, 500 / getSpeedRequest()));

  if (visited[node] == 2) {
    return true;
  } else if (visited[node] == 1) {
    return false;
  }
  activateCurrentNode(node);
  visited[node] = 1;
  for (let neighbor of g[node]) {
    await new Promise((r) => setTimeout(r, 500 / getSpeedRequest()));

    let activeLink = activateLink(node, neighbor);
    activeLinks = updateActiveLinks(activeLink, activeLinks, node);

    await new Promise((r) => setTimeout(r, 500 / getSpeedRequest()));
    activateNeighbor(neighbor);

    await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));
    if (
      (await visit(
        g,
        neighbor,
        stack,
        visited,
        getSpeedRequest,
        activeLinks
      )) == false
    ) {
      return false;
    }
  }
  stack.push(node);
  visited[node] = 2;
  
  await new Promise((r) => setTimeout(r, 1000 / getSpeedRequest()));

  markNodeComplete(node);
  removeOutgoingLinks(activeLinks, node);

  await new Promise((r) => setTimeout(r, 500 / getSpeedRequest()));

  return true;
}

export default topSort;

function activateCurrentNode(node) {
  let currentElement = document.getElementById(node);
  if (currentElement.classList.contains('current-neighbor-of-interest')) {
    document
      .getElementById(node)
      .classList.remove('current-neighbor-of-interest');
    document
      .getElementById(node)
      .classList.add('current-node-of-interest-from-blue');
  } else {
    document.getElementById(node).classList.add('current-node-of-interest');
  }
}

function activateNeighbor(neighbor) {
  document
    .getElementById(neighbor)
    .classList.add('current-neighbor-of-interest');
}

function activateLink(node, neighbor) {
  let lineElement = document.getElementById(node + '-' + neighbor);
  if (lineElement) lineElement.classList.add('ts-link-of-interest');
  return lineElement;
}

function updateActiveLinks(activeLink, activeLinks, node) {
  if (activeLink) {
    if (!activeLinks[node]) {
      activeLinks[node] = [activeLink];
    } else {
      activeLinks[node].push(activeLink);
    }
  }
  return activeLinks;
}

function removeOutgoingLinks(activeLinks, node) {
  if (activeLinks[node] && activeLinks[node].length > 0) {
    activeLinks[node].forEach((e) => {
      e.classList.remove('ts-link-of-interest');
    });
  }
}

function markNodeComplete(node) {
  document
    .getElementById(node)
    .classList.remove('current-neighbor-of-interest');

  document.getElementById(node).classList.remove('current-node-of-interest');
  document.getElementById(node).classList.add('node-done');
}
