import React, { Component } from "react";
import "./styles/App.scss";
import NavigationBar from "./Components/NavigationBar";
import "./styles/Node.scss";
import "./styles/Link.scss";
import "./styles/Graph.scss";
import "./styles/OutputTable.scss";
import "./styles/Clusters.scss";
import "./styles/Pseudocode.scss";
import "./styles/Sidebar.scss";
import "./styles/NeuralNets.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
 
  }

  render() {
    return (
      <div>
        <div className={"container-fluid"} style={{ height: 1000 + "px" }}>
          <NavigationBar />
        </div>
      </div>
    );
  }
}

export default App;
