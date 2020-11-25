import React, { Component } from 'react';
import '../styles/MainPage.scss';

// Components
import { InfoSegment } from './MainPage/InfoSegment';

// Libraries
import { FaSortDown } from 'react-icons/fa';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scroll_position: 0,
      waves_opacity: 1,
      title_set_1 : "",
      title_set_2 : "",
      title_set_3 : "",
      background_left_opacity: 0,
      background_right_opacity: 0
    };
  }

  componentDidMount() {
    // Set a listener to track window position
    window.addEventListener("scroll", this.updateScroll)
    // Start the title typing effect
    setTimeout(() => {
      this.startTypingTitle()
    },500)
  }
  
  componentWillUnmount() {
    // this.endInterval(); 
  }

  startTypingTitle = () => {
    let title_queue = ["Welcome To","Am","Algorithms"]
    let i = 0;
    let j = 0;
    let interval = setInterval(() => {
      if (j >= title_queue[i].length) { 
        if (i < title_queue.length - 1) {
          i += 1;
          j = 0;
        } else {
          clearInterval(interval)
        }
      } else {
        switch (i) {
          case 0:
            this.setState({title_set_1: this.state.title_set_1 + title_queue[i][j]})
            break;
          case 1:
            this.setState({title_set_2: this.state.title_set_2 + title_queue[i][j]})
            break;
          case 2:
            this.setState({title_set_3: this.state.title_set_3 + title_queue[i][j]})
            break
        }
        j += 1;
      }
    },100)
  }

  updateScroll = (e) => {
    // Calculate scroll offset
    let windowYScroll = window.pageYOffset
    this.setState({scroll_position: windowYScroll})
    
    // Calculate opacity offset
    if (windowYScroll <= 500) {
      let newOp = windowYScroll / 100
      if (newOp <= 0) {
        this.setState({waves_opacity: 1})
      } else {
        this.setState({waves_opacity: (1 - (newOp * 0.2))})
      }
    }
  }

  render() {
    return (
      <div>        
        <div className="arrow_icon_field" style={{opacity: this.state.waves_opacity}}>
          <FaSortDown></FaSortDown>
          <FaSortDown></FaSortDown>
          <FaSortDown></FaSortDown>
        </div>
        
        <div className="background">
          <img style={{ 
              left: "-" + (this.state.scroll_position * 5) + "px",
              opacity: this.state.waves_opacity
            }} 
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background1.png'
            }
            alt={'bg1'}
          />
          <img style={{ 
            left: (this.state.scroll_position * 6) + "px",
            opacity: this.state.waves_opacity 
          }}
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background2.png'
            }
            alt={'bg2'}
          />
          <img style={{ 
            left: "-" + (this.state.scroll_position * 6) + "px",
            opacity: this.state.waves_opacity 
          }} 
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background3.png'
            }
            alt={'bg3'}
          />
        </div>

        <div className="background background-left" style={{
          opacity: 1 - this.state.waves_opacity}}>
          <img
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background1.png'
            }
            alt={'bg1'}
          />
          <img
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background2.png'
            }
            alt={'bg2'}
          />
          <img
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background3.png'
            }
            alt={'bg3'}
          />
        </div>

        <div className="background background-right" style={{
          transform: "rotate(-90deg)",
          opacity: 1 - this.state.waves_opacity}}>
          <img 
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background1.png'
            }
            alt={'bg1'}
          />
          <img 
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background2.png'
            }
            alt={'bg2'}
          />
          <img 
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background3.png'
            }
            alt={'bg3'}
          />
        </div>
      </div>
    );
  };
}
export default MainPage;
