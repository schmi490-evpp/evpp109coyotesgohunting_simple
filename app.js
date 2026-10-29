// ======================================
// EVPP Predator-Prey Simulation
// Part 1 - Setup & Global Variables
// ======================================

import { firebaseConfig } from "./firebase-config.js";

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --------------------------------------
// Student info
// --------------------------------------

let studentName = "";
let studentEmail = "";

let runId = "";

let checkpointGeneration = 10;

// --------------------------------------
// Simulation data
// --------------------------------------

let generation = 1;

let mice = 10;

let coyotes = 1;

let populationHistory = [];

let simulationComplete = false;

// slightly different hunting conditions
// for each student

let huntModifier =
  0.9 + Math.random() * 0.2;

// chart

let chart;

// --------------------------------------
// DOM Elements
// --------------------------------------

const loginCard =
document.getElementById("login-card");

const simulationArea =
document.getElementById("simulation-area");

const startBtn =
document.getElementById("start-btn");

const huntBtn =
document.getElementById("hunt-btn");

const nameDisplay =
document.getElementById("display-name");

const runIdDisplay =
document.getElementById("run-id");

const miceDisplay =
document.getElementById("mice-count");

const coyoteDisplay =
document.getElementById("coyote-count");

const generationDisplay =
document.getElementById("generation-number");

const huntResult =
document.getElementById("hunt-result");

const resultsBody =
document.getElementById("results-body");

const screenshotWarning =
document.getElementById("screenshot-warning");

const csvButton =
document.getElementById("download-csv");

const certificateButton =
document.getElementById("download-certificate");

// --------------------------------------
// Start Simulation
// --------------------------------------

startBtn.addEventListener("click", startSimulation);

function startSimulation() {

  studentName =
    document.getElementById("student-name")
    .value.trim();

  studentEmail =
    document.getElementById("student-email")
    .value.trim();

  if (!studentName || !studentEmail) {

    alert(
      "Please enter your name and GMU email."
    );

    return;
  }

  runId =
    "PP-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  checkpointGeneration =
    Math.floor(Math.random() * 8) + 8;

  loginCard.classList.add("hidden");

  simulationArea.classList.remove("hidden");

  nameDisplay.textContent =
    studentName;

  runIdDisplay.textContent =
    runId;

  initializeChart();

  renderGeneration();
}
// ======================================
// Practice Generations 1-4
// ======================================

const practiceGenerations = {

  1: {
    miceStart: 10,
    coyotesStart: 1,
    captures: [1]
  },

  2: {
    miceStart: 18,
    coyotesStart: 1,
    captures: [3]
  },

  3: {
    miceStart: 30,
    coyotesStart: 1,
    captures: [6]
  },

  4: {
    miceStart: 48,
    coyotesStart: 2,
    captures: [6,4]
  }

};

// ======================================
// Render Generation
// ======================================

function renderGeneration() {

  generationDisplay.textContent =
    generation;

  miceDisplay.textContent =
    mice;

  coyoteDisplay.textContent =
    coyotes;

  renderMice();

  if(generation === checkpointGeneration){

  screenshotWarning.classList.remove(
    "hidden"
  );

  screenshotWarning.innerHTML =

`
<h3>
📸 Screenshot Required
</h3>

<p>
Take a screenshot now and upload it
to Canvas later.
</p>

<ul>
<li>Name</li>
<li>Run ID</li>
<li>Generation ${checkpointGeneration}</li>
<li>Mouse Population</li>
<li>Coyote Population</li>
</ul>
`;

}
  
  else{

    screenshotWarning.classList.add("hidden");

  }

}

// ======================================
// Render Mice
// ======================================

function renderMice(){

  let shownMice =
    Math.min(
      Math.round(mice / 4),
      25
    );

  let html = "";

  for(let i=0;i<shownMice;i++){

    html += "🐭 ";

  }

  document.getElementById(
    "mouse-area"
  ).innerHTML = html;

}

// ======================================
// Hunt Button
// ======================================

huntBtn.addEventListener(
  "click",
  runGeneration
);

// ======================================
// Run Generation
// ======================================

async function runGeneration(){

  huntBtn.disabled = true;

  animateCoyote();

  await wait(1800);

  if(generation <= 4){

    runPracticeGeneration();

  }
  else{

    runRandomGeneration();

  }

  huntBtn.disabled = false;

}

// ======================================
// Animation
// ======================================

