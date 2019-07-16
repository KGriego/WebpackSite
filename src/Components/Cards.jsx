/* Library Imports */
import React, { Component } from "react";
import Lightbox from "./react-images/lib/Lightbox";
import { Card, Image, Header, Divider, Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";

/* Component Imports */
import tileData from "../js/tileData";

class Cards extends Component {
  state = {
    pictures: [],
    lightBox: [],
    currentImage: 0,
    lightboxIsOpen: false
  };

  componentDidMount() {
    this.getHeaderPicture();
  }

  getHeaderPicture = () => {
    const pictures = tileData.reduce((pic, img) => {
      if (img.frontPage) {
        pic.push(img);
      }
      return pic;
    }, []);
    const lightBox = pictures.map(pic => ({ src: pic.src.src }));
    this.setState({ pictures, lightBox });
  };
  openLightbox = e => {
    if (e.target.nodeName === "IMG") {
      e.preventDefault();
      const curretImg = parseInt(e.target.dataset.key);
      this.setState({
        currentImage: curretImg,
        lightboxIsOpen: true
      });
    }
  };
  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    });
  };
  gotoPrevious = () => {
    this.setState(prevState => {
      const { currentImage } = prevState;
      if (currentImage - 1 === -1) {
        return { ...prevState, currentImage: prevState.pictures.length - 1 };
      } else {
        return { ...prevState, currentImage: currentImage - 1 };
      }
    });
  };
  gotoNext = () => {
    this.setState(prevState => {
      const { currentImage } = prevState;
      if (currentImage + 1 === 10) {
        return { ...prevState, currentImage: 0 };
      } else {
        return { ...prevState, currentImage: currentImage + 1 };
      }
    });
  };
  goToAlbum = e => {
    const { history } = this.props;
    const albumName = e.target.alt;
    history.push("/albumPage/" + albumName);
  };
  render() {
    const { pictures, lightBox } = this.state;
    return (
      <Grid className={"gridOfImages"}>
        <Grid.Row>
          <Grid.Column>
            <Divider horizontal className={"gridDivider"}>
              <Header>Spotlight</Header>
            </Divider>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Card.Group centered>
            {pictures.map(({ src, caption, albumName }, index) => {
              let splitName, nameToShow, link;
              if (albumName.includes(" ")) {
                splitName = albumName.split(" ")[0];
              } else if (albumName.match(/(?=[A-Z])/)) {
                nameToShow = albumName.split(/(?=[A-Z])/).join(" ");
                link = albumName;
              } else {
                nameToShow = albumName;
              }
              return (
                <Link
                  className={"ui imageHolder"}
                  to={`/Albums/${splitName ? splitName : link}`}
                  key={index}
                >
                  <Card
                    as={"div"}
                    className={"imageCard"}
                    onClick={this.openLightbox}
                  >
                    <Card.Content>
                      <Image
                        srcSet={src.srcSet}
                        src={src}
                        alt={caption}
                        data-key={index}
                      />
                      <Card.Header className={"imageCardHeader"}>
                        {splitName ? splitName : nameToShow}
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <Card.Description className={"imageCardDescription"}>
                        {caption}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      Link to:
                      <span className={"imageCardLink"}>
                        {splitName ? splitName : nameToShow}
                      </span>
                    </Card.Content>
                  </Card>
                </Link>
              );
            })}
          </Card.Group>
        </Grid.Row>
        <Lightbox
          backdropClosesModal={true}
          images={lightBox}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClickImage={this.goToAlbum}
          currentImage={this.state.currentImage}
          isOpen={this.state.lightboxIsOpen}
        />
      </Grid>
    );
  }
}

export default Cards;
