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

let studentName = "";
let studentEmail = "";
let runId = "";

let generation = 1;
let mice = 10;
let coyotes = 1;

let labHistory = [];

const practiceGenerations = {
  1: {},
  2: {},
  3: {},
  4: {}
};

generatePracticeGenerations();

function randomInteger(min,max){

  return Math.floor(
    Math.random() *
    (max - min + 1)
  ) + min;

}

function generatePracticeGenerations(){

  // Generation 1

  let g1Catch =
    randomInteger(1,4);

  practiceGenerations[1] = {

    catches:[g1Catch],

    survivingMice:
      10 - g1Catch,

    survivingCoyotes:
      0,

    offspring:
      0,

    nextMice:
      Math.max(
        (10-g1Catch)*2,
        10
      ),

    nextCoyotes:
      1
  };

  // Generation 2

  let g2Catch =
    randomInteger(1,4);

  practiceGenerations[2] = {

    catches:[g2Catch],

    survivingMice:
      18 - g2Catch,

    survivingCoyotes:
      0,

    offspring:
      0,

    nextMice:
      Math.min(
        (18-g2Catch)*2,
        100
      ),

    nextCoyotes:
      1
  };

  // Generation 3

  let g3Catch =
    randomInteger(5,9);

  practiceGenerations[3] = {

    catches:[g3Catch],

    survivingMice:
      30 - g3Catch,

    survivingCoyotes:
      1,

    offspring:
      Math.floor(g3Catch/5),

    nextMice:
      Math.min(
        (30-g3Catch)*2,
        100
      ),

    nextCoyotes:
      1 + Math.floor(g3Catch/5)
  };

  // Generation 4

  let catch1 =
    randomInteger(5,8);

  let catch2 =
    randomInteger(1,4);

  practiceGenerations[4] = {

    catches:[catch1,catch2],

    survivingMice:
      48 - catch1 - catch2,

    survivingCoyotes:
      1,

    offspring:
      Math.floor(catch1/5),

    nextMice:
      Math.min(
        (48-catch1-catch2)*2,
        100
      ),

    nextCoyotes:
      1 + Math.floor(catch1/5)
  };

}

const loginCard =
document.getElementById("login-card");

const labArea =
document.getElementById("lab-area");

const startBtn =
document.getElementById("start-btn");

const displayName =
document.getElementById("display-name");

const runIdDisplay =
document.getElementById("run-id");

const generationNumber =
document.getElementById("generation-number");

const miceCount =
document.getElementById("mice-count");

const coyoteCount =
document.getElementById("coyote-count");

const instructionsBox =
document.getElementById(
  "generation-instructions"
);

const coyoteInputs =
document.getElementById(
  "coyote-inputs"
);

const resultsOutput =
document.getElementById(
  "results-output"
);

startBtn.addEventListener(
  "click",
  startLab
);

function startLab(){

  studentName =
    document
      .getElementById("student-name")
      .value
      .trim();

  studentEmail =
    document
      .getElementById("student-email")
      .value
      .trim();

  if(
    !studentName ||
    !studentEmail
  ){
    alert(
      "Please enter your name and email."
    );
    return;
  }

  runId =
    "PP-" +
    Math.random()
      .toString(36)
      .substring(2,8)
      .toUpperCase();

  displayName.textContent =
    studentName;

  runIdDisplay.textContent =
    runId;

  loginCard.classList.add("hidden");

  labArea.classList.remove("hidden");

  renderGeneration();

}

function renderGeneration(){

  generationNumber.textContent =
    generation;

  miceCount.textContent =
    mice;

  coyoteCount.textContent =
    coyotes;

  if(generation <= 4){

    renderPracticeGeneration();

  } else {

    renderStudentGeneration();

  }

}

function renderPracticeGeneration(){

  const data =
    practiceGenerations[generation];

  let catchesText = "";

  data.catches.forEach(
    (value,index) => {

      catchesText +=

      `Coyote ${index+1}
      caught ${value} mice<br>`;

    }
  );

  instructionsBox.innerHTML =

  `
  <strong>Practice Generation ${generation}</strong>
<br>
  <div class="practice-box">
These first four generations are practice.
You must correctly calculate the results before
the automatic calculator unlocks.
</div>

  <br><br>

  Starting mice:
  ${mice}

  <br>

  Starting coyotes:
  ${coyotes}

  <br><br>

  ${catchesText}

  <br>

  Use the rules below to calculate:

  <ul>
  <li>Mice surviving</li>
  <li>Coyotes surviving</li>
  <li>Offspring produced</li>
  <li>Next generation mice</li>
  <li>Next generation coyotes</li>
  </ul>

  <strong>Rules</strong>

  <ul>
  <li>Coyotes must catch at least 5 mice to survive.</li>
  <li>One offspring is produced for every 5 mice caught.</li>
  <li>Surviving mice double.</li>
  <li>Mouse populations cannot exceed 100.</li>
  <li>If no coyotes survive and no offspring are produced, a new coyote immigrates into the area. The next generation will still begin with 1 coyote.</li>
  </ul>
  `;

  coyoteInputs.innerHTML =

  `
  <div class="coyote-row">
  <label>Mice Surviving</label>
  <input id="practice-mice">
  </div>

  <div class="coyote-row">
  <label>Coyotes Surviving</label>
  <input id="practice-coyote-survive">
  </div>

  <div class="coyote-row">
  <label>Coyote Offspring</label>
  <input id="practice-offspring">
  </div>

  <div class="coyote-row">
  <label>Next Generation Mice</label>
  <input id="practice-next-mice">
  </div>

  <div class="coyote-row">
  <label>Next Generation Coyotes</label>
  <input id="practice-next-coyote">
  </div>

  <button onclick="checkPracticeGeneration()">
  Check My Answers
  </button>
  `;

}

window.checkPracticeGeneration =
function(){

  const data =
    practiceGenerations[generation];

  const miceAns =
    Number(
      document
      .getElementById("practice-mice")
      .value
    );

  const coyoteAns =
    Number(
      document
      .getElementById("practice-coyote-survive")
      .value
    );

  const offspringAns =
    Number(
      document
      .getElementById("practice-offspring")
      .value
    );

  const nextMiceAns =
    Number(
      document
      .getElementById("practice-next-mice")
      .value
    );

  const nextCoyoteAns =
    Number(
      document
      .getElementById("practice-next-coyote")
      .value
    );

  const correct =

    miceAns === data.survivingMice &&
    coyoteAns === data.survivingCoyotes &&
    offspringAns === data.offspring &&
    nextMiceAns === data.nextMice &&
    nextCoyoteAns === data.nextCoyotes;

  if(!correct){

    resultsOutput.innerHTML =

    `
    ❌ Not quite.

    Check the rules carefully.

    Remember:
    Coyotes need at least 5 mice to survive.
    `;

    return;

  }

  resultsOutput.innerHTML =

  `
  ✅ Correct!

  Generation ${generation}
  completed.
  `;

  mice = data.nextMice;
  coyotes = data.nextCoyotes;

  generation++;

  setTimeout(
    renderGeneration,
    1000
  );

};
