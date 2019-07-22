/* Library Imports */
import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

/* Component Imports */

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { hidden, handleMenuState, activeItem } = this.props;
    return (
      <div className={`sideNav ${hidden && "show-menu"}`}>
        <Menu secondary size="huge" style={{ marginTop: 20 }} vertical>
          <Menu.Item
            active={activeItem === "home"}
            as="div"
            name="home"
            onClick={handleMenuState}
          />
          <Menu.Item
            active={activeItem === "services"}
            as="div"
            name="services"
            onClick={handleMenuState}
          />
          <Menu.Item
            active={activeItem === "resources"}
            as="div"
            name="resources"
            onClick={handleMenuState}
          />
          <Menu.Item
            active={activeItem === "aboutUs"}
            as="div"
            name="aboutUs"
            onClick={handleMenuState}
          />
          <Menu.Item
            active={activeItem === "contactInfo"}
            as="div"
            name="contactInfo"
            onClick={handleMenuState}
          />
        </Menu>
      </div>
    );
  }
}

export default SideBar;
