let mood = 'neutral';
let regenerateButton;
let moodButtons = [];

function setup() {
  createCanvas(800, 600);
  noLoop();

  // Mood control panel with grey background
  const moodPanel = createDiv().style('position', 'absolute')
                               .style('left', '820px')
                               .style('top', '10px')
                               .style('width', '220px')
                               .style('background-color', '#ccc')
                               .style('padding', '15px')
                               .style('border-radius', '10px')
                               .style('box-shadow', '2px 2px 5px rgba(0,0,0,0.2)')
                               .style('font-family', 'sans-serif')
                               .style('text-align', 'center');

  // Header inside panel
  createElement('h3', 'Select the mood:').parent(moodPanel).style('margin', '0 0 10px 0');

  // Container div for mood buttons - flex row
  const btnRow = createDiv().parent(moodPanel)
                           .style('display', 'flex')
                           .style('justify-content', 'space-between')
                           .style('gap', '10px');

  createMoodButton('😊', 'happy', btnRow);
  createMoodButton('😐', 'neutral', btnRow);
  createMoodButton('😠', 'bad', btnRow);

  // Regenerate button below the grey panel, aligned left with panel
  regenerateButton = createButton('Regenerate');
  regenerateButton.position(820, 10 + moodPanel.elt.offsetHeight + 10); // below panel with 10px gap
  regenerateButton.style('width', '180px');
  regenerateButton.mousePressed(redraw);

  highlightSelectedButton(mood); // highlight default mood
}

function createMoodButton(label, moodValue, parentDiv) {
  const btn = createButton(label);
  btn.style('font-size', '24px');
  btn.style('margin', '5px');
  btn.style('padding', '8px');
  btn.style('border-radius', '6px');
  btn.style('border', '1px solid #aaa');
  btn.style('background-color', '#f0f0f0');

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
    if (entry.mood === selectedMood) {
      entry.button.style('background-color', '#aee');
      entry.button.style('font-weight', 'bold');
      entry.button.style('border', '2px solid #0099cc');
    } else {
      entry.button.style('background-color', '#f0f0f0');
      entry.button.style('font-weight', 'normal');
      entry.button.style('border', '1px solid #aaa');
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