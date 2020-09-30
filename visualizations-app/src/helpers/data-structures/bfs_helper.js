function bfs(g, root) {
  let visited = {};
  Object.keys(g).forEach((key) => (visited[key] = false));
  let q = [];
  q.push(root);
  visited[root - 1] = true;
  let ordering = [];
  while (q.length > 0) {
    let s = q[0];
    ordering.push(s);
    q.shift();
    // console.log(s);
    for (let child of g[s]) {
      if (visited[child] == false) {
        q.push(child);
        visited[child] = true;
      }
    }
  }
  return ordering;
}
module.exports = { bfs };
