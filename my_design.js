/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "The Beatles", 
      assetUrl: "assets/the_beatles.png",
    },
    {
      name: "Limbo", 
      assetUrl: "assets/limbo.png",
    },
    {
      name: "Beware of the Dog", 
      assetUrl: "assets/beware_of_dog.jpg",
    },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 8, inspiration.image.height / 8);
  
  let design = {
    bg: 128,
    fg: [],
    numColors: 17,
  }
  
  design.w = 32;
  design.h = height / (width/design.w);
  design.tile = (width + (width/design.w))/design.w;
  
  for (let i = 0; i < design.h; i++) {
    design.fg.push({x: 0,
                    y: i * design.tile,
                    w: design.tile * random(0.8, 1.2),
                    h: design.tile,
                    color: floor(random(design.numColors))})
    for (let j = 1; j < design.w; j++) {
      design.fg.push({x: design.fg[design.w * i + j - 1].x + design.fg[design.w * i + j - 1].w,
                      y: i * design.tile,
                      w: design.tile * random(0.8, 1.2),
                      h: design.tile,
                      color: floor(random(design.numColors))})
    }
  }
  
  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  stroke(design.bg);
  strokeWeight(32/design.w);
  //noStroke();
  angleMode(DEGREES);
  for (let box of design.fg) {
    //fill(round(box.fill / (256 / (design.numColors - 1))) * (256 / (design.numColors - 1)), 128);
    fill(box.color * 256 / (design.numColors - 1), 255);
    rect(box.x, 
         box.y, 
         box.w,
         box.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  // for (let box of design.fg) {
  //   box.color = round(mut(box.color, 0, design.numColors - 1, rate));
  // }
  for (let i = 0; i < design.w; i++) {
    let index = floor(random(design.fg.length));
    let rows = floor(random(1, 1 + design.w * rate/2));
    let columns = floor(random(1, 1 + design.h * rate/2));
    let colorStep = round(random(-2, 2));
    for (let r = 0; r < rows; r++) {
      for (let c = index; c < index + columns; c++) {
        if (c + r * design.w < design.fg.length) {
          design.fg[c + r * design.w].color = constrain(design.fg[c + r * design.w].color + colorStep, 0, design.numColors);
        }
      }
    }
  }
}

function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}
