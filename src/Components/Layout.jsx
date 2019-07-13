/* Library Imports */
import React from "react";

/* Component Imports */
import Header from "./Header";

/* Style Imports */

function Layout(props) {
  return (
    <div>
      <Header />
      {props.children}
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
