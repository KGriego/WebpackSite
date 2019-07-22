/* Library Imports */
import React from "react";
import { TweenMax, Sine } from "gsap";

/* Redux Imports */

/* Component Imports */
import PixiContainer from "../Components/PixiContainer";

class About extends React.Component {
  constructor(props) {
    super(props);
    this.logoElement = React.createRef();
    this._xLast = 0;
    this._yLast = 0;
    this._xTo = 0;
    this._yTo = 0;
    this.state = {};
  }

  scaleNormal = () =>
    TweenMax.to(this.logoElement, 1, { scale: 1, ease: Sine.ease });
  scaleDown = e => {
    this._xLast = e.clientX;
    this._yLast = e.clientY;
    TweenMax.to(this.logoElement, 1, { scale: 0.9 });
  };

  render() {
    return (
      <div className={"App"}>
        <div
          onMouseDown={this.scaleDown}
          onMouseLeave={this.scaleNormal}
          onMouseUp={this.scaleNormal}
          ref={element => (this.logoElement = element)}
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
