/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "The Beatles", 
      assetUrl: "https://cdn.glitch.global/69694c29-85cb-40ea-93cf-4da0884bb9bb/566fc181-c04f-44f8-8a88-951de4fd1fd6.image.png?v=1746943445762",
    },
    {
      name: "Limbo", 
      assetUrl: "https://cdn.glitch.global/69694c29-85cb-40ea-93cf-4da0884bb9bb/45d3ef9c-35d2-4d33-97b0-3ce2a524914c.image.png?v=1746943895693",
    },
    {
      name: "Beware of the Dog", 
      assetUrl: "https://cdn.glitch.global/69694c29-85cb-40ea-93cf-4da0884bb9bb/1080px-Cave_canem_MAN_Napoli_Inv110666.jpg?v=1746941120856",
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
