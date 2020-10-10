import React from 'react';
import '../styles/MainPage.scss';

const MainPage = (props) => {
  return (
    <div>
      <h1 className="heading">
        Welcome to
        <span style={{color:"#51a6fc"}}> Am</span>
        <span style={{color:"#8787fe"}}>Algorithms</span>
      </h1>
      <div className="background">
        <img src={process.env.PUBLIC_URL + '/assets/imgs/home_page_background1.png'} />
        <img src={process.env.PUBLIC_URL + '/assets/imgs/home_page_background2.png'} />
        <img src={process.env.PUBLIC_URL + '/assets/imgs/home_page_background3.png'} />
      </div>
    </div>
  );
};

export default MainPage;
