import React, { Component } from 'react';
import '../styles/MainPage.scss';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scroll_position: 0
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.updateScroll)
  }
  
  componentWillUnmount() {
    // this.endInterval(); 
  }

  updateScroll= (e) => {
    let windowYScroll = window.pageYOffset
    this.setState({scroll_position: windowYScroll})
  }

  render() {
    return (
      <div>
        <h1 className="heading">
          Welcome to
          <span style={{ color: '#51a6fc' }}> Am</span>
          <span style={{ color: '#8787fe' }}>Algorithm</span>
        </h1>
        <h2>{this.state.scroll_position}</h2>
        <div className="background">
          <img style={{ left: "-" + (this.state.scroll_position * 3) + "px" }} 
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background1.png'
            }
            alt={'bg1'}
          />
          <img style={{ left: (this.state.scroll_position * 3) + "px" }}
            src={
              process.env.PUBLIC_URL + '/assets/imgs/home_page_background2.png'
            }
            alt={'bg2'}
          />
          <img style={{ left: "-" + (this.state.scroll_position * 3) + "px" }} 
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
