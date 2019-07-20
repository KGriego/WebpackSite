/* Library Imports */
import React from "react";
import { Card, Image } from "semantic-ui-react";
import Draggable from "react-draggable";
import PhysicsDragger from "./PhysicsDragger";

/* Redux Imports */

/* Component Imports */
import tileData from "../js/tileData";

class Dragger extends React.Component {
  constructor(props) {
    super(props);
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
      <div style={{ width: "100vw", overflow: "hidden" }}>
        <PhysicsDragger
          ResizeObserver
          className="dragger"
          friction={0.85}
          style={{ backgroundColor: "red" }}
        >
          <div
            style={{
              height: "100vh",
              width: "200vw",
              padding: 50,
              backgroundColor: "red"
            }}
          >
            <Card.Group centered>
              {randPic.map(item => {
                return (
                  <Card key={item.src.src}>
                    <Image src={item.src.src} />
                    <Card.Content className="ui">
                      <Card.Header className="ui">Click Me</Card.Header>
                    </Card.Content>
                  </Card>
                );
              })}
            </Card.Group>
          </div>
        </PhysicsDragger>
      </div>
    );
  }
}

export default Dragger;
