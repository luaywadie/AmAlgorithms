async function bfs(g, getPauseStatus, getStopStatus) {
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
    let el = document.getElementById(s);
    await new Promise((r) => setTimeout(r, 1000));
    while (getPauseStatus() === true) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
    if (getStopStatus() === true) {
      console.log('done');
      return;
    }
    el.style.fill = 'green';
    for (let child of g[s]) {
      if (visited[child] === false) {
        visited[child] = true;
        queue.push(child);
      }
    }
  }
}

export default bfs;
