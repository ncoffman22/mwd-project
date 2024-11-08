import './App.css';
import * as ENV from "./environments.js"
import Parse from "parse";
import React from "react";
import {
  BrowserRouter as Router,

} from 'react-router-dom';
import { Container } from "react-bootstrap";
import NavigationContainer from "./components/Navigation/NavigationContainer";
import Components from './components/Components';

// Only do one parse initialization in the app.js
Parse.initialize(ENV.APPLICATION_ID, ENV.JAVASCRIPT_KEY);
Parse.serverURL = ENV.SERVER_URL;

function App() {
  // two use states: one for the user, one for their workouts
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavigationContainer />
        <Container fluid className="flex-grow-1 mt-3">
          <Components
          />
        </Container>
      </div>
    </Router>
  );
}
export default App;
