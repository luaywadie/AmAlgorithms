// class TreeNode {
//   constructor(name, children) {
//     this.name = name;
//     this.value = 15;
//     this.type = 'black';
//     this.level = '';
//     this.children = children;
//   }
// }

let adjList = {
  a: ['b', 'c', 'd'],
  b: ['e', 'h', 'i'],
  c: ['j', 'r'],
  d: ['s', 't', 'u', 'v'],
  e: ['f', 'g'],
  f: [],
  g: [],
  h: [],
  i: [],
  j: ['k'],
  k: ['l', 'q'],
  l: ['m', 'n', 'p'],
  m: [],
  n: ['o'],
  o: [],
  p: ['o'],
  q: [],
  r: [],
  s: [],
  t: [],
  u: [],
  v: ['w'],
  w: ['x'],
  x: ['y', 'z'],
  y: [],
  z: [],
};

function buildTreeData(g) {
  let treeData = {};
  let root = true;
  for (let [node, children] of Object.entries(g)) {
    if (root == true) {
      treeData[node] = {
        name: node,
        value: 15,
        type: 'black',
        level: '',
        children: [],
      };
      root = false;
    }
    for (let child of children) {
      if (!treeData[child]) {
        // treeData[child] = new TreeNode(child, []);
        treeData[child] = {
          name: child,
          value: 15,
          type: 'black',
          level: '',
          children: [],
        };
      }
      treeData[node].children.push(treeData[child]);
    }
  }
  return treeData;
}

let data = buildTreeData(adjList);

const treeData = {
  name: 'a',
  value: 15,
  type: 'black',
  level: '',
  children: [
    {
      name: 'b',
      value: 15,
      type: 'black',
      level: '',
      children: [
        {
          name: 'c',
          value: 15,
          type: 'black',
          level: '',
          children: [
            {
              name: 'd',
              value: 15,
              type: 'black',
              level: '',
              children: [],
            },
            {
              name: 'e',
              value: 15,
              type: 'black',
              level: '',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'f',
      value: 15,
      type: 'black',
      level: '',
      children: [
        {
          name: 'g',
          value: 15,
          type: 'black',
          level: '',
          children: [
            {
              name: 'h',
              value: 15,
              type: 'black',
              level: '',
              children: [],
            },
            {
              name: 'i',
              value: 15,
              type: 'black',
              level: '',
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

console.log(treeData == data);
// let nodes = [];
// buildAdjList({}, treeData, {name:'a'});

// function buildAdjList(g, treeData, root) {
//   if (!g[root.name]) {
//     g[root.name] = [];
//   }
//   for (let child of treeData.children) {
//     g[root.name].push(child.name);

//     if (child.children.length > 0) {
//       buildAdjList(g, treeData., child);
//     }
//   }
//   console.log(g);
//   return g;
// }

// console.log(treeData);
