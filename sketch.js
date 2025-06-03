let mood = 'neutral';
let regenerateButton;
let moodButtons = [];

function setup() {
  createCanvas(800, 600);
  noLoop();

  const panelOffsetX = 80; // move right
  const panelOffsetY = 40; // move down

  const panelLeft = width + panelOffsetX;
  const panelTop = panelOffsetY;

  const sidePanel = createDiv().id('sidePanel');
  sidePanel.position(panelLeft, panelTop);

  // Mood control panel inside sidePanel
  const moodPanel = createDiv().id('moodPanel').parent(sidePanel);
  createElement('h3', 'Select the mood:').parent(moodPanel);
  const btnRow = createDiv().id('moodButtonsContainer').parent(moodPanel);

  createMoodButton('😊', 'happy', btnRow);
  createMoodButton('😐', 'neutral', btnRow);
  createMoodButton('😠', 'bad', btnRow);

  // Regenerate button inside sidePanel
  regenerateButton = createButton('Regenerate');
  regenerateButton.id('regenerateButton');
  regenerateButton.parent(sidePanel); // add to same container
  regenerateButton.mousePressed(redraw);

  highlightSelectedButton(mood);

  createDreamInput(sidePanel);
}

function createMoodButton(label, moodValue, parentDiv) {
  const btn = createButton(label);
  btn.class('mood-button'); // add class for shared styling

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
}

function getBackgroundColor() {
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

function createDreamInput(parentDiv) {
  const inputContainer = createDiv().style('margin-top', '20px');
  inputContainer.parent(parentDiv);
  
  createElement('label', 'Describe your dream:')
    .attribute('for', 'textInput')
    .parent(parentDiv);

  const dreamInput = createElement('textarea')
    .attribute('id', 'textInput')
    .attribute('placeholder', 'Write your dream here...')
    .attribute('rows', '4')
    .attribute('cols', '30');
  dreamInput.parent(parentDiv);
}
