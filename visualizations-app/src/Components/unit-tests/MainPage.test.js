// import TestRenderer from 'react-test-renderer'; // ES6
import React from 'react';
import MainPage from '../MainPage';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('MainPage Component', () => {
  let mainComponent;
  beforeEach(() => {
    mainComponent = shallow(<MainPage />);
  });

  it('renders heading', () => {
    expect(mainComponent.find('h1').text()).toEqual('Amalgorithms Home Page');
    expect(mainComponent.find('.heading').text()).toEqual(
      'Amalgorithms Home Page'
    );
  });
});
