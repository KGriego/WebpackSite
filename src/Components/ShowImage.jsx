/* Library Imports */
import React, { Component } from "react";
import { Grid, Image, Item } from "semantic-ui-react";

/* Component Import */
import tileData from "../js/tileData";

class ShowImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgIndex: props.imgIndex,
      image: props.image
    };
  }
  goToPrev = () => {
    let { imgIndex } = this.state;
    let image = tileData[imgIndex - 1];
    if (image === undefined) {
      image = tileData[tileData.length - 1];
      imgIndex = tileData.length - 1;
    }
    this.setState({ image, imgIndex: imgIndex - 1 });
  };
  goToNext = () => {
    let { imgIndex } = this.state;
    let image = tileData[imgIndex + 1];
    if (image === undefined) {
      image = tileData[0];
      imgIndex = 0;
    }
    this.setState({ image, imgIndex: imgIndex + 1 });
  };

  render() {
    const { image } = this.state;
    const { stopShowing } = this.props;
    return (
      <>
        <div
          className="imageToShow fullscreen"
          onClick={stopShowing}
          style={{ backgroundColor: "yellow" }}
        />
        <Grid centered>
          <Grid.Row>
            <Item onClick={this.goToPrev}>prev</Item>
            <Item>
              <Image
                src={image.src.src}
                srcSet={image.src.srcSet}
                style={{ width: "75%" }}
              />
              <Item.Content>
                <Item.Header>{image.title || "Needs a title?"}</Item.Header>
                <Item.Description>{image.caption}</Item.Description>
                <Item.Meta>Album: {image.albumName}</Item.Meta>
              </Item.Content>
            </Item>
            <Item onClick={this.goToNext}>next</Item>
            <Item onClick={stopShowing}>close</Item>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

export default ShowImage;
