/* Library Imports */
import React from "react";
import { TweenMax, Sine } from "gsap";
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

  getValues = () => {
    const height = window.innerHeight * 2;
    const width = window.innerWidth * 2;
    this.setState({ height, width });
  };

  makeImages = () => {
    this.container.buttonMode = true;
    tileData.map((image, i) => {
      const imageToRender = new PIXI.Sprite.from(image.src.src);
      if (i === 9) {
        imageToRender.x = 0;
        imageToRender.y = 0;
      } else if (i === 13) {
        imageToRender.x = tileData[i - 1].src.width + 10;
        imageToRender.y = 0;
      } else {
        return;
      }
      this.container.addChild(imageToRender);
    });
  };

  scaleNormal = () => TweenMax.to(this.stage, 1, { scale: 1, ease: Sine.ease });
  scaleDown = () => TweenMax.to(this.stage, 1, { scale: 0.9 });

  render() {
    const { height, width } = this.state;
    return (
      <Stage
        height={height}
        interactive
        mousedown={this.scaleDown}
        mousemove={onMouseMove}
        mouseout={this.scaleNormal}
        mouseup={this.scaleNormal}
        options={{ backgroundColor: 0x10bb99 }}
        ref={ref => (this.stage = ref)}
        style={{ height: window.innerHeight, width: window.innerWidth }}
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
    const x = this.data.originalEvent.pageX - this.lastX;
    const y = this.data.originalEvent.pageY - this.lastY;

    this.position.x = x;
    this.position.y = y;
  }
}
function onDragStart(e) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.data = e.data;
  this.dragging = true;
  this.lastX =
    this.data.originalEvent.pageX -
    this.data.originalEvent.currentTarget.offsetLeft;

  this.lastY =
    this.data.originalEvent.pageY -
    this.data.originalEvent.currentTarget.offsetTop;
}

function onDragEnd() {
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
  this._xLast = this.position.x;
  this._yLast = this.position.y;
}