function animateCoyote(){

  const coyote =
    document.getElementById(
      "coyote-icon"
    );

  coyote.style.left = "10px";

  setTimeout(() => {

    coyote.style.left = "80%";

  },100);

}

// ======================================
// Delay Helper
// ======================================

function wait(ms){

  return new Promise(resolve => {

    setTimeout(resolve, ms);

  });

}

// ======================================
// Practice Generations
// ======================================

function runPracticeGeneration(){

  const data =
    practiceGenerations[generation];

  let totalCaptured = 0;

  for(let value of data.captures){

    totalCaptured += value;

  }

  let survivingMice =
    data.miceStart -
    totalCaptured;

  let survivingCoyotes = 0;

  let offspring = 0;

  data.captures.forEach(catchCount => {

    if(catchCount >= 5){

      survivingCoyotes++;

      offspring += Math.floor(
        catchCount / 5
      );

    }

  });

  addResultRow(
    generation,
    data.miceStart,
    data.coyotesStart,
    totalCaptured
  );

  updateGraph(
    generation,
    data.miceStart,
    data.coyotesStart
  );

  huntResult.innerHTML =

    `
    Practice Generation ${generation}<br>
    Mice Captured: ${totalCaptured}<br>
    Surviving Mice: ${survivingMice}<br>
    Coyotes Surviving: ${survivingCoyotes}<br>
    Offspring Produced: ${offspring}
    `;

  if(generation === 1){

    mice = 18;
    coyotes = 1;

  }

  if(generation === 2){

    mice = 30;
    coyotes = 1;

  }

  if(generation === 3){

    mice = 48;
    coyotes = 2;

  }

  if(generation === 4){

    mice = 76;
    coyotes = 2;

    huntResult.innerHTML +=
      "<br><br><strong>Practice complete. From now on your results will be unique.</strong>";

  }

  generation++;

  renderGeneration();

}

// ======================================
// Student-Controlled Generations (5-20)
// ======================================

function runRandomGeneration(){

  let capturesPerCoyote = [];

  let totalCaptured = 0;

  // Each coyote hunts independently

  for(let i = 0; i < coyotes; i++){

    let captured =
      calculateCaptureCount(mice);

    capturesPerCoyote.push(captured);

    totalCaptured += captured;

  }

  // can't catch more mice than exist

  totalCaptured =
    Math.min(
      totalCaptured,
      mice
    );

  let miceSurviving =
    mice - totalCaptured;

  let survivingCoyotes = 0;

  let offspring = 0;

  capturesPerCoyote.forEach(value => {

    if(value >= 5){

      survivingCoyotes++;

      offspring += Math.floor(
        value / 5
      );

    }

  });

  addResultRow(
    generation,
    mice,
    coyotes,
    totalCaptured
  );

  updateGraph(
    generation,
    mice,
    coyotes
  );

  if(generation >= 5){
  populationHistory.push({

    generation,
    mice,
    coyotes,

    capturesPerCoyote,
    
    totalCaptured,
    miceSurviving,
    survivingCoyotes,
    offspring

  });
    }

   let coyoteResults = "";

  capturesPerCoyote.forEach(

    (captured,index) => {

      coyoteResults +=

        `Coyote ${index+1} caught ${captured} mice<br>`;

    }

  );

  huntResult.innerHTML =

    `
    <strong>
    Generation ${generation}
    </strong>

    <br><br>

    ${coyoteResults}

    <br>

    Total Captured:
    ${totalCaptured}

    <br>

    Mice Surviving:
    ${miceSurviving}

    <br>

    Coyotes Surviving:
    ${survivingCoyotes}

    <br>

    Offspring Produced:
    ${offspring}
    `;

  // Next generation mouse population

  let nextMice =
    miceSurviving * 2;

  if(nextMice < 10){

    nextMice = 10;

  }

  if(nextMice > 100){

    nextMice = 100;

  }

  // Next generation coyote population

  let nextCoyotes =
    survivingCoyotes + offspring;

  if(nextCoyotes < 1){

    nextCoyotes = 1;

  }

  mice = nextMice;

  coyotes = nextCoyotes;

  generation++;

  if(generation > 20){

    completeSimulation();

    return;

  }

  renderGeneration();

}

// ======================================
// Realistic Hunting Model
// ======================================

