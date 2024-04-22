import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DataProcessing from './components/DataProcessing';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1 style={{
          textAlign: 'center',
          paddingTop: '50px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '2em'
        }}>Firefly Optimizer</h1>
        <Switch>
        <Route exact path="/">
            <Redirect to="/dataprocessing" />
          </Route>
          <Route path="/dataprocessing">
            <DataProcessing />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;