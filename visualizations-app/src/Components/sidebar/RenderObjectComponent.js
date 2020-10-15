import React, { Component } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

class RenderObjectComponent extends Component {
  render() {
    return (
      <>
        {this.props.clicked ? (
          <ul style={{ paddingLeft: '0px', listStyle: 'none' }}>
            <FaChevronDown /> {this.props.objName} = {'{'}{' '}
            {Object.keys(this.props.obj).map((e, i) => (
              <li key={i} style={{ marginLeft: '55px' }}>
                {e} :
                {Array.isArray(this.props.obj[e])
                  ? Array.isArray(this.props.obj[e][0])
                    ? '[' +
                      String(this.props.obj[e].map((lst) => '[' + lst + ']')) +
                      ']'
                    : '[' + String(this.props.obj[e]) + ']'
                  : String(this.props.obj[e])}
                ,
              </li>
            ))}{' '}
            <span style={{ marginLeft: '35px' }}>{'}'}</span>
          </ul>
        ) : (
          <>
            <FaChevronRight /> {this.props.objName} ={' '}
            {'{ ' +
              Object.keys(this.props.obj).map(
                (e) =>
                  ' ' +
                  e +
                  ':' +
                  (Array.isArray(this.props.obj[e])
                    ? Array.isArray(this.props.obj[e][0])
                      ? '[' +
                        String(
                          this.props.obj[e].map((lst) => '[' + lst + ']')
                        ) +
                        ']'
                      : '[' + String(this.props.obj[e]) + ']'
                    : String(this.props.obj[e]))
              ) +
              ' }'}
          </>
        )}
      </>
    );
  }
}

export default RenderObjectComponent;
