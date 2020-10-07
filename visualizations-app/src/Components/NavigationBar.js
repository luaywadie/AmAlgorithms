import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {
  Container,
  Navbar,
  Nav,
  Form,
  Button,
  FormControl,
  NavDropdown,
} from 'react-bootstrap';

import TreeTraversals from '../Components/TreeTraversals';
import UndirectedGraphAlgorithms from '../Components/UndirectedGraphAlgorithms';
import DirectedGraphAlgorithms from '../Components/DirectedGraphAlgorithms';
import Heap from '../Components/data-structures/Heap';

import '../styles/Navigation-bar.scss';
import MainPage from './MainPage';

const NavigationBar = () => {
  return (
    <Router>
      <Container fluid={true}>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand as={Link} to="/">
            <img
              alt={'logo'}
              className={'header-logo'}
              src={process.env.PUBLIC_URL + '/logo.png'}
            />
          </Navbar.Brand>
          <Nav className="mr-auto">
            <NavDropdown title="Data Structures">
              <NavDropdown.Item eventKey="1" as={Link} to="/heap">
                Heap
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Sorting">
              <NavDropdown.Item eventKey="1" as={Link} to="#">
                Sorts
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
              <NavDropdown.Item eventKey="3" as={Link} to="#">
                K-Means
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info">Search</Button>
          </Form>
        </Navbar>
        <br />
      </Container>
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

      <Route exact path="/" component={MainPage} />
    </Router>
  );
};

export default NavigationBar;
