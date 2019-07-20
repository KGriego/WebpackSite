/* Library Imports */
import React from "react";
import { Card, Image, Grid } from "semantic-ui-react";

/* Redux Imports */

/* Component Imports */
import tileData from "../js/tileData";

class Dragger extends React.Component {
  constructor(props) {
    super(props);
    this.dragParent = React.createRef();
    this.state = {
      randPic: [],
      pos: { x: 0, y: 0 },
      dragging: false
    };
  }
  componentDidMount() {
    this.getHeaderPicture();
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
    if (e.button !== 0) return;
    const { current } = this.dragParent;

    let pos = {
      top: current.offsetTop,
      left: current.offsetLeft
    };
    this.setState({
      dragging: true,
      rel: { x: e.pageX - pos.left, y: e.pageY - pos.top }
    });
  };
  onMouseUp = e => {
    this.setState({ dragging: false });
    e.stopPropagation();
    e.preventDefault();
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
  getHeaderPicture = () => {
    const pics = tileData.reduce((pic, img) => {
      pic.push(img);
      return pic;
    }, []);
    this.setState({ randPic: pics });
  };
  openPicture = () => {
    console.log("hey");
  };
  render() {
    const { randPic, pos } = this.state;
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        ref={this.dragParent}
        style={{
          width: "100vw",
          backgroundColor: "red",
          position: "absolute",
          height: "300vh",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          cursor: "pointer",
          padding: 50
        }}
      >
        <Card.Group style={{ marginTop: "1em" }}>
          {randPic.map(item => {
            return (
              <Card key={item.src.src}>
                <Image
                  key={item.src.src}
                  src={item.src.src}
                  srcSet={item.src.srcSet}
                />
                <Card.Content>
                  <Card.Meta onClick={this.openPicture}>
                    Click me to view the picture!
                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </div>
    );
  }
}

export default Dragger;
