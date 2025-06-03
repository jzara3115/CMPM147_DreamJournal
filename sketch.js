let mood = 'neutral';
let regenerateButton;
let moodButtons = [];
let loadedImg = null;

function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent('container');
  noLoop();

  const btnRow = select('#moodButtonsContainer');
  createMoodButton('😊', 'happy', btnRow);
  createMoodButton('😐', 'neutral', btnRow);
  createMoodButton('😠', 'bad', btnRow);

  regenerateButton = select('#regenerateButton');
  regenerateButton.mousePressed(redraw);

  highlightSelectedButton(mood);

  createDreamInput(select('#dreamInputContainer'));
}

function createMoodButton(label, moodValue, parentDiv) {
  const btn = createButton(label);
  btn.class('mood-button');
  btn.mousePressed(() => {
    mood = moodValue;
    highlightSelectedButton(moodValue);
    redraw();
  });
  btn.parent(parentDiv);
  moodButtons.push({ mood: moodValue, button: btn });
}

function highlightSelectedButton(selectedMood) {
  for (let entry of moodButtons) {
    // Remove 'selected' class from all buttons
    entry.button.removeClass('selected');

    // Add 'selected' class only to the active one
    if (entry.mood === selectedMood) {
      entry.button.addClass('selected');
    }
  }
}


function draw() {
  background(getBackgroundColor());

  let numShapes;
  if (mood === 'happy') {
    numShapes = int(random(15, 30));
  } else if (mood === 'neutral') {
    numShapes = int(random(5, 15));
  } else {
    numShapes = int(random(30, 70));
  }

  for (let i = 0; i < numShapes; i++) {
    drawShape();
  }

  drawLines();
  drawInputImage();
}

function getBackgroundColor() {
  if (detectedColor) {
    // Make the background lighter based on mood
    let blendAmt;
    if (mood === 'happy') {
      blendAmt = 0.7;
    } else if (mood === 'neutral') {
      blendAmt = 0.4;
    } else {
      blendAmt = 0.1;
    }
    let r = lerp(detectedColor[0], 255, blendAmt);
    let g = lerp(detectedColor[1], 255, blendAmt);
    let b = lerp(detectedColor[2], 255, blendAmt);
    return color(r, g, b);
  }
  if (mood === 'happy') {
    return color(random(220, 255), random(220, 255), random(180, 255));
  } else if (mood === 'neutral') {
    let gray = random(180, 220);
    return color(gray, gray, gray);
  } else {
    return color(random(10, 60), random(10, 60), random(10, 60));
  }
}

function drawShape() {
  let x = random(width);
  let y = random(height);
  let s = random(30, 200);
  let c = getColor();

  strokeWeight(random(1, 4));
  stroke(getStrokeColor());
  fill(c);

  let shapeType = chooseShape();

  push();
  translate(x, y);
  if (shapeType === 'circle') {
    ellipse(0, 0, s, s);
  } else if (shapeType === 'rect') {
    rectMode(CENTER);
    rect(0, 0, s, s);
  } else if (shapeType === 'triangle') {
    triangle(-s / 2, s / 2, 0, -s / 2, s / 2, s / 2);
  } else if (shapeType === 'jagged') {
    drawJaggedShape(s);
  }
  pop();
}

function getColor() {
  if (mood === 'happy') {
    return color(random(200, 255), random(100, 255), random(100, 255), 180);
  } else if (mood === 'neutral') {
    return color(random(100, 200), random(100, 200), random(100, 200), 150);
  } else {
    return color(random(30, 80), random(30, 80), random(30, 80), 150);
  }
}

function getStrokeColor() {
  if (mood === 'happy') {
    return color(random(150, 255), random(150, 255), random(150, 255));
  } else if (mood === 'neutral') {
    return color(100);
  } else {
    return color(random(100), 0, 0);
  }
}

function chooseShape() {
  if (mood === 'happy') {
    return random(['circle', 'rect']);
  } else if (mood === 'neutral') {
    return random(['circle', 'rect', 'triangle']);
  } else {
    return random(['triangle', 'jagged']);
  }
}

function drawJaggedShape(size) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let r = size / 2 + random(-10, 20);
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawLines() {
  let lineCount;
  if (mood === 'happy') {
    lineCount = int(random(3, 7));
  } else if (mood === 'neutral') {
    lineCount = int(random(5, 10));
  } else {
    lineCount = int(random(15, 30));
  }

  for (let i = 0; i < lineCount; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = random(width);
    let y2 = random(height);

    stroke(getStrokeColor());
    strokeWeight(random(1, 3));
    noFill();

    if (mood === 'happy') {
      let cx1 = lerp(x1, x2, 0.3) + random(-50, 50);
      let cy1 = lerp(y1, y2, 0.3) + random(-50, 50);
      let cx2 = lerp(x1, x2, 0.7) + random(-50, 50);
      let cy2 = lerp(y1, y2, 0.7) + random(-50, 50);
      bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
    } else if (mood === 'neutral') {
      line(x1, y1, x2, y2);
    } else {
      let segments = int(random(3, 7));
      beginShape();
      for (let j = 0; j <= segments; j++) {
        let t = j / segments;
        let x = lerp(x1, x2, t) + random(-10, 10);
        let y = lerp(y1, y2, t) + random(-10, 10);
        vertex(x, y);
      }
      endShape();
    }
  }
}

//INPUT HANDLING
let detectedColor = null;
let detectedColorName = '';
let dreamInputElem, detectedColorDiv;

//Basic color words and RGB values
const COLORS = {
  red: [255, 0, 0],
  blue: [0, 0, 255],
  green: [0, 128, 0],
  yellow: [255, 255, 0],
  orange: [255, 165, 0],
  purple: [128, 0, 128],
  pink: [255, 105, 180],
  brown: [139, 69, 19],
  black: [0, 0, 0],
  white: [255, 255, 255],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
};

// Create the input area for dream description
function createDreamInput(parentDiv) {
  const inputContainer = createDiv().style('margin-top', '20px');
  inputContainer.parent(parentDiv);

  createElement('label', 'Describe your dream:')
    .attribute('for', 'textInput')
    .parent(parentDiv);

  dreamInputElem = createElement('textarea')
    .attribute('id', 'textInput')
    .attribute('placeholder', 'Write your dream here...')
    .attribute('rows', '4')
    .attribute('cols', '30');
  dreamInputElem.parent(parentDiv);

  detectedColorDiv = createDiv('').style('margin-top', '8px');
  detectedColorDiv.parent(parentDiv);

  dreamInputElem.elt.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDreamInput(dreamInputElem.value());
    }
  });
}

//handle the dream input and detect colors
function handleDreamInput(text) {
  detectedColor = null;
  detectedColorName = '';

  const lower = text.toLowerCase();
  for (let colorName in COLORS) {
    if (lower.includes(colorName)) {
      detectedColor = COLORS[colorName];
      detectedColorName = colorName;
      break;
    }
  }

  if (detectedColor) {
    detectedColorDiv.html(
      `Detected color: <span style="color:rgb(${detectedColor.join(',')});font-weight:bold">${detectedColorName}</span>`
    );
  } else {
    detectedColorDiv.html('No color detected.');
  }
  redraw();
}

function drawInputImage() {
  if (loadedImg) {
    push();
    image(loadedImg, 0, 0, 800, 600);
    pop();
  }
}

imageInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    loadedImg = loadImage(event.target.result, () => {
      drawInputImage()
    });
  };
  reader.readAsDataURL(file);
};
