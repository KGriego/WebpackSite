import React, { useState, useEffect, useRef } from "react";

let roundNum = function (num) {
  return Math.round(num * 1000) / 1000;
};
// https://stackoverflow.com/a/16655847/2255980
let isNumeric = function (num) {
  return Number(parseFloat(num)) == num;
};

// Inspired by Dave DeSandro's (@desandro) work on Practical UI Physics
// https://www.youtube.com/watch?v=90oMnMFozEE
// https://codepen.io/desandro/pen/QbPKEq
let applyForce = function (_a) {
  let velocityX = _a.velocityX,
    force = _a.force;
  return velocityX + force;
};
let applyDragForce = function (_a) {
  let isDragging = _a.isDragging,
    dragPosition = _a.dragPosition,
    nativePosition = _a.nativePosition,
    velocityX = _a.velocityX;
  if (!isDragging) return velocityX;
  let dragVelocity = dragPosition - nativePosition;
  let dragForce = dragVelocity - velocityX;
  return velocityX + dragForce;
};
let applyBoundForce = function (_a) {
  let bound = _a.bound,
    edge = _a.edge,
    nativePosition = _a.nativePosition,
    friction = _a.friction,
    velocityX = _a.velocityX;
  // bouncing past bound
  let distance = bound - nativePosition;
  let force = distance * (1 - friction);
  // calculate resting position with this force
  let rest = nativePosition + (velocityX + force) / (1 - friction);
  // apply force if resting position is out of bounds
  if ((edge === "right" && rest > bound) || (edge === "left" && rest < bound)) {
    return applyForce({ velocityX: velocityX, force: force });
  } else {
    // if in bounds, apply force to align at bounds
    force = distance * (1 - friction) - velocityX;
    return applyForce({ velocityX: velocityX, force: force });
  }
};

let getBoundaries = function (_a) {
  let outerWidth = _a.outerWidth,
    outerHeight = _a.outerHeight,
    innerWidth = _a.innerWidth,
    innerHeight = _a.innerHeight,
    elClientLeft = _a.elClientLeft,
    elClientTop = _a.elClientTop;
  let innerWidthIsLessThanOuterWidth = innerWidth < outerWidth;
  let innerHeightIsLessThanOuterHeight = innerHeight < outerHeight;
  let leftEdge = elClientLeft;
  let topEdge = elClientTop;
  let rightEdge = -innerWidth + outerWidth;
  let bottomEdge = -innerHeight + outerHeight;
  return {
    left: innerWidthIsLessThanOuterWidth ? leftEdge : rightEdge,
    right: innerWidthIsLessThanOuterWidth ? rightEdge : leftEdge,
    top: innerHeightIsLessThanOuterHeight ? topEdge : bottomEdge,
    bottom: innerHeightIsLessThanOuterHeight ? bottomEdge : topEdge
  };
};

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  let insertAt = ref.insertAt;

  if (!css || typeof document === "undefined") {
    return;
  }

  let head = document.head || document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.type = "text/css";

  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

let css =
  ".styles_outer__abXQX {\n  cursor: grab;\n}\n\n.styles_inner__x-amJ {\n  white-space: nowrap;\n  user-select: none;\n  -webkit-overflow-scrolling: touch;\n  will-change: transform;\n  display: inline-block;\n}\n\n.styles_isDragging__dh9eX {\n  cursor: grabbing;\n}\n";
let styles = {
  outer: "styles_outer__abXQX",
  inner: "styles_inner__x-amJ",
  isDragging: "styles_isDragging__dh9eX"
};
styleInject(css);

