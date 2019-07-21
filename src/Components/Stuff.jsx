/* Library Imports */
import React from "react";
import { Stage, Sprite, Container } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

/* Redux Imports */

/* Component Imports */
import tileData from "../js/tileData";

class Stuff extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.state = {};
  }
  componentDidMount() {
    this.getValues();
    this.makeImages();
  }
  getValues = () =>
    this.setState({ height: window.innerHeight, width: window.innerWidth });

  makeImages = () => {
    this.container.buttonMode = true;
    tileData.map((image, i) => {
      const imageToRender = new PIXI.Sprite.from(image.src.src);
      imageToRender.x = (i % 5) * 40;
      imageToRender.y = Math.floor(i / 5) * 40;
      this.container.addChild(imageToRender);
    });
  };

  render() {
    const { height, width } = this.state;
    return (
      <Stage
        height={height}
        options={{ backgroundColor: 0x10bb99 }}
        width={width}
      >
        <Container
          interactive
          pointerdown={onDragStart}
          pointermove={onDragMove}
          pointerup={onDragEnd}
          pointerupoutside={onDragEnd}
          ref={ref => (this.container = ref)}
        />
      </Stage>
    );
  }
}

export default Stuff;

function onDragStart(event) {
  this.data = event.data;
  this.dragging = true;
}
function onDragEnd() {
  this.dragging = false;
  this.data = null;
}
function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
}
