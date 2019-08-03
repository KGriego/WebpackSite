/* Library Imports */
import React from "react";

/* Redux Imports */

/* Component Imports */
import PixiContainer from "../Components/PixiContainer";

class About extends React.Component {
  constructor(props) {
    super(props);
    this.logoElement = React.createRef();
    this.state = {};
  }
  render() {
    return (
      <div className={"App"}>
        <div
          style={{
            border: "2px black solid",
            height: "100vh",
            width: "100vw",
            overflow: "hidden"
          }}
        >
          <PixiContainer />
        </div>
      </div>
    );
  }
}

export default About;
