import React, { Component } from 'react';
import createScatterplot from '../graph-builders/scatterplot-builder';
import * as d3 from 'd3';
import csvJSON from "../helper-functions/csv-to-json.js";

class ScatterPlotAlgorithms extends Component {
    constructor(props) {
        super(props);
        this.scatter = document.getElementById("graph-container");
        }
        async componentDidMount(){
            //Load in the clustering csv data
            const points = await d3.csv("https://raw.githubusercontent.com/luaywadie/AmAlgorithms/clustering/visualizations-app/src/data/cluster_data.csv");
            console.log(points);
            createScatterplot(points);
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
