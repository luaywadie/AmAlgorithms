import './tree-styles.css';

async function dfs(g, getPauseStatus, getStopStatus, buildNodePath) {
  let linkList = [];
  let root = 'a';
  console.log(root);
  let visited = {};
  for (let node of Object.keys(g)) {
    visited[node] = false;
  }
  visited[root] = true;
  let stack = [root];
  while (stack.length > 0) {
    let s = stack.pop();
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
    nodeElement.classList.add('visited-node-dfs');
    buildNodePath(s);

    for (let child of g[s]) {
      if (visited[child] === false) {
        visited[child] = true;
        stack.push(child);
      }
    }
  }
  linkList.forEach((el) => el.classList.remove('link-traversed'));

}

export default dfs;
