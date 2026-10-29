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

let generation = 0;
let mice = 10;
let coyotes = 1;

let labHistory = [];

const practiceProblem = generatePracticeProblem();

function randomInteger(min,max){

  return Math.floor(
    Math.random() *
    (max - min + 1)
  ) + min;

}

function generatePracticeProblem(){

  const startingMice =
    randomInteger(10,20);

  const caught =
    randomInteger(1,8);

  const survivingMice =
    startingMice - caught;

  const survivingCoyotes =
    caught >= 5 ? 1 : 0;

  const offspring =
    Math.floor(caught / 5);

  const nextMice =
    Math.min(
      Math.max(
        survivingMice * 2,
        10
      ),
      100
    );

  const nextCoyotes =
    Math.max(
      survivingCoyotes +
      offspring,
      1
    );

  return {

    startingMice,

    catches:[caught],

    survivingMice,

    survivingCoyotes,

    offspring,

    nextMice,

    nextCoyotes

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

 if(generation === 0){

  renderPracticeGeneration();

} else {

  renderStudentGeneration();

}

}

function renderPracticeGeneration(){

  const data =
    practiceProblem;

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
  <strong>Practice Problem </strong>
<br>
  <div class="practice-box">
These first four generations are practice.
You must correctly calculate the results before
the automatic calculator unlocks.
</div>

  <br><br>

  Starting mice:
  ${data.startingMice}

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
    practiceProblem;

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

You have demonstrated that you understand the rules.

Press Continue to begin the actual lab.
`;

coyoteInputs.innerHTML +=

`
<br>

<button onclick="beginActualLab()">
Begin Actual Lab
</button>
`;

// Wait for student to click
2
// "Begin Actual Lab"
3
 
4
return;

};

window.beginActualLab =
function(){

  generation = 1;

  mice = 10;

  coyotes = 1;

  renderGeneration();

};
