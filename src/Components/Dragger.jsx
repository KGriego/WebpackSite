/* Library Imports */
import React from "react";
import { Card, Image } from "semantic-ui-react";
import Draggable from "react-draggable";
import PhysicsDragger from "./PhysicsDragger";
import ResizeObserver from "resize-observer-polyfill";

/* Redux Imports */

/* Component Imports */
import tileData from "../js/tileData";
import image from "../images/Albums/Insects/bee flower.jpg";

class Dragger extends React.Component {
  constructor(props) {
    super();
    this.state = {
      randPic: []
    };
  }
  componentDidMount() {
    this.getHeaderPicture();
  }
  getHeaderPicture = () => {
    const pics = tileData.reduce((pic, img) => {
      if (img.frontPage) {
        pic.push(img);
      }
      return pic;
    }, []);
    this.setState({ randPic: pics });
  };

  render() {
    const { randPic } = this.state;
    return (
      <PhysicsDragger className="dragger" friction={0.85} ResizeObserver>
        <div
          style={{
            height: 10000,
            width: 5000,
            padding: 50,
            backgroundColor: "red"
          }}
        >
          {randPic.map(item => {
            console.log(item);
            return (
              <Draggable bounds="parent" key={item.src.src}>
                <Card>
                  <Image src={item.src.src} />
                  <Card.Content className="ui">
                    <Card.Header className="ui">Click Me</Card.Header>
                  </Card.Content>
                </Card>
              </Draggable>
            );
          })}
        </div>
      </PhysicsDragger>
    );
  }
}

export default Dragger;
