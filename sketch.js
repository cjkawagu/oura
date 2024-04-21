let zoomLevel = 1.0;
// stores days and each days sleep stage cycles (time)
let hypnogramData;
// stores calories burnt throughout the day
let caloriesData;

// @Ehna finish up this function to load the data in
function preload(){
    hypnogramData = loadTable();
    caloriesData = loadTable();
}

function setup() {
    var canvas = createCanvas(windowWidth, 405);
    canvas.parent("graph");
    frameRate(60);
}

// main draw function
function draw() {
    background(255);

    let leftMargin = 50;
    let rightMragin = width - 50;
    let topMargin = 20; 
    let bottomMargin = height -50;

    scale(zoomLevel);
    
    drawHypnogram(hypnogramData, leftMargin, rightMargin, topMargin, bottomMargin);
    drawCalories(caloriesData, leftMargin, rightMargin, topMargin, bottomMargin);
}


function drawHypnogram(data, left, right, top, bottom){
    beginShape();
    for(let i = 0; i < data.getRowCount(); i++){
        let x = map(i, 0, data.getRowCount() - 1, left, right);
        let y = map(data.getNum(i, 'stage'), 0, 4, bottom, top);
        vertex(x, y); 
    }

    endShape();
}

function drawCalories(data, left, right, top, bottom){
    stroke(255, 0, 0);
    beginShape();
    for(let i = 0; i < data.getRowCount(); i++){
        let x = map(i,0,data.getRowCount() - 1, left, right);
        // assuming max of 3000 calories
        let y = map(data.getNum(i, 'calories'), 0, 3000, bottom, top);
        vertex(x, y);
    }

    endShape();
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


