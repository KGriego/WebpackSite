/* Library Imports */
import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
/* Redux Imports */

/* Component Imports */
import Layout from "./Components/Layout";
import Home from "./Pages/Home";

/* Style Imports */
import "./App.scss";

const history = createBrowserHistory();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillUpdate(data) {
    console.log(data);
  }

  render() {
    return (
      <Router history={history}>
        <Layout>
          <Switch>
            <Route path={"/"} exact render={() => <Home />} />
            <Route
              path={"/AboutMe"}
              exact
              render={() => {
                return <h1>this is me </h1>;
              }}
            />
            <Route
              path={"/ContactUs"}
              exact
              render={() => {
                return <h1>hello </h1>;
              }}
            />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
