/* Library Imports */
import React from "react";
import { Card, Image } from "semantic-ui-react";
import Gallery from "../Modules/react-photo-gallery/react-photo-gallery.esm";
import Lightbox from "../Modules/react-images/react-images.es";

/* Redux Imports */

/* Component Imports */
import tileData from "../js/tileData";

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (let i = 1; i < arguments.length; i++) {
        let source = arguments[i];

        for (let key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };

  return _extends.apply(this, arguments);
}

class Dragger extends React.Component {
  constructor(props) {
    super(props);
    this.state = { gallery: [] };
  }
  componentDidMount() {
    this.getHeaderPicture();
  }
  getHeaderPicture = () => {
    const gallery = [];
    const pics = tileData.forEach(img =>
      gallery.push({
        src: img.src.src,
        srcSet: img.src.srcSet,
        alt: img.alt,
        height: img.src.height,
        width: img.src.width,
        caption: img.caption,
        images: img.src.images
      })
    );
    this.setState({ randPic: pics, gallery });
  };

  openLightbox = e => {
    if (e.target.nodeName === "IMG") {
      e.preventDefault();
      const curretImg = parseInt(e.target.dataset.key);
      this.setState({ currentImage: curretImg, lightboxIsOpen: true });
    }
  };
  closeLightbox = () => {
    this.setState({ currentImage: 0, lightboxIsOpen: false });
  };
  gotoPrevious = () => {
    this.setState(prevState => {
      const { currentImage } = prevState;
      if (currentImage === 0) {
        return { ...prevState, currentImage: prevState.gallery.length - 1 };
      } else {
        return { ...prevState, currentImage: currentImage - 1 };
      }
    });
  };
  gotoNext = () => {
    this.setState(prevState => {
      const { currentImage } = prevState;
      if (currentImage + 1 === prevState.gallery.length) {
        return { ...prevState, currentImage: 0 };
      } else {
        return { ...prevState, currentImage: currentImage + 1 };
      }
    });
  };
  render() {
    const { gallery, lightboxIsOpen, currentImage } = this.state;
    return (
      <div style={{ marginTop: 100 }}>
        <Gallery
          direction={"column"}
          photos={gallery}
          renderImage={image => {
            const { photo, onClick, margin, left, top, key, index } = image;
            const imgStyle = { margin, display: "block", cursor: "pointer" };
            if (image.direction === "column") {
              imgStyle.position = "absolute";
              imgStyle.left = left;
              imgStyle.top = top;
            }
            const props = _extends({ key, style: imgStyle }, photo, {
              onClick
            });
            return (
              <Card
                className={"notDraggable"}
                key={key}
                onClick={this.openLightbox}
                style={{ ...props.style }}
              >
                <Image
                  className={"notDraggable"}
                  data-key={index}
                  src={props.src}
                  srcSet={props.srcSet}
                />
                <Card.Content className={"notDraggable"}>
                  <Card.Meta className={"notDraggable"} onClick={() => {}}>
                    Click me to view the picture!
                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          }}
        />
        <Lightbox
          backdropClosesModal
          currentImage={currentImage}
          images={gallery}
          isOpen={lightboxIsOpen}
          onClickImage={this.goToAlbum}
          onClickNext={this.gotoNext}
          onClickPrev={this.gotoPrevious}
          onClose={this.closeLightbox}
        />
      </div>
    );
  }
}

export default Dragger;
