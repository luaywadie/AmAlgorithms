import React, { Component } from 'react';
import {dot, transpose, exp} from 'mathjs';
import buildNetwork from '../graph-builders/neural-net-builder';


class NeuralNets extends Component {
    constructor(props) {
      super(props);
      this.state = {
        pause: false,
        stop: false,
        speed: 1
      };
    }
    componentDidMount(){
      buildNetwork();
      this.neuralNetwork = document.getElementById('graph-container')
    }
    componentWillUnmount() {

    }
  
    componentDidUpdate(prevProps) {}
  
    async checkPauseStatus() {
      while (this.props.pause) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
    }

    nNLearn(){
      let actual = 1
      let alpha = .5
      let n_iterations = 1
      let x = [1,0]
      let w1 = [
        [ 3, 4],
        [ 6, 5]
      ]
      let b1 = [1, -6]
    
      let w2 = [2, 4]
      
      let b2 = [-3.93]
    
      const sigmoid = (x) =>  1/ (1 + exp(-x))
      const error = (pred, actual) => (1/2) * ((actual - pred) ** 2)
      const dZ =  (x) => (x * (1-x))
      
      for(let i = 0; i < n_iterations ; i++){
        console.log(`Iteration: ${i+1}`)
  
        // Forward
        let h1_net = dot(x, transpose(w1)) + b1
        let h1_out = sigmoid(h1_net)

        let out_net = dot(h1_out, transpose(w2)) + b2
        let out_out = sigmoid(out_net)
        console.log(`Output: ${out_out}`)
        console.log(`error: ${error(out_out, actual)}`)

        // Backprop
        let dE = -(actual - out_out)
        let dOut_wrt_W2 = h1_out

        let dW2 = dE * dZ(out_out) * dOut_wrt_W2
        let dB2 = dE * dZ(out_out)
    
        let dOut_wrt_h1 = w2
        let dH1_wrt_W1 = x
    
        let dW1 = dE * dZ(out_out) * dOut_wrt_h1 * dZ(h1_out) * dH1_wrt_W1
        let dB1 = dE * dZ(out_out) * dOut_wrt_h1 * dZ(h1_out)

            
        console.log(`dW1: ${dW1}\n
                     dB1: ${dB1}\n
                     dW2: ${dW2}\n
                     dB2: ${dB2}`)

        w1 = w1 - alpha * dW1
        b1 = b1 - alpha * dB1
        w2 = w2 - alpha * dW2
        b2 = b2 - alpha * dB2

        console.log(
        `Updated w1:${w1}
        Updated B1: ${b1}\n
        Updated w2: ${w2}\n
        Updated B2: ${b2}\n`
        )
      }
    }
    
      
        render() {
            return (
                <div className={'row'}>
                  <div className={'col-4'} id={'graph-container'}>
                  </div>
                  <div className={'col-4'} >
                    pseduocode
                  </div>
                  <div className={'col-4'} >
                    sidebar
                  </div>
                </div>
            

            );
        }
    


  
}//End NeuralNet Component

export default NeuralNets;
