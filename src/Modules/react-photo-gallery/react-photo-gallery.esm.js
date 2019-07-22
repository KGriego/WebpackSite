import React, { useState, useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

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

function _objectSpread(target) {
  for (let i = 1; i < arguments.length; i++) {
    let source = arguments[i] != null ? arguments[i] : {};
    let ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  let target = {};
  let sourceKeys = Object.keys(source);
  let key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  let target = _objectWithoutPropertiesLoose(source, excluded);

  let key, i;

  if (Object.getOwnPropertySymbols) {
    let sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  let _arr = [];
  let _n = true;
  let _d = false;
  let _e = undefined;

  try {
    for (
      let _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

let imgWithClick = { cursor: "pointer" };

let Photo = function Photo(_ref) {
  let index = _ref.index,
    onClick = _ref.onClick,
    photo = _ref.photo,
    margin = _ref.margin,
    direction = _ref.direction,
    top = _ref.top,
    left = _ref.left,
    key = _ref.key;
  let imgStyle = { margin: margin, display: "block" };

  if (direction === "column") {
    imgStyle.position = "absolute";
    imgStyle.left = left;
    imgStyle.top = top;
  }

  let handleClick = function handleClick(event) {
    onClick(event, { photo, index });
  };

  return React.createElement(
    "img",
    _extends(
      {
        key,
        style: onClick ? _objectSpread({}, imgStyle, imgWithClick) : imgStyle
      },
      photo,
      { onClick: onClick ? handleClick : null }
    )
  );
};

let photoPropType = PropTypes.shape({
  key: PropTypes.string,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
  srcSet: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  sizes: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
});
Photo.propTypes = {
  direction: PropTypes.string,
  index: PropTypes.number.isRequired,
  left: function left(props) {
    if (props.direction === "column" && typeof props.left !== "number") {
      return new Error(
        "left is a required number when direction is set to `column`"
      );
    }
  },
  margin: PropTypes.number,
  onClick: PropTypes.func,
  photo: photoPropType.isRequired,
  top: function top(props) {
    if (props.direction === "column" && typeof props.top !== "number") {
      return new Error(
        "top is a required number when direction is set to `column`"
      );
    }
  }
};

let round = function round(value, decimals) {
  if (!decimals) decimals = 0;
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};

let computeColumnLayout = function computeColumnLayout(_ref) {
  let photos = _ref.photos,
    columns = _ref.columns,
    containerWidth = _ref.containerWidth,
    margin = _ref.margin;
  // calculate each colWidth based on total width and column amount
  let colWidth = (containerWidth - margin * 2 * columns) / columns; // map through each photo to assign adjusted height and width based on colWidth

  let photosWithSizes = photos.map(function (photo) {
    let newHeight = (photo.height / photo.width) * colWidth;
    return _objectSpread({}, photo, {
      width: round(colWidth, 1),
      height: round(newHeight, 1)
    });
  }); // store all possible left positions
  // and current top positions for each column

  let colLeftPositions = [];
  let colCurrTopPositions = [];

  for (let i = 0; i < columns; i++) {
    colLeftPositions[i] = round(i * (colWidth + margin * 2), 1);
    colCurrTopPositions[i] = 0;
  } // map through each photo, then reduce thru each "column"
  // find column with the smallest height and assign to photo's 'top'
  // update that column's height with this photo's height

  let photosPositioned = photosWithSizes.map(function (photo) {
    let smallestCol = colCurrTopPositions.reduce(function (acc, item, i) {
      acc = item < colCurrTopPositions[acc] ? i : acc;
      return acc;
    }, 0);
    photo.top = colCurrTopPositions[smallestCol];
    photo.left = colLeftPositions[smallestCol];
    colCurrTopPositions[smallestCol] =
      colCurrTopPositions[smallestCol] + photo.height + margin * 2; // store the tallest col to use for gallery height because of abs positioned elements

    let tallestCol = colCurrTopPositions.reduce(function (acc, item, i) {
      acc = item > colCurrTopPositions[acc] ? i : acc;
      return acc;
    }, 0);
    photo.containerHeight = colCurrTopPositions[tallestCol];
    return photo;
  });
  return photosPositioned;
};

let ratio = function ratio(_ref) {
  let width = _ref.width,
    height = _ref.height;
  return round(width / height, 2);
};

/*
Copyright 2007-2013 Marijn Haverbeke frin "Eloquent Javascript, 1st Edition"

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}
BinaryHeap.prototype = {
  push: function push(element) {
    // Add the new element to the end of the array.
    this.content.push(element); // Allow it to bubble up.

    this.bubbleUp(this.content.length - 1);
  },
  pop: function pop() {
    // Store the first element so we can return it later.
    let result = this.content[0]; // Get the element at the end of the array.

    let end = this.content.pop(); // If there are any elements left, put the end element at the
    // start, and let it sink down.

    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }

    return result;
  },
  remove: function remove(node) {
    let length = this.content.length; // To remove a value, we must search through the array to find
    // it.

    for (let i = 0; i < length; i++) {
      if (this.content[i] != node) continue; // When it is found, the process seen in 'pop' is repeated
      // to fill up the hole.

      let end = this.content.pop(); // If the element we popped was the one we needed to remove,
      // we're done.

      if (i == length - 1) break; // Otherwise, we replace the removed element with the popped
      // one, and allow it to float up or sink down as appropriate.

      this.content[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  },
  size: function size() {
    return this.content.length;
  },
  bubbleUp: function bubbleUp(n) {
    // Fetch the element that has to be moved.
    let element = this.content[n],
      score = this.scoreFunction(element); // When at 0, an element can not go up any further.

    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      let parentN = Math.floor((n + 1) / 2) - 1,
        parent = this.content[parentN]; // If the parent has a lesser score, things are in order and we
      // are done.

      if (score >= this.scoreFunction(parent)) break; // Otherwise, swap the parent with the current element and
      // continue.

      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  },
  sinkDown: function sinkDown(n) {
    // Look up the target element and its score.
    let length = this.content.length,
      element = this.content[n],
      elemScore = this.scoreFunction(element);

    while (true) {
      // Compute the indices of the child elements.
      let child2N = (n + 1) * 2,
        child1N = child2N - 1; // This is used to store the new position of the element,
      // if any.

      let swap = null; // If the first child exists (is inside the array)...

      if (child1N < length) {
        // Look it up and compute its score.
        let child1 = this.content[child1N],
          child1Score = this.scoreFunction(child1); // If the score is less than our element's, we need to swap.

        if (child1Score < elemScore) swap = child1N;
      } // Do the same checks for the other child.

      if (child2N < length) {
        let child2 = this.content[child2N],
          child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child2Score))
          swap = child2N;
      } // No need to swap further, we are done.

      if (swap == null) break; // Otherwise, swap and continue.

      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
};

let buildPrecedentsMap = function buildPrecedentsMap(
  graph,
  startNode,
  endNode
) {
  // store the previous vertex of the shortest path of arrival
  let precedentsMap = {}; // store nodes already visited

  let visited = {}; // store/update only the shortest edge weights measured
  // the purpose of this is object is constant time lookup vs. binary heap lookup O(n)

  let storedShortestPaths = {};
  storedShortestPaths[startNode] = 0; // priority queue of ALL nodes and storedShortestPaths
  // don't bother to delete them because it's faster to look at visited?

  let pQueue = new BinaryHeap(function (n) {
    return n.weight;
  });
  pQueue.push({
    id: startNode,
    weight: 0
  });

  while (pQueue.size()) {
    // pop node with shortest total weight from start node
    let shortestNode = pQueue.pop();
    let shortestNodeId = shortestNode.id; // if already visited, continue

    if (visited[shortestNodeId]) continue; // visit neighboring nodes

    let neighboringNodes = graph(shortestNodeId) || {};
    visited[shortestNodeId] = 1; // meet the neighbors, looking for shorter paths

    for (let neighbor in neighboringNodes) {
      // weight of path from startNode to this neighbor
      let newTotalWeight = shortestNode.weight + neighboringNodes[neighbor]; // if this is the first time meeting the neighbor OR if the new total weight from
      // start node to this neighbor node is greater than the old weight path, update it,
      // and update precedent node

      if (
        typeof storedShortestPaths[neighbor] === "undefined" ||
        storedShortestPaths[neighbor] > newTotalWeight
      ) {
        storedShortestPaths[neighbor] = newTotalWeight;
        pQueue.push({
          id: neighbor,
          weight: newTotalWeight
        });
        precedentsMap[neighbor] = shortestNodeId;
      }
    }
  }

  if (typeof storedShortestPaths[endNode] === "undefined") {
    throw new Error(
      "There is no path from ".concat(startNode, " to ").concat(endNode)
    );
  }

  return precedentsMap;
}; // build the route from precedent node vertices

let getPathFromPrecedentsMap = function getPathFromPrecedentsMap(
  precedentsMap,
  endNode
) {
  let nodes = [];
  let n = endNode;
  let precedent;

  while (n) {
    nodes.push(n);
    precedent = precedentsMap[n];
    n = precedentsMap[n];
  }

  return nodes.reverse();
}; // build the precedentsMap and find the shortest path from it

let findShortestPath = function findShortestPath(graph, startNode, endNode) {
  let precedentsMap = buildPrecedentsMap(graph, startNode, endNode);
  return getPathFromPrecedentsMap(precedentsMap, endNode);
};

// to calculate the single best layout using Dijkstra's findShortestPat
// get the height for a set of photos in a potential row

let getCommonHeight = function getCommonHeight(row, containerWidth, margin) {
  let rowWidth = containerWidth - row.length * (margin * 2);
  let totalAspectRatio = row.reduce(function (acc, photo) {
    return acc + ratio(photo);
  }, 0);
  return rowWidth / totalAspectRatio;
}; // calculate the cost of breaking at this node (edge weight)

let cost = function cost(photos, i, j, width, targetHeight, margin) {
  let row = photos.slice(i, j);
  let commonHeight = getCommonHeight(row, width, margin);
  return Math.pow(Math.abs(commonHeight - targetHeight), 2);
}; // return function that gets the neighboring nodes of node and returns costs

let makeGetNeighbors = function makeGetNeighbors(
  targetHeight,
  containerWidth,
  photos,
  limitNodeSearch,
  margin
) {
  return function (start) {
    let results = {};
    start = +start;
    results[+start] = 0;

    for (let i = start + 1; i < photos.length + 1; ++i) {
      if (i - start > limitNodeSearch) break;
      results[i.toString()] = cost(
        photos,
        start,
        i,
        containerWidth,
        targetHeight,
        margin
      );
    }

    return results;
  };
};

let computeRowLayout = function computeRowLayout(_ref) {
  let containerWidth = _ref.containerWidth,
    limitNodeSearch = _ref.limitNodeSearch,
    targetRowHeight = _ref.targetRowHeight,
    margin = _ref.margin,
    photos = _ref.photos;
  // const t = +new Date();
  let getNeighbors = makeGetNeighbors(
    targetRowHeight,
    containerWidth,
    photos,
    limitNodeSearch,
    margin
  );
  let path = findShortestPath(getNeighbors, "0", photos.length);
  path = path.map(function (node) {
    return +node;
  }); // console.log(`time to find the shortest path: ${(+new Date() - t)} ms`);

  for (let i = 1; i < path.length; ++i) {
    let row = photos.slice(path[i - 1], path[i]);
    let height = getCommonHeight(row, containerWidth, margin);

    for (let j = path[i - 1]; j < path[i]; ++j) {
      photos[j].width = round(height * ratio(photos[j]), 1);
      photos[j].height = height;
    }
  }

  return photos;
};

// the aspect ratio of the container with images having an avg AR of 1.5
// as the minimum amount of photos per row, plus some nodes

let findIdealNodeSearch = function findIdealNodeSearch(_ref) {
  let targetRowHeight = _ref.targetRowHeight,
    containerWidth = _ref.containerWidth;
  let rowAR = containerWidth / targetRowHeight;
  return round(rowAR / 1.5) + 8;
};

let Gallery = React.memo(function Gallery(_ref) {
  let photos = _ref.photos,
    onClick = _ref.onClick,
    direction = _ref.direction,
    margin = _ref.margin,
    limitNodeSearch = _ref.limitNodeSearch,
    targetRowHeight = _ref.targetRowHeight,
    columns = _ref.columns,
    renderImage = _ref.renderImage;

  let _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    containerWidth = _useState2[0],
    setContainerWidth = _useState2[1];

  let galleryEl = useRef(null);
  useLayoutEffect(function () {
    let animationFrameID = null;
    let observer = new ResizeObserver(function (entries) {
      // only do something if width changes
      let newWidth = entries[0].contentRect.width;

      if (containerWidth !== newWidth) {
        // put in an animation frame to stop "benign errors" from
        // ResizObserver https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
        animationFrameID = window.requestAnimationFrame(function () {
          setContainerWidth(Math.floor(newWidth));
        });
      }
    });
    observer.observe(galleryEl.current);
    return function () {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  let handleClick = function handleClick(event, _ref2) {
    let index = _ref2.index;
    onClick(event, {
      index: index,
      photo: photos[index],
      previous: photos[index - 1] || null,
      next: photos[index + 1] || null
    });
  }; // no containerWidth until after first render with refs, skip calculations and render nothing

  if (!containerWidth)
    return React.createElement("div", { ref: galleryEl }, "\xA0"); // subtract 1 pixel because the browser may round up a pixel

  let width = containerWidth - 1;
  let galleryStyle, thumbs;

  if (direction === "row") {
    // allow user to calculate limitNodeSearch from containerWidth
    if (typeof limitNodeSearch === "function") {
      limitNodeSearch = limitNodeSearch(containerWidth);
    }

    if (typeof targetRowHeight === "function") {
      targetRowHeight = targetRowHeight(containerWidth);
    } // set how many neighboring nodes the graph will visit

    if (limitNodeSearch === undefined) {
      limitNodeSearch = 2;

      if (containerWidth >= 450) {
        limitNodeSearch = findIdealNodeSearch({
          containerWidth: containerWidth,
          targetRowHeight: targetRowHeight
        });
      }
    }

    galleryStyle = { display: "flex", flexWrap: "wrap", flexDirection: "row" };
    thumbs = computeRowLayout({
      containerWidth: width,
      limitNodeSearch,
      targetRowHeight,
      margin,
      photos
    });
  }

  if (direction === "column") {
    // allow user to calculate columns from containerWidth
    if (typeof columns === "function") {
      columns = columns(containerWidth);
    } // set default breakpoints if user doesn't specify columns prop

    if (columns === undefined) {
      columns = 1;
      if (containerWidth >= 500) columns = 2;
      if (containerWidth >= 900) columns = 3;
      if (containerWidth >= 1500) columns = 4;
    }

    galleryStyle = { position: "relative" };
    thumbs = computeColumnLayout({
      containerWidth: width,
      columns,
      margin,
      photos
    });
    galleryStyle.height = thumbs[thumbs.length - 1].containerHeight;
  }

  let renderComponent = renderImage || Photo;
  return React.createElement(
    "div",
    { className: "react-photo-gallery--gallery" },
    React.createElement(
      "div",
      { ref: galleryEl, style: galleryStyle, className: "ui cards" },
      thumbs.map(function (thumb, index) {
        let left = thumb.left,
          top = thumb.top,
          containerHeight = thumb.containerHeight,
          photo = _objectWithoutProperties(thumb, [
            "left",
            "top",
            "containerHeight"
          ]);
        return renderComponent({
          left,
          top,
          key: thumb.key || thumb.src,
          containerHeight,
          index,
          margin,
          direction,
          onClick: onClick ? handleClick : null,
          photo
        });
      })
    )
  );
});
Gallery.propTypes = {
  columns: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  direction: PropTypes.string,
  limitNodeSearch: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  margin: PropTypes.number,
  onClick: PropTypes.func,
  photos: PropTypes.arrayOf(photoPropType).isRequired,
  renderImage: PropTypes.func,
  targetRowHeight: PropTypes.oneOfType([PropTypes.func, PropTypes.number])
};
Gallery.defaultProps = {
  margin: 2,
  direction: "row",
  targetRowHeight: 300
};

export default Gallery;
export { Photo };
