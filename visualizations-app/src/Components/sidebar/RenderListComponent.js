import React, {Component} from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

class RenderListComponent extends Component {
  render() {
    return (
      <>
      { this.props.clicked ? 
        <ul style={{paddingLeft: '0px', listStyle:'none'}}>
          <FaChevronDown /> {this.props.listName} =  [ {  this.props.list.map( (e, i) => <li key={i} style={{marginLeft: '55px'}}>{e}, </li>)} <span style={{marginLeft:'35px'}}>]</span>
        </ul> 
        :  
        
        <> <FaChevronRight /> {this.props.listName}  = {'['+this.props.list.map(e => ' '+e) + ' ]'} </>
        
      }
      </>
    );
  }
}

export default RenderListComponent;
