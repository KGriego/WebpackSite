/* Library Imports */
import React from "react";
import { Stage, Container } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

/* Redux Imports */

/* Component Imports */
import tileData from "../js/tileData";

class PixiContainer extends React.Component {
  constructor(props) {
    super(props);
    this.stage = React.createRef();
    this.container = React.createRef();
    this.state = {};
  }
  componentDidMount() {
    this.makeImages();
    this.getValues();
  }

  makeImages = () => {
    this.container.buttonMode = true;
    tileData.map((image, i) => {
      const imageToRender = new PIXI.Sprite.from(image.src.src);
      if (i === 0) {
        imageToRender.x = 0;
        imageToRender.y = 0;
      } else if (i === 1) {
        imageToRender.x = tileData[i - 1].src.width + 10;
        imageToRender.y = 0;
      } else {
        return;
      }
      this.container.addChild(imageToRender);
    });
  };

  getValues = () => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    this.setState({ height, width });
  };
  render() {
    const { height, width } = this.state;
    return (
      <Stage
        height={height}
        interactive
        mousemove={onMouseMove}
        options={{ backgroundColor: 0x10bb99 }}
        ref={ref => (this.stage = ref)}
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

export default PixiContainer;

function onMouseMove(e) {
  if (this.dragging) {
    return;
  }
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight;

  const halfHeight = stageHeight / 100;
  const halfWidth = stageWidth / 100;

  const moveX = e.data.originalEvent.clientX;
  const moveY = e.data.originalEvent.clientY;

  const dx = (stageWidth >> 1) - moveX;
  const dy = (stageHeight >> 1) - moveY;

  const xAdd = (dx / stageWidth) * 85;
  const yAdd = (dy / stageHeight) * 85;

  const x = halfHeight + xAdd;
  const y = halfWidth + yAdd;

  this.x = x;
  this.y = y;
}

function onDragMove(e) {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    const x = newPosition.x - this._xLast;
    const y = newPosition.y - this._yLast;
    const newX = x * 0.5;
    const newY = y * 0.5;

    this.position.x = newX;
    this.position.y = newY;
    // debugger;
  }
}
function onDragStart(e) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.data = e.data;
  this.dragging = true;
  this._xLast = this.position.x;
  this._yLast = this.position.y;
}

function onDragEnd() {
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
  this._xLast = this.position.x;
  this._yLast = this.position.y;
}
