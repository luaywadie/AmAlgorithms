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
            <Nav.Link as={Link} to="/tree_traversals" className="nav-link">
              Tree Traversals
            </Nav.Link>
            <Nav.Link as={Link} to="/undirected_graph_algorithms">
              Undirected Graph Algorithms
            </Nav.Link>
            <Nav.Link as={Link} to="/directed_graph_algorithms">
              Directed Graph Algorithms
            </Nav.Link>
            <Nav.Link as={Link} to="/heap">
              Heap
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
