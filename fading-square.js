// Inspired from: https://www.instagram.com/p/Bw4zDfzCEIZ/?utm_source=ig_embed&utm_campaign=embed_video_watch_again
const width = 800;
const height = 800;
const backgroundColor = "#222";

const context = {
    frame: 0,
    squaresCleared: new Set(),
    layer: 0,
    noise: [],
    nextNoise: [],
    cutoffs: [],
    nextCutoffs: [],
    colorScheme: [],
    nextColorScheme: []
};

const boxNoise = (box, layer) => noise(box.percentX, box.percentY, layer)

const getSection = (percentile, cutoffs) => {
    let i = 0;
    for(let cutoff of cutoffs) {
        if(percentile <= cutoff) {
            return i;
        }
        i++;
    }
    return i;
}

const sections = [0.1, .25, 0.50, 0.75, 1]; 

const boxWorker = new doIt(width, height)
    .toEachBox()
    .numColumns(15)
    .numRows(15)
    .padding(.5)
    .context(context)
    .center(false)

function setup() {
  createCanvas(width, height);

  boxWorker.do(box => {
    box.context.noise.push(boxNoise(box, box.context.layer))
  })

  boxWorker.do(box => {
    box.context.nextNoise.push(boxNoise(box, box.context.layer + 1))
  })

  context.colorScheme = getAColorScheme()
  context.nextColorScheme = getAColorScheme()

  context.noise.sort((a,b) => a - b)
  context.cutoffs = sections.map(s => d3.quantile(context.noise, s))

  context.nextNoise.sort((a,b) => a - b)
  context.nextCutoffs = sections.map(s => d3.quantile(context.nextNoise, s))

  noStroke()
}

// Boxes will not rotate until this number of frames is passed
const rotatingDelayer = (box) => 
    heavyside(sin(box.distanceToCenter/100) * 100);

// Boxes will not shrink until this number of frames is passed
const shrinkingDelayer = (box) =>
    heavyside(sin(box.distanceToCenter/100) * 100);


function draw() {
    background(backgroundColor);

    // Worker just for below boxes
    boxWorker.do(box => {
        // Need to draw next box
        // Set fill of beneath box
        const nextSection = getSection(boxNoise(box, (box.context.layer + 1) % 2), 
        box.context.nextCutoffs)
        fill(box.context.nextColorScheme[nextSection]);
        const t = shrinkingDelayer(box)(box.context.frame) * 1/100

        const multiplier = t > PI/2 ? 1 : sin(t)
        rect(box.x, box.y, box.width * multiplier, box.height * multiplier);
    });

    boxWorker.do(box => {
        if(box.context.squaresCleared.has(`${box.xBox}--${box.yBox}`)) {
            if(box.context.squaresCleared.size == box.options.numColumns * box.options.numRows) {
                // Clear completed squares
                box.context.squaresCleared = new Set();

                // Switch color schemes
                const temp = box.context.nextColorScheme;
                box.context.nextColorScheme = box.context.colorScheme;
                box.context.colorScheme = temp;

                // Switch noises
                const temp1 = box.context.nextNoise, temp2 = box.context.nextCutoffs;
                box.context.nextNoise = box.context.noise;
                box.context.nextCutoffs = box.context.cutoffs;
                box.context.noise = temp1;
                box.context.cutoffs = temp2;

                box.context.layer += 1
                box.context.frame = 0
            }
            return
        }

        const section = getSection(boxNoise(box, box.context.layer % 2), box.context.cutoffs)
        const t = shrinkingDelayer(box)(box.context.frame) * 1/100
        const theta = rotatingDelayer(box)(box.context.frame) * 1/100

        if (t > TWO_PI/4) { // Already shrunk
            box.context.squaresCleared.add(`${box.xBox}--${box.yBox}`)
            return
        }

        // Set fill of rotating box
        fill(box.context.colorScheme[section])

        // Shrink box
        box.width *= cos(t)
        box.height *= cos(t)

        // [0,0] => [1, 0]
        // [1,0] => [1, 1]
        // [1,1] => [0, 1]
        // [0,1] => [0, 0]
        const anchor = rotatePointAroundPoint(box.x, box.y, TWO_PI/4, width/2, height/2)

        drawRectangleRotatedAroundPoint(
            box.x, box.y, 
            box.width, box.height,
            theta,
            anchor[0],
            anchor[1]
        )
    
    });
    context.frame += 1;
}