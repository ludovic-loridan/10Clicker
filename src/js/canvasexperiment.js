'use strict';

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var RADIUS = 20;
var PADDING = 10;

// coordinate system
var TOP = PADDING;
var BOTTOM = canvas.height - PADDING;
var LEFT = PADDING;
var RIGHT = canvas.width - PADDING;

// points
var CTL = { x: LEFT + RADIUS, y: TOP + RADIUS };
var CTR = { x: RIGHT - RADIUS, y: TOP + RADIUS };
var CBL = { x: LEFT + RADIUS, y: BOTTOM - RADIUS };
var CBR = { x: RIGHT - RADIUS, y: BOTTOM - RADIUS };

// lines and arcs
var strokes = [{
  name: 'Top ML',
  type: 'line',
  x1: (RIGHT + LEFT) / 2, x2: CTL.x,
  y1: TOP, y2: TOP
}, {
  name: 'Top Left',
  type: 'arc',
  center: CTL,
  angle: { start: -Math.PI / 2, end: -Math.PI }
}, {
  name: 'Left',
  type: 'line',
  x1: LEFT, x2: LEFT,
  y1: CTL.y, y2: CBL.y
}, {
  name: 'Bottom Left',
  type: 'arc',
  center: CBL,
  angle: { start: Math.PI, end: Math.PI / 2 }
}, {
  name: 'Bottom',
  type: 'line',
  x1: CBL.x, x2: CBR.x,
  y1: BOTTOM, y2: BOTTOM
}, {
  name: 'Bottom Right',
  type: 'arc',
  center: CBR,
  angle: { start: Math.PI / 2, end: 0 }
}, {
  name: 'Right',
  type: 'line',
  x1: RIGHT, x2: RIGHT,
  y1: CBR.y, y2: CTR.y
}, {
  name: 'Top Right',
  type: 'arc',
  center: CTR,
  angle: { start: 0, end: -Math.PI / 2 }
}, {
  name: 'Top RM',
  type: 'line',
  x1: CTR.x, x2: (RIGHT + LEFT) / 2,
  y1: TOP, y2: TOP
}];

//
// Drawing functions
//

function drawLine(ctx, line, ratio) {
  if (ratio > 0) {
    // weights towards the points
    var w1 = 1 - ratio;
    var w2 = ratio;

    var xe = line.x1 * w1 + line.x2 * w2;
    var ye = line.y1 * w1 + line.y2 * w2;
    ctx.lineTo(xe, ye);
  }
}

function drawArc(ctx, arc, ratio) {
  if (ratio > 0) {
    var w1 = 1 - ratio;
    var w2 = ratio;

    var arcEnd = w1 * arc.angle.start + w2 * arc.angle.end;
    ctx.arc(arc.center.x, arc.center.y, RADIUS, arc.angle.start, arcEnd, true);
  }
}

function drawStroke(ctx, stroke, ratio) {
  if (stroke.type === 'line') {
    drawLine(ctx, stroke, ratio);
  } else if (stroke.type === 'arc') {
    drawArc(ctx, stroke, ratio);
  }
}

//
// Maths functions
//
function getLineLength(_ref) {
  var x1 = _ref.x1,
      x2 = _ref.x2,
      y1 = _ref.y1,
      y2 = _ref.y2;

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getArcLength(arc) {
  var ratio = Math.abs(arc.angle.start - arc.angle.end) / (2 * Math.PI);
  return ratio * (2 * Math.PI * RADIUS);
}

function getStrokeLength(stroke) {
  if (stroke.type === 'line') {
    return getLineLength(stroke);
  } else if (stroke.type === 'arc') {
    return getArcLength(stroke);
  }
};

//
// Ratio utilities
//

function computeRatios(strokes, ratio) {
  var strokeLengths = strokes.map(getStrokeLength);
  var totalLength = strokeLengths.reduce(function (acc, val) {
    return acc + val;
  });
  var desiredLength = totalLength * ratio;

  // todo : might try to find a functional version
  var remainingLength = desiredLength;
  var ratios = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = strokeLengths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      strokeLength = _step.value;

      if (strokeLength <= remainingLength) {
        ratios.push(1);
        remainingLength -= strokeLength;
      } else {
        ratios.push(remainingLength / strokeLength);
        remainingLength = 0;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return ratios;
}

// ratio = [0..1]
function draw(completionRatio) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(strokes[0].x1, strokes[0].y1);
  var ratios = computeRatios(strokes, completionRatio);
  console.log(ratios);
  strokes.map(function (stroke, idx) {
    return drawStroke(ctx, stroke, ratios[idx]);
  });
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgba(0,153,255,0.8)';
  ctx.lineCap = 'round';
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 4;
  ctx.shadowColor = 'green';

  var gradient = ctx.createLinearGradient(0, 0, 200, 0);
  gradient.addColorStop(0, 'green');
  gradient.addColorStop(1, 'green');
  ctx.strokeStyle = gradient;
  ctx.stroke();
}

var theRatio = 1;
setInterval(function () {
  draw(theRatio);
  theRatio -= 0.002;
  if (theRatio < 0) {
    theRatio = 1;
  }
}, 2);