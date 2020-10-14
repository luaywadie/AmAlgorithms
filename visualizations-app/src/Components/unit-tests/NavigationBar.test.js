import React from 'react';
import NavigationBar from '../NavigationBar';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('Navbar Component', () => {
  let NavigationBarComponent;
  beforeEach(() => {
    NavigationBarComponent = shallow(<NavigationBar />);
  });

  it('renders logo', () => {
    expect(NavigationBarComponent.find('img').prop('alt')).toEqual('logo');
  });

  it('renders nav bar dropdown buttons and search bar', () => {
    let linkArray = [
      'Data Structures',
      'Sorting',
      'Tree',
      'Graph',
      'Machine Learning',
    ];
    for (let link of linkArray) {
      expect(
        NavigationBarComponent.find('Nav')
          .childAt(linkArray.indexOf(link))
          .prop('title')
      ).toEqual(link);
    }
    expect(NavigationBarComponent.find('Nav').length).toEqual(1);
    expect(NavigationBarComponent.find('NavDropdown').length).toEqual(5);
    expect(NavigationBarComponent.find('Form').length).toEqual(1);
  });

  it('should contain all dropdown link items', () => {
    expect(
      NavigationBarComponent.find('NavDropdown').at(0).childAt(0).prop('to')
    ).toEqual('/heap');
    expect(
      NavigationBarComponent.find('NavDropdown').at(0).childAt(0).text()
    ).toEqual('Heap');

    expect(
      NavigationBarComponent.find('NavDropdown').at(1).childAt(0).prop('to')
    ).toEqual('#');
    expect(
      NavigationBarComponent.find('NavDropdown').at(1).childAt(0).text()
    ).toEqual('Sorts');

    expect(
      NavigationBarComponent.find('NavDropdown').at(2).childAt(0).prop('to')
    ).toEqual('/tree_traversals');
    expect(
      NavigationBarComponent.find('NavDropdown').at(2).childAt(0).text()
    ).toEqual('Tree Traversals');

    expect(
      NavigationBarComponent.find('NavDropdown').at(3).childAt(0).prop('to')
    ).toEqual('/directed_graph_algorithms');
    expect(
      NavigationBarComponent.find('NavDropdown').at(3).childAt(0).text()
    ).toEqual('Directed Graph Algorithms');

    expect(
      NavigationBarComponent.find('NavDropdown').at(3).childAt(1).prop('to')
    ).toEqual('/undirected_graph_algorithms');
    expect(
      NavigationBarComponent.find('NavDropdown').at(3).childAt(1).text()
    ).toEqual('Undirected Graph Algorithms');

    expect(
      NavigationBarComponent.find('NavDropdown').at(4).childAt(0).prop('to')
    ).toEqual('#');
    expect(
      NavigationBarComponent.find('NavDropdown').at(4).childAt(0).text()
    ).toEqual('K-Means');
  });
});
