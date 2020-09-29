const g = {
  A: ['B', 'F'],
  B: ['H'],
  C: [],
  D: ['C', 'E', 'I'],
  E: ['I'],
  F: [],
  G: ['A', 'B', 'C'],
  H: [],
  I: ['C'],
  J: ['E'],
};

console.log(topSort(g));

function topSort(g) {
  let stack = [];
  let visited = {};
  for (let key of Object.keys(g)) {
    visited[key] = 0;
  }
  for (let node of Object.keys(g)) {
    if (visited[node] == 0) {
      if (visit(g, node, stack, visited) == false) {
        return null;
      }
    }
  }
  return stack.reverse();
}
// 2 = permenant mark, 1 = temp mark (if we encounter 1 again, we have cycle)
function visit(g, node, stack, visited) {
  if (visited[node] == 2) {
    return true;
  } else if (visited[node] == 1) {
    return false;
  }
  visited[node] = 1;
  for (let neighbor of g[node]) {
    if (visit(g, neighbor, stack, visited) == false) {
      return false;
    }
  }
  stack.push(node);
  visited[node] = 2;
  return true;
}

