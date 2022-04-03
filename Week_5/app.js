import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

const csvFile = "./data/titanic.csv"
const trainingLabel = "Survived"
const ignoredColumns = ['Name', 'Cabin', 'PassengerId', 'Ticket', 'Fare']
let amountCorrect = 0;
let totalAmount = 0;
let actuallySurvived = 0;
let actuallyDied = 0;
let trueFalse = 0;
let falseTrue = 0;

function loadData(){
    Papa.parse(csvFile, {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => trainModel(results.data)
    })
}


function trainModel(data) {
    
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    totalAmount = testData.length

    let decisionTree = new DecisionTree({
        ignoredAttributes: ignoredColumns,
        trainingSet: trainData,
        categoryAttr: trainingLabel,
        maxTreeDepth : 3 
    })
    
    data.sort(() => (Math.random() - 0.5))
    
    let passenger = testData[100]
    let mySelf = [{Name : "Timo Wieme",  Sex : "male", Age : 22}]
    console.log(mySelf)
    let prediction = decisionTree.predict(passenger)
    let predictionSelf = decisionTree.predict(mySelf)
    console.log(`${mySelf[0].Name} is predicted to ${predictionSelf == 0 ? "died" : "survived"} but actually ${mySelf[0].Survived == 0? "died" : "survived"} `)
    console.log(` ${passenger.Name} is predicted to ${prediction == 0 ? "died" : "survived"} but actually ${passenger.Survived == 0? "died" : "survived"}`)
    
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())
    
    for (let i = 0; i < testData.length; i++){
        testPassenger(testData[i])
    }
    
    function testPassenger(passenger) {
        // kopie van passenger maken, zonder het label
        const passengerWithoutLabel = Object.assign({}, passenger)
        delete passengerWithoutLabel.Survived
        
        // prediction
        let prediction = decisionTree.predict(passengerWithoutLabel)
        
        // vergelijk de prediction met het echte label
        if (prediction == passenger.Survived) {
            // console.log("Deze voorspelling is goed gegaan!")
            amountCorrect++
        } else{
            // console.log("Deze voorspelling is niet goed gegaan")
        }

        // Check if the survived passengers actually survived
        if (prediction == 1 && passenger.Survived == 1){
            actuallySurvived++
        }
        // Check if the died passengers actually died
        if (prediction == 0 && passenger.Survived == 0){
            actuallyDied++
        }
        // Check if survived passengers actually died instead
        if (prediction == 1 && passenger.Survived == 0){
            trueFalse++
        }
        // Check if died passengers actually survived instead
        if (prediction == 0 && passenger.Survived == 1){
            falseTrue++
        }
    }
    
    let accuracy = Math.floor( amountCorrect / totalAmount * 100)

    let percentageSurvived = Math.floor (actuallySurvived / totalAmount * 100)
    let percentageDied = Math.floor (actuallyDied / totalAmount * 100)
    let percentageTrueFalse = Math.floor (trueFalse / totalAmount * 100)
    let percentageFalseTrue = Math.floor (falseTrue / totalAmount * 100)

    document.getElementById("accuracy").innerHTML ="The accuracy is " + accuracy + "%"
    document.getElementById("self").innerHTML = `${mySelf[0].Name} who is a ${mySelf[0].Sex}, would have ${predictionSelf == 0 ? "died" : "survived"} on the Titanic.  `
    document.getElementById("actuallySurvived").innerHTML = actuallySurvived + " (" + percentageSurvived + "%)"
    document.getElementById("actuallyDied").innerHTML = actuallyDied + " (" + percentageDied + "%)"
    document.getElementById("trueFalse").innerHTML = trueFalse + " (" + percentageTrueFalse + "%)"
    document.getElementById("falseTrue").innerHTML = falseTrue + " (" + percentageFalseTrue + "%)"
}



loadData()