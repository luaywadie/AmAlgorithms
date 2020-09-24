import React, { useState } from 'react';
import bfs from '../algorithms/breadth-first-search';
import dfs from '../algorithms/depth-first-search';
import CreateTree from './graph-builder/tree-builder';

let pause = false;
let stop = false;

const TreeTraversals = () => {
  const [pauseMessage, setpauseMessage] = useState('Pause');
  const [nodePath, setnodePath] = useState([]);

  let outputEl = document.getElementById('output');
  if (!outputEl.hasChildNodes()) {
    let heading = document.createTextNode('Traversal Ordering');
    outputEl.appendChild(heading);
    resetOrderList(outputEl);
  }

  let adjList = {
    a: ['b', 'c', 'd'],
    b: ['e', 'h', 'i'],
    c: ['j', 'r'],
    d: ['s', 't', 'u', 'v'],
    e: ['f', 'g'],
    f: [],
    g: ['o'],
    h: [],
    i: [],
    j: ['k'],
    k: ['l', 'q'],
    l: ['m', 'n', 'p'],
    m: [],
    n: [],
    o: [],
    p: [],
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

  const getPauseStatus = () => pause;
  const getStopStatus = () => stop;
  const buildNodePath = (node) => {
    setnodePath((oldA) => [...oldA, node]);
    let li = document.createElement('LI');
    li.style.textAlign = 'center';
    li.appendChild(document.createTextNode(node));
    document.getElementById('nodeHistory').appendChild(li);
  };

  const reset = () => {
    Object.keys(adjList).forEach((e) => {
      let el = document.getElementById(e);
      el.classList.remove('visited-node-bfs');
      el.classList.remove('visited-node-dfs');
    });
    let outputEl = document.getElementById('output');
    outputEl.removeChild(document.getElementById('nodeHistory'));
    resetOrderList(outputEl);
  };

  return (
    <div>
      <div>
        <CreateTree adjList={adjList} />
        <button
          onClick={() => {
            pause = false;
            stop = false;
            dfs(adjList, getPauseStatus, getStopStatus, buildNodePath);
          }}
        >
          DFS traverse
        </button>
        <button
          onClick={() => {
            pause = false;
            stop = false;
            bfs(adjList, getPauseStatus, getStopStatus, buildNodePath);
          }}
        >
          BFS traverse
        </button>
        <button
          onClick={() => {
            stop = true;
            setpauseMessage('Pause');
            pause = false;
            reset();
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            pause = !pause;
            if (pauseMessage === 'Pause') {
              setpauseMessage('Unpause');
            } else {
              setpauseMessage('Pause');
            }
          }}
        >
          {pauseMessage}
        </button>
      </div>
    </div>
  );
};

export default TreeTraversals;

function resetOrderList(outputEl) {
  outputEl.style.fontSize = '30px';
  outputEl
    .appendChild(document.createElement('UL'))
    .setAttribute('id', 'nodeHistory');
  let ul = document.getElementById('nodeHistory');
  ul.style.listStyleType = 'none';
  ul.style.fontSize = '20px';
}
