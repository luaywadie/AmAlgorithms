import React, { Component } from 'react';
import '../../styles/segment/InfoSegment.scss';
import { useHistory } from 'react-router-dom';
// Libraries
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight, FaExclamation} from 'react-icons/fa';

class InfoSegment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            slides: this.props.segment_data[1],
            current_id : 0,
            quiz_correct : "light"
        };
    }

    componentDidMount = () => {

    }

    componentDidUpdate = () => {
        let el = document.getElementById("segment" + this.props.segment_id)
        if (this.props.scroll_position > (el.offsetTop - 400)) {
            el.style.opacity = 1
        } else if (this.props.scroll_position > (el.offsetTop - 600)) {
            el.style.opacity = .5
        } else {
            el.style.opacity = 0
        }
    }

    checkAnswer = (value) => {
        if (this.state.slides[this.state.current_id]['answer'] == value) {
            console.log("Correct")
        } else {
            console.log("Incorrect...")  
        } 
    }

    render() {
        return (
            <Row id={"segment" + this.props.segment_id} className="segment">
                {this.props.segment_id % 2 == 0 &&
                <Col>
                    <div className="segment-gif">
                        <a href={process.env.PUBLIC_URL + "#/undirected_graph_algorithms"} target="_blank">
                            <i className="gif-icon"><FaExclamation></FaExclamation></i>
                        </a>
                        <img src= {process.env.PUBLIC_URL + "/assets/gif/segment-1.gif"}/>
                    </div>
                </Col>                
                }
                {
                    this.state.slides[this.state.current_id]['type'] == 'info' &&
                    <Col>
                        <div className="segment-text text-center">
                            <h1>{this.state.slides[this.state.current_id]['title']}</h1>
                            <h4 dangerouslySetInnerHTML={{__html: this.state.slides[this.state.current_id]['text']}}></h4>
                        </div>
                        <div className="segment-nav">
                            <button
                                className="graph-button btn-left"
                                onClick={() => {
                                    if (this.state.current_id > 0) {
                                        this.setState({ current_id: this.state.current_id - 1 })
                                    }
                                }}
                            >
                                <FaArrowLeft></FaArrowLeft>
                            </button>

                            <div className="nav-icons">
                                {
                                    this.state.slides.map((value, index) => 
                                        <i className={'circle-icon ' + (this.state.current_id == index ? 'active' : "")}></i>
                                    )
                                }
                            </div>

                            <button
                                className="graph-button btn-right"
                                onClick={() => {
                                    if (this.state.current_id < this.state.slides.length - 1) {
                                        this.setState({ current_id: this.state.current_id + 1 });
                                    }
                                }}
                            >
                                <FaArrowRight></FaArrowRight>
                            </button>
                        </div>
                    </Col>
                }
                {
                    this.state.slides[this.state.current_id]['type'] == 'quiz' &&
                    <Col>
                        <div className="segment-text text-center">
                            <h1>{this.state.slides[this.state.current_id]['title']}</h1>
                            <h4 dangerouslySetInnerHTML={{__html: this.state.slides[this.state.current_id]['text']}}></h4>
                            <ListGroup>
                            {
                                this.state.slides[this.state.current_id]['options'].map((value, index) => 
                                    <ListGroup.Item
                                    key={index}
                                    action
                                    onClick={() => this.checkAnswer(value)}
                                    variant={this.state.quiz_correct}
                                    >
                                        {value}
                                    </ListGroup.Item>
                                )
                            }
                            </ListGroup>
                        </div>
                        <div className="segment-nav">
                            <button
                                className="graph-button btn-left"
                                onClick={() => {
                                    if (this.state.current_id > 0) {
                                        this.setState({ current_id: this.state.current_id - 1 })
                                    }
                                }}
                            >
                                <FaArrowLeft></FaArrowLeft>
                            </button>

                            <div className="nav-icons">
                                {
                                    this.state.slides.map((value, index) => 
                                        <i key={index} className={'circle-icon ' + (this.state.current_id == index ? 'active' : "")}></i>
                                    )
                                }
                            </div>

                            <button
                                className="graph-button btn-right"
                                onClick={() => {
                                    if (this.state.current_id < this.state.slides.length - 1) {
                                        this.setState({ current_id: this.state.current_id + 1 });
                                    }
                                }}
                            >
                                <FaArrowRight></FaArrowRight>
                            </button>
                        </div>
                    </Col>
                }
                {this.props.segment_id % 2 != 0 &&
                <Col>
                    <div className="segment-gif">
                        <a href="http://localhost:3000/AmAlgorithms#/undirected_graph_algorithms" target="_blank">
                            <i className="gif-icon"><FaExclamation></FaExclamation></i>
                        </a>
                        <img src= {process.env.PUBLIC_URL + "/assets/gif/segment-1.gif"}/>
                    </div>
                </Col>                
                }
            </Row>
        )
    }
}

export default InfoSegment;