let defaultProps = {
  disabled: false,
  friction: 0.92
};
let Dragger = function (props) {
  const { friction, disabled, children, style, className } = props;
  let docStyle = document.documentElement.style;
  let settings = useRef({ friction });
  // DOM element refs
  let outerEl = useRef(null);
  let innerEl = useRef(null);
  // Dimensions
  let outerWidth = useRef(0);
  let outerHeight = useRef(0);
  let innerWidth = useRef(0);
  let innerHeight = useRef(0);
  let leftBound = useRef(0);
  let rightBound = useRef(0);
  let topBound = useRef(0);
  let bottomBound = useRef(0);
  // User input states
  let isDragging = useRef(false); // doesn't update render
  let _a = useState(false),
    isDraggingStyle = _a[0],
    setIsDraggingStyle = _a[1]; // does update render
  let inputType = useRef(""); // mouse or touch
  // Dragging state
  let restPositionX = useRef(0);
  let velocityX = useRef(0);
  let downX = useRef(0);
  let dragStartPosition = useRef(0);
  let nativePosition = useRef(0); // starting position
  let dragPosition = useRef(nativePosition.current);
  let rafId = useRef(null);
  // componentDidMount
  useEffect(
    function () {
      outerWidth.current = outerEl.current.scrollWidth;
      outerHeight.current = outerEl.current.scrollHeight;
      innerWidth.current = innerEl.current.scrollWidth;
      innerHeight.current = innerEl.current.scrollHeight;
      let _a = getBoundaries({
          outerWidth: outerWidth.current,
          outerHeight: outerHeight.current,
          innerWidth: innerWidth.current,
          innerHeight: innerHeight.current,
          elClientLeft: outerEl.current && outerEl.current.clientLeft,
          elClientTop: outerEl.current && outerEl.current.clientTop
        }),
        left = _a.left,
        right = _a.right,
        top = _a.top,
        bottom = _a.bottom;
      leftBound.current = left;
      rightBound.current = right;
      topBound.current = top;
      bottomBound.current = bottom;
      // Update the edge boundaries when the outer element is resized
      // Update the inner width when the children change size
      // Check first if ResizeObserver is available on the window or if a polyfill is supplied by the user via props
      if (window.ResizeObserver && !props.ResizeObserver) {
        throw new Error(
          "No ResizeObserver is available. Please check the docs for instructions on how to add a polyfill."
        );
      }
      let Ro = window.ResizeObserver || props.ResizeObserver;
      // address the 'any' typing of entries
      let observer = new Ro(function (entries) {
        // use the elements data-id to determine whether the inner or the outer has been observed
        let id = entries[0].target.dataset.id;
        if (id === "Dragger-inner")
          innerWidth.current = entries[0].contentRect.width;
        if (id === "Dragger-outer")
          outerWidth.current = entries[0].contentRect.width;
        let _a = getBoundaries({
            outerWidth: outerWidth.current,
            outerHeight: outerHeight.current,
            innerWidth: innerWidth.current,
            innerHeight: innerHeight.current,
            elClientLeft: outerEl.current && outerEl.current.clientLeft,
            elClientTop: outerEl.current && outerEl.current.clientTop
          }),
          left = _a.left,
          right = _a.right,
          top = _a.top,
          bottom = _a.bottom;
        leftBound.current = left;
        rightBound.current = right;
        topBound.current = top;
        bottomBound.current = bottom;
        // broadcast onFrame event on component mount, as well as when the inner or outer elements change size
        if (props.onFrame) {
          props.onFrame({
            x: roundNum(nativePosition.current),
            outerWidth: outerWidth.current,
            innerWidth: innerWidth.current,
            progress: roundNum(
              nativePosition.current / (outerWidth.current - innerWidth.current)
            )
          });
        }
        // if a draggerRef has been provided, broadcast changes to it as well
        // and make the setPosition function available
        if (props.draggerRef) {
          props.draggerRef({
            setPosition: setPosition,
            outerWidth: outerWidth.current,
            innerWidth: innerWidth.current
          });
        }
      });
      observer.observe(outerEl.current);
      observer.observe(innerEl.current);
    },
    [disabled]
  ); // keep track of whether the component is disabled
  // componentDidUpdate
  useEffect(
    function () {
      if (props.friction) {
        settings.current = { friction: props.friction };
      }
    },
    [friction]
  );
  // setPosition is exposed via ref
  function setPosition(position) {
    if (props.disabled) return;
    let finalPosition = Math.min(
      Math.max(leftBound.current, position),
      rightBound.current
    );
    window.cancelAnimationFrame(rafId.current); // cancel any existing loop
    rafId.current = window.requestAnimationFrame(function () {
      updateLoop(finalPosition);
    }); // kick off a new loop
  }
  function updateLoop(optionalFinalPosition) {
    velocityX.current *= settings.current.friction;
    // if a number is provided as a param (optionalFinalPosition), move to that position
    if (isNumeric(optionalFinalPosition)) {
      let distance = optionalFinalPosition - nativePosition.current;
      let force =
        distance * (1 - settings.current.friction) - velocityX.current;
      velocityX.current = applyForce({
        velocityX: velocityX.current,
        force: force
      });
    } else {
      if (!isDragging.current && nativePosition.current < leftBound.current) {
        velocityX.current = applyBoundForce({
          bound: leftBound.current,
          edge: "left",
          nativePosition: nativePosition.current,
          friction: settings.current.friction,
          velocityX: velocityX.current
        });
      }
      if (!isDragging.current && nativePosition.current > rightBound.current) {
        velocityX.current = applyBoundForce({
          bound: rightBound.current,
          edge: "right",
          nativePosition: nativePosition.current,
          friction: settings.current.friction,
          velocityX: velocityX.current
        });
      }
    }
    velocityX.current = applyDragForce({
      isDragging: isDragging.current,
      dragPosition: dragPosition.current,
      nativePosition: nativePosition.current,
      velocityX: velocityX.current
    });
    nativePosition.current += velocityX.current;
    let isInfinitesimal = roundNum(Math.abs(velocityX.current)) < 0.001;
    if (!isDragging.current && isInfinitesimal) {
      // no longer dragging and inertia has stopped
      window.cancelAnimationFrame(rafId.current);
      restPositionX.current = roundNum(nativePosition.current);
    } else {
      // bypass Reacts render method during animation, similar to react-spring
      innerEl.current.style.transform =
        "translate3d(" + roundNum(nativePosition.current) + "px,0,0)";
      rafId.current = window.requestAnimationFrame(function () {
        updateLoop(null);
      });
    }
    if (props.onFrame) {
      props.onFrame({
        x: roundNum(nativePosition.current),
        outerWidth: outerWidth.current,
        innerWidth: innerWidth.current,
        progress: roundNum(
          nativePosition.current / (outerWidth.current - innerWidth.current)
        )
      });
    }
  }
  // address 'any' typing of event // MouseEvent does not have property 'touches'
  function onMove(e) {
    let x = inputType.current === "mouse" ? e.pageX : e.touches[0].pageX;
    let moveVector = x - downX.current;
    // gradually increase friction as the dragger is pulled beyond bounds
    // credit: https://github.com/metafizzy/flickity/blob/master/dist/flickity.pkgd.js#L2894
    let dragX = dragStartPosition.current + moveVector;
    let originBound = Math.max(rightBound.current, dragStartPosition.current);
    dragX = dragX > originBound ? (dragX + originBound) * 0.5 : dragX;
    let endBound = Math.min(leftBound.current, dragStartPosition.current);
    dragX = dragX < endBound ? (dragX + endBound) * 0.5 : dragX;
    dragPosition.current = dragX;
  }
  function onRelease(e) {
    isDragging.current = false;
    setIsDraggingStyle(false);
    // if the slider hasn't dragged sufficiently treat it as a static click
    let moveVector = Math.abs(downX.current - e.pageX);
    if (moveVector < 20 && props.onStaticClick) {
      props.onStaticClick(e.target);
    }
    // Update html element styles
    docStyle.cursor = "";
    docStyle.userSelect = "";
    if (inputType.current === "mouse") {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onRelease);
    } else {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onRelease);
    }
  }
  function onStart(e) {
    if (props.disabled) return;
    // dismiss clicks from right or middle buttons
    // (credit: https://github.com/metafizzy/flickity/blob/e2706840532c0ce9c4fc25832e810ad4f9823b61/dist/flickity.pkgd.js#L2176)
    let mouseButton = e.button;
    if (mouseButton && (mouseButton !== 0 && mouseButton !== 1)) return;
    isDragging.current = true;
    setIsDraggingStyle(true);
    window.cancelAnimationFrame(rafId.current); // cancel any existing loop
    rafId.current = window.requestAnimationFrame(function () {
      updateLoop(null);
    }); // kick off a new loop
    // Update <html> element styles
    docStyle.cursor = "grabbing";
    docStyle.userSelect = "none";
    inputType.current = e.type === "mousedown" ? "mouse" : "touch";
    downX.current =
      inputType.current === "mouse" ? e.pageX : e.touches[0].pageX;
    dragStartPosition.current = nativePosition.current;
    // initial onMove needed to set the starting mouse position
    onMove(e);
    if (inputType.current === "mouse") {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onRelease);
    } else if (inputType.current === "touch") {
      window.addEventListener("touchmove", onMove);
      window.addEventListener("touchend", onRelease);
    }
  }
  return React.createElement(
    "div",
    {
      "data-id": "Dragger-outer",
      ref: outerEl,
      className:
        styles.outer +
        " " +
        (isDraggingStyle ? styles.isDragging : "") +
        (disabled ? " is-disabled" : "") +
        " " +
        className,
      onTouchStart: onStart,
      onMouseDown: onStart,
      style: style
    },
    React.createElement(
      "div",
      {
        "data-id": "Dragger-inner",
        ref: innerEl,
        className: styles.inner + " dragger-inner",
        style: { transform: "translateX(" + restPositionX.current + "px)" }
      },
      children
    )
  );
};
Dragger.defaultProps = defaultProps;

export default Dragger;
//# sourceMappingURL=index.es.js.map
