import React, { Component } from 'react';
import {
  multiply,
  add,
  dotMultiply,
  subtract,
  transpose,
  exp,
  round,
} from 'mathjs';
import { FaStepBackward, FaStepForward, FaPause, FaPlay } from 'react-icons/fa';

import { MathComponent } from 'mathjax-react';
import buildNetwork from '../graph-builders/neural-net-builder';
import { Tabs, Tab } from 'react-bootstrap';

class NeuralNets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      w0: [
        [3, 4],
        [6, 5],
      ],
      w1: [2, 4],
      b0: [1, -6],
      b1: [-3.93],
      x: [1, 0.2],
      learningRate: 0.75,
      prevW0: null,
      prevW1: null,
      prevB0: null,
      prevB1: null,
      newW0: null,
      newW1: null,
      newB0: null,
      newB1: null,
      output: null,
      iteration: null,
      h0_net: null,
      h0_out: null,
      h1_net: null,
      h1_out: null,
      o0_net: null,
      o0_out: null,
      error: null,
      dE: null,
      dZ_out: null,
      dZ_h: null,
      dW1: null,
      dW0: null,
      dB0: null,
      dB1: null,
      activeKey: 'forward',
      animationQueue: [],
      stepIndex: 0,
      stepMode: false,
    };
    this.localAQ = [];
  }

  linkToMatrixMapping = {
    'i0-h0': 'w0-00',
    'i0-h1': 'w0-10',
    'i1-h0': 'w0-01',
    'i1-h1': 'w0-11',
    'h0-o0': 'w1-0',
    'h1-o0': 'w1-1',
  };

  nodeToMatrixMapping = {
    h0: 'b0-0',
    h1: 'b0-1',
    o0: 'b1',
  };

  animationQueue = [];
  componentDidMount() {
    buildNetwork(this.state.x);
    this.neuralNetwork = document.getElementById('graph-container');
    this.addHoverEventListeners();
  }
  componentWillUnmount() {
    this.deleteNetwork();
    this.reset();
  }
  deleteNetwork() {
    this.unMounting = true;
    let svg = document.getElementById('nn-svg');
    if (this.neuralNetwork.hasChildNodes() && svg)
      this.neuralNetwork.removeChild(svg);
  }

  componentDidUpdate(prevProps) {}

  async checkPauseStatus() {
    while (this.state.pause && !this.state.stepMode) {
      await new Promise((r) => setTimeout(r, 100));
      continue;
    }
  }

  linkNames = {
    h0: ['i0-h0', 'i1-h0'],
    h1: ['i0-h1', 'i1-h1'],
    o0: ['h0-o0', 'h1-o0'],
  };

  reset() {
    Object.entries(this.linkNames).forEach(([node, activeLinks]) => {
      this.deActivateNode(node, 'forward');
      this.deActivateNode(node, 'backward');
      this.deActivateLink(activeLinks, 'forward');
      this.deActivateLink(activeLinks, 'backward');
    });

    let nodeText = [
      { id: 'h0-net', str: 'net = ?' },
      { id: 'h0-out', str: 'out = ?' },
      { id: 'h1-net', str: 'net = ?' },
      { id: 'h1-out', str: 'out = ?' },
      { id: 'o0-net', str: 'net = ?' },
      { id: 'o0-out', str: 'out = ?' },
      { id: 'o0-output', str: 'Output = ?' },
      { id: 'o0-error', str: 'Error = ?' },
    ];
    Object.entries(nodeText).forEach(([id, str]) => {
      let el = document.getElementById(id);
      if (el) {
        el.innerHTML = str;
      }
    });

    this.deActivateNodeMatricies([
      'w0-00',
      'w0-01',
      'w0-10',
      'w0-11',
      'b0-0',
      'b0-1',
      'w1-0',
      'w1-1',
      'b1',
    ]);

    let equations = [
      'h0-net-eq',
      'h0-out-eq',
      'h1-net-eq',
      'h1-out-eq',
      'out-net-eq',
      'out-out-eq',
      'error-eq',
      'dE-eq',
      'dZ-out-eq',
      'dOut-wrt-w1-eq',
      'dW1-eq',
      'dB1-eq',
      'dOut-wrt-h-eq',
      'dZ-h-eq',
      'dH-wrt-w-eq',
      'dW0-eq',
      'dB0-eq',
      'w0-update-eq',
      'b0-update-eq',
      'w1-update-eq',
      'b1-update-eq',
    ];
    equations.forEach(this.deHighlightEquation);
    // Remove all highlighted matrices
    this.setState({
      h0_net: null,
      h0_out: null,
      h1_net: null,
      h1_out: null,
      o0_net: null,
      o0_out: null,
      error: null,
      dE: null,
      dZ_out: null,
      dZ_h: null,
      dW1: null,
      dW0: null,
      dB0: null,
      dB1: null,
      activeKey: 'forward',
      w0: [
        [3, 4],
        [6, 5],
      ],
      w1: [2, 4],
      b0: [1, -6],
      b1: [-3.93],
      iteration: null,
      learningRate: 0.75,
    });
    this.localAQ = [];
  }

  addHoverEventListeners() {
    //Attaches hover effects for biases and nodes
    for (const [key, val] of Object.entries(this.nodeToMatrixMapping)) {
      let biasEl = document.getElementById(val);
      biasEl.addEventListener('mouseover', () =>
        this.activateNode(key, 'forward')
      );
      biasEl.addEventListener('mouseout', () =>
        this.deActivateNode(key, 'forward')
      );
    }

    //Attaches hover effects for weights and node links
    for (const [key, val] of Object.entries(this.linkToMatrixMapping)) {
      let linkToMatrixEl = document.getElementById(key);
      linkToMatrixEl.addEventListener('mouseover', () =>
        this.activateNodeMatricies([val])
      );
      linkToMatrixEl.addEventListener('mouseout', () =>
        this.deActivateNodeMatricies([val])
      );

      let matrixToLinkEl = document.getElementById(val);
      matrixToLinkEl.addEventListener('mouseover', () =>
        this.activateLinks([key], 'forward')
      );
      matrixToLinkEl.addEventListener('mouseout', () =>
        this.deActivateLink([key], 'forward')
      );
    }
  }

  async activateNode(node, direction) {
    let el = document.getElementById(node + '-node');
    if (el) {
      el.classList.add('active-node-nn-' + direction);
    }
  }
  deActivateNode(node, direction) {
    let el = document.getElementById(node + '-node');
    if (el) {
      el.classList.remove('active-node-nn-' + direction);
    }
  }
  async activateLinks(links, direction) {
    for (let link of links) {
      let el = document.getElementById(link);
      if (el) {
        el.classList.add('active-link-nn-' + direction);
      }
    }
  }
  deActivateLink(links, direction) {
    for (let link of links) {
      let el = document.getElementById(link);
      if (el) {
        el.classList.remove('active-link-nn-' + direction);
        if (el.classList.contains('fade-out-link-nn-' + direction)) {
          el.classList.remove('fade-out-link-nn-' + direction);
        }
      }
    }
  }

  lookup = {
    h0: ['w0-0', 'b0-0'],
    h1: 'w0-1',
  };
  activateNodeMatricies(tds) {
    for (let td of tds) {
      let el = document.getElementById(td);
      if (el) {
        el.classList.add('active-nn-matrix');
      }
    }
  }

  deActivateNodeMatricies(tds) {
    for (let td of tds) {
      let el = document.getElementById(td);
      if (el) {
        el.classList.remove('active-nn-matrix');
      }
    }
  }

  highlightEquation(id) {
    let el = document.getElementById(id);
    if (el) {
      el.classList.add('active-equation');
    }
  }

  deHighlightEquation(id) {
    let el = document.getElementById(id);
    if (el) {
      el.classList.remove('active-equation');
    }
  }

  async renderAnimationQueue() {
    await this.setState({ stepIndex: 0 });
    let shouldWait = true;
    while (this.state.stepIndex < this.state.animationQueue.length) {
      let currentState = this.state.animationQueue[this.state.stepIndex];

      if (currentState.highlightEq) {
        this.highlightEquation(currentState.highlightEq);
      }

      if (currentState.activeMatrix) {
        this.activateNodeMatricies(currentState.activeMatrix);
      }

      if (currentState.activeNode) {
        for (let [id, direction] of currentState.activeNode) {
          this.activateNode(id, direction);
        }
      }

      if (currentState.activeLinks) {
        for (let [id, direction] of currentState.activeLinks) {
          this.activateLinks(id, direction);
        }
      }

      if (currentState.fadeOutLinks) {
        for (let [ids, direction] of currentState.fadeOutLinks) {
          for (let id of ids) {
            let el = document.getElementById(id);
            if (el) {
              el.classList.add('fade-out-link-nn-' + direction);
            }
          }
        }
      }

      if (currentState.fadeOutNodes) {
        for (let [id, direction] of currentState.fadeOutNodes) {
          let el = document.getElementById(id + '-node');
          if (el) {
            el.classList.add('fade-out-node-nn-' + direction);
          }
        }
      }

      if (currentState.updatedWeights) {
        for (let nodeLink of currentState.updatedWeights) {
          for (let link of nodeLink) {
            let el = document.getElementById(link);
            if (el) {
              el.classList.add('flash-updates-parameters');
            }
          }
        }
      }
      if (currentState.updatedBias) {
        for (let id of currentState.updatedBias) {
          let el = document.getElementById(id);
          if (el) {
            el.classList.add('flash-updated-node');
          }
        }
      }

      let waitTime =
        currentState.waitTime !== undefined ? currentState.waitTime : 1500;

      if (!shouldWait) {
        waitTime = 0;
      }

      await new Promise((r) => setTimeout(r, waitTime / this.state.speed));
      await this.checkPauseStatus();

      await this.setState({ ...currentState });

      if (currentState.nodeTextToUpdate) {
        for (let obj of currentState.nodeTextToUpdate) {
          let el = document.getElementById(obj.id);
          if (el) {
            el.innerHTML = obj.outputStr;
          }
        }
      }

      if (currentState.deHighlightEq) {
        this.deHighlightEquation(currentState.deHighlightEq);
      }
      if (currentState.deActivateLink) {
        for (let [id, direction] of currentState.deActivateLink) {
          this.deActivateLink(id, direction);
        }
      }
      if (currentState.deActiveNode) {
        for (let [id, direction] of currentState.deActiveNode) {
          this.deActivateNode(id, direction);
        }
      }
      if (currentState.deActiveMatrix) {
        this.deActivateNodeMatricies(currentState.deActiveMatrix);
      }
      if (currentState.updatedWeights) {
        for (let nodeLink of currentState.updatedWeights) {
          for (let link of nodeLink) {
            let el = document.getElementById(link);
            if (el) {
              el.classList.remove('flash-updates-parameters');
            }
          }
        }
      }
      if (currentState.updatedBias) {
        for (let id of currentState.updatedBias) {
          let el = document.getElementById(id);
          if (el) {
            el.classList.remove('flash-updated-node');
          }
        }
      }
      if (currentState.fadeOutNodes) {
        for (let [id, direction] of currentState.fadeOutNodes) {
          let el = document.getElementById(id + '-node');
          if (el) {
            el.classList.remove('fade-out-node-nn-' + direction);
          }
        }
      }

      if (!this.state.stepMode) {
        this.setState({ stepIndex: this.state.stepIndex + 1 });
        shouldWait = true;
      } else {
        //     // need to reset everything up to the previous state starting from beggining since we only update what is neccessary at each element of the animation queue

        this.setState({
          stepMode: false,
          pause: true,
        });

        this.reset();
        this.neuralNetwork = document.getElementById('graph-container');
        this.addHoverEventListeners();

        for (let i = 0; i < this.state.stepIndex; i++) {
          let prevState = this.state.animationQueue[i];
          this.setState({ ...prevState });

          if (prevState.highlightEq) {
            this.highlightEquation(prevState.highlightEq);
          }

          if (prevState.activeMatrix) {
            this.activateNodeMatricies(prevState.activeMatrix);
          }

          if (prevState.activeNode) {
            for (let [id, direction] of prevState.activeNode) {
              this.activateNode(id, direction);
            }
          }

          if (prevState.activeLinks) {
            for (let [id, direction] of prevState.activeLinks) {
              this.activateLinks(id, direction);
            }
          }

          if (prevState.nodeTextToUpdate) {
            for (let obj of prevState.nodeTextToUpdate) {
              document.getElementById(obj.id).innerHTML = obj.outputStr;
            }
          }

          if (prevState.deHighlightEq) {
            this.deHighlightEquation(prevState.deHighlightEq);
          }
          if (prevState.deActivateLink) {
            for (let [id, direction] of prevState.deActivateLink) {
              this.deActivateLink(id, direction);
            }
          }
          if (prevState.deActiveNode) {
            for (let [id, direction] of prevState.deActiveNode) {
              this.deActivateNode(id, direction);
            }
          }
          if (prevState.deActiveMatrix) {
            this.deActivateNodeMatricies(prevState.deActiveMatrix);
          }
        }
        shouldWait = false;
      }
    }
    this.setState({ animationQueue: [], pause: false, executing: false });
  }

  async nNLearn() {
    let w0 = [
      [3, 4],
      [6, 5],
    ];
    let w1 = [2, 4];
    let b0 = [1, -6];
    let b1 = [-3.93];

    // RELU SETTINGS
    // let actual = 10;
    // let alpha = 0.05;

    // SIGMOID SETTINGS
    let actual = 1;
    let n_iterations = 16;
    let x = this.state.x;

    const sigmoid = (v) => 1 / (1 + exp(-v));
    // const relu = (x) => max(x, 0);
    const errorFunction = (pred, targ) => (1 / 2) * (targ - pred) ** 2;
    const dZ = (v) => v * (1 - v); // sigmoid derivative
    // const dZ = (x) => Number(x > 0); // relu derivative

    for (let i = 1; i < n_iterations; i++) {
      console.log(`Iteration: ${i}`);

      this.localAQ.push({
        waitTime: 0,
        prevW0: this.state.w0,
        prevW1: this.state.w1,
        prevB0: this.state.b0,
        prevB1: this.state.b1,
        newW0: null,
        newB0: null,
        newW1: null,
        newB1: null,
        iteration: i,
        activeKey: 'forward',
      });

      // Forward
      let h_net = add(multiply(x, transpose(w0)), b0);

      this.localAQ.push({
        highlightEq: 'h0-net-eq',
        activeNode: [['h0', 'forward']],
        activeLinks: [[this.linkNames['h0'], 'forward']],
        activeMatrix: ['w0-00', 'w0-01', 'b0-0'],
      });

      this.localAQ.push({
        h0_net: h_net[0],
        nodeTextToUpdate: [
          {
            id: 'h0-net',
            outputStr: 'net = ' + round(h_net[0], 3),
          },
        ],
      });

      this.localAQ.push({
        deHighlightEq: 'h0-net-eq',
      });
      this.localAQ.push({
        highlightEq: 'h0-out-eq',
      });

      let h_out = h_net.map((e) => sigmoid(e));
      // let h_out = h_net.map((e) => relu(e));

      this.localAQ.push({
        h0_out: h_out[0],
        nodeTextToUpdate: [
          {
            id: 'h0-out',
            outputStr: 'out = ' + round(h_out[0], 3),
          },
        ],
      });

      this.localAQ.push({
        fadeOutNodes: [['h0', 'forward']],
        fadeOutLinks: [[this.linkNames['h0'], 'forward']],
        deHighlightEq: 'h0-out-eq',
        deActiveNode: [['h0', 'forward']],
        deActivateLink: [[this.linkNames['h0'], 'forward']],
        deActiveMatrix: ['w0-00', 'w0-01', 'b0-0'],
      });

      this.localAQ.push({
        highlightEq: 'h1-net-eq',
        activeNode: [['h1', 'forward']],
        activeLinks: [[this.linkNames['h1'], 'forward']],
        activeMatrix: ['w0-10', 'w0-11', 'b0-1'],
      });

      this.localAQ.push({
        h1_net: h_net[1],
        nodeTextToUpdate: [
          {
            id: 'h1-net',
            outputStr: 'net = ' + round(h_net[1], 3),
          },
        ],
      });

      this.localAQ.push({
        deHighlightEq: 'h1-net-eq',
      });

      this.localAQ.push({
        highlightEq: 'h1-out-eq',
      });

      this.localAQ.push({
        h1_out: h_out[1],
        nodeTextToUpdate: [
          {
            id: 'h1-out',
            outputStr: 'out = ' + round(h_out[1], 3),
          },
        ],
      });

      this.localAQ.push({
        fadeOutNodes: [['h1', 'forward']],
        fadeOutLinks: [[this.linkNames['h1'], 'forward']],
        deHighlightEq: 'h1-out-eq',
        deActiveNode: [['h1', 'forward']],
        deActivateLink: [[this.linkNames['h1'], 'forward']],
        deActiveMatrix: ['w0-10', 'w0-11', 'b0-1'],
      });

      this.localAQ.push({
        highlightEq: 'out-net-eq',
        activeNode: [['o0', 'forward']],
        activeLinks: [[this.linkNames['o0'], 'forward']],
        activeMatrix: ['w1-0', 'w1-1', 'b1'],
      });

      let out_net = add(multiply(h_out, transpose(w1)), b1);

      this.localAQ.push({
        o0_net: out_net,
        nodeTextToUpdate: [
          {
            id: 'o0-net',
            outputStr: 'net = ' + round(out_net, 3),
          },
        ],
      });

      this.localAQ.push({
        deHighlightEq: 'out-net-eq',
      });

      this.localAQ.push({
        highlightEq: 'out-out-eq',
      });

      let out_out = sigmoid(out_net);

      this.localAQ.push({
        o0_out: out_out,
        nodeTextToUpdate: [
          {
            id: 'o0-output',
            outputStr: 'Output = ' + round(out_out, 3),
          },
        ],
      });

      this.localAQ.push({
        fadeOutLinks: [[this.linkNames['o0'], 'forward']],
        deHighlightEq: 'out-out-eq',
        deActivateLink: [[this.linkNames['o0'], 'forward']],
        deActiveMatrix: ['w1-0', 'w1-1', 'b1'],
      });

      this.localAQ.push({
        highlightEq: 'error-eq',
      });

      let error = errorFunction(out_out, actual);

      this.localAQ.push({
        error: round(error, 3),
      });

      this.localAQ.push({
        fadeOutNodes: [['o0', 'forward']],
        deHighlightEq: 'error-eq',
        deActiveNode: [['o0', 'forward']],
        nodeTextToUpdate: [
          {
            id: 'o0-error',
            outputStr: 'Error = ' + round(error, 3),
          },
        ],
      });

      // Backprop

      this.localAQ.push({
        activeKey: 'backprop',
        highlightEq: 'dE-eq',
        activeNode: [['o0', 'backward']],
      });

      let dE = -(actual - out_out);

      this.localAQ.push({
        dE: dE,
      });

      this.localAQ.push({
        deHighlightEq: 'dE-eq',
      });
      this.localAQ.push({
        highlightEq: 'dZ-out-eq',
      });

      let dZ_out = dZ(out_out); // d_out_out_wrt_d_out_net

      this.localAQ.push({
        dZ_out: dZ_out,
      });

      this.localAQ.push({
        deHighlightEq: 'dZ-out-eq',
      });

      this.localAQ.push({
        highlightEq: 'dOut-wrt-w1-eq',
        activeLinks: [[this.linkNames['o0'], 'backward']],
      });

      let dOut_wrt_w1 = h_out;

      this.localAQ.push({
        deHighlightEq: 'dOut-wrt-w1-eq',
      });

      this.localAQ.push({
        highlightEq: 'dW1-eq',
      });

      let dw1 = multiply(dE, multiply(dZ_out, dOut_wrt_w1));

      this.localAQ.push({
        dW1: dw1,
      });

      this.localAQ.push({
        deHighlightEq: 'dW1-eq',
      });

      this.localAQ.push({
        highlightEq: 'dB1-eq',
      });

      let db1 = multiply(dE, dZ(out_out));

      this.localAQ.push({
        dB1: db1,
      });

      this.localAQ.push({
        deHighlightEq: 'dB1-eq',
      });

      this.localAQ.push({
        highlightEq: 'dOut-wrt-h-eq',
        activeNode: [
          ['h0', 'backward'],
          ['h1', 'backward'],
        ],
      });

      let dOut_wrt_h = w1;

      this.localAQ.push({
        deHighlightEq: 'dOut-wrt-h-eq',
      });

      this.localAQ.push({
        highlightEq: 'dZ-h-eq',
      });

      let dZ_h = h_out.map((e) => dZ(e)); // d_h_out_wrt_d_h_net

      this.localAQ.push({
        dZ_h: dZ_h,
      });

      this.localAQ.push({
        deHighlightEq: 'dZ-h-eq',
      });

      this.localAQ.push({
        highlightEq: 'dH-wrt-w-eq',
        activeLinks: [
          [this.linkNames['h0'], 'backward'],
          [this.linkNames['h1'], 'backward'],
        ],
      });

      let dh_wrt_w0 = x;

      this.localAQ.push({
        deHighlightEq: 'dH-wrt-w-eq',
      });

      this.localAQ.push({
        highlightEq: 'dW0-eq',
      });

      let dw0 = multiply(
        dotMultiply(dE, dZ(out_out)),
        dotMultiply(dOut_wrt_h, dotMultiply(dZ_h, dh_wrt_w0))
      );

      this.localAQ.push({
        dW0: dw0,
      });

      this.localAQ.push({
        deHighlightEq: 'dW0-eq',
      });
      this.localAQ.push({
        highlightEq: 'dB0-eq',
      });

      let db0 = dotMultiply(dE * dZ(out_out), dotMultiply(dOut_wrt_h, dZ_h));

      this.localAQ.push({
        dB0: db0,
      });

      this.localAQ.push({
        fadeOutNodes: [
          ['o0', 'backward'],
          ['h0', 'backward'],
          ['h1', 'backward'],
        ],
        fadeOutLinks: [
          [this.linkNames['h0'], 'backward'],
          [this.linkNames['h1'], 'backward'],
          [this.linkNames['o0'], 'backward'],
        ],
        deHighlightEq: 'dB0-eq',
        deActiveNode: [
          ['o0', 'backward'],
          ['h0', 'backward'],
          ['h1', 'backward'],
        ],
        deActivateLink: [
          [this.linkNames['h0'], 'backward'],
          [this.linkNames['h1'], 'backward'],
          [this.linkNames['o0'], 'backward'],
        ],
        deActiveMatrix: ['w1-0', 'w1-1', 'b1'],
      });

      // UPDATES
      this.localAQ.push({
        activeKey: 'update',
      });

      this.localAQ.push({
        highlightEq: 'w0-update-eq',
        activeMatrix: ['w0-00', 'w0-01', 'w0-10', 'w0-11'],
        updatedWeights: [this.linkNames['h0'], this.linkNames['h1']],
      });

      w0 = subtract(w0, [
        dotMultiply(this.state.learningRate, dw0),
        dotMultiply(this.state.learningRate, dw0),
      ]);
      this.localAQ.push({
        newW0: w0,
        w0: w0,
      });

      this.localAQ.push({
        deHighlightEq: 'w0-update-eq',
        deActiveMatrix: ['w0-00', 'w0-01', 'w0-10', 'w0-11'],
      });

      this.localAQ.push({
        highlightEq: 'b0-update-eq',
        activeMatrix: ['b0-0', 'b0-1'],
        updatedBias: ['h0-node', 'h1-node'],
      });

      b0 = subtract(b0, dotMultiply(this.state.learningRate, db0));

      this.localAQ.push({
        newB0: b0,
        b0: b0,
        nodeTextToUpdate: [{ id: 'o0-bias', outputStr: 'b = ' + round(b1, 3) }],
      });

      this.localAQ.push({
        deHighlightEq: 'b0-update-eq',
        deActiveMatrix: ['b0-0', 'b0-1'],
      });

      this.localAQ.push({
        highlightEq: 'w1-update-eq',
        activeMatrix: ['w1-0', 'w1-1'],
        updatedWeights: [this.linkNames['o0']],
      });

      w1 = subtract(w1, dotMultiply(this.state.learningRate, dw1));
      this.localAQ.push({
        newW1: w1,
        w1: w1,
      });

      this.localAQ.push({
        deHighlightEq: 'w1-update-eq',
        deActiveMatrix: ['w1-0', 'w1-1'],
      });

      this.localAQ.push({
        highlightEq: 'b1-update-eq',
        activeMatrix: ['b1'],
        updatedBias: ['o0-node'],
      });

      b1 = subtract(b1, dotMultiply(this.state.learningRate, db1));

      this.localAQ.push({
        newB1: b1,
        b1: b1,
        nodeTextToUpdate: [
          { id: 'h0-bias', outputStr: 'b = ' + round(b0[0], 3) },
          { id: 'h1-bias', outputStr: 'b = ' + round(b0[1], 3) },
        ],
      });

      this.localAQ.push({
        waitTime: 0,
        deHighlightEq: 'b1-update-eq',
        deActiveMatrix: ['b1'],
        output: round(out_out, 3),
        w0: w0,
        w1: w1,
        b0: b0,
        b1: b1,
        h0_net: null,
        h0_out: null,
        h1_net: null,
        h1_out: null,
        o0_net: null,
        o0_out: null,
        error: null,
        dE: null,
        dZ_out: null,
        dZ_h: null,
        dW1: null,
        dW0: null,
        dB0: null,
        dB1: null,
      });
    }
    this.setState({
      animationQueue: this.localAQ,
    });
    this.renderAnimationQueue();
  }

  render2x2Matrix(a, yLabel, xLabel) {
    return (
      <table className={'nn-matrix'}>
        <tbody>
          <tr>
            {/* <td></td> */}
            <td></td>
            <td colSpan="2">{/* <i>{xLabel}</i> */}</td>
            <td></td>
          </tr>
          <tr>
            {/* <td></td> */}
            <td></td>
            <td>
              <i>i0</i>
            </td>
            <td>
              <i>i1</i>
            </td>
          </tr>
          <tr>
            {/* <td rowSpan="2" style={{ padding: 0 }}>
               <i>{yLabel}</i> 
            </td> */}
            <td>
              <i>h0</i>
            </td>
            <td id={'w0-00'} className={'left'}>
              {round(a[0][0], 3)}
            </td>
            <td id={'w0-01'} className={'right'}>
              {round(a[0][1], 3)}
            </td>
          </tr>

          <tr>
            <td>
              <i>h1</i>
            </td>
            <td id={'w0-10'} className={'left'}>
              {round(a[1][0], 3)}
            </td>
            <td id={'w0-11'} className={'right'}>
              {round(a[1][1], 3)}
            </td>
          </tr>
          <tr>
            {/* <td></td> */}
            <td></td>
            <td colSpan="2">W0</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  }

  render1x2Matrix(a, yLabel, yNode, xLabel, xNode) {
    return (
      <table className={'nn-matrix'}>
        <tbody>
          <tr>
            {/* <td></td> */}
            <td></td>
            <td colSpan="2">{/* <i>{xLabel}</i> */}</td>
            <td></td>
          </tr>
          <tr>
            {/* <td></td> */}
            <td></td>
            <td>
              <i>{xNode}0</i>
            </td>
            <td>
              <i>{xNode}1</i>
            </td>
            <td></td>
          </tr>
          <tr>
            {/* <td style={{ padding: 0 }}><i>{yLabel}</i></td> */}
            <td>
              <i>{yNode}0</i>
            </td>
            <td id={'w1-0'} className={'left'}>
              {round(a[0], 3)}
            </td>
            <td id={'w1-1'} className={'right'}>
              {round(a[1], 3)}
            </td>
          </tr>
          <tr>
            {/* <td></td> */}
            <td></td>
            <td colSpan="2">W1</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  }

  render2x1Matrix(a, yLabel, yNode, xLabel, xNode) {
    return (
      <table className={'nn-matrix'}>
        <tbody>
          <tr>
            {/* <td></td> */}
            <td></td>
            <td>{/* <i>{xLabel}</i> */}</td>
          </tr>
          <tr>
            {/* <td></td> */}
            <td></td>
            <td>
              <i>{xNode}0</i>
            </td>
          </tr>
          <tr>
            {/* <td rowSpan="2" style={{ padding: 0 }}>
              <i>{yLabel}</i>
            </td> */}
            <td>
              <i>{yNode}0</i>
            </td>
            <td id={'b0-0'} className={'left-and-right'}>
              {round(a[0], 3)}
            </td>
          </tr>
          <tr>
            <td>
              <i>{yNode}1</i>
            </td>
            <td id={'b0-1'} className={'left-and-right'}>
              {round(a[1], 3)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render1x1Matrix(a, yLabel, yNode, xLabel, xNode) {
    return (
      <table className={'nn-matrix'}>
        <tbody>
          <tr>
            {/* <td></td> */}
            <td></td>
            <td>{/* <i>{xLabel}</i> */}</td>
          </tr>
          <tr>
            {/* <td></td> */}
            <td></td>
            <td>
              <i>{xNode}1</i>
            </td>

            <td></td>
          </tr>
          <tr>
            {/* <td style={{ padding: 0 }}><i>{yLabel}</i></td> */}
            <td>
              <i>{yNode}0</i>
            </td>
            <td id={'b1'} className={'left-and-right'}>
              {round(a[0], 3)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  handleTabSelect = (key) => {
    console.log(key);
    this.setState({ activeKey: key });
  };

  render() {
    return (
      <div className={'row'}>
        <div className={'col-6'} id={'graph-container'}>
          <div className={'row'} style={{ zIndex: 5 }}>
            <button
              onClick={async () => {
                await this.nNLearn();
              }}
            >
              Learn
            </button>
            <button
              id={'reset-button'}
              onClick={async () => {
                await this.setState({
                  pause: false,
                  stop: true,
                  animationQueue: [],
                  runningAlg: null,
                });
                this.deleteNetwork();
                buildNetwork(this.state.x);
                this.reset();
              }}
            >
              Reset
            </button>
            <div className={'divider'}></div>
            <button
              onClick={() => {
                let newStepIndex = this.state.stepIndex - 1;
                while (!this.state.animationQueue[newStepIndex].highlightEq) {
                  newStepIndex -= 1;
                }
                this.setState({
                  stepIndex: newStepIndex,
                  pause: true,
                  stepMode: true,
                });
              }}
            >
              <FaStepBackward />
            </button>
            <button
              onClick={() => {
                this.setState({ pause: !this.state.pause, stepMode: false });
              }}
            >
              {this.state.pause ? <FaPlay /> : <FaPause />}
            </button>
            <button
              onClick={() => {
                let newStepIndex = this.state.stepIndex + 1;
                while (!this.state.animationQueue[newStepIndex].highlightEq) {
                  newStepIndex += 1;
                }
                this.setState({
                  stepIndex: newStepIndex,
                  pause: true,
                  stepMode: true,
                });
              }}
            >
              <FaStepForward />
            </button>
            <form onSubmit={(event) => event.preventDefault()}>
              <label>
                Speed:
                <input
                  style={{ width: '50px' }}
                  type="number"
                  value={this.state.speed}
                  onChange={(event) =>
                    this.setState({
                      speed: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Learning Rate:
                <input
                  style={{ width: '65px' }}
                  type="number"
                  value={this.state.learningRate}
                  onChange={(event) =>
                    this.setState({
                      learningRate: event.target.value,
                    })
                  }
                  max="1"
                  min="0"
                  step="0.05"
                />
              </label>
            </form>

            <br></br>
            <table
              style={{
                border: 'none',
                borderCollapse: 'collapse',
                fontSize: '36px',
                marginLeft: '100px',
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      border: 'none',
                      width: '200px',
                      textAlign: 'left',
                    }}
                  >
                    Iteration: {this.state.iteration}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={'col-6'}>
          <Tabs
            activeKey={this.state.activeKey}
            onSelect={this.handleTabSelect}
            id="uncontrolled-tab-example"
          >
            <Tab
              eventKey="forward"
              title="Forward"
              style={{ fontSize: '22px', marginLeft: '-10px' }}
            >
              <div className={'row'}>
                <h1>FORWARD Matrix Math</h1> <br></br>
              </div>
              <div className={'row'}>
                <div id={'h0-net-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw`h_0 net = w_{00}^0 * x_0 + w_{01}^0 * x_1 + b_0^0 = ${round(
                      this.state.w0[0][0],
                      3
                    )} *${this.state.x[0]} + ${round(
                      this.state.w0[0][1],
                      3
                    )} * ${this.state.x[1]} + ${round(this.state.b0[0], 3)} = 
              ${this.state.h0_net ? round(this.state.h0_net, 3) : '?'}`}
                  />
                </div>
              </div>
              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'h0-out-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw`h_0 out = \sigma (h_0 net) =  
              ${this.state.h0_out ? round(this.state.h0_out, 3) : '?'}
              `}
                  />
                </div>
              </div>
              <div className={'row'}>
                <div id={'h1-net-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw`h_1 net = w_{10}^0 * x_0 + w_{11}^0 * x_1 + b_1^0 = ${round(
                      this.state.w0[1][0],
                      3
                    )} *${this.state.x[0]} + ${round(
                      this.state.w0[1][1],
                      3
                    )} * ${this.state.x[1]} + ${round(this.state.b0[1], 3)} = 
              ${this.state.h1_net !== null ? round(this.state.h1_net, 3) : '?'}
              
              `}
                  />{' '}
                </div>
              </div>
              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'h1-out-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw`h_1 out = \sigma (h_1 net) =  
              ${this.state.h1_out ? round(this.state.h1_out, 3) : '?'}
              `}
                  />
                </div>
              </div>

              <div className={'row'}>
                <div id={'out-net-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw`o_0 net = w_{0}^1 * x_0 + w_{1}^1 * x_1 + b^1 = ${round(
                      this.state.w1[0],
                      3
                    )} *${this.state.x[0]} + ${round(this.state.w1[1], 3)} * ${
                      this.state.x[1]
                    } + ${round(this.state.b1, 3)} = 
              ${this.state.o0_net ? round(this.state.o0_net, 3) : '?'}
              
              `}
                  />{' '}
                </div>
              </div>
              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'out-out-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw`o_0 out = \sigma (o_0 net) =  
              ${this.state.o0_out ? round(this.state.o0_out, 3) : '?'}
              `}
                  />
                </div>
              </div>

              <div className={'row'}>
                <div id={'error-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw`error =  \frac{1}{2} * (o_0 net - target)^2 =  
                    \frac{1}{2} * (${
                      this.state.o0_out ? round(this.state.o0_out, 3) : '?'
                    }
               - 1)^2 = ${this.state.error ? round(this.state.error, 3) : '?'}
              `}
                  />
                </div>
              </div>
            </Tab>
            <Tab
              eventKey="backprop"
              title="Backprop"
              style={{ fontSize: '17px', marginLeft: '-60px' }}
            >
              <div className={'row'} style={{ marginTop: '10px' }}>
                <h1>BACKPROP Matrix Math</h1> <br></br>
              </div>

              <div className={'row'}>
                <div id={'dE-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` \frac{\partial E}{ \partial output} 
                    = - (target - output) 
                    = - (1 - 
                    ${this.state.o0_out ? round(this.state.o0_out, 3) : '?'}) 
                    = 
                    ${this.state.dE ? round(this.state.dE, 3) : '?'}`}
                  />
                </div>
              </div>
              <div className={'row'} style={{ marginTop: '-10px' }}>
                <div id={'dZ-out-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` \frac{\partial output}{ \partial o_0 net} 
                    = output * (1 - output) = 
                    ${this.state.o0_out ? round(this.state.o0_out, 3) : '?'} 
                    * (1 - 
                    ${this.state.o0_out ? round(this.state.o0_out, 3) : '?'}) 
                    = 
                    ${this.state.dZ_out ? round(this.state.dZ_out, 3) : '?'}`}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '20px' }}>
                <div id={'dOut-wrt-w1-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` \frac{\partial o_0 net}{ \partial w1} 
                    = \pmatrix{h_0 out \\ h_1 out} = 
                    \pmatrix{
                      ${this.state.h0_out ? round(this.state.h0_out, 3) : '?'} 
                      \\ 
                      ${this.state.h1_out ? round(this.state.h1_out, 3) : '?'}
                    }`}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dW1-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` 
                    \frac{\partial E}{ \partial w1} 
                    = \frac{\partial E}{ \partial output} 
                    * \frac{\partial output}{ \partial o_0 net} 
                    * \frac{\partial o_0 net}{ \partial w1} 
                    = ${this.state.dE ? round(this.state.dE, 3) : '?'} 
                    *  ${this.state.dZ_out ? round(this.state.dZ_out, 3) : '?'}
                    *   \pmatrix{
                        ${
                          this.state.h0_out ? round(this.state.h0_out, 3) : '?'
                        } 
                        \\ 
                        ${this.state.h1_out ? round(this.state.h1_out, 3) : '?'}
                        }
                    = \pmatrix{
                        ${this.state.dW1 ? round(this.state.dW1[0], 3) : '?'}
                        \\
                        ${this.state.dW1 ? round(this.state.dW1[1], 3) : '?'}
                      }`}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dB1-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` 
                    \frac{\partial Error}{ \partial b_1} 
                    = \frac{\partial E}{ \partial output} 
                    * \frac{\partial output}{ \partial b_1}  
                    = ${this.state.dE ? round(this.state.dE, 3) : '?'} 
                    *  ${this.state.dZ_out ? round(this.state.dZ_out, 3) : '?'}
                    = ${this.state.dB1 ? round(this.state.dB1, 3) : '?'}`}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '25px' }}>
                <div id={'dOut-wrt-h-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` 
                    \frac{\partial o_0 net}{ \partial h out} 
                    = W1 
                    = \pmatrix{
                      ${this.state.w1[0] ? round(this.state.w1[0], 3) : '?'}
                      \\ 
                      ${this.state.w1[1] ? round(this.state.w1[1], 3) : '?'}
                    }`}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-25px' }}>
                <div id={'dZ-h-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` 
                    \frac{\partial h out}{ \partial h_{net}} = h_{out} * (1 - h_{out}) 
                    = \pmatrix{${
                      this.state.h0_out ? round(this.state.h0_out, 3) : '?'
                    } \\ ${
                      this.state.h1_out ? round(this.state.h1_out, 3) : '?'
                    }}
               * (1 - 
                \pmatrix{${
                  this.state.h0_out ? round(this.state.h0_out, 3) : '?'
                } \\ ${this.state.h1_out ? round(this.state.h1_out, 3) : '?'}}
                 = 
                 \pmatrix{${
                   this.state.dZ_h ? round(this.state.dZ_h[0], 3) : '?'
                 } \\ ${this.state.dZ_h ? round(this.state.dZ_h[1], 3) : '?'}}
                 `}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-25px' }}>
                <div id={'dH-wrt-w-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` 
                    \frac{\partial h_{net}}{ \partial w0} 
                    = X 
                    = \pmatrix{
                      ${this.state.x[0] ? round(this.state.x[0], 3) : '?'} 
                      \\ 
                      ${
                        this.state.x[1] !== null
                          ? round(this.state.x[1], 3)
                          : '?'
                      }
                    }
               `}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-25px' }}>
                <div id={'dW0-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` \frac{\partial E}{ \partial w0} = \frac{\partial E}{ \partial output} * \frac{\partial output}{ \partial o_0 net} * \frac{\partial o_0 net}{ \partial h_{out}} *  \frac{\partial h_{out}}{ \partial h_{net}} *  \frac{\partial h_{net}}{ \partial W0} 
              = ${this.state.dE ? round(this.state.dE, 3) : '?'} 
              *  
              ${this.state.dZ_out ? round(this.state.dZ_out, 3) : '?'} 
              *   
              \pmatrix{${
                this.state.w1[0] ? round(this.state.w1[0], 3) : '?'
              } \\ ${this.state.w1[1] ? round(this.state.w1[1], 3) : '?'}}
              *
              \pmatrix{${
                this.state.dZ_h ? round(this.state.dZ_h[0], 3) : '?'
              } \\ ${this.state.dZ_h ? round(this.state.dZ_h[1], 3) : '?'}}
              *
              \pmatrix{${
                this.state.x[0] ? round(this.state.x[0], 3) : '?'
              } \\ ${
                      this.state.x[1] !== null ? round(this.state.x[1], 3) : '?'
                    }}
               = 
               \pmatrix{
                ${this.state.dW0 ? round(this.state.dW0[0], 3) : '?'}
                 \\
                 ${this.state.dW0 ? round(this.state.dW0[1], 3) : '?'}}
  
               `}
                  />
                </div>
              </div>
              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dB0-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` \frac{\partial Error}{ \partial b_0} = 
              \frac{\partial E}{ \partial output} * \frac{\partial output}{ \partial o_0 net} 
              * \frac{\partial o_0 net}{ \partial h_{out}} 
              * \frac{\partial h_{out}}{ \partial b_0}   
              = ${this.state.dE ? round(this.state.dE, 3) : '?'} *  ${
                      this.state.dZ_out ? round(this.state.dZ_out, 3) : '?'
                    }
               * \pmatrix{${
                 this.state.w1[0] ? round(this.state.w1[0], 3) : '?'
               } \\ ${this.state.w1[1] ? round(this.state.w1[1], 3) : '?'}}
              * \pmatrix{${
                this.state.dZ_h ? round(this.state.dZ_h[0], 3) : '?'
              } \\ ${this.state.dZ_h ? round(this.state.dZ_h[1], 3) : '?'}}
               = 
               \pmatrix{
                ${this.state.dB0 ? round(this.state.dB0[0], 3) : '?'}
                 \\
                 ${this.state.dB0 ? round(this.state.dB0[1], 3) : '?'}}
  
               `}
                  />
                </div>
              </div>
            </Tab>
            <Tab eventKey="update" title="Update" style={{ fontSize: '22px' }}>
              <div className={'row'} style={{ marginTop: '10px' }}>
                <h1>UPDATES</h1> <br></br>
              </div>

              <div className={'row'}>
                <div id={'w0-update-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` w0 = w0 - \alpha * \frac{\partial E}{ \partial w0} = 
              \pmatrix{
                ${this.state.prevW0 ? round(this.state.prevW0[0][0], 3) : '?'}
                &
                ${this.state.prevW0 ? round(this.state.prevW0[0][1], 3) : '?'}
                 \\
                 ${this.state.prevW0 ? round(this.state.prevW0[1][0], 3) : '?'}
                 &
                 ${this.state.prevW0 ? round(this.state.prevW0[1][1], 3) : '?'}}
                 - ${this.state.learningRate}  * 
                 \pmatrix{
                  ${this.state.dW0 ? round(this.state.dW0[0], 3) : '?'}
                   \\
                   ${this.state.dW0 ? round(this.state.dW0[1], 3) : '?'}}
                    = 
                    \pmatrix{
                      ${
                        this.state.newW0
                          ? round(this.state.newW0[0][0], 3)
                          : '?'
                      }
                      &
                      ${
                        this.state.newW0
                          ? round(this.state.newW0[0][1], 3)
                          : '?'
                      }
                       \\
                       ${
                         this.state.newW0
                           ? round(this.state.newW0[1][0], 3)
                           : '?'
                       }
                       &
                       ${
                         this.state.newW0
                           ? round(this.state.newW0[1][1], 3)
                           : '?'
                       }}
               `}
                  />
                </div>
              </div>
              <div className={'row'}>
                <div id={'b0-update-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` b0 = b0 - \alpha * \frac{\partial E}{ \partial b0} = 
              \pmatrix{
                ${this.state.prevB0 ? round(this.state.prevB0[0], 3) : '?'}
                 \\
                 ${this.state.prevB0 ? round(this.state.prevB0[1], 3) : '?'}
                 }
                 - ${this.state.learningRate}  * 
                 \pmatrix{
                  ${this.state.dB0 ? round(this.state.dB0[0], 3) : '?'}
                   \\
                   ${this.state.dB0 ? round(this.state.dB0[1], 3) : '?'}}
                   =                 \pmatrix{
                    ${this.state.newB0 ? round(this.state.newB0[0], 3) : '?'}
                     \\
                     ${this.state.newB0 ? round(this.state.newB0[1], 3) : '?'}}
               `}
                  />
                </div>
              </div>

              <div className={'row'}>
                <div id={'w1-update-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` w1 = w1 - \alpha * \frac{\partial E}{ \partial w1} = 
              \pmatrix{
                ${this.state.prevW1 ? round(this.state.prevW1[0], 3) : '?'}
                 \\
                 ${this.state.prevW1 ? round(this.state.prevW1[1], 3) : '?'}
                 }
                 - ${this.state.learningRate}  * 
                  ${this.state.dW1 ? round(this.state.dW1[0], 3) : '?'}
                  = 
                  \pmatrix{
                    ${this.state.newW1 ? round(this.state.newW1[0], 3) : '?'}
                    
                     \\
                     ${this.state.newW1 ? round(this.state.newW1[1], 3) : '?'}
                     }
               `}
                  />
                </div>
              </div>

              <div className={'row'}>
                <div id={'b1-update-eq'} className={'nn-equation'}>
                  <MathComponent
                    display={false}
                    tex={String.raw` b1 = b1 - \alpha * \frac{\partial E}{ \partial b1} = 
              
                ${this.state.prevB1 ? round(this.state.prevB1, 3) : '?'}
                 
                 - ${this.state.learningRate}  * 
                  ${this.state.dB1 ? round(this.state.dB1, 3) : '?'}
                  = 
                  ${this.state.newB1 ? round(this.state.newB1, 3) : '?'}
                   
               `}
                  />
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
        <div
          className={'col-12'}
          style={{ position: 'absolute', top: '800px', left: '-40px' }}
        >
          <div
            className={'row'}
            style={{ marginTop: '-70px', marginLeft: '-120px' }}
          >
            <span style={{ marginLeft: '160px' }}></span>
            {this.render2x2Matrix(this.state.w0, 'layer 1', 'layer 0')}
            <span style={{ marginLeft: '-20px' }}></span>
            {this.render2x1Matrix(this.state.b0, 'layer 1', 'h', 'bias 0', 'b')}
            <span style={{ marginLeft: '20px' }}></span>
            {this.render1x2Matrix(
              this.state.w1,
              'layer 2',
              'o',
              'layer 1',
              'h'
            )}
            <span style={{ marginLeft: '-35px' }}></span>
            {this.render1x1Matrix(this.state.b1, 'layer 2', 'o', 'bias 1', 'b')}
          </div>
        </div>
      </div>
    );
  }
} //End NeuralNet Component

export default NeuralNets;
