function dfs(g, root) {
  let visited = [];
  for (let node of Object.keys(g)) {
    visited[node - 1] = false;
  }
  visited[root - 1] = true;
  let stack = [root];
  while (stack.length > 0) {
    let s = stack.pop();
    console.log(s);
    for (let child of g[s]) {
      if (visited[child - 1] == false) {
        visited[child - 1] = true;
        stack.push(child);
      }
    }
  }
}
