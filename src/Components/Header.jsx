/* Library Imports */
import React, { Component } from "react";
import { Icon, Menu } from "semantic-ui-react";
import { withRouter, Link, Redirect } from "react-router-dom";

/* Component Import */
import HamburgerHTML from "./Hamburger.html";

/* JS File */
import demo6 from "../js/demo6";

class Header extends Component {
  state = {
    hidden: false,
    WindowSize: 400,
    activeItem: null
  };
  componentDidMount() {
    demo6.hamburger();
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.addEventListener("resize", null);
  }
  handleResize = () => this.setState({ WindowSize: window.innerWidth });
  handleItemClick = (e, target = {}) => this.setState({ activeItem: target.name });

  contentClickHandler = e => {
    e.preventDefault();
    const targetLink = e.target.closest("a");
    if (!targetLink) return;
    this.props.history.push(e.target.href.split("/")[3]);
  };

  render() {
    const { activeItem, WindowSize } = this.state;
    let mobile;
    if (WindowSize >= 950) {
      mobile = false;
    } else {
      mobile = true;
    }
    return (
      <>
        <Menu
          borderless={true}
          inverted
          className={"header headerColor removedStyles headerLineHeight"}>
          <Menu.Item>
            <Menu.Header as={"h2"} className={"rochester"}>
              <Link to="/">Laurie Anne's Photogrpahy</Link>
            </Menu.Header>
          </Menu.Item>
          {!mobile && (
            <>
              <Menu.Item
                name={"About"}
                position={"right"}
                active={activeItem === "About"}
                onClick={this.handleItemClick}
                as={"p"}>
                <Link to={"/AboutMe"}>
                  <Icon name={activeItem === "About" ? "address card" : "address card outline"} />
                  About
                </Link>
              </Menu.Item>
              <Menu.Item
                name={"Portfolio"}
                active={activeItem === "Portfolio"}
                onClick={this.handleItemClick}
                as={"p"}>
                <Link to={"/Portfolio"}>
                  <Icon name={activeItem === "Portfolio" ? "folder open" : "folder"} />
                  Portfolio
                </Link>
              </Menu.Item>
              <Menu.Item
                name={"Blog"}
                active={activeItem === "Blog"}
                onClick={this.handleItemClick}
                as={"p"}>
                <Link to={"/Blog"}>
                  <Icon name={"book"} />
                  Blog
                </Link>
              </Menu.Item>
              <Menu.Item
                name={"Contact"}
                active={activeItem === "Contact"}
                onClick={this.handleItemClick}
                as={"p"}>
                <Link to={"/ContactMe"}>
                  <Icon name={activeItem === "Contact" ? "envelope open" : "envelope"} />
                  Contact
                </Link>
              </Menu.Item>
            </>
          )}
        </Menu>
        {mobile && (
          <div
            style={{ display: "table-cell", verticalAlign: "middle" }}
            dangerouslySetInnerHTML={{ __html: HamburgerHTML }}
            onClick={this.contentClickHandler}
          />
        )}
      </>
    );
  }
}

export default withRouter(Header);
