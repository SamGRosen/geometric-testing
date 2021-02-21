const width = 500;
const height = 500;
const backgroundColor = "#222";

const context = {
  frame: 0,
};

function setup() {
  createCanvas(width, height);
  colorMode(HSB);
  noStroke();
}

function draw() {
  background(backgroundColor);

  const worker = new doIt(width, height)
    .toEachBox()
    .numColumns(25)
    .numRows(25)
    .padding(0.2)
    .context(context)
    .center(true)
    .do((box) => {
      fill(box.percentX * 256, box.percentY * 256, box.percentTotal * 256);
      drawRectangleRotatedAroundPoint(
        box.x,
        box.y,
        box.width,
        box.height,
        box.context.frame / 100,
        box.x + box.width / 2,
        box.y + box.height / 2
      );

      // fill((1-box.percentX)* 256, (1-box.percentY) * 256, (1-box.percentTotal) * 256);
      // drawRectangleRotatedAroundPoint(
      //     box.x + box.width/2, box.y + box.height/2,
      //     box.width, box.height,
      //     -box.context.frame * 1/100,
      //     box.x + box.width/2, box.y + box.height/2)
    });

  context.frame += 1;
}
