// Initialize the Object Detector module
let objectDetector;

// Holds the image we want to run object detection on
let video;

function preload() {
    objectDetector = ml5.objectDetector('cocossd');
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    objectDetector.detect(video, gotResult);
}

function gotResult(error, results) {

    if (error) {
        console.error(error);
    } else {
        console.log(results);

        drawResults(results);

    }
}

function drawResults(results) {

    results.forEach((result) => {

        // Generates a random color for each object
        const r = Math.random()*256|0;
        const g = Math.random()*256|0;
        const b = Math.random()*256|0;

        // Draw the text
        stroke(0, 0, 0);
        strokeWeight(2);
        textSize(16);
        fill(r, g, b);
        text(`${result.label} (${result.confidence.toFixed(2)}%)`, result.x, result.y - 10);

        // Draw the rectangle stroke
        noFill();
        strokeWeight(3);
        stroke(r, g, b);
        rect(result.x, result.y, result.width, result.height);
    });
};