/* Library Imports */
import React from "react";

/* Redux Imports */

/* Component Imports */
import Galleria from "./Galleria";

class Dragger extends React.Component {
  constructor(props) {
    super(props);
    this.dragParent = React.createRef();
    this.state = {
      pos: { x: 0, y: 0 },
      dragging: false
    };
  }
  // we could get away with not having this (and just having the listeners on
  // our div), but then the experience would be possibly be janky. If there's
  // anything w/ a higher z-index that gets in the way, then you're toast,
  // etc.
  componentDidUpdate(props, state) {
    const { dragging } = this.state;
    if (dragging && !state.dragging) {
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
    } else if (!dragging && state.dragging) {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseUp);
    }
  }
  // calculate relative position to the mouse and set dragging=true
  onMouseDown = e => {
    e.stopPropagation();
    e.preventDefault();
    // only left mouse button
    if (e.button !== 0 || e.target.className.includes("notDraggable")) return;
    const { current } = this.dragParent;
    let pos = { top: current.offsetTop, left: current.offsetLeft };
    this.setState({
      dragging: true,
      rel: { x: e.pageX - pos.left, y: e.pageY - pos.top }
    });
  };
  onMouseUp = e => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ dragging: false });
  };
  onMouseMove = e => {
    e.stopPropagation();
    e.preventDefault();
    const { dragging, rel } = this.state;
    if (!dragging) return;
    const x = e.pageX - rel.x;
    const y = e.pageY - rel.y;
    this.setState({ pos: { x, y } });
  };
  render() {
    const { pos } = this.state;
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        ref={this.dragParent}
        style={{
          width: "101vw",
          backgroundColor: "red",
          overflowX: "hidden",
          position: "relative",
          height: "200vh",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          cursor: "pointer",
          padding: 50
        }}
      >
        <Galleria />
      </div>
    );
  }
}

export default Dragger;
