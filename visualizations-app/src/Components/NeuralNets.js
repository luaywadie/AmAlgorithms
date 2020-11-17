import React, { Component } from 'react';
import {
  multiply,
  add,
  dotMultiply,
  subtract,
  transpose,
  exp,
  max,
  round,
} from 'mathjs';
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
      x: [1, 0],
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
    buildNetwork();
    this.neuralNetwork = document.getElementById('graph-container');
    this.addHoverEventListeners();
  }
  componentWillUnmount() {}

  componentDidUpdate(prevProps) {}

  async checkPauseStatus() {
    while (this.props.pause) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
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

  linkNames = {
    h0: ['i0-h0', 'i1-h0'],
    h1: ['i0-h1', 'i1-h1'],
    o0: ['h0-o0', 'h1-o0'],
  };

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
          document.getElementById(obj.id).innerHTML = obj.outputStr;
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
      if (!this.state.stepMode) {
        this.setState({ stepIndex: this.state.stepIndex + 1 });
        shouldWait = true;
      }

      //   if (currentState.activateChildAndParent) {
      //     this.activateChildAndParent(
      //       currentState.activateChildAndParent[0],
      //       currentState.activateChildAndParent[1]
      //     );
      //   }

      //   this.activateParent(currentState.activateParent);
      //   this.deActivateParent(currentState.deActivateParent);

      //   if (currentState.activateLeftAndRightChildren) {
      //     this.activateLeftAndRightChildren(
      //       currentState.activateLeftAndRightChildren[0],
      //       currentState.activateLeftAndRightChildren[1]
      //     );
      //   }

      //   if (currentState.deActivateLeftAndRightChildren) {
      //     this.deActivateLeftAndRightChildren(
      //       currentState.deActivateLeftAndRightChildren[0],
      //       currentState.deActivateLeftAndRightChildren[1]
      //     );
      //   }

      //   if (currentState.swap) {
      //     swap(currentState.swap[0], currentState.swap[1]);
      //   }

      //   if (currentState.removeActiveChildParent) {
      //     this.removeActiveChildParent(
      //       currentState.removeActiveChildParent[0],
      //       currentState.removeActiveChildParent[1]
      //     );
      //   }
      //   this.activateLink(currentState.activatedLink);
      //   this.deActivateLink(currentState.deActivateLink);

      //   if (!this.state.stepMode) {
      //     this.setState({ stepIndex: this.state.stepIndex + 1 });
      //     shouldWait = true;
      //   } else {
      //     // need to reset everything up to the previous state starting from beggining since we only update what is neccessary at each element of the animation queue

      //     this.setState({
      //       stepMode: false,
      //       pause: true,
      //     });
      //     this.convertHeapArrayToAdjList(this.state.heapA);
      //     insertIntoDynamicTree(this.state.heapA[1], this.adjList);
      //     for (let i = 0; i < this.state.stepIndex; i++) {
      //       let prevState = this.state.animationQueue[i];
      //       this.setState({ ...prevState });

      //       if (prevState.activateChildAndParent) {
      //         this.activateChildAndParent(
      //           prevState.activateChildAndParent[0],
      //           prevState.activateChildAndParent[1]
      //         );
      //       }

      //       if (prevState.removeActiveChildParent) {
      //         this.removeActiveChildParent(
      //           prevState.removeActiveChildParent[0],
      //           prevState.removeActiveChildParent[1]
      //         );
      //       }

      //       this.activateLink(prevState.activatedLink);
      //       this.deActivateLink(prevState.deActivateLink);

      //       if (prevState.keepLineHighlighted) {
      //         this.highlightLine(prevState.highlightedLine);
      //       }
      //       if (prevState.removeKeptHighlightedLine) {
      //         this.removeHighlightedLine(prevState.removeKeptHighlightedLine);
      //       }
      //     }
      //     shouldWait = false;
      //   }
      // }
      // this.setState({ animationQueue: [], pause: false, executing: false });
    }
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
    let alpha = 0.5;
    let n_iterations = 10;
    let x = [1, 0];

    const sigmoid = (x) => 1 / (1 + exp(-x));
    // const relu = (x) => max(x, 0);
    const errorFunction = (pred, actual) => (1 / 2) * (actual - pred) ** 2;
    const dZ = (x) => x * (1 - x); // sigmoid derivative
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
            outputStr: 'output = ' + round(out_out, 3),
          },
        ],
      });

      this.localAQ.push({
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
        deHighlightEq: 'error-eq',
        deActiveNode: [['o0', 'forward']],
      });

      // Backprop
      this.localAQ.push({
        activeKey: 'backprop',
      });

      this.localAQ.push({
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
      });

      w0 = subtract(w0, [dotMultiply(alpha, dw0), dotMultiply(alpha, dw0)]);
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
      });

      b0 = subtract(b0, dotMultiply(alpha, db0));

      this.localAQ.push({
        newB0: b0,
        b0: b0,
        nodeTextToUpdate: [
          { id: 'o0-bias', outputStr: 'b = ' + round(this.state.b1, 3) },
        ],
      });

      this.localAQ.push({
        deHighlightEq: 'b0-update-eq',
        deActiveMatrix: ['b0-0', 'b0-1'],
      });

      this.localAQ.push({
        highlightEq: 'w1-update-eq',
        activeMatrix: ['w1-0', 'w1-1'],
      });

      w1 = subtract(w1, dotMultiply(alpha, dw1));
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
      });

      b1 = subtract(b1, dotMultiply(alpha, db1));

      this.localAQ.push({
        newB1: b1,
        b1: b1,
        nodeTextToUpdate: [
          { id: 'h0-bias', outputStr: 'b = ' + round(this.state.b0[0], 3) },
          { id: 'h1-bias', outputStr: 'b = ' + round(this.state.b0[1], 3) },
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
          <div className={'row'}>
            <form
              style={{ zIndex: 4 }}
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <button
                onClick={async () => {
                  await this.nNLearn();
                }}
              >
                execute
              </button>
            </form>{' '}
            <table
              style={{
                border: 'none',
                borderCollapse: 'collapse',
                fontSize: '36px',
                marginLeft: '200px',
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
                  <td
                    style={{
                      border: 'none',
                      width: '300px',
                      textAlign: 'left',
                      paddingLeft: '100px',
                    }}
                  >
                    Error: {this.state.error}
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
              style={{ fontSize: '26px', marginLeft: '-10px' }}
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
                    tex={String.raw`error =  _2^1 * (o_0 net - target)^2 =  
              _2^1 * (${this.state.o0_out ? round(this.state.o0_out, 3) : '?'}
               - 1)^2 = ${this.state.error ? round(this.state.error, 3) : '?'}
              `}
                  />
                </div>
              </div>
            </Tab>
            <Tab
              eventKey="backprop"
              title="Backprop"
              style={{ fontSize: '18px', marginLeft: '-40px' }}
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
              \pmatrix{${this.state.h0_out ? round(this.state.h0_out, 3) : '?'} 
              \\ ${this.state.h1_out ? round(this.state.h1_out, 3) : '?'}}
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
                 - .5  * 
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
                 - .5  * 
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
                 - .5  * 
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
                 
                 - .5  * 
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
          style={{ position: 'absolute', top: '800px', left: '-20px' }}
        >
          <div
            className={'row'}
            style={{ marginTop: '-100px', marginLeft: '-120px' }}
          >
            <span style={{ marginLeft: '160px' }}></span>
            {this.render2x2Matrix(this.state.w0, 'layer 1', 'layer 0')}
            {this.render2x1Matrix(this.state.b0, 'layer 1', 'h', 'bias 0', 'b')}
            <span style={{ marginLeft: '50px' }}></span>
            {this.render1x2Matrix(
              this.state.w1,
              'layer 2',
              'o',
              'layer 1',
              'h'
            )}
            {this.render1x1Matrix(this.state.b1, 'layer 2', 'o', 'bias 1', 'b')}
          </div>
        </div>
      </div>
    );
  }
} //End NeuralNet Component

export default NeuralNets;
