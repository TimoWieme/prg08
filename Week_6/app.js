import { createChart, updateChart } from "./scatterplot.js"

const nn = ml5.neuralNetwork({ task: 'regression', debug: true })


function loadData() {
    Papa.parse("./data/cars.csv", {
        download: true,
        header: true, 
        dynamicTyping: true,
        complete: (results) => createData(results.data)
    })
}

function showData(data){
const columns = data.map(car => ({
    x: car.horsepower,
    y: car.mpg,
}))
createChart(columns)
}

function createData(data){
    console.log(data)
    showData(data)
    createNeuralNetwork(data)
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
            // Trainen met meer onderdelen maakt de voorspelling slechter
            nn.addData({ horsepower: car.horsepower}, { mpg: car.mpg })
            }
        nn.normalizeData()
        nn.train({ epochs: 15 }, () => finishedTraining())
        save(test1);
    }

async function finishedTraining() {
    const testCar = { horsepower: 90}

    const results = await nn.predict(testCar)
    console.log(results)

    const prediction = results[0].value
    console.log(`Geschat verbruik: ${prediction}`)

    let chartresults = []
    //  beginnen bij hoger HP verbeterd de voorspelling
    for(let hp = 60; hp<250; hp+=2) {
        const results = await nn.predict({horsepower:hp })
        chartresults.push({ x: hp, y: results[0].value})
    }
    updateChart("Predictions", chartresults)
}

// start de applicatie
loadData()

