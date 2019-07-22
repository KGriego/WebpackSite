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
      if (i < 1) {
        imageToRender.x = 0;
        imageToRender.y = 0;
      } else if (i < 2) {
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
        >
          <Container />
        </Container>
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
  this._xLast = x;
  this._yLast = y;
  this.x = x;
  this.y = y;
}

function onDragStart(e) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.data = e.data;
  this.dragging = true;
  this._xTo = 52800 >> 1;
  this._yTo = 46200 >> 1;

  this._xTo -= 440 + 217;
  this._yTo -= 660 + 217;

  this._xLast = e.data.originalEvent.x;
  this._yLast = e.data.originalEvent.y;
}

function onDragEnd(e) {
  const moveX = e.data.originalEvent.clientX;
  const moveY = e.data.originalEvent.clientY;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
  this._xLast = moveX;
  this._yLast = moveY;
}

function onDragMove(e) {
  if (this.dragging) {
    let x = e.data.originalEvent.x;
    let y = e.data.originalEvent.y;

    let dx = x - this._xLast;
    let dy = y - this._yLast;

    this._xTo += dx * 1;
    this._yTo += dy * 1;

    this._xLast = x;
    this._yLast = y;

    this.x = this._xLast;
    this.y = this._yLast;
  }
}
