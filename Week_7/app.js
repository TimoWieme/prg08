import { createChart, updateChart } from "./scatterplot.js";

const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
// CVS File
const csvFile = "./data/car.csv";
// Columns die ik niet gebruik
const ignoredColumns = ["FuelConsumptionHwy", "FuelConsumptionCombMpg", "CO2Emissions", "EngineSize", "FuelType"]

// function getPlate() {
//     console.log("hallo");
//     var licensePlate = document.getElementById("plateForm").value;
//     document.getElementById("test").innerHTML = "Your Licenseplate is: " + licensePlate
//   }

// Ophalen van data uit CSV file
function loadData() {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => deleteColumn(results.data)
  })
}

// Verwijder ongebruikte colommen
function deleteColumn(data) {
  for (let i = 0; i < data.length; i++) {
    for (let r = 0; r < ignoredColumns.length; r++) {
      delete data[i][ignoredColumns[r]]
    }
  }
  showData(data)
  createNeuralNetwork(data)
}

function showData(data) {
  const columns = data.map(car => ({
    x: car.FuelConsumptionComb,
    y: car.FuelConsumptionCity
  }))

  createChart(columns)
}

//
// teken een scatterplot
//
function drawScatterplot(data) {

}


//
// maak en train het neural network
//
async function createNeuralNetwork(data) {
  data.sort(() => (Math.random() - 0.5))
  // een voor een de data toevoegen aan het neural network
  for (let car of data) {
    // Meest accuraat wanneer ik train op EngineSize, fuelConsumptionComb en FuelType
    nn.addData({ fuelConsumptionCity: car.FuelConsumptionCity}, {fuelConsumptionComb: car.FuelConsumptionComb})
  }
  console.log(data)
  nn.normalizeData()
  // Meest accuraat met 10 epochs
  nn.train({ epochs: 10 }, () => finishedTraining())
}

async function finishedTraining() {
  const testCar = { fuelConsumptionCity: 12 }
  const results = await nn.predict(testCar)
  // Bereken hoeveelheid benzine verbruik in liters per 100km
  const prediction = Math.round( results[0].fuelConsumptionComb)
  // Bereken hoeveel CO2 uitgestoten wordt in kg per 100km
  const emission = Math.round(prediction * 2392 / 1000)
  console.log(`Geschatte brandstofverbruik stad en snelweg gecombineerd: ${prediction} liter/100km, daarmee stoot je ongeveer ${emission}kg co2 uit per 100km. `)

  let chartresults = []
  
  for (let fuelCity = 4; fuelCity < 25; fuelCity++) {
    const results = await nn.predict({ fuelConsumptionCity: fuelCity})
    chartresults.push({ x: fuelCity, y: results[0].fuelConsumptionComb })
  }
  updateChart("FuelConsumption City Prediction", chartresults)
}

// start de applicatie
loadData()
