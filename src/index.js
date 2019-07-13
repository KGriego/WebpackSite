/* Library Imports */
import React, { Component } from "react";
import { render } from "react-dom";

/* Redux Imports */
// import { Provider } from "react-redux";
// import configureStore from "./JS/Store/createStore";

/* Component Imports */
import App from "./App";

// const store = configureStore();

render(
  // <Provider store={store}>
  <App />,
  // </Provider>,
  document.getElementById("react-entry")
);
