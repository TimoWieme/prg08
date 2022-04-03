<h1> Programmeren week7 - datasets </h2>
<p> <a href = "https://youtu.be/5SDlIoI5_dY"> Link naar mijn youtube video </a>
<p> <a href = ""> Link naar prototype </a>
<ul>
 <h3> <b> Concept beschrijving: </b> </li>

## Wat is jouw TLE project, en wat is daarvoor jouw concept? Hoe draagt dit bij aan Rotterdam:Duurzame Stad?
<li> Mijn TLE project is Rotterdam duurzame stad, wij moeten hierbij een AI oplossing denken voor Rotterdam, waardoor de stad een stukje duurzamer wordt. </li>
<li> Het concept dat wij hebben bedacht, is een navigatiesysteem die jou niet alleen van A naar B brengt, maar ook nog eens de meest duurzame route geeft (tenzij het tijdsverlies te groot is bij de duurzame route). Buiten dat de meest duurzame route wordt gegeven voor de auto, wordt er ook nog de meest duurzame reisoptie voorgesteld, zodat je bijvoorbeeld ook voor het OV zou kunnen kiezen. </li>
<li> Het concept dat ik heb bedacht voor deze inleveropdracht is dat ik aan de hand van ML5 Neural Networks een voorspelling maak hoeveel brandstof een auto gemiddeld verbruikt op een route. Met deze voorspelling kan ik dan uitrekenen hoeveel CO2 er uitgestoot wordt op de route. Ik zal voor het concept een formulier erbij maken zodat mensen het aantal kilometers en hun kentekenplaat kunnen invoeren. Aan de hand van deze informatie kan de voorspelling gemaakt worden. </li>
<li> Dit zal bijdragen aan Rotterdam:Duurzame Stad, omdat reizigers die toch al de auto pakken, op deze manier zien hoeveel zij uitstoten en hierdoor misschien wat sneller het OV of fiets pakken. </li>

## Wat is de toegevoegde waarde van AI in jouw concept?
<li> De toegevoegde waarde die AI gaat hebben bij dit concept is dat de gebruiker een voorspelling krijgt van hoeveel uitstoot en verbruik hij/zij heeft voor een bepaalde route, en op deze manier na gaat denken of het niet beter is om de fiets of OV te pakken. </li>

## Welke data heb je nodig en hoe kom je daar aan?
<li> De data die ik hierbij nodig heb is het kenteken van het voortuig waarmee gereden wordt. Met dit kenteken kan er via een API gekeken worden hoeveel de auto verbruikt. (https://overheid.io/documentatie/voertuiggegevens API.) Verder heb ik een dataset nodig met hoeveel verbruik bepaalde auto's hebben zodat ik kan uitrekenen hoeveel ze uitstoten. De dataset die ik gebruik komt van Kaggle en heet : CO2 Emission by Vehicles (https://www.kaggle.com/datasets/debajyotipodder/co2-emission-by-vehicles/code) </li>

## Welke library / algoritme denk jij dat geschikt is voor jouw concept?
<li> De algoritme die ik ga gebruiken is ML5 Neural networks, de API die ik ga gebruiken is de https://overheid.io/documentatie/voertuiggegevens API (voor het ophalen van de gegevens aan de hand van een kenteken.) </li>
<li> ML5 neural networks zou ik eventueel kunnen gebruiken voor het voorspellen hoeveel uitstoot er is per route </li>

## Beschrijf de de uiteindelijke vorm (Website, app, installatie, etc).  </h3> </li>
<li> De uiteindelijke vorm voor het concept is een website. </li>

## Beschrijf kort de eindgebruiker en de doelgroep.
<li> De eindgebruiker en doelgroep zijn weggebruikers tussen de 18 en 32 jaar oud die regelmatig van, naar en door Rotterdam reizen, deze mensen maken ook regelmatig gebruik van een routeplanner. Deze doelgroep wilt ook liever wat beter zijn voor het milieu. </li>
</ul>


## Accuracy van het prototype wordt getoond met de "prediction" lijn in de drawScatterplot. Wordt uitgelegd in video
## Ik heb de accuracy verbeterd door de epochs aan te passen, ook had ik eerst een berekening van CO2 voorspeld in de scatterplot, maar ik heb deze veranderd naar berekenen hoeveel benzine je verbruikt en dit vermenigvuldigd met 2392 (dat is hoeveel gram CO2 je uitstoot per liter benzine) Ik heb ook geprobeerd om met meer onderdelen te trainen, maar hier werd het niet perse accurater van. Juist iets minder.
