
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

function draw() {
    background(backgroundColor);

    new doIt(width, height)
        .toEachRing()
        .padding(.1)
        .numRings(5)
        .numSlices(5)
        .context(context)
        .spaceBetweenSlices(TWO_PI/200)
        .spaceBetweenRings(.50)
        .do(slice => {
            stroke(slice.percentRing * 256, slice.percentSlice * 256, slice.percentTotal * 256);

            thetaPrime = 0;
            radiusPercent = abs(sin(context.frame / (200 / (slice.percentRing + 1))) )
            // slice.radiusToOuterRing += radiusDelta

            slice.vertices = slice.vertices.map(point => 
                rotatePointAroundPoint(
                    point[0] * radiusPercent + width/2  * (1 - radiusPercent), 
                    point[1] * radiusPercent + height/2 * (1 - radiusPercent), 
                    thetaPrime, width/2, height/2))
            

            line(slice.vertices[0][0], slice.vertices[0][1], slice.vertices[3][0], slice.vertices[3][1])
            line(slice.vertices[1][0], slice.vertices[1][1], slice.vertices[2][0], slice.vertices[2][1])

            noFill()

            arc(width/2, height/2, 
                slice.radiusToOuterRing * 2 * radiusPercent, slice.radiusToOuterRing * 2 * radiusPercent, 
                slice.thetaStart + thetaPrime, slice.thetaEnd + thetaPrime)

            arc(width/2, height/2,
                (slice.radiusToOuterRing - slice.radiusDiff) * 2 * radiusPercent, 
                (slice.radiusToOuterRing - slice.radiusDiff) * 2 * radiusPercent, 
                slice.thetaStart + thetaPrime, slice.thetaEnd + thetaPrime)
        });

    context.frame += 1;
}
    
