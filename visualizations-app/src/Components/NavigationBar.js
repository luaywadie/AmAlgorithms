import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import TreeTraversals from '../Components/TreeTraversals';
import UndirectedGraphAlgorithms from '../Components/UndirectedGraphAlgorithms';
import DirectedGraphAlgorithms from '../Components/DirectedGraphAlgorithms';
import ScatterPlotAlgorithms from '../Components/ScatterPlotAlgorithms';
import Heap from '../Components/data-structures/Heap';
import Stack from '../Components/data-structures/Stack';
import InsertionSort from '../Components/algorithms/sorts/InsertionSort';
import NeuralNets from '../Components/NeuralNets';

import '../styles/Navigation-bar.scss';
import MainPage from './MainPage';

const NavigationBar = () => {
  return (
    <Router>
      <Navbar>
        <Navbar.Brand as={Link} to="/">
          <img
            alt={'logo'}
            className={'header-logo'}
            src={process.env.PUBLIC_URL + '/assets/imgs/logo.png'}
          />
        </Navbar.Brand>

        <Nav className="ml-auto">
          <NavDropdown title="Data Structures">
            <NavDropdown.Item eventKey="1" as={Link} to="/heap">
              Heap
            </NavDropdown.Item>
            <NavDropdown.Item eventKey="2" as={Link} to="/stack">
              Stack
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Sorting">
            <NavDropdown.Item eventKey="1" as={Link} to="/insertion_sort">
              Insertion Sort
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Tree">
            <NavDropdown.Item as={Link} to="/tree_traversals">
              Tree Traversals
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Graph">
            <NavDropdown.Item
              eventKey="1"
              as={Link}
              to="/directed_graph_algorithms"
            >
              Directed Graph Algorithms
            </NavDropdown.Item>
            <NavDropdown.Item
              eventKey="2"
              as={Link}
              to="/undirected_graph_algorithms"
            >
              Undirected Graph Algorithms
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Machine Learning">
            <NavDropdown.Item
              eventKey="3"
              as={Link}
              to="/ScatterPlotAlgorithms"
            >
              K-Means
            </NavDropdown.Item>
            <NavDropdown.Item
              eventKey="4"
              as={Link}
              to="/neural_nets"
            >
              Neural Nets
            </NavDropdown.Item>
          </NavDropdown>

          <div className="burgerContainer">
            <div className="burgerIcon"></div>
            <div className="burgerIcon"></div>
            <div className="burgerIcon"></div>
          </div>
        </Nav>
      </Navbar>
      <br />
      <Route path="/tree_traversals" component={TreeTraversals} />
      <Route
        path="/undirected_graph_algorithms"
        component={UndirectedGraphAlgorithms}
      />
      <Route
        path="/directed_graph_algorithms"
        component={DirectedGraphAlgorithms}
      />
      <Route path="/heap" component={Heap} />
      <Route path="/stack" component={Stack} />
      <Route path="/insertion_sort" component={InsertionSort} />
      <Route path="/ScatterPlotAlgorithms" component={ScatterPlotAlgorithms} />
      <Route path="/neural_nets" component={NeuralNets} />
      <Route exact path="/" component={MainPage} />
    </Router>
  );
};

export default NavigationBar;
