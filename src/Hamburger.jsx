/* Library Imports */
import React, { Component } from "react";

/* Component Import */
const ease = {
  exponentialIn: t => {
    return t == 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
  },
  exponentialOut: t => {
    return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
  },
  exponentialInOut: t => {
    return t == 0.0 || t == 1.0
      ? t
      : t < 0.5
      ? +0.5 * Math.pow(2.0, 20.0 * t - 10.0)
      : -0.5 * Math.pow(2.0, 10.0 - t * 20.0) + 1.0;
  },
  sineOut: t => {
    const HALF_PI = 1.5707963267948966;
    return Math.sin(t * HALF_PI);
  },
  circularInOut: t => {
    return t < 0.5
      ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
      : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
  },
  cubicIn: t => {
    return t * t * t;
  },
  cubicOut: t => {
    const f = t - 1.0;
    return f * f * f + 1.0;
  },
  cubicInOut: t => {
    return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
  },
  quadraticOut: t => {
    return -t * (t - 2.0);
  },
  quarticOut: t => {
    return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
  }
};

class HamburgerMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: [],
      numPoints: 10,
      duration: 100,
      delayPointsArray: [],
      delayPointsMax: 50,
      delayPerPath: 100,
      timeStart: Date.now(),
      isAnimating: false,
      isOpened: false
    };
  }

  componentDidMount() {
    const path = this.refs["shape-overlays"].querySelectorAll("path");
    this.setState({ path });
  }

  toggle = () => {
    this.setState({ isAnimating: true });
    for (let i = 0; i < this.state.numPoints; i++) {
      this.state.delayPointsArray[i] = Math.random() * this.state.delayPointsMax;
    }
    if (this.state.isOpened === false) {
      this.open();
    } else {
      this.close();
    }
  };

  open() {
    this.setState({ isOpened: true });
    this.refs["shape-overlays"].classList.add("is-opened");
    this.setState({ timeStart: Date.now() });
    this.renderLoop();
  }

  close() {
    this.setState({ isOpened: false });
    this.refs["shape-overlays"].classList.remove("is-opened");
    this.setState({ timeStart: Date.now() });
    this.renderLoop();
  }

  renderLoop = () => {
    this.update();
    if (
      Date.now() - this.timeStart <
      this.state.duration +
        this.state.delayPerPath * (this.state.path.length - 1) +
        this.state.delayPointsMax
    ) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    } else {
      this.setState({ isAnimating: false });
    }
  };

  updatePath = time => {
    const points = [];
    for (let i = 0; i < this.state.numPoints; i++) {
      points[i] =
        (1 -
          ease.cubicInOut(
            Math.min(Math.max(time - this.state.delayPointsArray[i], 0) / this.state.duration, 1)
          )) *
        100;
    }

    let str = "";
    str += this.state.isOpened ? `M 0 0 V ${points[0]}` : `M 0 ${points[0]}`;
    for (let i = 0; i < this.state.numPoints - 1; i++) {
      const p = ((i + 1) / (this.state.numPoints - 1)) * 100;
      const cp = p - ((1 / (this.state.numPoints - 1)) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
    }
    str += this.state.isOpened ? `V 100 H 0` : `V 0 H 0`;
    return str;
  };

  update = () => {
    if (this.state.isOpened) {
      for (let i = 0; i < this.state.path.length; i++) {
        this.state.path[i].setAttribute(
          "d",
          this.updatePath(Date.now() - (this.state.timeStart + this.state.delayPerPath * i))
        );
      }
    } else {
      for (let i = 0; i < this.state.path.length; i++) {
        this.state.path[i].setAttribute(
          "d",
          this.updatePath(
            Date.now() -
              (this.state.timeStart + this.state.delayPerPath * (this.state.path.length - i - 1))
          )
        );
      }
    }
  };

  render() {
    return (
      <div className="mobileMenu demo-6">
        <div className="content">
          <div
            className="hamburger"
            ref={"hamburger"}
            onClick={() => {
              const gNavItems = this.refs["global-menu"].querySelectorAll(".global-menu__item");
              if (this.state.isAnimating) return false;
              this.toggle();
              if (this.state.isOpened) {
                this.refs.hamburger.classList.add("is-open-navi");
                for (let i = 0; i < gNavItems.length; i++) {
                  gNavItems[i].classList.add("is-opened");
                }
              } else {
                this.refs.hamburger.classList.remove("is-opened-navi");
                for (let i = 0; i < gNavItems.length; i++) {
                  gNavItems[i].classList.remove("is-opened");
                }
              }
            }}>
            <div className="hamburger__line hamburger__line--01">
              <div className="hamburger__line-in hamburger__line-in--01" />
            </div>
            <div className="hamburger__line hamburger__line--02">
              <div className="hamburger__line-in hamburger__line-in--02" />
            </div>
            <div className="hamburger__line hamburger__line--03">
              <div className="hamburger__line-in hamburger__line-in--03" />
            </div>
            <div className="hamburger__line hamburger__line--cross01">
              <div className="hamburger__line-in hamburger__line-in--cross01" />
            </div>
            <div className="hamburger__line hamburger__line--cross02">
              <div className="hamburger__line-in hamburger__line-in--cross02" />
            </div>
          </div>
          <div className="global-menu" ref={"global-menu"}>
            <div>
              <a className="global-menu__item global-menu__item--demo-6" href="#">
                Data Science
              </a>
              <a className="global-menu__item global-menu__item--demo-6" href="#">
                Research
              </a>
              <a className="global-menu__item global-menu__item--demo-6" href="#">
                Case Studies
              </a>
              <a className="global-menu__item global-menu__item--demo-6" href="#">
                Contact
              </a>
            </div>
          </div>
          <svg
            className="shape-overlays"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            ref={"shape-overlays"}>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00c99b" />
                <stop offset="100%" stopColor="#ff0ea1" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffd392" />
                <stop offset="100%" stopColor="#ff3898" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#110046" />
                <stop offset="100%" stopColor="#32004a" />
              </linearGradient>
            </defs>
            <path className="shape-overlays__path" />
            <path className="shape-overlays__path" />
            <path className="shape-overlays__path" />
          </svg>
        </div>
      </div>
    );
  }
}

export default HamburgerMenu;
