import React, { useState } from 'react';
import bfs from './algorithms/breadth-first-search';
import dfs from './algorithms/depth-first-search';
import CreateTree from '../graph-builder/tree-builder';

let pause = false;
let stop = false;

const Graph = () => {
  const [pauseMessage, setpauseMessage] = useState('Pause');
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

  const reset = () => {
    Object.keys(adjList).forEach((e) => {
      let el = document.getElementById(e);
      el.style.fill = '';
    });
  };

  return (
    <div>
      <CreateTree adjList={adjList} />
      <button
        onClick={() => {
          pause = false;
          stop = false;
          dfs(adjList, getPauseStatus, getStopStatus);
        }}
      >
        DFS traverse
      </button>
      <button
        onClick={() => {
          pause = false;
          stop = false;
          bfs(adjList, getPauseStatus, getStopStatus);
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
  );
};

export default Graph;
