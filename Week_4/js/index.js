let model
let videoWidth, videoHeight
let ctx, canvas
const log = document.querySelector("#array")
const VIDEO_WIDTH = 720
const VIDEO_HEIGHT = 405

const LABELS_MAP = {
    'Rock': 0,
    'Paper': 1,
    'Scissor': 2
  }

// video fallback
navigator.getUserMedia = navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia

// array posities van de vingerkootjes
let fingerLookupIndices = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20]
}


//
// start de applicatie
//
async function main() {
    model = await handpose.load()
    const video = await setupCamera()
    video.play()
    startLandmarkDetection(video)
}

//
// start de webcam
//
async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            "Webcam not available"
        )
    }

    const video = document.getElementById("video")
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: "user",
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT
        }
    })
    video.srcObject = stream

    return new Promise(resolve => {
        video.onloadedmetadata = () => {
            resolve(video)
        }
    })
}

//
// predict de vinger posities in de video stream
//
async function startLandmarkDetection(video) {

    videoWidth = video.videoWidth
    videoHeight = video.videoHeight

    canvas = document.getElementById("output")

    canvas.width = videoWidth
    canvas.height = videoHeight

    ctx = canvas.getContext("2d")

    video.width = videoWidth
    video.height = videoHeight

    ctx.clearRect(0, 0, videoWidth, videoHeight)
    ctx.strokeStyle = "red"
    ctx.fillStyle = "red"

    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1) // video omdraaien omdat webcam in spiegelbeeld is

    predictLandmarks()
}

//
// predict de locatie van de vingers met het model
//
async function predictLandmarks() {
    ctx.drawImage(video,0,0,videoWidth,videoHeight,0,0,canvas.width,canvas.height)
    // prediction!
    const predictions = await model.estimateHands(video)
    if (predictions.length > 0) {
        const result = predictions[0].landmarks
        drawKeypoints(ctx, result, predictions[0].annotations)
        logData(predictions)
    }

    // 60 keer per seconde is veel, gebruik setTimeout om minder vaak te predicten
    requestAnimationFrame(predictLandmarks)

    // setTimeout(()=>predictLandmarks(), 1000)
}

//
// toon de eerste 20 waarden in een log - elk punt heeft een X, Y, Z waarde
//
function logData(predictions) {
    let str = ""
    // console.log(predictions[0].landmarks)
    for (let i = 0; i < 20; i++) {
        str += predictions[0].landmarks[i][0] + ", " + predictions[0].landmarks[i][1] + ", " + predictions[0].landmarks[i][2] + ", "
    }
    log.innerText = str
}

//
// teken hand en vingers
//
function drawKeypoints(ctx, keypoints) {
    const keypointsArray = keypoints;

    for (let i = 0; i < keypointsArray.length; i++) {
        const y = keypointsArray[i][0]
        const x = keypointsArray[i][1]
        drawPoint(ctx, x - 2, y - 2, 3)
    }

    const fingers = Object.keys(fingerLookupIndices)
    for (let i = 0; i < fingers.length; i++) {
        const finger = fingers[i]
        const points = fingerLookupIndices[finger].map(idx => keypoints[idx])
        drawPath(ctx, points, false)
    }
}

//
// teken een punt
//
function drawPoint(ctx, y, x, r) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
}
//
// teken een lijn
//
function drawPath(ctx, points, closePath) {
    const region = new Path2D()
    region.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
        const point = points[i]
        region.lineTo(point[0], point[1])
    }

    if (closePath) {
        region.closePath()
    }
    ctx.stroke(region)
}

// const predictions = await model.estimateHands(video)
// if (predictions.length > 0) {
//     const result = predictions[0].landmarks
//     // x, y, z van de top van de wijsvinger:
//     let y = predictions[0].landmarks[8][0]
//     let x = predictions[0].landmarks[8][1]
//     let z = predictions[0].landmarks[8][2]
// }

// Add the current hand tracking data to the classifier
function addExample(label) {
    if (predictions.length > 0) {
      const features = predictions[0].landmarks;
      const tensors = tf.tensor(features)
      // Add an example with a label to the classifier
      classifier.addExample(tensors, label);
      updateCounts();
    } else {
      console.log('No gesture is detected')
    }
  }

// Predict the current frame.
async function classify() {
    // Get the total number of labels from classifier
    const numLabels = classifier.getNumClasses();
    if (numLabels <= 0) {
      console.error('There is no examples in any label');
      return;
    }
    if (predictions.length > 0) {
      const results = await classifier.predictClass(tf.tensor(predictions[0].landmarks));
        // result.label is the label that has the highest confidence
        if (results.label) {
          select('#result').html(results.label);
        }
    }
}


function createButtons() {
    // When the A button is pressed, add the current frame
    // from the video with a label of "rock" to the classifier
    buttonA = select('#trainRock');
    buttonA.mousePressed(function() {
      addExample('Rock');
    });
  
    // When the B button is pressed, add the current frame
    // from the video with a label of "paper" to the classifier
    buttonB = select('#trainPaper');
    buttonB.mousePressed(function() {
      addExample('Paper');
    });
  
    // When the C button is pressed, add the current frame
    // from the video with a label of "scissor" to the classifier
    buttonC = select('#trainScissors');
    buttonC.mousePressed(function() {
      addExample('Scissor');
    });
  
    // Reset buttons
    resetBtnA = select('#resetRock');
    resetBtnA.mousePressed(function() {
      clearLabel('Rock');
    });
      
    resetBtnB = select('#resetPaper');
    resetBtnB.mousePressed(function() {
      clearLabel('Paper');
    });
      
    resetBtnC = select('#resetScissors');
    resetBtnC.mousePressed(function() {
      clearLabel('Scissors');
    });
  
    // Predict button
    buttonPredict = select('#buttonPredict');
    buttonPredict.mousePressed(classify);
  
    // Clear all classes button
    buttonClearAll = select('#clearAll');
    buttonClearAll.mousePressed(clearAllLabels);
  }

  // Clear the examples in one label
function clearLabel(label) {
    classifier.clearClass(label);
    updateCounts();
  }
  
  // Clear all the examples in all labels
  function clearAllLabels() {
    classifier.clearAllClasses();
    updateCounts();
  }

  // Update the example count for each label	
function updateCounts() {
    const counts = classifier.getClassExampleCount();
  
    select('#exampleRock').html(counts['Rock'] || 0);
    select('#examplePaper').html(counts['Paper'] || 0);
    select('#exampleScissor').html(counts['Scissor'] || 0);
  }
  
//
// start
//
main()