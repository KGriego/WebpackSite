/* Library Imports */
import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import Slider from "react-animated-slider";

/* Component Imports */
import tileData from "../js/tileData";

/* Style Imports */

class ImageSlider extends Component {
  state = {
    randPic: [],
    max: 10
  };
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
    const { randPic, max } = this.state;
    return (
      <Grid columns={"1"} className={"headerImage"}>
        <Slider
          autoplay={2500}
          infinite
          slideIndex={Math.floor(Math.random() * Math.floor(max))}
        >
          {randPic.map((item, i) => (
            <div
              key={`${item.src}-${i}`}
              style={{
                height: "100%",
                backgroundImage: `url('${item.src}')`,
                backgroundSize: "cover"
              }}
            />
          ))}
        </Slider>
      </Grid>
    );
  }
}

export default ImageSlider;

/* <div className={"backgroundCover"}>
<div className={"textOverlayOfFirstThingYouSee"}>
<Item>
<Item.Content className={"alignCenterTextOverLay"}>
<Item.Header>Welcome!</Item.Header>
<Item.Description className={"alignCenterTextOverLay"}>
Explore my website! Click on the images to enlarge them. You can head to the
portfolio page to view my albums and works! If you are interested in booking
a photography session, please contact me under the contact tab.
</Item.Description>
</Item.Content>
</Item>
</div>
</div> */
