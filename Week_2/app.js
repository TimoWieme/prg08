const image = document.getElementById('image')
const fileButton = document.querySelector("#file")
let answer = ""
image.addEventListener('load', () => userImageUploaded())

fileButton.addEventListener("change", (event) => loadFile(event))

function loadFile(event) {
  image.src = URL.createObjectURL(event.target.files[0])
}

let synth = window.speechSynthesis

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


console.log('ml5 version:', ml5.version);
// Initialize the Image Classifier method with MobileNet
const classifier = ml5.imageClassifier('MobileNet', modelLoaded);

// When the model is loaded

function modelLoaded() {
  console.log('Model Loaded!');


};

function userImageUploaded() {
  console.log("The image is now visible in the DOM")
  // Make a prediction with a selected image
  classifier.classify(document.getElementById('image'), (err, results) => {
    console.log(results);
    document.getElementById("first").innerHTML =  "First Guess : " + results[0].label
    document.getElementById("second").innerHTML =  "Second Guess : " + results[1].label
    document.getElementById("third").innerHTML =  "Third Guess : " + results[2].label
    
    answer = "Ik gok dat het een " + results[0].label + "is"
    answerElement.innerHTML += answer
  })
}

btn.addEventListener("click", () => {
  speak(answer)

})



let inputField = document.querySelector("#inputfield")
let playButton = document.querySelector("#playbutton")

