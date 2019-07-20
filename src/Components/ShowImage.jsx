/* Library Imports */
import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { withRouter, Link } from "react-router-dom";

/* Component Import */
import HamburgerHTML from "./Hamburger.html";

/* JS File */
import demo6 from "../js/demo6";

class Header extends Component {
  componentDidMount() {
    demo6.hamburger();
  }

  handleContentClicker = e => {
    const { history } = this.props;
    e.preventDefault();
    const targetLink = e.target.closest("a");
    if (!targetLink) return;
    history.push(e.target.href.split("/")[3]);
  };

  render() {
    const { stopShowing } = this.props;
    return (
      <div
        className="imageToShow"
        onClick={stopShowing}
        style={{ backgroundColor: "black", position: "absolute", top: 60 }}
      >
        hi
      </div>
    );
  }
}

export default withRouter(Header);
