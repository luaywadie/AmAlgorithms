import React, { Component } from 'react';
import '../../styles/segment/InfoSegment.scss';
import { useHistory } from 'react-router-dom';
// Libraries
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import {
  FaArrowLeft,
  FaArrowRight,
  FaExclamation,
  FaExternalLinkAlt,
} from 'react-icons/fa';

class InfoSegment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      segment_id: this.props.segment_id,
      slides: this.props.segment_data[1],
      current_id: 0,
      quiz_correct: 'light',
    };
  }

  componentDidMount = () => {
    console.log(this.props.segment_data);
  };

  componentDidUpdate = () => {
    let el = document.getElementById('segment' + this.props.segment_id);
    if (this.props.scroll_position > el.offsetTop - 400) {
      el.style.opacity = 1;
    } else if (this.props.scroll_position > el.offsetTop - 600) {
      el.style.opacity = 0.5;
    } else {
      el.style.opacity = 0;
    }
  };

  checkAnswer = (className) => {
    let parsedName = className.split('|');
    let obj = document.getElementsByClassName(className)[0];
    if (parsedName[0] == 'quiz_correct-' + this.state.segment_id) {
      obj.style.backgroundColor = '#6bfb6b';
    } else {
      obj.style.backgroundColor = '#fb4f4f';
    }
  };

  resetAnswers = () => {
    let els = document.getElementsByClassName('quiz_options');
    for (let el of els) {
      el.style.backgroundColor = '';
    }
  };

  renderSection(even) {
    return even ? (
      <>
        {this.renderGif()}
        {this.renderInfoOrQuiz()}
      </>
    ) : (
      <>
        {this.renderInfoOrQuiz()}
        {this.renderGif()}
      </>
    );
  }

  renderInfoOrQuiz() {
    let quiz = this.state.slides[this.state.current_id]['type'] === 'quiz';
    return <>{quiz ? this.renderQuiz() : this.renderInfo()}</>;
  }

  renderSegmentNavButtons() {
    return (
      <div className="segment-nav">
        <button
          className="graph-button btn-left"
          onClick={() => {
            if (this.state.current_id > 0) {
              this.resetAnswers();
              this.setState({ current_id: this.state.current_id - 1 });
            }
          }}
        >
          <FaArrowLeft></FaArrowLeft>
        </button>

        <div className="nav-icons">
          {this.state.slides.map((value, index) => (
            <i
              key={index}
              className={
                'circle-icon ' +
                (this.state.current_id == index ? 'active' : '')
              }
            ></i>
          ))}
        </div>

        <button
          className="graph-button btn-right"
          onClick={() => {
            if (this.state.current_id < this.state.slides.length - 1) {
              this.resetAnswers();
              this.setState({ current_id: this.state.current_id + 1 });
            }
          }}
        >
          <FaArrowRight></FaArrowRight>
        </button>
      </div>
    );
  }
  renderInfo() {
    return (
      <Col>
        <div className="segment-text text-center">
          <h1>{this.state.slides[this.state.current_id]['title']}</h1>
          <h4
            className="text-left"
            dangerouslySetInnerHTML={{
              __html: this.state.slides[this.state.current_id]['text'],
            }}
          ></h4>
        </div>
        {this.renderSegmentNavButtons()}
      </Col>
    );
  }

  renderGif() {
    return (
      <Col>
        <div className="segment-gif">
          {this.state.slides[this.state.current_id]['redirect_link'] !=
            null && (
            <a
              href={
                process.env.PUBLIC_URL +
                '/#/' +
                this.state.slides[this.state.current_id]['redirect_link']
              }
              target="_blank"
            >
              <i className="gif-icon">
                <FaExternalLinkAlt></FaExternalLinkAlt>
              </i>
            </a>
          )}
          {this.state.slides[this.state.current_id]['credit_link'] != null && (
            <a
              href={this.state.slides[this.state.current_id]['credit_link']}
              target="_blank"
            >
              <i className="gif-credit-link">Credit Link</i>
            </a>
          )}
          <img
            width="500px"
            height="500px"
            src={
              process.env.PUBLIC_URL +
              this.state.slides[this.state.current_id]['image_link']
            }
          />
        </div>
      </Col>
    );
  }

  generateQuizAnswerClasses(value, index) {
    let className = 'quiz_options ';
    if (this.state.slides[this.state.current_id]['answer'] == value) {
      className += 'quiz_correct-' + this.state.segment_id + '|' + index;
    } else {
      className += 'quiz_incorrect-' + this.state.segment_id + '|' + index;
    }
    return className;
  }
  renderQuiz() {
    return (
      <Col>
        <div className="segment-text text-center">
          <h1>{this.state.slides[this.state.current_id]['title']}</h1>
          <h4
            dangerouslySetInnerHTML={{
              __html: this.state.slides[this.state.current_id]['text'],
            }}
          ></h4>
          <div>
            {this.state.slides[this.state.current_id]['options'].map(
              (value, index) => (
                <button
                  key={index}
                  className={this.generateQuizAnswerClasses(value, index)}
                  onClick={(e) => this.checkAnswer(e.target.classList[1])}
                >
                  {value}
                </button>
              )
            )}
          </div>
        </div>
        {this.renderSegmentNavButtons()}
      </Col>
    );
  }

  even(n) {
    return n % 2 === 0;
  }

  render() {
    return (
      <Row id={'segment' + this.props.segment_id} className="segment">
        {this.renderSection(this.even(this.props.segment_id))}
      </Row>
    );
  }
}

export default InfoSegment;
