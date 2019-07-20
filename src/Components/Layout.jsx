/* Library Imports */
import React from "react";

/* Component Imports */
import Header from "./Header";

/* Style Imports */

function Layout(props) {
  const { children } = props;
  return (
    <div>
      <Header />
      <div style={{ position: "relative" }}>{children}</div>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
