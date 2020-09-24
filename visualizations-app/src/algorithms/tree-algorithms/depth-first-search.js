import '../../styles/tree-styles.css';

async function dfs(g, getPauseStatus, getStopStatus, buildNodePath) {
  let linkList = [];
  let root = 'a';
  let visited = {};
  Object.keys(g).map((node) => (visited[node] = false));
  visited[root] = true;
  let stack = [root];
  while (stack.length > 0) {
    let currentNode = stack.pop();

    await new Promise((r) => setTimeout(r, 1000));
    await checkPauseStatus(getPauseStatus);
    if (getStopStatus()) return;

    activateLink(currentNode, linkList);

    await new Promise((r) => setTimeout(r, 700));
    await checkPauseStatus(getPauseStatus);
    if (getStopStatus()) return;

    activateVisitedNode(currentNode);
    buildNodePath(currentNode);

    for (let child of g[currentNode]) {
      if (visited[child] === false) {
        visited[child] = true;
        stack.push(child);
      }
    }
  }
  linkList.forEach((el) => el.classList.remove('link-traversed'));
}

export default dfs;

function activateLink(currentNode, linkList) {
  let linkElement = document.getElementById(currentNode + 'link');
  if (linkElement) {
    linkElement.classList.add('link-traversed');
    linkList.push(linkElement);
  }
}

function activateVisitedNode(currentNode) {
  let nodeElement = document.getElementById(currentNode);
  nodeElement.classList.add('visited-node-dfs');
}

async function checkPauseStatus(getPauseStatus) {
  while (getPauseStatus()) {
    await new Promise((r) => setTimeout(r, 1000));
    continue;
  }
}
