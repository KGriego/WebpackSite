/* Library Imports */
import React, { useEffect, useRef } from "react";
import { TweenMax, Sine } from "gsap";

/* Redux Imports */

/* Component Imports */
import Stuff from "../Components/Stuff";

const About = () => {
  let logoElement = useRef(null);

  useEffect(() => {
    TweenMax.to(logoElement, 1, {
      repeat: -1,
      ease: Sine.easeNone
    });
  }, []);

  function scaleNormal() {
    TweenMax.to(logoElement, 1, { scale: 1, ease: Sine.ease });
  }

  function scaleDown() {
    TweenMax.to(logoElement, 1, { scale: 0.9 });
  }
  return (
    <div className={"App"}>
      <div
        onMouseDown={scaleDown}
        onMouseUp={scaleNormal}
        ref={element => (logoElement = element)}
        style={{
          border: "2px black solid",
          height: "100vh",
          width: "100vw",
          overflow: "hidden"
        }}
      >
        <Stuff />
      </div>
    </div>
  );
};

export default About;
