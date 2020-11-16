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
    };
  }
  animationQueue = [];
  componentDidMount() {
    buildNetwork();
    this.neuralNetwork = document.getElementById('graph-container');
  }
  componentWillUnmount() {}

  componentDidUpdate(prevProps) {}

  async checkPauseStatus() {
    while (this.props.pause) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
  }
  linkNames = {
    h0: ['i0-h0', 'i1-h0'],
    h1: ['i0-h1', 'i1-h1'],
    o0: ['h0-o0', 'h1-o0'],
  };

  async activateNode(node) {
    let el = document.getElementById(node + '-node');
    if (el) {
      el.classList.add('active-node-nn');
    }
  }
  deActivateNode(node) {
    let el = document.getElementById(node + '-node');
    if (el) {
      el.classList.remove('active-node-nn');
    }
  }
  async activateLinks(links) {
    for (let link of links) {
      let el = document.getElementById(link);
      if (el) {
        el.classList.add('active-link-nn');
      }
    }
  }
  deActivateLink(links) {
    for (let link of links) {
      let el = document.getElementById(link);
      if (el) {
        el.classList.remove('active-link-nn');
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

  updateBias() {
    let h0 = document.getElementById('h0-bias');
    if (h0) {
      h0.innerHTML = 'b = ' + round(this.state.b0[0], 3);
    }
    let h1 = document.getElementById('h1-bias');
    if (h1) {
      h1.innerHTML = 'b = ' + round(this.state.b0[1], 3);
    }
    let b1 = document.getElementById('o0-bias');
    if (b1) {
      b1.innerHTML = 'b = ' + round(this.state.b1, 3);
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
    let n_iterations = 1000;
    let x = [1, 0];

    const sigmoid = (x) => 1 / (1 + exp(-x));
    // const relu = (x) => max(x, 0);
    const errorFunction = (pred, actual) => (1 / 2) * (actual - pred) ** 2;
    const dZ = (x) => x * (1 - x); // sigmoid derivative
    // const dZ = (x) => Number(x > 0); // relu derivative

    for (let i = 1; i < n_iterations; i++) {
      console.log(`Iteration: ${i}`);

      this.setState({
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
      let h_out = h_net.map((e) => sigmoid(e));
      // let h_out = h_net.map((e) => relu(e));

      // First, highlight links and active node
      this.activateNode('h0');
      this.activateLinks(this.linkNames['h0']);
      this.activateNodeMatricies(['w0-00', 'w0-01', 'b0-0']);
      this.highlightEquation('h0-net-eq');
      // highlight matrix w0, row 0 && matrix b0 row 0
      await new Promise((r) => setTimeout(r, 1500));

      // compute sum
      this.setState({ h0_net: h_net[0] });
      document.getElementById('h0-net').innerHTML =
        'net = ' + round(h_net[0], 3);
      await new Promise((r) => setTimeout(r, 300));
      this.deHighlightEquation('h0-net-eq');
      // compute sigma of sum
      this.highlightEquation('h0-out-eq');
      await new Promise((r) => setTimeout(r, 1500));

      this.setState({ h0_out: h_out[0] });
      document.getElementById('h0-out').innerHTML =
        'out = ' + round(h_out[0], 3);
      await new Promise((r) => setTimeout(r, 1500));

      this.deHighlightEquation('h0-out-eq');

      // Remove active links and nodes
      this.deActivateNode('h0');
      this.deActivateLink(this.linkNames['h0']);
      this.deActivateNodeMatricies(['w0-00', 'w0-01', 'b0-0']);
      // un-highlight matrix w0, row 0 && matrix b0 row 0

      // activate h1 node and its links

      this.activateNode('h1');
      this.activateLinks(this.linkNames['h1']);
      this.activateNodeMatricies(['w0-10', 'w0-11', 'b0-1']);
      // highlight matrix w0, row 1 && matrix b0 row 1
      this.highlightEquation('h1-net-eq');
      await new Promise((r) => setTimeout(r, 1500));

      // compute sum
      this.setState({ h1_net: h_net[1] });
      document.getElementById('h1-net').innerHTML =
        'net = ' + round(h_net[1], 3);

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('h1-net-eq');

      this.highlightEquation('h1-out-eq');
      await new Promise((r) => setTimeout(r, 1500));

      // compute sigma of sum
      await this.setState({ h1_out: h_out[1] });
      document.getElementById('h1-out').innerHTML =
        'out = ' + round(h_out[1], 3);
      await new Promise((r) => setTimeout(r, 1500));

      this.deHighlightEquation('h1-out-eq');

      // Remove active links and nodes
      this.deActivateNode('h1');
      this.deActivateLink(this.linkNames['h1']);
      this.deActivateNodeMatricies(['w0-10', 'w0-11', 'b0-1']);
      // un-highlight matrix w0, row 1 && matrix b0 row 1

      // activate o0 node and its links
      this.activateNode('o0');
      this.activateLinks(this.linkNames['o0']);
      this.activateNodeMatricies(['w1-0', 'w1-1', 'b1-0']);
      // highlight matrix w1, row 0 b1

      let out_net = add(multiply(h_out, transpose(w1)), b1);
      this.highlightEquation('out-net-eq');
      await new Promise((r) => setTimeout(r, 1500));

      this.setState({ o0_net: out_net });
      document.getElementById('o0-net').innerHTML =
        'net = ' + round(out_net, 3);

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('out-net-eq');

      let out_out = sigmoid(out_net);

      this.highlightEquation('out-out-eq');
      await new Promise((r) => setTimeout(r, 1500));

      this.setState({ o0_out: out_out });

      document.getElementById('o0-output').innerHTML =
        'output = ' + round(out_out, 3);
      document.getElementById('o0-out').innerHTML =
        'out = ' + round(out_out, 3);
      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('out-out-eq');
      // let out_out = relu(out_net);

      // Remove active links and nodes
      this.deActivateNode('o0');
      this.deActivateLink(this.linkNames['o0']);
      this.deActivateNodeMatricies(['w1-0', 'w1-1', 'b1-0']);
      // un-highlight matrix w1, row 0 b1
      this.highlightEquation('error-eq');
      await new Promise((r) => setTimeout(r, 1500));

      let error = errorFunction(out_out, actual);
      this.setState({ error: round(error, 3) });
      document.getElementById('o0-error').innerHTML =
        'error = ' + round(error, 3);
      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('error-eq');

      await new Promise((r) => setTimeout(r, 1000));

      // Backprop
      await this.setState({ activeKey: 'backprop' });
      this.activateNode('o0');
      this.highlightEquation('dE-eq');
      await new Promise((r) => setTimeout(r, 1500));

      let dE = -(actual - out_out);
      await this.setState({ dE: dE });
      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('dE-eq');

      this.highlightEquation('dZ-out-eq');
      await new Promise((r) => setTimeout(r, 1500));

      let dZ_out = dZ(out_out); // d_out_out_wrt_d_out_net
      await this.setState({ dZ_out: dZ_out });

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('dZ-out-eq');
      this.deActivateNode('o0');

      this.highlightEquation('dOut-wrt-w1-eq');
      await new Promise((r) => setTimeout(r, 1500));

      let dOut_wrt_w1 = h_out;

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('dOut-wrt-w1-eq');
      this.deActivateNode('o0');

      this.highlightEquation('dW1-eq');
      this.activateLinks(this.linkNames['o0']);

      await new Promise((r) => setTimeout(r, 1500));

      let dw1 = multiply(dE, multiply(dZ_out, dOut_wrt_w1));
      await this.setState({ dW1: dw1 });

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('dW1-eq');
      this.deActivateLink(this.linkNames['o0']);

      this.highlightEquation('dB1-eq');
      await new Promise((r) => setTimeout(r, 1500));

      let db1 = multiply(dE, dZ(out_out));
      this.setState({ dB1: db1 });

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('dB1-eq');

      this.highlightEquation('dOut-wrt-h-eq');
      await new Promise((r) => setTimeout(r, 1500));

      let dOut_wrt_h = w1;

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('dOut-wrt-h-eq');

      this.highlightEquation('dZ-h-eq');
      await new Promise((r) => setTimeout(r, 1500));

      let dZ_h = h_out.map((e) => dZ(e)); // d_h_out_wrt_d_h_net
      await this.setState({ dZ_h: dZ_h });

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('dZ-h-eq');

      this.highlightEquation('dH-wrt-w-eq');
      await new Promise((r) => setTimeout(r, 1500));

      let dh_wrt_w0 = x;

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('dH-wrt-w-eq');

      this.highlightEquation('dW0-eq');
      await new Promise((r) => setTimeout(r, 1500));

      let dw0 = multiply(
        dotMultiply(dE, dZ(out_out)),
        dotMultiply(dOut_wrt_h, dotMultiply(dZ_h, dh_wrt_w0))
      );

      await this.setState({ dW0: dw0 });

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('dW0-eq');

      this.highlightEquation('dB0-eq');
      await new Promise((r) => setTimeout(r, 1500));

      let db0 = dotMultiply(dE * dZ(out_out), dotMultiply(dOut_wrt_h, dZ_h));
      this.setState({ dB0: db0 });

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('dB0-eq');

      // UPDATES
      await this.setState({ activeKey: 'update' });

      this.highlightEquation('w0-update-eq');
      await new Promise((r) => setTimeout(r, 1500));

      w0 = subtract(w0, [dotMultiply(alpha, dw0), dotMultiply(alpha, dw0)]);
      await this.setState({ newW0: w0, w0: w0 });

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('w0-update-eq');

      this.highlightEquation('b0-update-eq');
      await new Promise((r) => setTimeout(r, 1500));

      b0 = subtract(b0, dotMultiply(alpha, db0));

      await this.setState({ newB0: b0, b0: b0 });

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('b0-update-eq');

      this.highlightEquation('w1-update-eq');
      await new Promise((r) => setTimeout(r, 1500));

      w1 = subtract(w1, dotMultiply(alpha, dw1));
      await this.setState({ newW1: w1, w1: w1 });

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('w1-update-eq');

      this.highlightEquation('b1-update-eq');
      await new Promise((r) => setTimeout(r, 1500));

      b1 = subtract(b1, dotMultiply(alpha, db1));
      await this.setState({ newB1: b1, b1: b1 });

      await new Promise((r) => setTimeout(r, 1500));
      this.deHighlightEquation('b1-update-eq');

      this.updateBias();

      await this.setState({
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
            <td id={'b1-0'} className={'left-and-right'}>
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
            <h1 style={{ marginLeft: '15px' }}>
              {' '}
              Iteration: {this.state.iteration}
            </h1>
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
                <div id={'h0-net-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw`h_0 net = w_{00}^0 * x_0 + w_{01}^0 * x_1 + b_0^0 = ${round(
                      this.state.w0[0][0],
                      3
                    )} *${this.state.x[0]} + ${round(
                      this.state.w0[0][1],
                      3
                    )} * ${this.state.x[1]} + ${round(this.state.b0[0], 3)} = 
              ${this.state.h0_net ? round(this.state.h0_net, 3) : '?'}
              
              `}
                  />{' '}
                </div>
              </div>
              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'h0-out-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw`h_0 out = \sigma (h_0 net) =  
              ${this.state.h0_out ? round(this.state.h0_out, 3) : '?'}
              `}
                  />
                </div>
              </div>
              <div className={'row'}>
                <div id={'h1-net-eq'}>
                  <MathComponent
                    display={true}
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
                <div id={'h1-out-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw`h_1 out = \sigma (h_1 net) =  
              ${this.state.h1_out ? round(this.state.h1_out, 3) : '?'}
              `}
                  />
                </div>
              </div>

              <div className={'row'}>
                <div id={'out-net-eq'}>
                  <MathComponent
                    display={true}
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
                <div id={'out-out-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw`o_0 out = \sigma (o_0 net) =  
              ${this.state.o0_out ? round(this.state.o0_out, 3) : '?'}
              `}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'error-eq'}>
                  <MathComponent
                    display={true}
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
              style={{ fontSize: '16px', marginLeft: '-30px' }}
            >
              <div className={'row'} style={{ marginTop: '10px' }}>
                <h1>BACKPROP Matrix Math</h1> <br></br>
              </div>

              <div className={'row'}>
                <div id={'dE-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` \frac{\partial E}{ \partial output} = - (target - output) = 
              - (1 - ${
                this.state.o0_out ? round(this.state.o0_out, 3) : '?'
              }) = 
              ${this.state.dE ? round(this.state.dE, 3) : '?'}`}
                  />
                </div>
              </div>
              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dZ-out-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` \frac{\partial output}{ \partial o_0 net} = output * (1 - output) = 
              ${this.state.o0_out ? round(this.state.o0_out, 3) : '?'} * (1 - ${
                      this.state.o0_out ? round(this.state.o0_out, 3) : '?'
                    }) = 
              ${this.state.dZ_out ? round(this.state.dZ_out, 3) : '?'}`}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dOut-wrt-w1-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` \frac{\partial o_0 net}{ \partial w1} = \pmatrix{h_0 out \\ h_1 out} = 
              \pmatrix{${
                this.state.h0_out ? round(this.state.h0_out, 3) : '?'
              } \\ ${this.state.h1_out ? round(this.state.h1_out, 3) : '?'}}
               `}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dW1-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` \frac{\partial E}{ \partial w1} = \frac{\partial E}{ \partial output} * \frac{\partial output}{ \partial o_0 net} * \frac{\partial o_0 net}{ \partial w1} 
              = ${this.state.dE ? round(this.state.dE, 3) : '?'} *  ${
                      this.state.dZ_out ? round(this.state.dZ_out, 3) : '?'
                    } *   \pmatrix{${
                      this.state.h0_out ? round(this.state.h0_out, 3) : '?'
                    } \\ ${
                      this.state.h1_out ? round(this.state.h1_out, 3) : '?'
                    }}
               = 
               \pmatrix{
                ${this.state.dW1 ? round(this.state.dW1[0], 3) : '?'}
                 \\
                 ${this.state.dW1 ? round(this.state.dW1[1], 3) : '?'}}
  
               `}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dB1-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` \frac{\partial Error}{ \partial b_1} = 
              \frac{\partial E}{ \partial output} * \frac{\partial output}{ \partial b_1}  
              = ${this.state.dE ? round(this.state.dE, 3) : '?'} *  ${
                      this.state.dZ_out ? round(this.state.dZ_out, 3) : '?'
                    }
               = ${this.state.dB1 ? round(this.state.dB1, 3) : '?'}
               `}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dOut-wrt-h-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` \frac{\partial o_0 net}{ \partial h out} = W1 = \pmatrix{${
                      this.state.w1[0] ? round(this.state.w1[0], 3) : '?'
                    } \\ ${
                      this.state.w1[1] ? round(this.state.w1[1], 3) : '?'
                    }}`}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dZ-h-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` \frac{\partial h out}{ \partial h_{net}} = h_{out} * (1 - h_{out}) = 
              \pmatrix{${
                this.state.h0_out ? round(this.state.h0_out, 3) : '?'
              } \\ ${this.state.h1_out ? round(this.state.h1_out, 3) : '?'}}
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

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dH-wrt-w-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` \frac{\partial h_{net}}{ \partial w0} = X = 
              \pmatrix{${
                this.state.x[0] ? round(this.state.x[0], 3) : '?'
              } \\ ${
                      this.state.x[1] !== null ? round(this.state.x[1], 3) : '?'
                    }}
               `}
                  />
                </div>
              </div>

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'dW0-eq'}>
                  <MathComponent
                    display={true}
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
                <div id={'dB0-eq'}>
                  <MathComponent
                    display={true}
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

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'w0-update-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` w0 = w0 - alpha * \frac{\partial E}{ \partial w0} = 
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
              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'b0-update-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` b0 = b0 - alpha * \frac{\partial E}{ \partial b0} = 
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

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'w1-update-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` w1 = w1 - alpha * \frac{\partial E}{ \partial w1} = 
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

              <div className={'row'} style={{ marginTop: '-20px' }}>
                <div id={'b1-update-eq'}>
                  <MathComponent
                    display={true}
                    tex={String.raw` b1 = b1 - alpha * \frac{\partial E}{ \partial b1} = 
              
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
          style={{ position: 'absolute', top: '800px', left: '-10px' }}
        >
          <div
            className={'row'}
            style={{ marginTop: '-120px', marginLeft: '-120px' }}
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

// render2x3Matrix(a) {
//   return (
//     <table className={'nn-matrix'}>
//       <tbody>
//         <tr>
//           <td></td>
//           <td></td>
//           <td></td>
//           <td>
//             <i>layer 1</i>
//           </td>
//         </tr>
//         <tr>
//           <td></td>
//           <td></td>
//           <td>
//             <i>h0</i>
//           </td>
//           <td>
//             <i>h1</i>
//           </td>
//           <td>
//             <i>h2</i>
//           </td>
//         </tr>
//         <tr>
//           <td style={{ padding: 0 }} rowSpan="2">
//             <i>layer 2</i>
//           </td>
//           <td>
//             <i>o</i>0
//           </td>
//           <td id={'matrix2-00'} className={'left'}>
//             {a[0][0]}
//           </td>
//           <td id={'matrix2-01'}>{a[0][1]}</td>
//           <td id={'matrix2-02'} className={'right'}>
//             {a[0][2]}
//           </td>
//         </tr>

//         <tr>
//           <td>
//             <i>o</i>1
//           </td>
//           <td id={'matrix2-10'} className={'left'}>
//             {a[1][0]}
//           </td>
//           <td id={'matrix2-11'}>{a[1][1]}</td>
//           <td id={'matrix2-12'} className={'right'}>
//             {a[1][2]}
//           </td>
//         </tr>
//       </tbody>
//     </table>
//   );
// }

// render3x3Matrix(a, yLabel, xLabel) {
//   return (
//     <table className={'nn-matrix'}>
//       <tbody>
//         <tr>
//           <td></td>
//           <td></td>
//           <td></td>
//           <td>
//             <i>{xLabel}</i>
//           </td>
//         </tr>
//         <tr>
//           <td></td>
//           <td></td>
//           <td>
//             <i>i0</i>
//           </td>
//           <td>
//             <i>i1</i>
//           </td>
//           <td>
//             <i>i2</i>
//           </td>
//         </tr>
//         <tr>
//           <td></td>
//           <td>
//             <i>h0</i>
//           </td>
//           <td id={'matrix1-00'} className={'left'}>
//             {a[0][0]}
//           </td>
//           <td id={'matrix1-01'}>{a[0][1]}</td>
//           <td id={'matrix1-02'} className={'right'}>
//             {a[0][2]}
//           </td>
//         </tr>

//         <tr>
//           <td style={{ padding: 0 }}>
//             <i>{yLabel}</i>
//           </td>
//           <td>
//             <i>h1</i>
//           </td>
//           <td id={'matrix1-10'} className={'left'}>
//             {a[1][0]}
//           </td>
//           <td id={'matrix1-11'}>{a[1][1]}</td>
//           <td id={'matrix1-12'} className={'right'}>
//             {a[1][2]}
//           </td>
//         </tr>
//         <tr>
//           <td></td>
//           <td>
//             <i>h2</i>
//           </td>
//           <td id={'matrix1-20'} className={'left'}>
//             {a[2][0]}
//           </td>
//           <td id={'matrix1-21'}>{a[2][1]}</td>
//           <td id={'matrix1-22'} className={'right'}>
//             {a[2][2]}
//           </td>
//         </tr>
//       </tbody>
//     </table>
//   );
// }

// render1x3Matrix(a, yLabel, yNode, xLabel, xNode) {
//   return (
//     <table className={'nn-matrix'}>
//       <tbody>
//         <tr>
//           <td></td>
//           <td></td>
//           <td></td>
//           <td>
//             <i>{xLabel}</i>
//           </td>
//         </tr>
//         <tr>
//           <td></td>
//           <td></td>
//           <td>
//             <i>{xNode}0</i>
//           </td>
//           <td>
//             <i>{xNode}1</i>
//           </td>
//           <td>
//             <i>{xNode}2</i>
//           </td>
//         </tr>
//         <tr>
//           <td style={{ padding: 0 }}>
//             <i>{yLabel}</i>
//           </td>
//           <td>
//             <i>{yNode}0</i>
//           </td>
//           <td id={'bias0-0'} className={'left'}>
//             {a[0]}
//           </td>
//           <td id={'bias0-1'}>{a[1]}</td>
//           <td id={'bias0-2'} className={'right'}>
//             {a[2]}
//           </td>
//         </tr>
//       </tbody>
//     </table>
//   );
// }
