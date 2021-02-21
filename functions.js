const width = 500;
const height = 500;
const backgroundColor = 0;

const context = {
    frame: 0,
};

function setup() {
  createCanvas(width, height);

  background(backgroundColor)
}

const domain = [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1];

const f = (x, y, z, t) => {
    return z*z * cos(x) * sin(y) * sin(t)
}


function draw() {
    background(backgroundColor);

    new doIt(width, height)
        .toEachBox()
        .numColumns(15)
        .numRows(15)
        .context(context)
        .do(box => {
            noFill()
            stroke(255)
            beginShape();

            for(const point of domain) {
                const val = f(box.percentX * PI, box.percentY * PI, point, context.frame / 100)
                curveVertex(box.x + (point * box.width), box.y + (box.height - (val * box.height)))
            }
            endShape();
        });

    context.frame += 1;
}
    
