import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

const firebaseDatbaseConnection = initializeApp({
  apiKey: "AIzaSyACTZs6IaFhE6VeldeyYfhzjqC9C_69Sv4",
  authDomain: "test01-d0fdd.firebaseapp.com",
  databaseURL: "https://test01-d0fdd-94bcd.europe-west1.firebasedatabase.app/",
  projectId: "test01-d0fdd",
  storageBucket: "test01-d0fdd.appspot.com",
  messagingSenderId: "968693583529",
  appId: "1:968693583529:web:1bd15312655ae0daa223b8",
  measurementId: "G-HN8Z87RXQB",
});

const firebaseDatabase = getDatabase(firebaseDatbaseConnection);

window.setup = setup;
window.draw = draw;
window.preload = preload;

let capture;
function preload() {
  capture = createCapture(VIDEO);
  capture.hide();
  window.setup = setup;
  window.draw = draw;
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Use navigator.mediaDevices.enumerateDevices() to get available devices
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      let videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("Available cameras:", videoDevices);

      // If there are video devices available, create a capture
      if (videoDevices.length > 0) {
        let constraints = {
          audio: false,
          video: {
            deviceId: "OBS Virtual Camera", // "FaceTime HD Camera"
            width: windowWidth,
            height: windowHeight,
          },
        };
        // capture = createCapture(VIDEO);
        // capture.hide();
      } else {
        console.log("There are no video devices available.");
        return;
      }
    })
    .catch((error) => {
      console.error("Error enumerating devices:", error);
    });
}

function draw() {
  if (capture == true) {
    capture.loadPixels(); // Ensure the capture's pixel data is up to date
  }
  image(capture, 0, 0, windowWidth, windowHeight);
  capture.loadPixels();
  let redBucket = 0;
  let greenBucket = 0;
  let blueBucket = 0;

  let numPixels = capture.width * capture.height;

  // Loop through each pixel and accumulate color values
  for (let i = 0; i < numPixels; i++) {
    let index = i * 4; // Each pixel occupies 4 values (RGBA)
    let r = capture.pixels[index];
    let g = capture.pixels[index + 1];
    let b = capture.pixels[index + 2];

    redBucket += r;
    greenBucket += g;
    blueBucket += b;
  }

  // Calculate average color values
  let redAverage = redBucket / numPixels;
  let greenAverage = greenBucket / numPixels;
  let blueAverage = blueBucket / numPixels;
  console.log(int(redAverage), int(greenAverage), int(blueAverage));

  let data = ref(firebaseDatabase);

  set(data, {
    red: int(redAverage),
    green: int(greenAverage),
    blue: int(blueAverage),
  });

  // Set fill color to average color
  fill(redAverage, greenAverage, blueAverage);

  // Draw a rectangle with the average color
  noStroke();
  rect(0, 0, 300, 300);
  // fill(0);
  // stroke(255);
  // strokeWeight(1);
  // textAlign(CENTER, CENTER);
  // let lineH = 22;
  // textSize(20);
  // text(
  //   "This website does not record its' view",
  //   windowWidth / 2,
  //   windowHeight / 2
  // );
  // text(
  //   "It acts as an online mirror,",
  //   windowWidth / 2,
  //   windowHeight / 2 + lineH
  // );

  // text(
  //   "channeling RGB data impacting the digital landscape",
  //   windowWidth / 2,
  //   windowHeight / 2 + lineH * 2
  // );
  // textSize(12);
  // strokeWeight(0.5);
  // text(
  //   "You can find the landscape in the Reid Gallery",
  //   windowWidth / 2,
  //   windowHeight / 2 + lineH * 4
  // );
}
