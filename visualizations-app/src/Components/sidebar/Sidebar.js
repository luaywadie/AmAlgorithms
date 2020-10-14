import React, { Component } from 'react';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: false,
    };
  }

  toggleSidebar = () => {
    this.setState({ sidebar: !this.state.sidebar });
  };
  render() {
    return (
      <>
        <div
          className={'sidebar'}
          style={{ visibility: this.props.showButton ? 'visible' : 'hidden' }}
        >
          <button
            id={'sidebar-button'}
            className={'menu-bars'}
            onClick={() => this.toggleSidebar()}
          >
            {this.state.sidebar ? 'Hide Variables' : 'Show Variables'}
          </button>
        </div>
        <nav
          className={
            this.state.sidebar && this.props.showButton
              ? 'side-menu active'
              : 'side-menu'
          }
        >
          <ul className={'side-menu-items'}>{this.props.children}</ul>
        </nav>
      </>
    );
  }
}

export default Sidebar;
