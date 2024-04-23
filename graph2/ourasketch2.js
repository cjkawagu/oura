// ***** Global variables ***** //
var sleepData;
var maxY = 0;
var minY = Infinity;
var maxRem = 0;
var minRem = Infinity;
var timeRange;
var marginX = 100;
var marginY = 80;
var graphHeight;
var graphWidth;
var sleepStrings = [];
var connectPoints = false;
let selectedFile;

// Get the selected file when input changes
document.getElementById("myFile").addEventListener("change", (event) => {
  selectedFile = event.target.files[0];
});

// Handle upload button click
document.getElementById("upload-button").addEventListener("click", (e) => {
  e.preventDefault();
  let fileReader = new FileReader();

  // Read the selected file as binary string
  fileReader.readAsBinaryString(selectedFile);

  // Process the file data when it's loaded
  fileReader.onload = (event) => {
    let fileData = event.target.result;

    // Read the Excel workbook
    let workbook = XLSX.read(fileData, { type: "binary" }, { dateNF: "mm/dd/yyyy" });

    // Change each sheet in the workbook to json
    workbook.SheetNames.forEach(async (sheet) => {
      const result = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
        raw: false,
      });

      getMaxValues(result);
      graphHeight = height - marginY * 2;
      graphWidth = width - marginX * 2;

      for (var i = 0; i < result.length; i++) {
        sleepStrings.push(parseString(result[i].hypnogram_5min));
      }
    });
  };
});

function 











function sleep(deep, rem, duration) {
  // Properties
  this.deep = deep;
  this.rem = rem;
  this.duration = duration;
  this.ellipseSize = map(duration, minDuration, maxDuration, 5, 20); // Map duration to ellipse size
  this.positionX = map(this.deep, minDeep, maxDeep, marginX, marginX + graphWidth);
  this.positionY = map(this.rem, minRem, maxRem, marginY + graphHeight, marginY);

  // Functions
  this.drawEllipse = function () {
    ellipse(this.positionX, this.positionY, this.ellipseSize, this.ellipseSize);
  };

  this.drawLine = function () {
    if (connectPoints) {
      stroke(100);
      line(this.positionX, this.positionY, this.prevX, this.prevY);
    }
    this.prevX = this.positionX;
    this.prevY = this.positionY;
  };

  this.checkMouse = function () {
    if (
      dist(this.positionX, this.positionY, mouseX, mouseY) <
      this.ellipseSize / 2
    ) {
      // Calculate the position of the information box
      let boxX = constrain(this.positionX - 100, marginX, width - marginX - 200);
      let boxY = constrain(this.positionY - 130, marginY, height - marginY - 120);

      fill(255);
      stroke(200);
      rect(boxX, boxY, 200, 120);
      noStroke();
      fill(0);
      textAlign(LEFT, TOP);
      text("Deep Sleep: " + str(this.deep), boxX + 10, boxY + 10);
      text("REM Sleep: " + str(this.rem), boxX + 10, boxY + 30);
      text("Sleep Duration: " + str(this.duration) + " min", boxX + 10, boxY + 50);
    }
  };
}

function getMaxValues(data) {
  data.forEach((row) => {
    const deep = parseFloat(row.score_deep);
    maxDeep = Math.max(maxDeep, deep);
    minDeep = Math.min(minDeep, deep);

    const rem = parseFloat(row.score_rem);
    maxRem = Math.max(maxRem, rem);
    minRem = Math.min(minRem, rem);

    const duration = parseFloat(row.total);
    maxDuration = Math.max(maxDuration, duration);
    minDuration = Math.min(minDuration, duration);
  });

  deepRange = maxDeep - minDeep;
  remRange = maxRem - minRem;
  durationRange = maxDuration - minDuration;
}








// setup is automatically called once when the page loads.
function setup() {
  // createCanvas() creates the canvas element we will be drawing to.
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch");
  textSize(12);
  textFont("Helvetica Neue");
  console.log("Setup complete...");
}


function draw() {
  background(255);
  // Draw minor axis lines
  stroke(230);
  for (var i = 0; i < 9; i++) {
    line(
      marginX,
      marginY + i * (graphHeight / 9),
      marginX + graphWidth,
      marginY + i * (graphHeight / 9)
    );
  }
  for (var i = 0; i < 7; i++) {
    line(
      marginX + (i + 1) * (graphWidth / 7),
      marginY,
      marginX + (i + 1) * (graphWidth / 7),
      marginY + graphHeight
    );
  }

  // Draw major axis lines
  stroke(0);
  line(marginX, height - marginY, width - marginX, height - marginY);
  line(marginX, marginY, marginX, height - marginY);

  // Draw axis labels
  noStroke();
  fill(0);
  textAlign(CENTER, TOP);
  text("Time", width / 2, height - marginY + 30);
  textAlign(RIGHT, CENTER);
  push();
  translate(marginX - 70, height / 2);
  rotate(-PI / 2);
  text("Sleep Stage", 0, 0);
  pop();

  // Draw
  // Draw title
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Sleep Data Visualization", width / 2, marginY / 2);
  textSize(12);

  // Draw labels
  for (var i = 0; i < 8; i++) {
    textAlign(CENTER, TOP);
    text(
      round(minRem + i * (remRange / 7)),
      marginX + (graphWidth / 7) * i,
      marginY + graphHeight + 10
    );
  }
  for (var i = 0; i < 10; i++) {
    textAlign(RIGHT, CENTER);
    text(
      round(maxDeep - i * (deepRange / 9)),
      marginX - 15,
      marginY + (graphHeight / 9) * i
    );
  }

  // Plotting the dots and lines
  for (var i = 0; i < sleepObjects.length; i++) {
    sleepObjects[i].drawLine();
  }
  for (var i = 0; i < sleepObjects.length; i++) {
    sleepObjects[i].drawEllipse();
  }

  // Checking for mouse position to display popup
  for (var i = 0; i < sleepObjects.length; i++) {
    sleepObjects[i].checkMouse();
  }
}

// Thanks Mia
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  graphHeight = height - marginY * 2;
  graphWidth = width - marginX * 2;
}