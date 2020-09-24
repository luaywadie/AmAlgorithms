import './tree-styles.css';

async function bfs(g, getPauseStatus, getStopStatus, buildNodePath) {
  let linkList = [];
  let root = 'a';
  let visited = {};
  for (let node of Object.keys(g)) {
    visited[node] = false;
  }
  visited[root] = true;
  let queue = [root];
  while (queue.length > 0) {
    let s = queue[0];
    queue.shift();
    console.log(s);
    let nodeElement = document.getElementById(s);
    let linkElement = document.getElementById(s + 'link');

    await new Promise((r) => setTimeout(r, 1000));

    while (getPauseStatus() === true) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
    if (getStopStatus() === true) {
      linkList.forEach((el) => el.classList.remove('link-traversed'));
      return;
    }
    if (linkElement) {
      linkElement.classList.add('link-traversed');
      linkList.push(linkElement);
    }
    await new Promise((r) => setTimeout(r, 700));
    nodeElement.classList.add('visited-node-bfs');

    buildNodePath(s);
    for (let child of g[s]) {
      if (visited[child] === false) {
        visited[child] = true;
        queue.push(child);
      }
    }
  }
  linkList.forEach((el) => el.classList.remove('link-traversed'));
}

export default bfs;
