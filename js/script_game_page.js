const quizId = new URLSearchParams(window.location.search).get("quiz_id");
let answers = [];
let questions = [];
let questionNumber = 1;

document.addEventListener("DOMContentLoaded", async () => {
  questions = await getQuizQuestions(quizId);
  if (questions) {
    displayQuestion(questions[0], questionNumber, questions.length);
  }
});

async function getQuizQuestions(quizId) {
  try {
    const response = await fetch(
      `../api/get_game_questions.php?quiz_id=${quizId}`
    );
    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return null;
    }

    if (data.questions && data.questions.length > 0) {
      return data.questions;
    } else {
      alert("No questions found for this quiz.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return null;
  }
}

function displayQuestion(question, questionIndex, totalQuestions) {
  document.querySelector(
    "#questionBox h2"
  ).innerText = `Question ${questionIndex} of ${totalQuestions}`;
  document.querySelector("#questionBox h1").innerText = question.question;

  const answerBoxes = document.querySelectorAll(".answerBox");
  answerBoxes.forEach((box, index) => {
    box.innerText = question[`answer_${index + 1}`];
    box.onclick = () => submitAnswer(index + 1);
  });
}

function submitAnswer(answer) {
  answers.push(answer);
  questionNumber++;

  if (questionNumber <= questions.length) {
    displayQuestion(
      questions[questionNumber - 1],
      questionNumber,
      questions.length
    );
  } else {
    calculateScore();
  }
}

function calculateScore() {
  let score = 0;

  for (let i = 0; i < questions.length; i++) {
    if (answers[i] == questions[i].correct_answer) {
      score++;
    }
  }

  alert(`Your score is ${score}`);
  submitScore(score);
}

function submitScore(score) {
  const data = {
    quiz_id: quizId,
    score: score,
  };

  fetch("../api/save_score.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("Score saved successfully!");
      } else {
        console.error("Error saving score:", result.error);
      }
      window.location.href = "../pages/quizzes_page.php";
    })
    .catch((error) => {
      console.error("Error saving score:", error);
      window.location.href = "../pages/quizzes_page.php";
    });
}
