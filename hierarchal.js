const width = 500;
const height = 500;
const backgroundColor = 0;
const sections = [0.1, 0.25, 0.4, 0.5, 0.75, 1];

const context = {
  frame: 0,
  noise: [],
};

const boxNoise = (box) => noise(box.percentX, box.percentY); //, box.context.frame/5000)

const getSection = (percentile, cutoffs) => {
  let i = 0;
  for (let cutoff of cutoffs) {
    if (percentile <= cutoff) {
      return i;
    }
    i++;
  }
  return i;
};

const hexWorker = new doIt(width, height)
  .toEachHexagon()
  .numColumns(20)
  .numRows(20)
  .context(context);

function setup() {
  createCanvas(width, height);
  noStroke();

  hexWorker.do((hex) => {
    hex.context.noise.push(boxNoise(hex));
  });

  context.noise.sort((a, b) => a - b);
  context.cutoffs = sections.map((s) => d3.quantile(context.noise, s));
}

function draw() {
  background(backgroundColor);

  hexWorker.do((hex) => {
    const section = getSection(boxNoise(hex), hex.context.cutoffs);
    fill(d3.schemeDark2[section]);

    noStroke();

    const zChange =
      sin(hex.context.frame / 100) * (section + 1) * 30 * cos(hex.x);
    const vertices = hexagon(hex.x, hex.y + zChange, hex.radius);

    beginShape();
    vertex(vertices[2][0], vertices[2][1]);
    vertex(vertices[1][0], vertices[1][1]);
    vertex(vertices[0][0], vertices[0][1]);
    vertex(vertices[0][0], height);
    vertex(vertices[2][0], height);
    endShape(CLOSE);

    stroke(0);

    line(vertices[3][0], vertices[3][1], vertices[3][0], height);
    line(vertices[5][0], vertices[5][1], vertices[5][0], height);

    line(vertices[0][0], vertices[0][1], vertices[5][0], vertices[5][1]);
    line(vertices[4][0], vertices[4][1], vertices[5][0], vertices[5][1]);
    line(vertices[3][0], vertices[3][1], vertices[4][0], vertices[4][1]);

    line(hex.x, hex.y + zChange, vertices[1][0], height);
    line(hex.x, hex.y + zChange, vertices[1][0], vertices[1][1]);
    line(hex.x, hex.y + zChange, vertices[3][0], vertices[3][1]);
    line(hex.x, hex.y + zChange, vertices[5][0], vertices[5][1]);
  });
  context.frame += 1;
}
