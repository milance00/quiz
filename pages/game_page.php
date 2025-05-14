<?php
include "../includes/db.php";
session_start();

if (!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])) {
    header("Location: ../index.html");
    exit();
}

if (!isset($_GET['quiz_id']) || !is_numeric($_GET['quiz_id'])) {
    echo "No quiz selected.";
    exit();
}

$quiz_id = (int)$_GET['quiz_id'];

?>
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Game</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="../assets/css/style_game_page.css">
  

</head>
<body>
    <div id="navbar">
        <h1>Quiz</h1>
    </div>
    <div id="mainContainer">
      <div id="questionBox">
        <h2>Question <?= $current_question_index + 1 ?> of <?= $total_questions ?></h2>
        <h1><?= htmlspecialchars($current_question['question']) ?></h1>
</div>
<div id="answerContainer">
    <div class="answerBox" onclick="submitAnswer(1)"></div>
    <div class="answerBox" onclick="submitAnswer(2)"></div>
    <div class="answerBox" onclick="submitAnswer(3)"></div>
    <div class="answerBox" onclick="submitAnswer(4)"></div>

</div>
    </div>
    <div id="footer">Copyright &copy 2025 - Milan Popovic ITS 13/23</div>
    <script src="../js/script_game_page.js"></script>
</body>
</html>
