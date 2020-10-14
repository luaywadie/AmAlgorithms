function bfs(g, root) {
  let visited = [];
  for (let i = 0; i < graphNodes; i++) {
    visited[i] = false;
  }
  let q = [];
  q.push(root);
  visited[root - 1] = true;
  while (q.length > 0) {
    let s = q[0];
    q.shift();
    console.log(s);
    for (let child of g[s]) {
      if (visited[child - 1] == false) {
        q.push(child);
        visited[child - 1] = true;
      }
    }
  }
}
