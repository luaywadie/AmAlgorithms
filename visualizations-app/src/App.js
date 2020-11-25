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
      title_set_1: "",
      title_set_2: "",
      title_set_3: "",
      title_set_4: "",
      title_set_5: "",
    };
  }

  componentDidMount() {
    // Start the title typing effect
    setTimeout(() => {
      this.startTypingTitle();
    }, 500);
  }

  startTypingTitle = () => {
    let title_queue = [
      "Welcome To",
      "Am",
      "Algorithms",
      'Think',
      ' Algorithmically',
    ];
    let i = 0;
    let j = 0;
    let interval = setInterval(() => {
      if (j >= title_queue[i].length) {
        if (i < title_queue.length - 1) {
          i += 1;
          j = 0;
        } else {
          clearInterval(interval);
        }
      } else {
        switch (i) {
          case 0:
            this.setState({
              title_set_1: this.state.title_set_1 + title_queue[i][j],
            });
            break;
          case 1:
            this.setState({
              title_set_2: this.state.title_set_2 + title_queue[i][j],
            });
            break;
          case 2:
            this.setState({
              title_set_3: this.state.title_set_3 + title_queue[i][j],
            });
            break;
          case 3:
            this.setState({
              title_set_4: this.state.title_set_4 + title_queue[i][j],
            });
            break;
          case 4:
            this.setState({
              title_set_5: this.state.title_set_5 + title_queue[i][j],
            });
            break;
        }
        j += 1;
      }
    }, 100);
  };

  render() {
    return (
      <div className={"container-fluid"}>
        <NavigationBar />
        <h1 className="heading">
          {this.state.title_set_1}
          <span style={{ color: "#51a6fc" }}> {this.state.title_set_2}</span>
          <span style={{ color: "#8787fe" }}>{this.state.title_set_3}</span>
        </h1>
        <h1 className="heading">
          <span style={{ color: "#333" }}> {this.state.title_set_4}</span>
          <span style={{ color: "#8787fe" }}>{this.state.title_set_5}</span>
        </h1>
      </div>
    );
  }
}

export default App;
