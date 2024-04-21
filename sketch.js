let zoomLevel = 1.0;
let jsonData;

function setup() {
    var canvas = createCanvas(windowWidth, 405);
    canvas.parent("graph");
    frameRate(60);
}

// main draw function
function draw() {
    scale(zoomLevel);
    ellipse(width / 2, height / 2, 100, 100);
}

// zoom in and out on the window functions (idk if we're actually going to use it i just already had it)
function zoomIn() {
    // Zoom in by 10%
    zoomLevel *= 1.1;
}

function zoomOut(){
    //Zoom out by 10%
    zoomLevel *= 0.9;
}
