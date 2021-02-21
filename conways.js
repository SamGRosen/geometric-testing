const width = 4000;
const height = 4000;
const backgroundColor = "#222";
const gridSize = 101;
const checkerboardSize = 51;
const calculateEvery = 1;
const renderEvery = 10;

const context = {
  frame: 0,
  state: new Set(),
  histogram: new Map(),
  maxCount: 1
};

function pointToKey(x, y) {
  return `${x},${y}`;
}

function neighbors(cell) {
  let arr = cell.split(",");
  let x = parseInt(arr[0]);
  let y = parseInt(arr[1]);
  return [
    `${x - 1},${y - 1}`,
    `${x - 1},${y}`,
    `${x - 1},${y + 1}`,
    `${x},${y - 1}`,
    `${x},${y + 1}`,
    `${x + 1},${y - 1}`,
    `${x + 1},${y}`,
    `${x + 1},${y + 1}`,
  ];
}

// Mostly copied from https://youtu.be/o9pEzgHorH0?t=1179
function advanceState(state) {
  let newState = new Set();
  let toCheck = new Set();
  let addToState = (iter) =>
    iter.forEach((point) => {
      let numAlive = neighbors(point).filter((item) => state.has(item)).length;
      if (numAlive == 3 || (numAlive == 2 && state.has(point))) {
        newState.add(point);
      }
    });

  for (let point of state.keys()) {
    toCheck.add(point)
    for (let n of neighbors(point)) {
      toCheck.add(n);
    }
  }

  addToState(toCheck)

  return newState;
}

function advanceHistogram(state, histogram) {
  let currentMax = 0
  state.forEach(point => {
    const currentCount = histogram.get(point) || 0

    histogram.set(point, currentCount + 1);

    if(currentCount + 1 > currentMax) {
      currentMax = currentCount + 1;
    }
  });

  return currentMax
}

function setup() {
  createCanvas(width, height);
  background(backgroundColor);
  colorMode(HSB);
  noStroke();

  let toggle = true;
  const padding = (gridSize - checkerboardSize)/2
  for (let x = padding; x < gridSize - padding; x++) {
    for (let y = padding; y < gridSize - padding; y++) {
      if (toggle) {
        context.state.add(`${x},${y}`);
      }
      toggle = !toggle;
    }
  }
}

function draw() {
  if (context.frame % renderEvery == 0) {
    new doIt(width, height)
      .toEachBox()
      .numColumns(gridSize)
      .numRows(gridSize)
      .padding(0.2)
      .context(context)
      .center(true)
      .do((box) => {
        let key = pointToKey(box.xBox, box.yBox);
        let currentCount = box.context.histogram.get(key) || 0;

        fill(Math.sqrt(currentCount / box.context.maxCount) * 255)
        rect(box.x, box.y, box.width, box.height);
      });
  }

  if (context.frame % calculateEvery == 0) {
    context.state = advanceState(context.state); // immutable
    context.maxCount = advanceHistogram(context.state, context.histogram) // mutable
  }

  context.frame += 1;
}
