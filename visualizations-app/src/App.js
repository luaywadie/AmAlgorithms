import React from 'react';
import './styles/App.scss';
import NavigationBar from './Components/NavigationBar';
import './styles/Node.scss';
import './styles/Link.scss';
import './styles/Graph.scss';
import './styles/OutputTable.scss';
import './styles/Clusters.scss';
import './styles/Pseudocode.scss';
import './styles/Sidebar.scss';

function App() {
  return (
    <div className={'container-fluid'}>
      <NavigationBar />
    </div>
  );
}

export default App;
