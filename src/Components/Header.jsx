/* Library Imports */
import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
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
    return (
      <div style={{ zIndex: 110, position: "relative" }}>
        <Menu
          borderless
          className="headerMenu headerColor removedStyles headerLineHeight"
          inverted
        >
          <Menu.Item>
            <Menu.Header as="h2" className="rochester">
              <Link to="/">Laurie Anne&apos;s Photogrpahy</Link>
            </Menu.Header>
          </Menu.Item>
        </Menu>
        <div
          dangerouslySetInnerHTML={{ __html: HamburgerHTML }}
          onClick={this.handleContentClicker}
          style={{ display: "table-cell", verticalAlign: "middle" }}
        />
      </div>
    );
  }
}

export default withRouter(Header);
