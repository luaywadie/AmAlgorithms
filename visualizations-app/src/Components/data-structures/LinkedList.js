import React, { Component } from 'react';
import * as d3 from 'd3';

class LinkedList extends Component {
  constructor(props) {
  super(props);
    this.state = {
      head: null,
      inputNum: ''
    };
}

  render() {
    return(
      <div className={'row'}>
        <div className={'col-4'} id={'graph-container'}>
          <form
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <label>Add a node:</label>
              <input
              style={{ width: '50px' }}
              type="text"
              value={this.state.inputNum}
              onChange={async (event) => {
                await this.setState({
                  inputNum: Number(event.target.value),
                });
              }}
            />
            
              <button
                className="graph-button"
                disabled={this.state.data.includes(Number(this.state.inputNum)) ||
                  this.state.data.length === 7}
                type="submit"
                onClick={async () => 
                  {}
                }
              >
                Insert
              </button>
              <button
                className="graph-button"
                disabled={this.state.data.length === 0}
                type="submit"
                onClick={() => 
                    {}
                }
              >
                Remove
              </button>
              <button
                className="graph-button"
                type="submit"
                onClick={() => {
                  
                    }
                }
              >
                Clear
              </button>
              <div id="queue-container"></div>
          </form>
        </div>
        <div className={'col-4'} id={'graph-container'}>
          <div className={'row'}>

          </div>
        </div>
      </div>
    )
  }

}

export default LinkedList