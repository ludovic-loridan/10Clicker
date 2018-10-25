

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const RADIUS = 20;
const PADDING = 10;

// coordinate system
const TOP = PADDING;
const BOTTOM = canvas.height - PADDING;
const LEFT = PADDING;
const RIGHT = canvas.width - PADDING;

// points
const CTL = {x: LEFT + RADIUS, y: TOP + RADIUS};
const CTR = {x: RIGHT - RADIUS, y: TOP + RADIUS};
const CBL = {x: LEFT + RADIUS, y: BOTTOM - RADIUS};
const CBR = {x: RIGHT - RADIUS, y: BOTTOM - RADIUS};


// lines and arcs
const strokes = [
  {
    name: 'Top ML',
    type: 'line',
    x1: (RIGHT + LEFT) / 2, x2: CTL.x,
    y1: TOP, y2: TOP
  },
  {
    name: 'Top Left',
    type: 'arc',
    center: CTL,
    angle: {start: -Math.PI/2, end: -Math.PI}
  },
  {
    name: 'Left',
    type: 'line',
    x1: LEFT, x2: LEFT,
    y1: CTL.y, y2: CBL.y
  },
  {
    name: 'Bottom Left',
    type: 'arc',
    center: CBL,
    angle: {start: Math.PI, end: Math.PI/2}
  },
  {
    name: 'Bottom',
    type: 'line',
    x1: CBL.x, x2: CBR.x,
    y1: BOTTOM, y2: BOTTOM
  },
  {
    name: 'Bottom Right',
    type: 'arc',
    center: CBR,
    angle: {start: Math.PI/2, end:0}
  },
  {
    name: 'Right',
    type: 'line',
    x1: RIGHT, x2: RIGHT,
    y1: CBR.y, y2: CTR.y
  },
  {
    name: 'Top Right',
    type: 'arc',
    center: CTR,
    angle: {start: 0, end: -Math.PI/2}
  },
  {
    name: 'Top RM',
    type: 'line',
    x1: CTR.x, x2: (RIGHT + LEFT) / 2,
    y1: TOP, y2: TOP
  }
];


//
// Drawing functions
//

function drawLine(ctx,line, ratio) {
  if (ratio > 0) {
    // weights towards the points
    const w1 = 1 - ratio;
    const w2 = ratio;
  
    const xe = line.x1 * w1 + line.x2 * w2;
    const ye = line.y1 * w1 + line.y2 * w2;
    ctx.lineTo(xe, ye);
  }
}

function drawArc(ctx, arc, ratio) {
  if (ratio > 0) {
    const w1 = 1 - ratio;
    const w2 = ratio;
  
    const arcEnd = w1 * arc.angle.start + w2 * arc.angle.end;
    ctx.arc(arc.center.x, arc.center.y, RADIUS, arc.angle.start, arcEnd, true);
  }
}

function drawStroke(ctx, stroke, ratio) {
  if (stroke.type === 'line') { drawLine(ctx,stroke, ratio); }
  else if (stroke.type === 'arc') { drawArc(ctx,stroke,ratio); }
}

//
// Maths functions
//
function getLineLength({x1,x2,y1,y2}) {
  return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function getArcLength(arc) {
  const ratio = (Math.abs(arc.angle.start - arc.angle.end))/ (2 * Math.PI);
  return ratio * (2*Math.PI*RADIUS);
}

function getStrokeLength(stroke) {
  if (stroke.type === 'line') { return getLineLength(stroke); }
  else if (stroke.type === 'arc') { return getArcLength(stroke); }
};

//
// Ratio utilities
//

function computeRatios(strokes, ratio) {
  const strokeLengths = strokes.map(getStrokeLength);
  const totalLength = strokeLengths.reduce((acc, val) => acc+val);
  const desiredLength = totalLength * ratio;
  
  
  // todo : might try to find a functional version
  let remainingLength = desiredLength;
  let ratios = [];
  for (strokeLength of strokeLengths) {
    if (strokeLength <= remainingLength) {
      ratios.push(1);
      remainingLength -= strokeLength;
    } else {
      ratios.push(remainingLength/strokeLength);
      remainingLength = 0;
    }
  }
  
  return ratios;
}

// ratio = [0..1]
function draw(completionRatio) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  ctx.moveTo(strokes[0].x1, strokes[0].y1);
  const ratios = computeRatios(strokes, completionRatio);
  console.log(ratios)
  strokes.map((stroke, idx) => drawStroke(ctx,stroke, ratios[idx]))
  ctx.lineWidth=10;
  ctx.strokeStyle = 'rgba(0,153,255,0.8)';
  ctx.lineCap = 'round';
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 4;
  ctx.shadowColor= 'green';
  
  var gradient = ctx.createLinearGradient(0, 0, 200, 0);
  gradient.addColorStop(0, 'green');
  gradient.addColorStop(1, 'green');
  ctx.strokeStyle = gradient;
  ctx.stroke();
}

let theRatio = 1;
setInterval(() => {
  draw(theRatio); 
  theRatio-=0.002; 
  if (theRatio < 0){theRatio=1;}
}, 2)