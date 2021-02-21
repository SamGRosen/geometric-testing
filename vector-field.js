const width = 500;
const height = 500;
const backgroundColor = "#CCC"

const context = {
    frame: 0,
    field: (x, y) => [y, sin(x)],
    
};

function setup() {
  createCanvas(width, height);

  context.colorScheme = getAColorScheme();
  stroke(255)

  new doIt(width, height)
        .toEachBox()
        .numColumns(15)
        .numRows(15)
        .context(context)
        .do(box => {
            const vector = box.context.field(
                -3 + 6*box.percentX, -3 + 6*box.percentY
            )
            strokeWeight((vector[0] ** 2 + vector[1] ** 2))

            line(box.x, box.y, box.x + vector[0]*5, box.y + vector[1]*5)
        });
}


function draw() {}
    
