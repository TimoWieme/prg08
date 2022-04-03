let video;
let detector;
let detections = [];
let synth = window.speechSynthesis


function preload() {
  detector = ml5.objectDetector('cocossd');
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  detector.detect(video, gotDetections);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  detector.detect(video, gotDetections);
  
}

function draw() {
  image(video, 0, 0);
  
  for (let i = 0; i < detections.length; i++) {
    let object = detections[i];
    document.getElementById("first").innerHTML =  "I see a : " + detections[0].label
    stroke(0, 255, 0);
    strokeWeight(4);
    noFill();
    rect(object.x, object.y, object.width, object.height);
    noStroke();
    fill(255);
    textSize(24);
    text(object.label, object.x + 5, object.y - 10);

    answer = "Ik zie een " + detections[0].label
  }


}

function speak(text) {
  if (synth.speaking) {
    console.log('still speaking...')
    return
  }
  if (text !== '') {
    let utterThis = new SpeechSynthesisUtterance(text)
    synth.speak(utterThis)
  }
}

btn.addEventListener("click", () => {
  speak(answer)

})

let inputField = document.querySelector("#inputfield")
let playButton = document.querySelector("#playbutton")
