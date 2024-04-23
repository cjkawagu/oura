// ***** Global variables ***** //
var sleepData;
var maxDeep = 0;
var minDeep = Infinity;
var deepRange;
var maxRem = 0;
var minRem = Infinity;
var remRange;
var maxDuration = 0;
var minDuration = 0;
var durationRange;
var marginX = 100;
var marginY = 80;
var graphHeight;
var graphWidth;
var sleepObjects = [];
var selectedToggle = 0;
var toggleLength = 100;
var toggleSpacing = 10;
var toggleOptions = ["Deep Sleep", "REM", "Sleep Duration"];
var connectPoints = false;
let selectedFile;

// Get the selected file when input changes
document.getElementById("myFile").addEventListener("change", (event) => {
  selectedFile = event.target.files[0];
});

document.addEventListener("DOMContentLoaded", function () {
  var remButton = document.getElementById("toggle-duration");
  remButton.addEventListener("click", function () {
    selectedToggle = 0;
    redraw();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  var remButton = document.getElementById("toggle-rem");
  remButton.addEventListener("click", function () {
    selectedToggle = 1;
    redraw();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  var remButton = document.getElementById("toggle-deep");
  remButton.addEventListener("click", function () {
    selectedToggle = 2;
    redraw();
  });
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
    let workbook = XLSX.read(
      fileData,
      { type: "binary" },
      { dateNF: "mm/dd/yyyy" }
    );

    // Change each sheet in the workbook to json
    workbook.SheetNames.forEach(async (sheet) => {
      const result = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
        raw: false,
      });

      getMaxValues(result);
      graphHeight = height - marginY * 2;
      graphWidth = width - marginX * 2;

      // Sort the data based on REM sleep
      result.sort((a, b) => parseFloat(b.score_rem) - parseFloat(a.score_rem));

      for (var i = 0; i < result.length; i++) {
        var deep = parseFloat(result[i].score_deep);
        var rem = parseFloat(result[i].score_rem);
        var duration = parseFloat(result[i].total);
        sleepObjects.push(new sleep(deep, rem, duration));
      }
    });
  };
});

function sleep(deep, rem, duration) {
  // Properties
  this.isHovered = false;
  this.deep = deep;
  this.rem = rem;
  this.duration = duration;
  this.ellipseSize = map(duration, minDuration, maxDuration, 5, 20); // Map duration to ellipse size
  this.positionX = map(
    this.deep,
    minDeep,
    maxDeep,
    marginX,
    marginX + graphWidth
  );
  this.positionY = map(
    this.rem,
    minRem,
    maxRem,
    marginY + graphHeight,
    marginY
  );

  this.color;

  // Functions
  this.color = [
    { r: 166, g: 0, b: 191 },
    { r: 145, g: 0, b: 189 },
    { r: 132, g: 0, b: 197 },
    { r: 107, g: 2, b: 186 },
    { r: 78, g: 1, b: 186 },
  ];

  this.remToggle = function () {
    let index;
    // Determine which color to use based on the value of this.rem
    if (this.rem < 19) {
      index = 0;
    } else if (this.rem < 38) {
      index = 1;
    } else if (this.rem < 57) {
      index = 2;
    } else if (this.rem < 76) {
      index = 3;
    } else {
      index = 4;
    }

    // Use the colors from the array
    var color = this.color[index];
    fill(color.r, color.g, color.b);
  };
  this.deepToggle = function () {
    let index;

    if (this.deep < 19) {
      index = 0;
    } else if (this.deep < 38) {
      index = 1;
    } else if (this.deep < 57) {
      index = 2;
    } else if (this.deep < 76) {
      index = 3;
    } else {
      index = 4;
    }

    // Use the colors from the array
    var color = this.color[index];
    fill(color.r, color.g, color.b);
  };

  // Functions
  this.drawEllipse = function () {
    noStroke();

    // Change fill based on hover state
    if (this.isHovered) {
      fill(200, 60);
    } else {
      if (selectedToggle == 0) {
        fill(255, 0, 0); // Red
      } else if (selectedToggle == 1) {
        this.remToggle();
      } else if (selectedToggle == 2) {
        this.deepToggle();
      }
    }
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
      this.isHovered = true;
      // Calculate the position of the information box
      let boxX = constrain(
        this.positionX - 100,
        marginX,
        width - marginX - 200
      );
      let boxY = constrain(
        this.positionY - 130,
        marginY,
        height - marginY - 120
      );

      fill(255);
      stroke(200);
      rect(boxX, boxY, 200, 120);
      noStroke();
      fill(0);
      textAlign(LEFT, TOP);
      text("Deep Sleep: " + str(this.deep), boxX + 10, boxY + 10);
      text("REM Sleep: " + str(this.rem), boxX + 10, boxY + 30);
      text(
        "Sleep Duration: " +
          str((this.duration / 60 / 60).toFixed(2)) +
          " hours",
        boxX + 10,
        boxY + 50
      );
    } else {
      this.isHovered = false; // Set hovered state to false when not hovering
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
  canvas.id("sleepGraph");
  canvas.parent("sketch");
  textSize(14);
  textFont("DM+Sans");
  console.log("Setup complete...");
}

function drawToggles() {
  for (var i = 0; i < toggleOptions.length; i++) {
    if (selectedToggle == i) {
      fill(255, 233, 127);
    } else {
      fill(230);
    }
    noStroke();
    rect(
      marginX -
        toggleLength -
        toggleSpacing -
        (toggleLength + toggleSpacing) * i,
      marginY - 30,
      toggleLength,
      20
    );
    fill(100);
    textAlign(CENTER, CENTER);
    text(
      toggleOptions[i],
      marginX - toggleLength / 2 - (toggleLength + toggleSpacing) * i,
      marginY - 20
    );
  }
}

function draw() {
  // drawToggles();
  // Draw minor axis lines
  stroke(122, 122, 122);
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
  stroke(255);
  line(marginX, height - marginY, width - marginX, height - marginY);
  line(marginX, marginY, marginX, height - marginY);

  // Draw axis labels
  noStroke();
  fill(255);
  textAlign(CENTER, TOP);
  text("REM Sleep", width / 2, height - marginY + 30);
  textAlign(RIGHT, CENTER);
  push();
  translate(marginX - 70, height / 2);
  rotate(-PI / 2);
  text("Deep Sleep", 0, 0);
  pop();

  // Draw
  // Draw title
  textAlign(CENTER, CENTER);
  textSize(30);
  text("SLEEP DATA VISUALIZATION", width / 2, marginY / 2);
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

function mousePressed() {
  for (var i = 0; i < toggleOptions.length; i++) {
    var toggleX =
      marginX -
      toggleLength -
      toggleSpacing -
      (toggleLength + toggleSpacing) * i;
    var toggleY = marginY - 30;
    var toggleWidth = toggleLength;
    var toggleHeight = 20;

    if (
      mouseX > toggleX &&
      mouseX < toggleX + toggleWidth &&
      mouseY > toggleY &&
      mouseY < toggleY + toggleHeight
    ) {
      selectedToggle = i;
      if (selectedToggle == 2) {
        connectPoints = !connectPoints;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  graphHeight = height - marginY * 2;
  graphWidth = width - marginX * 2;
}
