/* Library Imports */
import React from "react";
import { Container } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

/* Redux Imports */

/* Component Imports */
import tileData from "../js/tileData";

class ImageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.dragging = false;
    this.dragData = null;
    this.state = {};
  }
  componentDidMount() {
    this.makeImages();
  }

  makeImages = () => {
    this.container.buttonMode = true;
    tileData.map((image, i) => {
      const imageToRender = new PIXI.Sprite.from(image.src.src);
      if (i < 1) {
        imageToRender.x = 0;
        imageToRender.y = 0;
      } else if (i < 3) {
        imageToRender.x = tileData[i - 1].src.width + 10;
        imageToRender.y = 0;
      } else {
        return;
      }
      this.container.addChild(imageToRender);
    });
  };
  onDragStart = e => {
    this.dragData = e.data;
    this.ragging = true;
  };
  onDragEnd = () => {
    this.dragging = false;
    this.dragData = null;
  };
  onDragMove = e => {
    if (this.dragging) {
      const newPosition = this.dragData.getLocalPosition(e.currentTarget);
      e.currentTarget.x = newPosition.x;
      e.currentTarget.y = newPosition.y;
    }
  };

  render() {
    const { onDragEnd, onDragMove, onDragStart, dragging, dragData } = this;
    return (
      <Container
        interactive
        pointerdown={e => onDragStart(e, { dragData, dragging })}
        pointermove={e => onDragMove(e, { dragging, dragData })}
        pointerup={e => onDragEnd(e, { dragData, dragging })}
        pointerupoutside={e => onDragEnd(e, { dragging, dragData })}
        ref={ref => (this.container = ref)}
      />
    );
  }
}

export default ImageContainer;
