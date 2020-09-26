import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {
  Container,
  Navbar,
  Nav,
  Form,
  Button,
  FormControl,
} from 'react-bootstrap';

import TreeTraversals from '../Components/TreeTraversals';
import GraphAlgorithms from '../Components/GraphAlgorithms';
import DirectedGraphAlgorithms from '../Components/DirectedGraphAlgorithms';

import '../styles/navigation-bar.css';
import MainPage from './MainPage';

const NavigationBar = () => {
  return (
    <Router>
      <Container>
        <Navbar bg="dark" variant="dark" style={{ borderRadius: '20px' }}>
          <Navbar.Brand as={Link} to="/">
            <img
              className={'header-logo'}
              src={process.env.PUBLIC_URL + '/logo.png'}
            />
          </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/tree_traversals" className="nav-link">
              Tree Traversals
            </Nav.Link>
            <Nav.Link as={Link} to="/graph_algorithms">
              Undirected Graph Algorithms
            </Nav.Link>
            <Nav.Link as={Link} to="/directed_graph_algorithms">
              Directed Graph Algorithms
            </Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info">Search</Button>
          </Form>
        </Navbar>
        <br />
      </Container>
      <Route path="/tree_traversals" component={TreeTraversals} />
      <Route path="/graph_algorithms" component={GraphAlgorithms} />
      <Route
        path="/directed_graph_algorithms"
        component={DirectedGraphAlgorithms}
      />
      <Route exact path="/" component={MainPage} />
    </Router>
  );
};

export default NavigationBar;
