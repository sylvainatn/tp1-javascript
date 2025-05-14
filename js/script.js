import { quiz } from "./quiz.js";


let currentQuestion = 0;
let score = 0;
let userAnswers = [];
localStorage.removeItem("quizState");

const savedState = localStorage.getItem("quizState");
if (savedState) {
   const state = JSON.parse(savedState);
   currentQuestion = state.currentQuestion || 0;
   score = state.score || 0;
   userAnswers = state.userAnswers || [];
}

const quizInterface = document.getElementById("quiz-interface");
const resultScreen = document.getElementById("result-screen");

const progressBar = document.getElementById("progress-bar");


const question = document.getElementById("question");
const choices = document.getElementById("choices");
const scoreEl = document.getElementById("score");

// Boutons
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const prevBtn = document.getElementById("prev-btn");



function showQuestion() {
   const q = quiz[currentQuestion];
   question.textContent = q.question;
   choices.innerHTML = "";

   q.choices.forEach((choice, index) => {
      const div = document.createElement("p");
      div.className = "form-check";
      div.innerHTML = `
      <input class="form-check-input" type="radio" name="choice" id="choice${index}" value="${choice}">
      <label class="form-check-label" for="choice${index}">${choice}</label>
    `;
      choices.appendChild(div);
   });


   if (userAnswers[currentQuestion]) {
      const radios = document.querySelectorAll('input[name="choice"]');
      radios.forEach(radio => {
         if (radio.value === userAnswers[currentQuestion]) {
            radio.checked = true;
         }
      });
   }


   if (currentQuestion === 0) {
      prevBtn.classList.add("d-none");
   } else {
      prevBtn.classList.remove("d-none");
   }


   const percent = ((currentQuestion + 1) / quiz.length) * 100;
   progressBar.style.width = percent + "%";
   progressBar.setAttribute("aria-valuenow", currentQuestion + 1);
   progressBar.textContent = `${currentQuestion + 1} / ${quiz.length}`;
}







// Évenements
startBtn.addEventListener("click", () => {
   startBtn.classList.add("d-none");
   quizInterface.classList.remove("d-none");
   showQuestion();
});


nextBtn.addEventListener("click", () => {
   const selected = getSelectedChoice();
   if (!selected) {
      alert("Veuillez choisir une réponse !");
      return;
   }
   userAnswers[currentQuestion] = selected;

   currentQuestion++;

   if (currentQuestion < quiz.length - 1) {
      showQuestion();
   } else {
      showQuestion();
      nextBtn.classList.add("d-none");
      submitBtn.classList.remove("d-none");
   }
   saveQuizState();
});



prevBtn.addEventListener("click", () => {
   const selected = getSelectedChoice();
   if (selected) userAnswers[currentQuestion] = selected;

   if (currentQuestion > 0) {
      currentQuestion--;
      showQuestion();
      nextBtn.classList.remove("d-none");
      submitBtn.classList.add("d-none");
   }
});


submitBtn.addEventListener("click", () => {
   const selected = getSelectedChoice();
   if (!selected) {
      alert("Veuillez choisir une réponse !");
      return;
   }
   userAnswers[currentQuestion] = selected;

   score = calculateScore();

   quizInterface.classList.add("d-none");
   resultScreen.classList.remove("d-none");
   scoreEl.textContent = `Votre score est de ${score} / ${quiz.length}`;
   showSummary();
});



restartBtn.addEventListener("click", () => {
   currentQuestion = 0;
   score = 0;
   userAnswers = [];
   resultScreen.classList.add("d-none");
   quizInterface.classList.remove("d-none");
   localStorage.removeItem("quizState");

   submitBtn.classList.add("d-none");
   nextBtn.classList.remove("d-none");

   showQuestion();
});




function getSelectedChoice() {
   const radios = document.querySelectorAll('input[name="choice"]');
   for (let radio of radios) {
      if (radio.checked) return radio.value;
   }
   return null;
}





function calculateScore() {
   return quiz.reduce((total, q, i) => {
      return total + (userAnswers[i] === q.answer ? 1 : 0);
   }, 0);
}



function showSummary() {
   const summaryDiv = document.getElementById("summary");
   quiz.forEach((q, i) => {
      const isCorrect = userAnswers[i] === q.answer;
      summaryDiv.innerHTML += `
         <div class="text-start mb-2">
            <strong>Q${i + 1} :</strong> ${q.question}<br>
            <span class="${isCorrect ? 'text-success' : 'text-danger'}">
               Votre réponse : ${userAnswers[i] || "<em>Non répondu</em>"}<br>
               ${isCorrect ? "Bonne réponse !" : `Mauvaise réponse. Réponse attendue : ${q.answer}`}
            </span>
         </div>
      `;
   });
}


function saveQuizState() {
   const state = {   
      currentQuestion,
      score,
      userAnswers
   };
   localStorage.setItem("quizState", JSON.stringify(state));
}
