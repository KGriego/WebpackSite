/* Library Imports */
import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
/* Redux Imports */

/* Component Imports */
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import About from "./Pages/About";

/* Style Imports */
import "./SCSS/App.scss";

const history = createBrowserHistory();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Router history={history}>
        <Layout>
          <Switch>
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/About" render={() => <About />} />
            <Route exact path="/ContactUs" render={() => <h1>hello</h1>} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
