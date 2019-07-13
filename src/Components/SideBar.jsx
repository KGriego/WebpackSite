/* Library Imports */
import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

/* Component Imports */

class SideBar extends Component {
  render() {
    const { hidden, handleMenuState, activeItem } = this.props;
    return (
      <div className={`sideNav ${hidden && "show-menu"}`}>
        <Menu size="huge" secondary vertical style={{ marginTop: 20 }}>
          <Menu.Item
            as="div"
            name="home"
            active={activeItem === "home"}
            onClick={handleMenuState}
          />
          <Menu.Item
            as="div"
            name="services"
            active={activeItem === "services"}
            onClick={handleMenuState}
          />
          <Menu.Item
            as="div"
            name="resources"
            active={activeItem === "resources"}
            onClick={handleMenuState}
          />
          <Menu.Item
            as="div"
            name="aboutUs"
            active={activeItem === "aboutUs"}
            onClick={handleMenuState}
          />
          <Menu.Item
            as="div"
            name="contactInfo"
            active={activeItem === "contactInfo"}
            onClick={handleMenuState}
          />
        </Menu>
      </div>
    );
  }
}

export default SideBar;
