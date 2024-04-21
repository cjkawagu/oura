let listeningData;
let zoomLevel = 1.0;
let jsonData;
let rawData;
let timeSortedArray;
let playsSortedArray;
let oneMonthData

// function to laod and parse the JSON file
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'Audio_2023-2024.json', true); // Change the filename here
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

// function that parses the JSON data without adding duplicates
function init(filename){
  fetch(filename)
    .then(response => response.json())
    .then(jsonData => {
      // creates a set for rawData
      rawData = new Set()
      
      // for loop that will go through each element in the JSON file
      for(let i = 0; i < jsonData.length; i++){
        parsedDate = new Date(jsonData[i].ts);
        // sets the key to be the song ID
        let key = (jsonData[i].spotify_track_uri).substring(13);
        // sets the value of the element to be all of the data that we need
        let value = {
          date: parsedDate,
          hour: parsedDate.getHours(),
          // year: parseInt(date.getFullyear().toString()),
          // day: (jsonData[i].ts).substring(5, 7),
          // minute: (jsonData[i].ts).substring(8, 10),
          time: parseInt((jsonData[i].ts).substring(jsonData[i].ts.length - 8, jsonData[i].ts.length-6) + (jsonData[i].ts).substring(jsonData[i].ts.length - 5, jsonData[i].ts.length-2)),
          plays: 0,
          morningListens: 0,
          afternoonListens: 0,
          eveningListens: 0,
          nightListens: 0,
          song: jsonData[i].master_metadata_track_name,
          artist: jsonData[i].master_metadata_album_artist_name,
          album: jsonData[i].master_metadata_album_album_name,
          songLink: "http://open.spotify.com/track/" + (jsonData[i].spotify_track_uri).substring(13)
        };

        // checks if the song is already added and will perform summations
        let status = false;
        for(let entry of rawData){
          if(entry[0] === key){
            // increases the timePlayed
            entry[1].timePlayed += jsonData[i].hours;

            // increases the number of plays tracker
            entry[1].plays++;

            // increases the time sections listen counters
            // Morning
            if(6 <= entry[1].hour < 12){
              entry[1].morningListens++;
            }

            // Afternoon
            if(12 <= entry[1].hour < 18){
              entry[1].afternoonListens++;
            }

            // Evening
            if(18 <= entry[1].hour < 21){
              entry[1].eveningListens++;
            }
            
            // Night
            if(0 <= entry[1].hour < 6 || 2100 <= entry[1].time <= 24){
              entry[1].nightListens++;
            }

            // sets our flag to be true
            status = true;
          }
        }

        if(!status){
          rawData.add([key, value]);
        }
      }

      // creates the arrays that will store the sorted data
      sortTime();
      sortPlays();

      // display rawData
      console.log(rawData);
    })
}

// function to return a bool that says if the song has already been added
function songAdded(data, songID){
  let dataArray = Array.from(data);
  return dataArray.some(entry => entry[0] === trackname);
}

// function that creates the 3 time constrained data sets
function createArrays(){
  rawData
}

// function that sorts rawData descending by time
function sortTime(data){
  timeSortedArray = Array.from(data);
  // sorts the temp array descending by time
  timeSortedArray.sort((a, b) => b.time - a.time);

  console.log(timeSortedArray);
}

// function that sorts rawData descending by plays
function sortPlays(data){
  playsSortedArray = Array.from(data);
  // sorts the temp array descending by plays
  playsSortedArray.sort((a, b) => b.time - a.time);

  console.log(playsSortedArray);
}

function setup() {
    var canvas = createCanvas(windowWidth-400, windowHeight-(windowHeight*0.2));
    init("data/Audio_2023-2024.json");
    canvas.parent("sketch");
    frameRate(60);
}

// main draw function
function draw() {
    scale(zoomLevel);
    ellipse(width / 2, height / 2, 100, 100);
}

function zoomIn() {
    // Zoom in by 10%
    zoomLevel *= 1.1;
}

function zoomOut(){
    //Zoom out by 10%
    zoomLevel *= 0.9;
}

function windowResized() {
  resizeCanvas(windowWidth-400, windowHeight-(windowHeight*0.2));
}
