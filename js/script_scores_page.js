async function getScores(quizId) {
  const data = {
    quiz_id: quizId,
  };

  try {
    const response = await fetch("../api/get_scores.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.scores) {
      console.log(result);
      return result;
    } else {
      console.error("Error:", result.error || "Unexpected error");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function showScores(quizId) {
  const result = await getScores(quizId);
  const scores = null ? null : result.scores;
  const quiz_name = result.quiz_name;

  renderScoresTable(scores, quiz_name);
}
function renderScoresTable(scores, quiz_name) {
  const tableContainer = document.getElementById("scoreBox");

  tableContainer.innerHTML = "";

  const h1 = document.createElement("h1");
  h1.innerText = quiz_name;
  tableContainer.appendChild(h1);
  if (scores.length != 0) {
    const table = document.createElement("table");
    table.className = "scoresTable";

    const headerRow = document.createElement("tr");
    const headers = ["", "Username", "Max Score", "Date"];
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.innerText = headerText;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    scores.forEach((score) => {
      const row = document.createElement("tr");

      const rowNumberCell = document.createElement("td");
      rowNumberCell.innerText = score.row_number + ".";
      row.appendChild(rowNumberCell);

      const usernameCell = document.createElement("td");
      usernameCell.innerText = score.username;
      row.appendChild(usernameCell);

      const maxScoreCell = document.createElement("td");
      maxScoreCell.innerText = score.max_score;
      row.appendChild(maxScoreCell);

      const dateCell = document.createElement("td");
      dateCell.innerText = score.score_date;
      row.appendChild(dateCell);

      table.appendChild(row);
    });

    tableContainer.appendChild(table);
  }
}
