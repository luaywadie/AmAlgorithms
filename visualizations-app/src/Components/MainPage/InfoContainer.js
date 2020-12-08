import React, { Component } from 'react';
import '../../styles/MainPage.scss';
// JSON Object for Information Segments
import JSONData from '../../data/info_segments.json';
// Project Components
import InfoSegment from './InfoSegment';
// Libraries
import { Container, Row, Col } from 'react-bootstrap';

class InfoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json_obj: [],
      segments: [1, 2, 3, 4, 5],
      data: JSONData,
      decoded_data: [],
    };
  }

  componentDidMount = () => {
    // Convert each object from the JSON structure into a JavaScript Object
    Object.entries(this.state.data).forEach((data) => {
      this.state.decoded_data.push(data);
    });
  };

  render() {
    return (
      <Container>
        {/* <InfoSegment scroll_position={this.props.scroll_position}></InfoSegment> */}
        {this.state.decoded_data.map((data, index) => (
          <InfoSegment
            key={index}
            segment_id={index}
            segment_data={data}
            scroll_position={this.props.scroll_position}
          ></InfoSegment>
        ))}
        <br></br>
      </Container>
    );
  }
}

export default InfoContainer;
