import React, { Component } from 'react';
import { dot, transpose, exp } from 'mathjs';
import { MathComponent } from 'mathjax-react';
import buildNetwork from '../graph-builders/neural-net-builder';

class NeuralNets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      stop: false,
      speed: 1,
      w0: [
        [1.11, 2.22, 3.33],
        [4.44, 5.55, 6.66],
        [7.77, 8.88, 9.99],
      ],
      w1: [
        [1.11, 2.22, 3.33],
        [4.44, 5.55, 6.66],
      ],
      b0: [1.11, 2.22, 3.33],
      b1: [1.11, 2.22],
    };
  }
  componentDidMount() {
    buildNetwork();
    this.neuralNetwork = document.getElementById('graph-container');
    let f = document.getElementById('matrix-1');
    console.log(f);
  }
  componentWillUnmount() {}

  componentDidUpdate(prevProps) {}

  async checkPauseStatus() {
    while (this.props.pause) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
  }

  nNLearn() {
    let actual = 1;
    let alpha = 0.5;
    let n_iterations = 1;
    let x = [1, 0];
    let w1 = [
      [3, 4],
      [6, 5],
    ];
    let b1 = [1, -6];

    let w2 = [2, 4];

    let b2 = [-3.93];

    const sigmoid = (x) => 1 / (1 + exp(-x));
    const error = (pred, actual) => (1 / 2) * (actual - pred) ** 2;
    const dZ = (x) => x * (1 - x);

    for (let i = 0; i < n_iterations; i++) {
      console.log(`Iteration: ${i + 1}`);

      // Forward
      let h1_net = dot(x, transpose(w1)) + b1;
      let h1_out = sigmoid(h1_net);

      let out_net = dot(h1_out, transpose(w2)) + b2;
      let out_out = sigmoid(out_net);
      console.log(`Output: ${out_out}`);
      console.log(`error: ${error(out_out, actual)}`);

      // Backprop
      let dE = -(actual - out_out);
      let dOut_wrt_W2 = h1_out;

      let dW2 = dE * dZ(out_out) * dOut_wrt_W2;
      let dB2 = dE * dZ(out_out);

      let dOut_wrt_h1 = w2;
      let dH1_wrt_W1 = x;

      let dW1 = dE * dZ(out_out) * dOut_wrt_h1 * dZ(h1_out) * dH1_wrt_W1;
      let dB1 = dE * dZ(out_out) * dOut_wrt_h1 * dZ(h1_out);

      console.log(`dW1: ${dW1}\n
                     dB1: ${dB1}\n
                     dW2: ${dW2}\n
                     dB2: ${dB2}`);

      w1 = w1 - alpha * dW1;
      b1 = b1 - alpha * dB1;
      w2 = w2 - alpha * dW2;
      b2 = b2 - alpha * dB2;

      console.log(
        `Updated w1:${w1}
        Updated B1: ${b1}\n
        Updated w2: ${w2}\n
        Updated B2: ${b2}\n`
      );
    }
  }

  render2x3Matrix(a) {
    return (
      <table className={'nn-matrix'}>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <i>layer 1</i>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>
              <i>h0</i>
            </td>
            <td>
              <i>h1</i>
            </td>
            <td>
              <i>h2</i>
            </td>
          </tr>
          <tr>
            <td style={{ padding: 0 }} rowSpan="2">
              <i>layer 2</i>
            </td>
            <td>
              <i>o</i>0
            </td>
            <td id={'matrix2-00'} className={'left'}>
              {a[0][0]}
            </td>
            <td id={'matrix2-01'}>{a[0][1]}</td>
            <td id={'matrix2-02'} className={'right'}>
              {a[0][2]}
            </td>
          </tr>

          <tr>
            <td>
              <i>o</i>1
            </td>
            <td id={'matrix2-10'} className={'left'}>
              {a[1][0]}
            </td>
            <td id={'matrix2-11'}>{a[1][1]}</td>
            <td id={'matrix2-12'} className={'right'}>
              {a[1][2]}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render3x3Matrix(a) {
    return (
      <table className={'nn-matrix'}>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <i>layer 0</i>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>
              <i>i0</i>
            </td>
            <td>
              <i>i1</i>
            </td>
            <td>
              <i>i2</i>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <i>h0</i>
            </td>
            <td id={'matrix1-00'} className={'left'}>
              {a[0][0]}
            </td>
            <td id={'matrix1-01'}>{a[0][1]}</td>
            <td id={'matrix1-02'} className={'right'}>
              {a[0][2]}
            </td>
          </tr>

          <tr>
            <td style={{ padding: 0 }}>
              <i>layer 1</i>
            </td>
            <td>
              <i>h1</i>
            </td>
            <td id={'matrix1-10'} className={'left'}>
              {a[1][0]}
            </td>
            <td id={'matrix1-11'}>{a[1][1]}</td>
            <td id={'matrix1-12'} className={'right'}>
              {a[1][2]}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <i>h2</i>
            </td>
            <td id={'matrix1-20'} className={'left'}>
              {a[2][0]}
            </td>
            <td id={'matrix1-21'}>{a[2][1]}</td>
            <td id={'matrix1-22'} className={'right'}>
              {a[2][2]}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render1x3Matrix(a) {
    return (
      <table className={'nn-matrix'}>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <i>layer 1</i>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>
              <i>h0</i>
            </td>
            <td>
              <i>h1</i>
            </td>
            <td>
              <i>h2</i>
            </td>
          </tr>
          <tr>
            <td style={{ padding: 0 }}>
              <i>Bias 0</i>
            </td>
            <td>
              <i>b0</i>
            </td>
            <td id={'bias0-0'} className={'left'}>
              {a[0]}
            </td>
            <td id={'bias0-1'}>{a[1]}</td>
            <td id={'bias0-2'} className={'right'}>
              {a[2]}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render1x2Matrix(a) {
    return (
      <table className={'nn-matrix'}>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td colSpan="2">
              <i>layer 2</i>
            </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>
              <i>o0</i>
            </td>
            <td>
              <i>o1</i>
            </td>
            <td>{/* <i>h2</i> */}</td>
          </tr>
          <tr>
            <td style={{ padding: 0 }}>
              <i>Bias 1</i>
            </td>
            <td>
              <i>b1</i>
            </td>
            <td id={'matrix1-0'} className={'left'}>
              {a[0]}
            </td>
            <td id={'matrix1-1'} className={'right'}>
              {a[1]}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className={'row'}>
        <div className={'col-7'} id={'graph-container'}></div>
        <div className={'col-5'} style={{ zIndex: '-1' }}>
          <div className={'row'}>
            Matrix Math
            <MathComponent
              id={'matrix-1'}
              tex={String.raw`\begin{array}{ccc}
                    & & \textit{layer 0}\\
                    & & \begin{array}{ccc} i0 & \quad i1 \quad & i2 \end{array}\\
                   \textit{layer 1} & \begin{array}{c} h0\\ h1\\ h2\end{array} &
                     \left(\begin{array}{ccc}
                       0.22 & 0.44 & 0.51\\
                       0.11 & 0.37 & 0.78\\
                       0.66 & 0.94 & 0.43
                     \end{array}\right)
                   \end{array}`}
            />
            <br></br>
            <MathComponent
              tex={String.raw`\begin{array}{ccc}
                    & & \textit{layer 1}\\
                    & & \begin{array}{ccc} h0 & \quad h1 \quad & h2 \end{array}\\
                   \textit{layer 2} & \begin{array}{c} o0\\ o1 \end{array} &
                     \left(\begin{array}{cc}
                       0.41 & 0.32 & 0.52\\
                       0.77 & 0.43 & 0.21
                     \end{array}\right)
                   \end{array}`}
            />
          </div>
          <div className={'row'}>{this.render3x3Matrix(this.state.w0)}</div>
          <br></br>
          <div className={'row'}>{this.render2x3Matrix(this.state.w1)}</div>
          <br></br>
          <div className={'row'}>{this.render1x3Matrix(this.state.b0)}</div>
          <br></br>
          <div className={'row'}>{this.render1x2Matrix(this.state.b1)}</div>
        </div>
      </div>
    );
  }
} //End NeuralNet Component

export default NeuralNets;
