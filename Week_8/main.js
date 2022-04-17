const nn = ml5.neuralNetwork({ task: 'regression', debug: true })

// Get button
let button = document.querySelector("#plate")
button.addEventListener("click", getPlate)

let model
let licensePlate
var image = document.getElementById("img1");

// Load the trained model
function loadModel() {
    const modelDetails = {
        model: 'models/model.json',
        metadata: 'models/model_meta.json',
        weights: 'models/model.weights.bin'
    }
    nn.load(modelDetails)

    console.log("model geladen")
}

// Get the licenceplate from the input field
function getPlate(e) {
    var licensePlate = document.getElementById("plateForm").value;
    var kilometres = document.getElementById("kilometres").value;
    console.log(licensePlate);
    console.log(kilometres);
    // API AANROEPEN MET LICENSEPLATE
    useAPI(licensePlate, kilometres)
    e.preventDefault()

}

// Get data of the car using the api and the licenseplate
async function useAPI(licensePlate, kilometres) {
    const result = await fetch(`https://api.overheid.io/voertuiggegevens/${licensePlate}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json',
            'ovio-api-key': 'db354afa306f071e41b1d6f51d887ce59a0720102e361f2bf0fca9cf97b6117b'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    })

    const data = await result.json()

    // Check if "brandstofverbruik_stad" exists
    if (data.brandstof[0].hasOwnProperty('brandstofverbruik_stad')) {
        let verbruikStad = { fuelConsumptionCity: data.brandstof[0].brandstofverbruik_stad }
        // console.log(verbruikStad)
        const results = await nn.predict(verbruikStad)
        // console.log(results)

        // Make prediction
        const prediction = Math.round(results[0].fuelConsumptionComb)

        // Calculate emission
        const emission = Math.round(prediction * 2392 / 1000)
        // console.log(kilometres);
        const emissionPerKm = Math.round(emission / 100 * kilometres)
        // console.log(emissionPerKm);

        // If kilometres is below 8, show a image of bicycle, else dont
        if (kilometres < 8) {
            if (!kilometres){
                image.style.display = 'none'
            } else if (image.style.display = 'none')
            image.style.display = 'block';
            document.getElementById("imageText").innerHTML =  `Its only ${kilometres} kilometres! Take the bicyle! If you still take the car, you can see your emission down below!`
          } else {
              image.style.display = 'none'
          }

          // If no kilometres have been given
        if (!kilometres) {
            console.log("Geen kilometers opgegeven");
        } else {
            document.getElementById("kms").innerHTML = `You will emit ${emissionPerKm} kg of CO2 with this trip.`

        }
        // console.log(`Geschatte brandstofverbruik stad en snelweg gecombineerd: ${prediction} liter/100km, daarmee stoot je ongeveer ${emission}kg co2 uit per 100km. `)
        document.getElementById("co2").innerHTML = `Your predicted fuel usage is: ${prediction} liter/100km, you will emit about ${emission} kg CO2 every 100 kilometres`
        document.getElementById("OV").innerHTML = `Public transport would be a better choice!`
    } else {
        document.getElementById("co2").innerHTML = `Unfortunately we cant make a prediction for this car!`
    }
}

loadModel()