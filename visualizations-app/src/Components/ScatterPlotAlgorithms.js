import React, { Component } from 'react';
import createScatterplot from '../graph-builders/scatterplot-builder';

class ScatterPlotAlgorithms extends Component {
    constructor(props) {
        super(props);
        this.scatter = document.getElementById("graph-container");
        }
        componentDidMount(){
            createScatterplot();
        }
        componentWillUnmount() {
            let svg = document.getElementById('scatter-svg');
            if (this.scatter.hasChildNodes()) this.scatter.removeChild(svg);
          }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default ScatterPlotAlgorithms;
