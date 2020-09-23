async function dfs(g, getPauseStatus, getStopStatus) {
  let root = 'a';
  let visited = {};
  for (let node of Object.keys(g)) {
    visited[node] = false;
  }
  visited[root] = true;
  let stack = [root];
  while (stack.length > 0) {
    let s = stack.pop();

    let el = document.getElementById(s);
    await new Promise((r) => setTimeout(r, 1000));
    while (getPauseStatus() === true) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
    if (getStopStatus() === true) {
      return;
    }

    el.style.fill = 'red';
    for (let child of g[s]) {
      if (visited[child] === false) {
        visited[child] = true;
        stack.push(child);
      }
    }
  }
}

export default dfs;
