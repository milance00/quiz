import {
  createDiv,
  createButton,
  createForm,
  createFormElement,
  createH1,
  createH3,
  createInput,
  createLabel,
  createOption,
  createSelect,
  createSpan,
} from "../modules/elements.js";
const popupContainer = document.getElementById("popupContainer");
const bigPopupContainer = document.getElementById("bigPopupContainer");
const exitSmallPopup = document.getElementById("exitSmallPopup");
const exitBigPopup = document.getElementById("exitBigPopup");
const adminContainer = document.getElementById("adminContainer");
const popupBackground = document.getElementById("popupBackground");
const popup = document.getElementById("popup");
const bigPopup = document.getElementById("bigPopup");
const boxNewQuiz = document.getElementById("quizBoxNewQuiz");
const btnQuiz = document.getElementById("quizBtn");
const btnUser = document.getElementById("userBtn");
const btnNewQuiz = document.getElementById("addNewQuiz");
//button for adding new quiz
btnNewQuiz.onclick = () => displayNewQuizPopup();
//get and display quizzes
getQuizzes();
//button for displaying quizzes
btnQuiz.addEventListener("click", btnQuizHandler);
function btnQuizHandler() {
  btnQuiz.style.backgroundColor = "rgba(56, 71, 216)";
  btnUser.style.backgroundColor = "rgb(66, 101, 216)";
  boxNewQuiz.style.display = "flex";
  getQuizzes();
  btnUser.addEventListener("click", btnUserHandler);
  btnQuiz.removeEventListener("click", btnQuizHandler);
}
// button for displaying users
btnUser.addEventListener("click", btnUserHandler);
function btnUserHandler() {
  btnUser.style.backgroundColor = "rgba(56, 71, 216)";
  btnQuiz.style.backgroundColor = "rgb(66, 101, 216)";
  boxNewQuiz.style.display = "none";
  getUsers();
  btnQuiz.addEventListener("click", btnQuizHandler);
  btnUser.removeEventListener("click", btnUserHandler);
}
/* QUIZZES */
//func for displaying a popup for a new quiz
function displayNewQuizPopup() {
  clearPopup(popupContainer);
  popupBackground.style.display = "flex";
  popupContainer.style.display = "flex";
  popup.style.display = "flex";

  exitSmallPopup.onclick = () => {
    popupBackground.style.display = "none";
    popup.style.display = "none";
    clearPopup(popupContainer);
  };
  const header = createH1("New Quiz");

  const form = createForm("newQuizForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData(this);

    try {
      let response = await fetch("../api/add_quiz.php", {
        method: "POST",
        body: formData,
      });

      let result = await response.json();

      if (result.success) {
        alert(result.success);
        this.reset();

        await getQuizzes();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  });

  form.appendChild(
    createFormElement(
      "Quiz name:",
      "text",
      "inputQuizName",
      "quizName",
      "Quiz Name"
    )
  );
  form.appendChild(
    createFormElement(
      "Quiz category:",
      "text",
      "inputQuizCategory",
      "quizCategory",
      "Quiz Category"
    )
  );
  form.appendChild(
    createFormElement(
      "Question:",
      "text",
      "inputQuestion",
      "question",
      "Question"
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 1:",
      "text",
      "inputAnswer1",
      "answer1",
      "Answer 1"
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 2:",
      "text",
      "inputAnswer2",
      "answer2",
      "Answer 2"
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 3:",
      "text",
      "inputAnswer3",
      "answer3",
      "Answer 3"
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 4:",
      "text",
      "inputAnswer4",
      "answer4",
      "Answer 4"
    )
  );

  const correctAnswerDiv = createDiv("formElement", null);

  const correctAnswerLabel = createLabel(
    "inputCorrectAnswer",
    "Correct Answer:"
  );

  const select = createSelect("inputCorrectAnswer", "correctAnswer");

  for (let i = 1; i <= 4; i++) {
    const option = createOption(i, i);
    select.appendChild(option);
  }

  correctAnswerDiv.appendChild(correctAnswerLabel);
  correctAnswerDiv.appendChild(select);
  form.appendChild(correctAnswerDiv);

  const submitButton = createInput("submit", null, null, null, "SUBMIT QUIZ");
  form.appendChild(submitButton);

  popupContainer.appendChild(header);
  popupContainer.appendChild(form);
}
//func for getting quizzes and displaying them
async function getQuizzes() {
  try {
    //clearing div so new results can be displayed
    clearAdminContainer();
    const response = await fetch(`../api/get_quizzes.php`);
    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return null;
    }

    if (data.quizzes && data.quizzes.length > 0) {
      //displaying results(quizzes) in div container
      displayQuizzes(data.quizzes);
      return data.quizzes;
    } else {
      alert("No quizzes found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return null;
  }
}
//func for displaying quizzes in div container
function displayQuizzes(quizzes) {
  quizzes.forEach((quiz) => {
    const quizBox = createDiv("quizBox", null);

    const quizName = createSpan("quizName", quiz.quiz_name);

    const quizCategory = createSpan(
      "quizCategory",
      "Category: " + quiz.category
    );

    const quizBtnContainer = createSpan("quizBtnContainer", null);

    const btnAddQuestion = createButton(
      "btnAddQuestion",
      "Add question",
      null,
      () => displayAddQuestionPopup(quiz.id, quiz.quiz_name)
    );

    const btnModify = createButton("btnModify", "Modify", null, () =>
      displayModifyQuizPopup(quiz.id, quiz.quiz_name, quiz.category)
    );
    quizBtnContainer.appendChild(btnAddQuestion);
    quizBtnContainer.appendChild(btnModify);

    const btnDeleteQuiz = createButton("btnDeleteQuiz", "X", null, () =>
      deleteQuiz(quiz.id)
    );

    quizBox.appendChild(quizName);
    quizBox.appendChild(quizCategory);
    quizBox.appendChild(quizBtnContainer);
    quizBox.appendChild(btnDeleteQuiz);
    adminContainer.appendChild(quizBox);
  });
}
//display popup for adding questions
function displayAddQuestionPopup(quiz_id, quiz_name) {
  clearPopup(popupContainer);
  popupBackground.style.display = "flex";
  popup.style.display = "flex";
  popupContainer.style.display = "flex";

  exitSmallPopup.onclick = () => {
    popupBackground.style.display = "none";
    popup.style.display = "none";
    clearPopup(popupContainer);
  };

  const header1 = createH1("Add Question");
  const header2 = createH3(quiz_name);

  const form = createForm("newQuestionForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData(this);
    formData.append("quiz_id", quiz_id);
    console.log(formData);

    try {
      let response = await fetch("../api/add_question.php", {
        method: "POST",
        body: formData,
      });

      let result = await response.json();

      if (result.success) {
        alert(result.success);
        this.reset();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  });

  form.appendChild(
    createFormElement(
      "Question:",
      "text",
      "inputQuestion",
      "question",
      "Question"
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 1:",
      "text",
      "inputAnswer1",
      "answer1",
      "Answer 1"
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 2:",
      "text",
      "inputAnswer2",
      "answer2",
      "Answer 2"
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 3:",
      "text",
      "inputAnswer3",
      "answer3",
      "Answer 3"
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 4:",
      "text",
      "inputAnswer4",
      "answer4",
      "Answer 4"
    )
  );
  const correctAnswerDiv = createDiv("formElement", null);

  const correctAnswerLabel = createLabel(
    "inputCorrectAnswer",
    "Correct Answer:"
  );

  const select = createSelect("inputCorrectAnswer", "correctAnswer");

  for (let i = 1; i <= 4; i++) {
    const option = createOption(i, i);
    select.appendChild(option);
  }

  correctAnswerDiv.appendChild(correctAnswerLabel);
  correctAnswerDiv.appendChild(select);
  form.appendChild(correctAnswerDiv);

  const submitButton = createInput(
    "submit",
    null,
    null,
    null,
    "SUBMIT QUESTION"
  );
  form.appendChild(submitButton);

  popupContainer.appendChild(header1);
  popupContainer.appendChild(header2);
  popupContainer.appendChild(form);
}
//func for displaying popup for modifying quiz
async function displayModifyQuizPopup(quiz_id, quiz_name, quiz_category) {
  clearPopup(bigPopupContainer);
  popupBackground.style.display = "flex";
  bigPopupContainer.style.display = "flex";
  bigPopup.style.display = "flex";

  exitBigPopup.onclick = () => {
    popupBackground.style.display = "none";
    bigPopup.style.display = "none";
    clearPopup(bigPopupContainer);
  };
  const header1 = createH1("Modfy Quiz");
  const header2 = createH3(quiz_name);

  bigPopupContainer.appendChild(header1);
  bigPopupContainer.appendChild(header2);

  bigPopupContainer.appendChild(
    displyModifyQuizForm(quiz_id, quiz_name, quiz_category)
  );
  //displaying table of questions in popup for modfying quiz
  bigPopupContainer.appendChild(await displayTableQuestion(quiz_id));
}

//func for displaying form for modifying quiz
function displyModifyQuizForm(quiz_id, quiz_name, quiz_category) {
  const form = createForm("modifyQuizForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData(this);
    formData.append("quiz_id", quiz_id);
    console.log(formData);

    try {
      let response = await fetch("../api/modify_quiz.php", {
        method: "POST",
        body: formData,
      });

      let result = await response.json();

      if (result.success) {
        alert(result.success);
        //display form with updated data
        bigPopupContainer.replaceChild(
          displyModifyQuizForm(
            quiz_id,
            formData.get("quizName"),
            formData.get("quizCategory")
          ),
          form
        );
        await getQuizzes();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  });

  const inputQuizName = createFormElement(
    "Quiz Name:",
    "text",
    "inputQuizName",
    "quizName",
    quiz_name,
    quiz_name
  );
  const inputQuizCategory = createFormElement(
    "Quiz Category:",
    "text",
    "inputQuizCategory",
    "quizCategory",
    quiz_category,
    quiz_category
  );
  form.appendChild(inputQuizName);
  form.appendChild(inputQuizCategory);

  const submitButton = createInput("submit", null, null, null, "SUBMIT CHANGE");
  form.appendChild(submitButton);

  return form;
}
//func that creates table that is populated with questions from certain quiz
async function displayTableQuestion(quiz_id) {
  //getting questions
  const questions = await getQuizQuestions(quiz_id);
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  const headers = [
    "Row Number",
    "Question",
    "Answer 1",
    "Answer 2",
    "Answer 3",
    "Answer 4",
    "Correct Answer",
    "Actions",
  ];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);

  questions.forEach((question) => {
    const row = document.createElement("tr");

    const rowNumberCell = document.createElement("td");
    rowNumberCell.textContent = question.row_number;
    row.appendChild(rowNumberCell);

    const questionCell = document.createElement("td");
    questionCell.textContent = question.question;
    row.appendChild(questionCell);

    const answer1Cell = document.createElement("td");
    answer1Cell.textContent = question.answer_1;
    row.appendChild(answer1Cell);

    const answer2Cell = document.createElement("td");
    answer2Cell.textContent = question.answer_2;
    row.appendChild(answer2Cell);

    const answer3Cell = document.createElement("td");
    answer3Cell.textContent = question.answer_3;
    row.appendChild(answer3Cell);

    const answer4Cell = document.createElement("td");
    answer4Cell.textContent = question.answer_4;
    row.appendChild(answer4Cell);

    const correctAnswerCell = document.createElement("td");
    correctAnswerCell.textContent = question.correct_answer;
    row.appendChild(correctAnswerCell);

    const actionsCell = document.createElement("td");

    const modifyBtn = createButton("modifyBtn", "Modify", null, () =>
      displayModifyQuestionPopup(
        question.id,
        question.question,
        question.answer_1,
        question.answer_2,
        question.answer_3,
        question.answer_4,
        question.correct_answer,
        quiz_id
      )
    );
    const deleteBtn = createButton("deleteBtn", "Delete", null, () =>
      deleteQuestion(question.id, quiz_id)
    );

    actionsCell.appendChild(modifyBtn);
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

//func for deleting question
async function deleteQuestion(question_id, quiz_id) {
  let msg = prompt("Ako želite da izbrišete pitanje, ukucajte DA");

  if (msg?.toUpperCase() === "DA") {
    const data = { question_id };

    try {
      const response = await fetch("../api/delete_question.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        alert("Question deleted successfully!");

        const newTable = await displayTableQuestion(quiz_id);
        bigPopupContainer.replaceChild(
          newTable,
          bigPopupContainer.querySelector("table")
        );
      } else {
        console.error("Error:", result.error);
        alert("Greška: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Error while dealeting questions.");
    }
  }
}
//func for getting questions
async function getQuizQuestions(quizId) {
  try {
    const response = await fetch(
      `../api/get_quiz_questions.php?quiz_id=${quizId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (result.success) {
      return result.questions;
    } else {
      console.error("Error:", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
//func for deleting quiz
function deleteQuiz(quiz_id) {
  let msg = prompt("Ako zelite da izbrisete kviz ukucajte DA");
  if (msg.toUpperCase() == "DA") {
    const data = {
      quiz_id: quiz_id,
    };

    fetch("../api/delete_quiz.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Quiz deleted successfully!");
          getQuizzes();
        } else {
          console.error("Error:", result.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
//func for displaying popup for modfying a question
function displayModifyQuestionPopup(
  id,
  question,
  answer_1,
  answer_2,
  answer_3,
  answer_4,
  correct_answer,
  quiz_id
) {
  clearPopup(popupContainer);

  exitSmallPopup.onclick = () => {
    popup.style.display = "none";
    bigPopup.style.display = "flex";
    clearPopup(popupContainer);
  };
  const header1 = createH1("Modify Question");
  const form = createForm("modifyQuestionForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData(this);
    formData.append("question_id", id);

    try {
      let response = await fetch("../api/modify_question.php", {
        method: "POST",
        body: formData,
      });

      let result = await response.json();

      if (result.success) {
        alert(result.success);
        this.reset();
        //display popup with new updated data
        displayModifyQuestionPopup(
          formData.get("question_id"),
          formData.get("Question"),
          formData.get("answer1"),
          formData.get("answer2"),
          formData.get("answer3"),
          formData.get("answer4"),
          formData.get("correctAnswer")
        );
        //update table of questions
        bigPopupContainer.replaceChild(
          await displayTableQuestion(quiz_id),
          bigPopupContainer.querySelector("table")
        );
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  });

  form.appendChild(
    createFormElement(
      "Question:",
      "text",
      "inputModifyQuestion",
      "Question",
      question,
      question
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 1:",
      "text",
      "inputModifyAnswer1",
      "answer1",
      answer_1,
      answer_1
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 2:",
      "text",
      "inputModifyAnswer2",
      "answer2",
      answer_2,
      answer_2
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 3:",
      "text",
      "inputModifyAnswer3",
      "answer3",
      answer_3,
      answer_3
    )
  );
  form.appendChild(
    createFormElement(
      "Answer 4:",
      "text",
      "inputModifyAnswer4",
      "answer4",
      answer_4,
      answer_4
    )
  );
  const correctAnswerDiv = createDiv("formElement", null);

  const correctAnswerLabel = createLabel(
    "inputModifyCorrectAnswer",
    "Correct Answer:"
  );

  const select = createSelect("inputModifyCorrectAnswer", "correctAnswer");

  for (let i = 1; i <= 4; i++) {
    const option = createOption(i, i);
    select.appendChild(option);
  }
  select.value = correct_answer;
  correctAnswerDiv.appendChild(correctAnswerLabel);
  correctAnswerDiv.appendChild(select);
  form.appendChild(correctAnswerDiv);

  const submitButton = createInput(
    "submit",
    null,
    null,
    null,
    "SUBMIT CHANGES"
  );
  form.appendChild(submitButton);

  popupContainer.appendChild(header1);
  popupContainer.appendChild(form);
  bigPopup.style.display = "none";
  popup.style.display = "flex";
  popupContainer.style.display = "flex";
}
/* USERS */
//func for getting and displaying users
async function getUsers() {
  try {
    //clearing div so new results can be displayed
    clearAdminContainer();
    const response = await fetch(`../api/get_users.php`);
    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return null;
    }

    if (data.users && data.users.length > 0) {
      //displaying results(users) in div container
      displayUsers(data.users);
      return data.users;
    } else {
      alert("No users found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}
//func for displaying users in div container
function displayUsers(users) {
  users.forEach((user) => {
    const userBox = createDiv("userBox", null);

    const username = createSpan("username", user.username);

    const userFirstName = createSpan(
      "userFirstName",
      "First Name: " + user.first_name
    );
    const userLastName = createSpan(
      "userLastName",
      "Last Name: " + user.last_name
    );
    const userEmail = createSpan("userEmail", "Email: " + user.email);
    const userCreatedAt = createSpan(
      "userCreatedAt",
      "Created at: " + user.created_at
    );

    const btnDeleteUser = createButton("btnDeleteUser", "X", null, () =>
      deleteUser(user.id)
    );

    userBox.appendChild(username);
    userBox.appendChild(userFirstName);
    userBox.appendChild(userLastName);
    userBox.appendChild(userEmail);
    userBox.appendChild(userCreatedAt);
    userBox.appendChild(btnDeleteUser);
    adminContainer.appendChild(userBox);
  });
}
//func for deleting user
function deleteUser(user_id) {
  let msg = prompt("Ako zelite da izbrisete korisnika ukucajte DA");
  if (msg.toUpperCase() == "DA") {
    const data = {
      user_id: user_id,
    };

    fetch("../api/delete_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("User deleted successfully!");
          getUsers();
        } else {
          console.error("Error:", result.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
/* CLEARING FUNC */
//func for clearing popup
function clearPopup(popup) {
  while (popup.firstChild) {
    popup.removeChild(popup.firstChild);
  }
}
//func for clearing main admin div container
function clearAdminContainer() {
  while (adminContainer.childNodes.length > 2) {
    adminContainer.removeChild(adminContainer.lastChild);
  }
}
