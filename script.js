import { quiz } from "./quiz.js";

let currentQuestion = 0;
let score = 0;
let userAnswers = [];

const welcomeScreen = document.getElementById("welcome-screen");
const quizInterface = document.getElementById("quiz-interface");
const resultScreen = document.getElementById("result-screen");

const question = document.getElementById("question");
const choices = document.getElementById("choices");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const scoreEl = document.getElementById("score");
const prevBtn = document.getElementById("prev-btn");
const progressBar = document.getElementById("progress-bar");


function showQuestion() 
{
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

   // Rétablit la sélection précédente si elle existe
   if (userAnswers[currentQuestion]) {
      const radios = document.querySelectorAll('input[name="choice"]');
      radios.forEach(radio => {
         if (radio.value === userAnswers[currentQuestion]) {
            radio.checked = true;
         }
      });
   }

   // Affiche ou masque le bouton retour
   if (currentQuestion === 0) {
      prevBtn.classList.add("d-none");
   } else {
      prevBtn.classList.remove("d-none");
   }

   // MAJ de la barre de progression
   const percent = ((currentQuestion + 1) / quiz.length) * 100;
   progressBar.style.width = percent + "%";
   progressBar.setAttribute("aria-valuenow", currentQuestion + 1);
   progressBar.textContent = `${currentQuestion + 1} / ${quiz.length}`;
}

document.getElementById("start-btn").addEventListener("click", () => {
   welcomeScreen.classList.add("d-none");
   quizInterface.classList.remove("d-none");
   showQuestion();
});


function checkAnswer() 
{
   return getSelectedChoice() === quiz[currentQuestion].answer;
}


nextBtn.addEventListener("click", () => {
   const selected = getSelectedChoice();
   if (!selected) {
      alert("Veuillez choisir une réponse !");
      return;
   }
   userAnswers[currentQuestion] = selected;

   if (checkAnswer()) score++;
   currentQuestion++;

   if (currentQuestion < quiz.length - 1) {
      showQuestion();
   } else {
      showQuestion();
      nextBtn.classList.add("d-none");
      submitBtn.classList.remove("d-none");
   }
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
   if (checkAnswer()) score++;

   quizInterface.classList.add("d-none");
   resultScreen.classList.remove("d-none");
   scoreEl.textContent = `Votre score est de ${score} sur ${quiz.length}`;
   showSummary();
});


function getSelectedChoice() 
{
   const radios = document.querySelectorAll('input[name="choice"]');
   for (let radio of radios) {
      if (radio.checked) return radio.value;
   }
   return null;
}


function showSummary() {
   const summaryDiv = document.getElementById("summary");
   summaryDiv.innerHTML = "<h4>Détail de vos réponses :</h4>";
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