function calculateCaptureCount(

  mousePopulation

){

  // expected success rises with
  // available prey

  let expectedCapture =
    mousePopulation / 12;

  // student-specific modifier

  expectedCapture =
    expectedCapture *
    huntModifier;

  // add randomness

  let variation =
    (Math.random() * 6) - 3;

  let captured =
    Math.round(
      expectedCapture + variation
    );

  captured =
    Math.max(
      0,
      captured
    );

  captured =
    Math.min(
      captured,
      15
    );

  return captured;

}

// ======================================
// Results Table
// ======================================

function addResultRow(

  generationNumber,
  miceCount,
  coyoteCount,
  captured

){

  const row =
    document.createElement("tr");

  row.innerHTML = `
    <td>${generationNumber}</td>
    <td>${miceCount}</td>
    <td>${coyoteCount}</td>
    <td>${captured}</td>
  `;

  resultsBody.appendChild(row);

}

// ======================================
// Population Graph
// ======================================

function initializeChart(){

  const ctx =
    document
      .getElementById(
        "populationChart"
      )
      .getContext("2d");

  chart = new Chart(ctx, {

    type: "line",

    data: {

      labels: [],

      datasets: [

        {
          label: "Mice",

          data: [],

          borderColor: "#2563eb",

          backgroundColor:
            "rgba(37,99,235,0.1)",

          tension: 0.25
        },

        {
          label: "Coyotes",

          data: [],

          borderColor: "#dc2626",

          backgroundColor:
            "rgba(220,38,38,0.1)",

          tension: 0.25
        }

      ]

    },

    options: {

      responsive: true,

      maintainAspectRatio: false

    }

  });

}

function updateGraph(

  generationNumber,
  miceCount,
  coyoteCount

){

  chart.data.labels.push(
    generationNumber
  );

  chart.data.datasets[0]
       .data.push(miceCount);

  chart.data.datasets[1]
       .data.push(coyoteCount);

  chart.update();

}

// ======================================
// Simulation Complete
// ======================================

async function completeSimulation(){

  simulationComplete = true;

  huntBtn.disabled = true;

  huntResult.innerHTML = `

  <strong>
  Simulation Complete
  </strong>

  <br><br>

  Run ID:
  ${runId}

  <br>

  Results are being saved.

  `;

  await saveToFirestore();

}

// ======================================
// Save Submission
// ======================================

async function saveToFirestore(){

  try{

    await addDoc(

      collection(
        db,
        "labSubmissions"
      ),

      {

        studentName,

        studentEmail,

        runId,

        checkpointGeneration,

        timestamp:
          new Date()
          .toISOString(),

        history:
          populationHistory

      }

    );

    huntResult.innerHTML +=

      `

      <br><br>

      ✅ Results saved successfully.

      `;

  }
  catch(error){

    console.error(error);

    huntResult.innerHTML +=

      `

      <br><br>

      ❌ Firestore save failed.

      `;

  }

}

// ======================================
// CSV Export
// ======================================

csvButton.addEventListener(
  "click",
  downloadCSV
);

function downloadCSV(){

  let csv =

`Generation,Mice,Coyotes,CoyoteCaptures,TotalCaptured,MiceSurviving,CoyoteSurviving,Offspring
`;

  populationHistory.forEach(row => {

    csv +=

`${row.generation},
${row.mice},
${row.coyotes},
"${row.capturesPerCoyote.join(", ")}",
${row.totalCaptured},
${row.miceSurviving},
${row.survivingCoyotes},
${row.offspring}
`.replace(/\n/g,"");
    

    csv += "\n";

  });

  const blob =
    new Blob(
      [csv],
      {type:"text/csv"}
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
`${studentName.replaceAll(" ","_")}_PredatorPreyData.csv`;

  link.click();

}

// ======================================
// Completion Certificate
// ======================================

certificateButton.addEventListener(
  "click",
  downloadCertificate
);

function downloadCertificate(){

  if(!simulationComplete){

    alert(
      "Complete the simulation first."
    );

    return;

  }

  const finalData =
    populationHistory[
      populationHistory.length - 1
    ];

  const certificateText =

`EVPP Predator-Prey Simulation

Student:
${studentName}

Email:
${studentEmail}

Run ID:
${runId}

Completed:
${new Date().toLocaleString()}

Final Generation:
20

Final Mouse Population:
${finalData.mice}

Final Coyote Population:
${finalData.coyotes}
`;

  const blob =
    new Blob(
      [certificateText],
      {type:"text/plain"}
    );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
`${studentName.replaceAll(" ","_")}_CompletionCertificate.txt`;

  link.click();

}



